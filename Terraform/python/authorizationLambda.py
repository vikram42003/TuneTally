import os
import boto3
import json
import time
import uuid
import base64
import requests
from urllib.parse import urlencode


SCOPE = "user-read-private user-read-email user-top-read user-read-recently-played"
CORS_HEADERS = {
    "Access-Control-Allow-Origin": os.environ.get("TUNETALLY_BASE_URL"),
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,GET",
    "Access-Control-Allow-Credentials": "true",
}


def lambda_handler(event, context):
    # Check if we have the app url before doing anything
    app_base_url = os.environ.get("TUNETALLY_BASE_URL")
    if not app_base_url:
        return errorHandler(
            500,
            "Sever side error",
            "No app url found. Check if environment variables are set up correctly",
        )

    # Warm up the lambda func to optimized the cold boot
    if event["requestContext"]["path"].endswith("/warm"):
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": "Warmed up"}

    path = event["requestContext"]["path"]
    # Strip away the v1 part since path will be something like /v1/spotifyLogin
    path = path.split("/")[2]

    # If demo_mode flag is on then do the auth with demo_user as state/sessionID value
    params = event.get("queryStringParameters") or {}
    demo_mode = params.get("demo_mode", "false") == "true"

    if path == "spotifyLogin":
        # Prepare the request and redirect to spotify auth page
        return handleSpotifyLoginRequest(demo_mode)
    elif path == "spotifyLoginCallback":
        # Exchange code for token (or send back error) and redirect to app page
        return handleSpotifyLoginCallbackRequest(event)
    else:
        return errorHandler(
            404, "Unknown request", "The request is not supported by the server"
        )


def errorHandler(statusCode, errorTitle, errorMessage):
    print(f"Status Code: {statusCode}   Error Title: {errorTitle}\n{errorMessage}")
    return {
        "statusCode": statusCode,
        "headers": CORS_HEADERS,
        "body": json.dumps({"error": errorTitle, "error_message": str(errorMessage)}),
    }


def errorHandlerRedirect(errorTitle, errorMessage):
    print(f"Status Code: 302   Error Title: {errorTitle}\n{errorMessage}")
    app_base_url = os.environ.get("TUNETALLY_BASE_URL")
    return {
        "statusCode": 302,
        "headers": {
            **CORS_HEADERS,
            "Location": app_base_url
            + f"/?error={errorTitle}&error_message={str(errorMessage)}",
        },
    }


def handleSpotifyLoginRequest(demo_mode):
    client_id = os.environ.get("SPOTIFY_CLIENT_ID")
    if not client_id:
        return errorHandler(
            500,
            "Server side error",
            "Spotify client ID not found. Check if enviornment variables are set properly",
        )

    redirect_uri = os.environ.get("SPOTIFY_REDIRECT_URI")
    if not redirect_uri:
        return errorHandler(
            500,
            "Server side error",
            "Spotify redirect URI not found. Check if enviornment variables are set properly",
        )

    if demo_mode:
        state = "demo_user"
        # Expires in 10 years
        expiresAt = int(time.time()) + 315576000
    else:
        state = str(uuid.uuid4())
        expiresAt = int(time.time()) + 300

    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("sessionID_token_pair")
        table.put_item(
            Item={
                "sessionID": state,
                "token": "TEMP",
                "expiresAt": expiresAt,
            }
        )
    except Exception as e:
        return errorHandler(500, "Server side error", e)

    params_dict = {
        "response_type": "code",
        "client_id": client_id,
        "scope": SCOPE,
        "redirect_uri": redirect_uri,
        "state": state,
    }

    spotify_auth_base_url = "https://accounts.spotify.com/authorize"
    query_string = urlencode(params_dict)
    url = spotify_auth_base_url + "?" + query_string

    return {"statusCode": 302, "headers": {"Location": url}}


def exchangeCodeForTokenAndRedirect(code, state):
    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("sessionID_token_pair")
        response = table.get_item(Key={"sessionID": state})

        # Check if the returned state matches our saved state (as a security measure)
        # state is the sessionID and it should be stored in dynamoDB
        if "Item" not in response:
            raise Exception("Invalid state parameter")
        # The value for token should be TEMP at this step, if its not then state we might already have a token
        elif response["Item"]["token"] != "TEMP":
            raise Exception("Invalid value for token")

        # Check for redirect uri, client id, and client secret
        redirect_uri = os.environ.get("SPOTIFY_REDIRECT_URI")
        if not redirect_uri:
            raise Exception(
                "Spotify redirect URI not found. Check if enviornment variables are set properly"
            )
        client_id = os.environ.get("SPOTIFY_CLIENT_ID")
        if not client_id:
            raise Exception(
                "Spotify client ID not found. Check if enviornment variables are set properly"
            )
        client_secret = os.environ.get("SPOTIFY_CLIENT_SECRET")
        if not client_secret:
            raise Exception(
                "Spotify client secret not found. Check if enviornment variables are set properly"
            )

        item = response["Item"]

        data = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": redirect_uri,
        }

        token_request_url = "https://accounts.spotify.com/api/token"
        auth = (client_id, client_secret)
        headers = {"Content-Type": "application/x-www-form-urlencoded"}

        response = requests.post(
            token_request_url, data=data, auth=auth, headers=headers
        )

        body = response.json()

        auth_token = body["access_token"]
        expires_in = body["expires_in"]
        refresh_token = body["refresh_token"]

        item["token"] = auth_token
        if state == "demo_user":
            # The item should expire in 10 years for the demo user
            item["expiresAt"] = int(time.time()) + 315576000
            item["authTokenExpiresAt"] = int(time.time()) + expires_in
            item["refreshToken"] = refresh_token
        else:
            item["expiresAt"] = int(time.time()) + expires_in
            item["authTokenExpiresAt"] = int(time.time()) + expires_in

        table.put_item(Item=item)

        httpOnly_cookie = f"sessionID={state}; Max-Age={expires_in}; HttpOnly; SameSite=None; Secure; Path=/"
        app_base_url = os.environ.get("TUNETALLY_BASE_URL")
        return {
            "statusCode": 302,
            "headers": {
                **CORS_HEADERS,
                "Set-Cookie": httpOnly_cookie,
                "Location": app_base_url + "/stats?spotifyAuthStatus=success",
            },
        }

    except Exception as e:
        return errorHandlerRedirect("Server side error", e)


def handleSpotifyLoginCallbackRequest(event):
    params = event.get("queryStringParameters", {})

    if not params:
        return errorHandlerRedirect(
            "Server side error",
            "No query params were found. This indicates an issue from Spotify's side",
        )
    elif "code" in params and "state" in params:
        return exchangeCodeForTokenAndRedirect(params["code"], params["state"])
    elif "error" in params and "state" in params:
        return errorHandlerRedirect(
            "Server side error - Login callback", params["error"]
        )
    else:
        return errorHandlerRedirect(
            "Server side error", "Something unexpected happened"
        )

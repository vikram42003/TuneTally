import os
import boto3
import json
import time
import uuid
import base64
from urllib.parse import urlencode
from urllib.request import Request, urlopen


SCOPE = "user-read-private user-read-email user-top-read"
CORS_HEADERS = {
    "Access-Control-Allow-Origin": os.environ.get("TUNETALLY_BASE_URL"),
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,GET",
}


def lambda_handler(event, context):
    # Check if we have the app url before doing anything
    app_base_url = os.environ.get("TUNETALLY_BASE_URL")
    if not app_base_url:
        return error_handler(
            "No app url found. Check if environment variables are set up correctly"
        )

    path = event["requestContext"]["path"]
    # Strip away the v1 part since path will be something like /v1/spotifyLogin
    path = path.split("/")[2]

    if path == "spotifyLogin":
        # Prepare the request and redirect to spotify auth page
        return handleSpotifyLoginRequest()
    elif path == "spotifyLoginCallback":
        # Exchange code for token (or send back error) and redirect to app page
        return handleSpotifyLoginCallbackRequest(event)
    else:
        return unknown_request_handler()

    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps({"message": "lambda is working again"}),
    }


def unknown_request_handler():
    return {
        "statusCode": 404,
        "headers": CORS_HEADERS,
        "body": json.dumps(
            {
                "error": "Unknown request",
                "error_description": "The request is not supported by the server",
            }
        ),
    }


def unknown_request_handler_redirect():
    app_base_url = os.environ.get("TUNETALLY_BASE_URL")
    return {
        "statusCode": 302,
        "headers": {
            **CORS_HEADERS,
            "Location": app_base_url
            + "/error?error="
            + "Unknown request - The request is not supported by the server",
        },
    }


def error_handler(e):
    return {
        "statusCode": 500,
        "headers": CORS_HEADERS,
        "body": json.dumps({"error": str(e)}),
    }


def error_handler_redirect(e):
    app_base_url = os.environ.get("TUNETALLY_BASE_URL")
    return {
        "statusCode": 302,
        "headers": {
            **CORS_HEADERS,
            "Location": app_base_url + "/error?error=" + str(e),
        },
    }


def handleSpotifyLoginRequest():
    client_id = os.enviorn.get("SPOTIFY_CLIENT_ID")
    if not client_id:
        return error_handler(
            "Spotify client ID not found. Check if enviornment variables are set properly"
        )

    redirect_uri = os.enviorn.get("SPOTIFY_REDIRECT_URI")
    if not redirect_uri:
        return error_handler(
            "Spotify redirect URI not found. Check if enviornment variables are set properly"
        )

    state = uuid.uuid4()

    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("sessionID_token_pair")
        table.put_item(
            Item={
                "sessionID": state,
                "token": "TEMP",
                "expiresAt": int(time.time()) + 300,
            }
        )
    except Exception as e:
        return error_handler(e)

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
        if "Item" not in response:
            raise Exception("Invalid state parameter")
        # The value for token should be TEMP at this step, if its not then state we might already have a token
        elif response["Item"]["token"] != "TEMP":
            raise Exception("Invalid value for token")

        # Check for redirect uri, client id, and client secret
        redirect_uri = os.enviorn.get("SPOTIFY_REDIRECT_URI")
        if not redirect_uri:
            return error_handler(
                "Spotify redirect URI not found. Check if enviornment variables are set properly"
            )
        client_id = os.enviorn.get("SPOTIFY_CLIENT_ID")
        if not client_id:
            return error_handler(
                "Spotify client ID not found. Check if enviornment variables are set properly"
            )
        client_secret = os.enviorn.get("SPOTIFY_CLIENT_SECRET")
        if not client_secret:
            return error_handler(
                "Spotify client secret not found. Check if enviornment variables are set properly"
            )

        item = response["Item"]

        data = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": redirect_uri,
        }
        encoded_data = json.dumps(data).encode("utf-8")

        token_request_url = "https://accounts.spotify.com/api/token"
        # doc ref - https://docs.python.org/3/library/urllib.request.html and https://stackoverflow.com/a/79435030
        req = Request(token_request_url, data=encoded_data, method="POST")

        b64_string = base64.b64encode(
            (client_id + ":" + client_secret).encode("utf-8")
        ).decode()
        req.add_header("Authorization", "Basic " + b64_string)
        req.add_header("Content-Type", "application/x-www-form-urlencoded")

        # This is how you make a request with urllib.request
        with urlopen(req) as response:
            res = response.read().decode("utf-8")
            body = json.loads(res)

            auth_token = body["access_token"]
            expires_in = body["expires_in"]

        item["token"] = auth_token
        item["expiresAt"] = expires_in

        table.put_item(Item=item)

        app_base_url = os.environ.get("TUNETALLY_BASE_URL")

        return {
            "statusCode": 302,
            "headers": {
                "Location": app_base_url,
            },
        }

    except Exception as e:
        return error_handler(e)


def handleSpotifyLoginCallbackRequest(event):
    params = event["queryStringParameters"]

    if "code" in params and "state" in params:
        return exchangeCodeForTokenAndRedirect(params["code"], params["state"])
    elif "error" in params and "state" in params:
        return error_handler(params["error"])
    else:
        return unknown_request_handler()

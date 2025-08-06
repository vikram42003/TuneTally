import os
import boto3
import json
import time
import uuid
from urllib import urlencode


SCOPE = "user-read-private user-read-email user-top-read"
CORS_HEADERS = {
    "Access-Control-Allow-Origin": "http://localhost:5173",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,GET",
}


def lambda_handler(event, context):
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


def error_handler(e):
    return {
        "statusCode": 500,
        "headers": CORS_HEADERS,
        "body": json.dumps({"error": str(e)}),
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

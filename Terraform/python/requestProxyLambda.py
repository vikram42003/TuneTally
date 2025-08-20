import json
import os
import requests
import boto3


CORS_HEADERS = {
    "Access-Control-Allow-Origin": os.environ.get("TUNETALLY_BASE_URL"),
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,GET",
    "Access-Control-Allow-Credentials": "true",
}


def lambda_handler(event, context):
    sessionID = getSessionIdFromEvent(event)

    if sessionID:
        # path will be something like /v1/spotify/<resource>
        path = event["requestContext"]["path"]
        if "/spotify/" not in path:
            return invalidPathHandler(path)

        path = path.split("/spotify/")[1]
        params = event.get("queryStringParameters", {})

        if path == "me/top/artists" or path == "me/top/tracks":
            params.setDefault("time_range", "medium_term")
            params.setDefault("limit", 10)
            params.setDefault("offset", 0)
            return makeProxyRequests(sessionID, path, params)
        else:
            return invalidPathHandler(path)
    else:
        return missingCookieHandler()


def getSessionIdFromEvent(event):
    # The location of cookie may be different depending on the version of aws api gatway so check both places
    # I know it will hit the v1 case but it doesnt hurt to be cautious
    # REST API (v1) stores it in ["headers"]["cookie"] and the value will be a string of cookeis separated by "; "
    header_cookie = event.get("headers", {}).get("cookie", "")
    if header_cookie:
        for part in header_cookie.split(";"):
            if part.strip().startswith("sessionID="):
                return part.split("=", 1)[1]
    # HTTP API (v2) stores it directly in the event and the value will be a list/array of cookies
    cookies = event.get("cookies", [])
    if cookies:
        for c in cookies:
            if c.startswith("sessionID="):
                return c.split("=", 1)[1]
    return None


def missingCookieHandler():
    return {
        "statusCode": 401,
        "headers": CORS_HEADERS,
        "body": json.dumps(
            {
                "error": "Missing Cookie",
                "error_description": "Required authentication cookie is missing.",
            }
        ),
    }


def invalidPathHandler(path):
    return {
        "statusCode": 400,
        "headers": CORS_HEADERS,
        "body": json.dumps(
            {
                "error": "Invalid Path",
                "error_description": f"Path {path} is not a valid path to a resource.",
            }
        ),
    }


def errorHandler(e):
    status_code = e.get("statusCode", 500)
    print(e)
    return {
        "statusCode": status_code,
        "headers": CORS_HEADERS,
        "body": json.dumps({"error": str(e)}),
    }


def makeProxyRequests(sessionID, path, params):
    spotify_base_url = "https://api.spotify.com/v1/"

    try:
        # get token from dynamoDB and create a header from it
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("sessionID_token_pair")
        response = table.get_item(Key={"sessionID": sessionID})
        token = response["Item"]["token"]

        headers = {"Authorization": f"Bearer {token}"}

        response = requests.get(spotify_base_url + path, headers=headers, params=params)
        response.raise_for_status()

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps(response.json()),
        }
    except requests.exceptions.RequestException as e:
        e["statusCode"] = e.response.status_code
        return errorHandler(e)
    except Exception as e:
        return errorHandler(e)

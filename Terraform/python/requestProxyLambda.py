import json
import os
import requests


CORS_HEADERS = {
    "Access-Control-Allow-Origin": os.environ.get("TUNETALLY_BASE_URL"),
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,GET",
    "Access-Control-Allow-Credentials": "true",
}

class InvalidPathException(Exception):
    pass

def lambda_handler(event, context):
    sessionID = getSessionIdFromEvent(event)

    if sessionID:
        # path will be something like /v1/spotify/<resource>
        path = event["requestContext"]["path"]
        if "/spotify/" not in path:
            return invalidPathHandler(path)

        path = path.split("/spotify/")[1]
        params = event.get("queryStringParameters", {})

        try:
            if path == "me/top/artists" or path == "me/top/tracks":
                checkRequest(path, params)
                return makeProxyRequests(sessionID, path, params)
        except Exception as e:
            if isinstance(e, InvalidPathException):
                return errorHandler(e, 400)
            else:
                return errorHandler(e)




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

def errorHandler(e, statusCode=None):
    if statusCode == None:
        print(e)
    else:
        print(f"STATUS CODE: {statusCode}\n{e}")

    return {
        "statusCode": 500 if statusCode == None else statusCode,
        "headers": CORS_HEADERS,
        "body": json.dumps({"error": str(e)}),
    }

def checkRequest(path, params):
    if path == "me/top/artists" or path == "me/top/tracks":

    else:
        raise InvalidPathException(f"Invalid path: {path}")

def makeProxyRequests(sessionID, req_type, params):
    # TODO: Implement the actual proxy logic here

    spotify_base_url = "https://api.spotify.com/v1/"


    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps(
            {"message": "Request Proxy Lambda works !!!", "cookies": sessionID}
        ),
    }

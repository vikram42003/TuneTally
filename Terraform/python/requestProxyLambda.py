import json
import os


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
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps(
                {
                    "message": f"We have the cookie and its {sessionID}",
                }
            ),
        }
        # return makeProxyRequests(sessionID)
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


def makeProxyRequests(sessionID):
    # TODO: Implement the actual proxy logic here
    # For now, we'll just return a success message with the sessionID
    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps(
            {"message": "Request Proxy Lambda works !!!", "cookies": sessionID}
        ),
    }

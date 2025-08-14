import json
import os
import http.cookies


CORS_HEADERS = {
    "Access-Control-Allow-Origin": os.environ.get("TUNETALLY_BASE_URL"),
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,GET",
    "Access-Control-Allow-Credentials": "true",
}


def lambda_handler(event, context):
    cookie_header = event.get("headers", {}).get("cookie")
    sessionID = None

    if cookie_header:
        cookie = http.cookies.SimpleCookie()
        cookie.load(cookie_header)

        if "sessionID" in cookie:
            sessionID = cookie["sessionID"].value

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
        return handleMissingCookie()


def handleMissingCookie():
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

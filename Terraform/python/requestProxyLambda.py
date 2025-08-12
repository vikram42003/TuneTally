import json
import os


CORS_HEADERS = {
    "Access-Control-Allow-Origin": os.environ.get("TUNETALLY_BASE_URL"),
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,GET",
    "Access-Control-Allow-Credentials": "true",
}


def lambda_handler(event, context):
    sessionID = None

    cookies = event.get("cookies", [])
    for cookie in cookies:
        if cookie.starts("sessionID"):
            sessionID = cookie.split("=")[1]
            break

    if sessionID:
        return makeProxyRequests(sessionID)
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

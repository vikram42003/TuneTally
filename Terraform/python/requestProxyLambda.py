import json
import os


CORS_HEADERS = {
    "Access-Control-Allow-Origin": os.environ.get("TUNETALLY_BASE_URL"),
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,GET",
}


def lambda_handler(event, context):
    cookie_info = "Cookies were not found"

    cookies = event.get("cookies", [])
    for cookie in cookies:
        if cookie.starts("sessionID"):
            cookie_info = cookie
            break

    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps(
            {
                "message": "Request Proxy Lambda works !!!",
                "cookies": cookie_info
            }
        ),
    }

import json
import os
import time
import requests
import boto3
from decimal import Decimal


CORS_HEADERS = {
    "Access-Control-Allow-Origin": os.environ.get("TUNETALLY_BASE_URL"),
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,GET",
    "Access-Control-Allow-Credentials": "true",
}


class UnauthorizedError(Exception):
    pass


def lambda_handler(event, context):
    sessionID = getSessionIdFromEvent(event)

    if sessionID:
        # path will be something like /v1/spotify/<resource>
        path = event["requestContext"]["path"]
        if "/spotify/" not in path:
            return errorHandler(400, "Invalid Path", f"Path {path} is not a valid path to a resource.")

        path = path.split("/spotify/")[1]
        params = event.get("queryStringParameters") or {}

        if path == "me":
            return makeProxyRequests(sessionID, path, params)
        elif path == "me/top/artists" or path == "me/top/tracks":
            params.setdefault("time_range", "medium_term")
            params.setdefault("limit", 10)
            params.setdefault("offset", 0)
            return makeProxyRequests(sessionID, path, params)
        elif path == "me/player/recently-played":
            params.setdefault("limit", 10)
            return makeProxyRequests(sessionID, path, params)
        else:
            return errorHandler(400, "Invalid Path", f"Path {path} is not a valid path to a resource.")
    else:
        return errorHandler(401, "Unauthorized", "Required authentication cookie is missing")


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


def errorHandler(statusCode, errorTitle, errorMessage):
    print(f"Status Code: {statusCode}   Error Title: {errorTitle}\n{errorMessage}")
    return {
        "statusCode": statusCode,
        "headers": CORS_HEADERS,
        "body": json.dumps({"error": errorTitle, "error_message": str(errorMessage)}),
    }


# The DynamoDB Decimal type is not JSON serializable, so we need to convert it to an int or float
# So we need this function to recursively convert any Decimals to int or float
def convertDecimals(obj):
    if isinstance(obj, list):
        return [convertDecimals(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convertDecimals(v) for k, v in obj.items()}
    elif isinstance(obj, Decimal):
        if obj % 1 == 0:
            return int(obj)
        else:
            return float(obj)
    return obj


def formatResponseData(path, response):
    # Check https://developer.spotify.com/documentation/web-api/reference/ if you need to add more resources
    if path == "me":
        new_response = {
            "display_name": response["display_name"],
            "id": response["id"],
            "images": response["images"],
            "country": response["country"],
            "external_urls": response["external_urls"]["spotify"],
            "followers": response["followers"]["total"],
        }
        return new_response

    items = []
    for item in response["items"]:
        new_item = {}

        if path == "me/top/artists":
            new_item["external_urls"] = item["external_urls"]["spotify"]
            new_item["followers"] = item["followers"]["total"]
            new_item["genres"] = item["genres"]
            new_item["id"] = item["id"]
            new_item["images"] = item["images"]
            new_item["name"] = item["name"]
        elif path == "me/top/tracks":
            new_item["album"] = {
                "name": item["album"]["name"],
                "total_tracks": item["album"]["total_tracks"],
                "external_urls": item["album"]["external_urls"]["spotify"],
                "id": item["album"]["id"],
                "images": item["album"]["images"],
            }
            new_item["artists"] = [
                {
                    "external_urls": artist["external_urls"]["spotify"],
                    "id": artist["id"],
                    "name": artist["name"],
                }
                for artist in item["artists"]
            ]
            new_item["duration_ms"] = item["duration_ms"]
            new_item["external_urls"] = item["external_urls"]["spotify"]
            new_item["id"] = item["id"]
            new_item["name"] = item["name"]
        elif path == "me/player/recently-played":
            new_item["played_at"] = item["played_at"]
            new_item["album"] = {
                "name": item["track"]["album"]["name"],
                "total_tracks": item["track"]["album"]["total_tracks"],
                "external_urls": item["track"]["album"]["external_urls"]["spotify"],
                "id": item["track"]["album"]["id"],
                "images": item["track"]["album"]["images"],
            }
            new_item["artists"] = [
                {
                    "external_urls": artist["external_urls"]["spotify"],
                    "id": artist["id"],
                    "name": artist["name"],
                }
                for artist in item["track"]["artists"]
            ]
            new_item["duration_ms"] = item["track"]["duration_ms"]
            new_item["external_urls"] = item["track"]["external_urls"]["spotify"]
            new_item["id"] = item["track"]["id"]
            new_item["name"] = item["track"]["name"]

        items.append(new_item)

    response["items"] = items
    return response


def makeProxyRequests(sessionID, path, params):
    spotify_base_url = "https://api.spotify.com/v1/"
    cache_path = path
    # If the path is me/top/tracks or me/top/artists or any path that gives different response based on time period
    # Then we need to store/retrieve it under its corresponding time range in DynamoDB
    if "time_range" in params:
        cache_path = path + f"?time_range={params['time_range']}"

    try:
        # get token from dynamoDB and create a header from it
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("sessionID_token_pair")
        db_response = table.get_item(Key={"sessionID": sessionID})

        if "Item" not in db_response or "expiresAt" not in db_response["Item"]:
            raise UnauthorizedError("SessionID is not valid")

        item = db_response["Item"]

        if int(item["expiresAt"]) < int(time.time()):
            raise UnauthorizedError("Your session has expired")

        response = item.get(cache_path, {})

        if not response or path == "me/player/recently-played":
            # Remove these print statements when app is ready for prod
            print("Making new request")
            token = item["token"]

            headers = {"Authorization": f"Bearer {token}"}

            response = requests.get(
                spotify_base_url + path, headers=headers, params=params
            )
            response.raise_for_status()

            response = formatResponseData(path, response.json())

            # cache the response in dynamoDB for any path other than recently-played under its correct cache_path
            if path != "me/player/recently-played":
                update_expression = "SET #path = :formatted_response"
                expression_attribute_names = {"#path": cache_path}
                expression_attribute_values = {":formatted_response": response}

                table.update_item(
                    Key={"sessionID": sessionID},
                    UpdateExpression=update_expression,
                    ExpressionAttributeNames=expression_attribute_names,
                    ExpressionAttributeValues=expression_attribute_values,
                )
        else:
            print("Using cached response")
            response = convertDecimals(response)

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps(response),
        }
    except UnauthorizedError as e:
        return errorHandler(401, "Unauthorized", e)
    except requests.exceptions.RequestException as e:
        return errorHandler(e.response.status_code, "Error", e)
    except Exception as e:
        return errorHandler(500, "Server side error", e)

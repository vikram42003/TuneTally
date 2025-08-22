import json
import os
import time
import requests
import boto3


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
            return invalidPathHandler(path)

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
            return invalidPathHandler(path)
    else:
        return unauthorizedErrorHandler("Required authentication cookie is missing")


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


def unauthorizedErrorHandler(message):
    print(message)
    return {
        "statusCode": 401,
        "headers": CORS_HEADERS,
        "body": json.dumps(
            {
                "error": "Unauthorized",
                "error_description": message,
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


def errorHandler(e, status_code=500):
    print(e)
    return {
        "statusCode": status_code,
        "headers": CORS_HEADERS,
        "body": json.dumps({"error": str(e)}),
    }


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

        response = item.get(path, {})

        if not response or path == "me/player/recently-played":
            print("Making new request")
            token = item["token"]

            headers = {"Authorization": f"Bearer {token}"}

            response = requests.get(
                spotify_base_url + path, headers=headers, params=params
            )
            response.raise_for_status()

            response = formatResponseData(path, response.json())

            if path != "me/player/recently-played":
                update_expression = "SET #path = :formatted_response"
                expression_attribute_names = {"#path": path}
                expression_attribute_values = {":formatted_response": response}

                table.update_item(
                    Key={"sessionID": sessionID},
                    UpdateExpression=update_expression,
                    ExpressionAttributeNames=expression_attribute_names,
                    ExpressionAttributeValues=expression_attribute_values,
                )
        else:
            print("Using cached response")
            response = convert_decimals(response)

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps(response),
        }
    except UnauthorizedError as e:
        return unauthorizedErrorHandler(e)
    except requests.exceptions.RequestException as e:
        return errorHandler(e, e.response.status_code)
    except Exception as e:
        return errorHandler(e)

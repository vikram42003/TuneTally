import boto3
import json
import time


SCOPE = "user-read-private user-read-email user-top-read"
CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'http://localhost:5173',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'OPTIONS,GET'
}

def lambda_handler(event, context):
  path = event["requestContext"]["path"]
  # Strip away the v1 part since path will be something like /v1/spotifyLogin
  path = path.split('/')[2]

  if path == 'spotifyLogin':
    # Prepare the request and redirect to spotify auth page
    return handleSpotifyLoginRequest()
  elif path == 'spotifyLoginCallback':
    # Exchange code for token (or send back error) and redirect to app page
    return handleSpotifyLoginCallbackRequest(event)
  else:
    return unknown_request_handler()

  return {
        'statusCode': 200,
        'headers': CORS_HEADERS,
        'body': json.dumps({
          'message': 'lambda is working again'
        })
    }

def handleSpotifyLoginRequest():
  pass

def unknown_request_handler():
  return {
        'statusCode': 404,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'OPTIONS,POST'
        },
        'body': json.dumps({
          'error': 'Unknown request',
          'error_description': 'The request is not supported by the server'
        })
    }

def error_handler(e):
  return {
    'statusCode': 500,
    'headers': {
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Origin': 'http://localhost:5173',
          'Access-Control-Allow-Methods': 'OPTIONS,POST'
      },
    'body': json.dumps({
      'error': str(e)
    })
  }
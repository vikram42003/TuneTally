import boto3
import json
import time


def lambda_handler(event, context):
  path = event["requestContext"]["path"]
  # Strip away the v1 part since path will be something like /v1/spotifyLogin
  path = path.split('/')[2]

  if path == 'spotifyLogin':
    # Handle spotify login request
    return handleSpotifyLoginRequest(event)
  elif path == 'spotifyLoginCallback':
    # Handle spotify login callback request
    return handleSpotifyLoginCallbackRequest(event)
  else:
    return unknown_request_handler()

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
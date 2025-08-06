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















  # Check and handle unknown and invalid requests
  # Return body if everything goes well
  # err, body = check_and_handle_invalid_requests(event)
  # if err:
  #   return err

  dynamodb = boto3.resource('dynamodb')
  table = dynamodb.Table('sessionID_token_pair')

  # Check which endpoint called the lambda
  # ref - https://stackoverflow.com/questions/57940412/how-can-an-aws-lambda-know-what-endpoint-called-it-from-api-gateway
  try:
    res = event["requestContext"]["path"]
    print(res)
  except Exception as e:
    res = e

  return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'OPTIONS,POST'
        },
        'body': json.dumps({
          'message': 'lambda is working again',
          'response': str(res)
        })
    }
    
  if 'state' in body and 'codeVerifier' in body:
    # Add state and codeVerifier to dynamoDB with an expirationTime of 5 minutes
    return saveStateAndCodeVerifierPair(body['state'], body['codeVerifier'], table)
  elif 'state' in body and 'code' in body:
    # Exchange code for access token from Spotify and attach it as a httpOnly cookie

    # !!! CHECK WHETHER CORS WOULD WORK WHEN SPOTIFY REDIRECTS TO CALLBACK !!!
    return handleTokenRequest(body['state'], body['code'], table)

def handleSpotifyLoginRequest():
  



def check_and_handle_invalid_requests(event):
  if 'body' not in event:
    return unknown_request_handler(), None
  
  try:
    body = json.loads(event['body'])
  except:
    return bad_request_handler(), None

  # If all required keys are missing
  no_pairs = 'state' not in body and 'codeVerifier' not in body and 'code' not in body

  # state and codeVerifier pair exists (auth request), and code is not present
  is_auth_request = 'state' in body and 'codeVerifier' in body and 'code' not in body

  # state and code pair exists (token request), and codeVerifier is not present
  is_token_request = 'state' in body and 'code' in body and 'codeVerifier' not in body

  if no_pairs:
    return unknown_request_handler(), None
  elif not is_auth_request and not is_token_request:
    return bad_request_handler(), None
  else:
    return None, body

def bad_request_handler():
  return {
        'statusCode': 400,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'OPTIONS,POST'
        },
        'body': json.dumps({
          'error': 'Bad formatted request',
          'error_description': 'The payload should be state and codeVerifier or state and code pair'
        })
    }

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

# Add state and codeVerifier to dynamoDB with an expirationTime of 5 minutes
def saveStateAndCodeVerifierPair(state, codeVerifier, table):
  try:
    table.put_item(
      Item = {
        'state': state,
        'codeVerifier': codeVerifier,
        'expiresAt': int(time.time()) + 300
      }
    )

    return {
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Origin': 'http://localhost:5173',
          'Access-Control-Allow-Methods': 'OPTIONS,POST'
      },
      'body': json.dumps({
        'message': 'State and code verifier saved successfully'
      })
    }
  except Exception as e:
    return error_handler(e)

def handleTokenRequest(state, code, table):
  try:
    # todo

    return {
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Origin': 'http://localhost:5173',
          'Access-Control-Allow-Methods': 'OPTIONS,POST'
      },
      'body': json.dumps({
        'message': 'Token request handled successfully'
      })
    }
  except Exception as e:
    return error_handler(e)

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
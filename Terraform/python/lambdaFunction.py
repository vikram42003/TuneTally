import boto3
import json
import time


def lambda_handler(event, context):
  # Check and handle unknown and invalid requests
  err = check_and_handle_invalid_requests(event)
  if err:
    return err

  dynamodb = boto3.resource('dynamodb')
  table = dynamodb.Table('state_verifier_pair')

  if 'state' in event and 'codeVerifier' in event:
    # Add state and codeVerifier to dynamoDB with an expirationTime of 5 minutes
    return saveStateAndCodeVerifierPair(event['state'], event['codeVerifier'], table)
  elif 'state' in event and 'code' in event:
    # Exchange code for access token from Spotify and attach it as a httpOnly cookie
    return handleTokenRequest(event['state'], event['code'], table)





def check_and_handle_invalid_requests(event):
  # If all required keys are missing
  no_pairs = 'state' not in event and 'codeVerifier' not in event and 'code' not in event

  # state and codeVerifier pair exists (auth request), and code is not present
  is_auth_request = 'state' in event and 'codeVerifier' in event and 'code' not in event

  # state and code pair exists (token request), and codeVerifier is not present
  is_token_request = 'state' in event and 'code' in event and 'codeVerifier' not in event

  if no_pairs:
      return unknown_request_handler()
  elif not is_auth_request and not is_token_request:
      return bad_request_handler()

def bad_request_handler():
  return {
        'statusCode': 400,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'OPTIONS,POST'
        },
        'body': {
          'error': 'Bad formatted request',
          'error_description': 'The payload should be state and codeVerifier or state and code pair'
        }
    }

def unknown_request_handler():
  return {
        'statusCode': 404,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'OPTIONS,POST'
        },
        'body': {
          'error': 'Unknown request',
          'error_description': 'The request is not supported by the server'
        }
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
      'body': {
        'message': 'State and code verifier saved successfully'
      }
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
      'body': {
        'message': 'Token request handled successfully'
      }
    }
  except Exception as e:
    return error_handler(e)

def error_handler(e):
  return {
    'statsCode': 500,
    'headers': {
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Origin': 'http://localhost:5173',
          'Access-Control-Allow-Methods': 'OPTIONS,POST'
      },
    'body': {
      'error': json.dumps(str(e))
    }
  }

  # if we receive state and code verifier from http requests
  # store verifier into a storage service (like dynamoDB) with
  #   - primary key as state
  #   - codeVerifier as code verifier
  #   - expirationTime as 5 minutes from now
  
  # if we receive state and code from http request
  # check the storage if we have a code verifier for the state we received
  # if there is a match then
  #   - take the code and code verifier and make an auth request to spotify's api/token endpint
  #   - delete the state and verifier from storage
  #   - receive the access token, attach it as a http only cookie and send it to the function caller
  
  # if we recieve anything else from the request then send 400
  
#   state = event["state"]
#   codeVerifier = event["codeVerifier"]
#   code = event["code"]
  
#   response
#   if state and codeVerifier and not code:
#     response = saveStateAndCodeVerifierPair(state, codeVerifier)
#   elif state and code and not codeVerifier:
#     response = getAndAttachAccessToken(state, code)
#   else:
#     response = {
#       "statusCode": 400,
#       "message": "Invalid input"
#     }
  
#   return response

  
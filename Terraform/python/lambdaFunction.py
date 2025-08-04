import boto3
import json
import time


def lambda_handler(event, context):
  # Check and handle unknown and invalid requests
  # Return body if everything goes well
  err, body = check_and_handle_invalid_requests(event)
  if err:
    return err

  dynamodb = boto3.resource('dynamodb')
  table = dynamodb.Table('state_verifier_pair')

  if 'state' in body and 'codeVerifier' in body:
    # Add state and codeVerifier to dynamoDB with an expirationTime of 5 minutes
    return saveStateAndCodeVerifierPair(body['state'], body['codeVerifier'], table)
  elif 'state' in body and 'code' in body:
    # Exchange code for access token from Spotify and attach it as a httpOnly cookie
    return handleTokenRequest(body['state'], body['code'], table)





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

  
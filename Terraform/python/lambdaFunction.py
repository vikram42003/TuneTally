import boto3
import json


def lambda_handler(event, context):
  check_and_handle_invalid_requests(event)

  # dynamodb = boto3.resource('dynamodb')
  # table = dynamodb.Table('state_verifier_pair')
  res = event

  return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'OPTIONS,POST'
        },
        'body': {
          'message': 'The lambda function is live!',
          'data': res
        }
    }

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

# def saveStateAndCodeVerifierPair(state, codeVerifier):
  
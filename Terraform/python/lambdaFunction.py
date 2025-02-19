import boto3

s3 = boto3.resource('s3')
for bucket in s3.buckets.all():
    print(bucket.name)

def lambda_handler(event, context):
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
  
  state = event["state"]
  codeVerifier = event["codeVerifier"]
  code = event["code"]
  
  response
  if state and codeVerifier and not code:
    response = saveStateAndCodeVerifierPair(state, codeVerifier)
  elif state and code and not codeVerifier:
    response = getAndAttachAccessToken(state, code)
  else:
    response = {
      "statusCode": 400,
      "message": "Invalid input"
    }
  
  return response
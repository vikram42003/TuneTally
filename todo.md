Objective for July 14 - 
✅1) Check if we're already logged in
1.1) Currently it logs the red "request failed" error to the console. deal with that
- Make frontend send a request to backend











Another TODO i guess - 
- SORT OUT THIS MESS OF A FILE
- take other people's feedback and see if the Hero components background image looks better with bg-center or with the current bg-top


To Do -

Create an API gateway for the lambda function with terraform



/* abstract of what i need to do copied from https://developer.spotify.com/documentation/web-api/howtos/web-app-profile

How it works
- When the page loads, we'll check if there is a code in the callback query string
- If we don't have a code, we'll redirect the user to the Spotify authorization page
- Once the user authorizes the application, Spotify will redirect the user back to our application, and we'll read the code from the query string.
- We will use the code to request an access token from the Spotify token API
- We'll use the access token to call the Web API to get the user's profile data.
- We'll populate the user interface with the user's profile data.

*/

Updated Auth flow -
1) Check GET /users/smedjan endpoint to see if we already have a http only authorization cookie
2) If not then generate codeVerifier, codeChallenge and state (state is just a unique id to identify the current session/user)
- send state and codeChallenge to spofity for authentication
- send state and codeVerifier to the Lambda function

/* UPDATE - CREATE THE AWS LAMBDA FUNCTION USING TERRAFORM */

3) Spotify authenticates and redirects us back to the app with the state and the code (code is a speical string spotify gives us, which we need to exchange for access token)
4) Check if the state returned by spotify and the state that we generated and stored in step 2 is the same (we recheck here to prevent attacks like Cross Site Request Forgery (CSRF), sessing hijacking etc)
5) Send the code and state to the Lambda function
6) The Lambda function checks its storage, finds the state and verifier pair for our requested state and then exchanges the code and verfier for an accessToken and deletes all info about state, verifier and code
7) The Lambda function attaches the accessToken as a HTTP-only cookie and returns it to the function caller.
8) The app sees that the request has finised working and then tests the GET /users/smedjan endpoint again. If the response is 200 then we are good to go! 


NOTE - in step 1 I need to make a request to fetch some data to check if we have the HTTP-only cookie set or not. Here i can send a request to GET /me endpoint but to do that im gonna have to ask user for some extra permissions that will oly be used for checking if we're auth'd or not. An alternative to this is to make a request to fetch a certain users profile, now this could be any user, and here i'd like to avoid using my own spotify profile for privacy reasons, but I need to fetch someones profile data, So here im gonna fetch data for a user whose user ID is "smedjan". This was the user whose profile data is fetched in Spotify documentation example but there is a chance that this could be a real random user, so maybe Email spotify team to confirm with them that this is not some random user and I am good to fetch their data with no worries.

CONSIDER HOSTING THE APP ON AWS CLOUDFRONT AND SET UP CLOUDFRONT WITH TERRAFORM

steps - 
1) check if we have the auth data that we need from the query string
2) - if yes then use the auth data to fetch music data
2) - if no the go to the auth page and do oauth pkce
  2.1)- DONE - Create a code challenge and request authorization from 'https://accounts.spotify.com/authorize' endpoint
  


  (Note - The actual Proof Key for Code Exchange (PKCE) mechanism does not need to be implemented since we'll be using the spotify pkce endpoint
  Also implementing pkce myself will be really hard and complicated and will be a separate project in itself and might lead to security vulnerabilities so i'll just use the spotify endpoint as recommended by spotify)

On auth the auth server (from spotify) will send an auth token/access token which we can use to make the api calls

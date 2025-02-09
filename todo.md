To Do -

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
1) Check GET /me endpoint to see if we already have a http only authorization cookie
2) If not then generate codeVerifier, codeChallenge and state (state is just a unique id to identify the current session/user)
- send state and codeChallenge to spofity for authentication
- send state and codeVerifier to the Lambda function
3) Spotify authenticates and redirects us back to the app with the state and the code (code is a speical string spotify gives us, which we need to exchange for access token)
4) Check if the state returned by spotify and the state that we generated and stored in step 2 is the same (we recheck here to prevent attacks like Cross Site Request Forgery (CSRF), sessing hijacking etc)
5) Send the code and state to the Lambda function
6) The Lambda function checks its storage, finds the state and verifier pair for our requested state and then exchanges the code and verfier for an accessToken and deletes all info about state, verifier and code
7) The Lambda function attaches the accessToken as a HTTP-only cookie and retruns it to the function caller.
8) The app sees that the request has finised working and then tests the GET /me endpoint again. If the response is 200 then we are good to go! 

steps - 
1) check if we have the auth data that we need from the query string
2) - if yes then use the auth data to fetch music data
2) - if no the go to the auth page and do oauth pkce
  2.1)- DONE - Create a code challenge and request authorization from 'https://accounts.spotify.com/authorize' endpoint
  


  (Note - The actual Proof Key for Code Exchange (PKCE) mechanism does not need to be implemented since we'll be using the spotify pkce endpoint
  Also implementing pkce myself will be really hard and complicated and will be a separate project in itself and might lead to security vulnerabilities so i'll just use the spotify endpoint as recommended by spotify)

On auth the auth server (from spotify) will send an auth token/access token which we can use to make the api calls


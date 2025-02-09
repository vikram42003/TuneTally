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

TRY THIS OUT -
storing the access token as a HTTP-only cookie would be much more secure than saving it to session storage, but we need a backend to attach it as HTTP-only cookie, so maybe try this - create an aws lambda fucntion, our app takes user to spotify authentication page, the user authenticates and comes back to the app with 

FLOW OF APP (for MVP) -
1) User opens the app
2) the app initializes tanstack store
3) The user clicks on get info button to fetch the data
4) The app creates the validators and code challenge and stores the validator in store instead of sessionStorage
5) 

steps - 
1) check if we have the auth data that we need from the query string
2) - if yes then use the auth data to fetch music data
2) - if no the go to the auth page and do oauth pkce
  2.1)- DONE - Create a code challenge and request authorization from 'https://accounts.spotify.com/authorize' endpoint
  


  (Note - The actual Proof Key for Code Exchange (PKCE) mechanism does not need to be implemented since we'll be using the spotify pkce endpoint
  Also implementing pkce myself will be really hard and complicated and will be a separate project in itself and might lead to security vulnerabilities so i'll just use the spotify endpoint as recommended by spotify)

On auth the auth server (from spotify) will send an auth token/access token which we can use to make the api calls


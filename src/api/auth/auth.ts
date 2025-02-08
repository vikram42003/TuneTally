import axios from "axios";

import redirectAndAuthenticateUser from "./pkce";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (!code) {
  // If the url query params doesnt have a code then redirect user to Spotify authorization page
  redirectAndAuthenticateUser(clientId);
} else {
  // If we do have a code then request an access token with the code
  const accessToken = await getAccessToken(code);
}

const getAccessToken = (code: string) {
  // stored in the previous step
  let codeVerifier = localStorage.getItem('code_verifier');

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      // grant_type: 'authorization_code',
      // code,
      redirect_uri: redirectUri,
      // code_verifier: codeVerifier,
    }),
  }

  const body = await fetch(url, payload);
  const response =await body.json();

  localStorage.setItem('access_token', response.access_token);
}
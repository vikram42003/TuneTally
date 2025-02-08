import axios from "axios";
import crypto from "crypto";

// Create a code verifier and code challenge according to the PKCE standard
const codeVerifier = crypto
  .randomBytes(64)
  .toString("base64")
  .replace(/=/g, "")
  .replace(/\+/g, "-")
  .replace(/\//g, "_");

const codeChallenge = crypto
  .createHash("sha256")
  .update(codeVerifier)
  .digest("base64")
  .replace(/=/g, "")
  .replace(/\+/g, "-")
  .replace(/\//g, "_");

// Add the code verifier to local storage so that we can access it later
window.localStorage.setItem("code_verifier", codeVerifier);

// The url to redirect to after auth should be the app's current url
const redirectUri = window.location.href;

const redirectAndAuthenticateUser = (clientId: string) => {
  // UN-HARDCODE THIS LATER
  // The type of data to fetch
  // go to https://developer.spotify.com/documentation/web-api/concepts/scopes for details
  const scope = "user-top-read";

  // The parameters to pass in the fetch request
  const params = {
    response_type: "code",
    client_id: clientId,
    scope,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  };

  const authUrl = new URL("https://accounts.spotify.com/authorize");
  // Append the parameters that we set in previous step to the url search params
  authUrl.search = new URLSearchParams(params).toString();
  // Redirect the user to the Spotify authorization page directly by setting window.location.href value
  window.location.href = authUrl.toString();
};

const getAccessToken = async (clientId: string, code: string) => {
  // stored in the previous step
  const codeVerifier = localStorage.getItem("code_verifier");

  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier!,
    }),
  };

  const url = "https://accounts.spotify.com/api/token";

  const body = await axios(url, payload);
  const response = await body.json();

  localStorage.setItem("access_token", response.access_token);
};

export default redirectAndAuthenticateUser;

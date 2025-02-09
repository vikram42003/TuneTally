import axios from "axios";

// The url to redirect to after auth should be the app's current url (wihtout query string)
const redirectUri = window.location.href.split("?")[0];

export const redirectAndAuthenticateUser = async (clientId: string) => {
  const codeVerifier = generateCodeVerifier();
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64UrlEncode(hashed);

  // Add the code verifier to local storage so that we can access it later
  window.localStorage.setItem("code_verifier", codeVerifier);

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

export const getAccessToken = async (clientId: string, code: string) => {
  // stored in the previous step
  const codeVerifier = localStorage.getItem("code_verifier");

  const params = new URLSearchParams({
    client_id: clientId,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier!,
  });

  const url = "https://accounts.spotify.com/api/token";

  const body = await axios.post(url, params);
  // const body = await fetch(url, payload);

  console.log(body);
  // const response = await body.json();

  if (body?.data?.access_token) {
    sessionStorage.setItem("access_token", body.data.access_token);
  }
};

// Create a code verifier and code challenge according to the PKCE standard
const generateCodeVerifier = () => {
  const array = new Uint8Array(64);
  window.crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

const sha256 = async (plain: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
};

const base64UrlEncode = (input: ArrayBuffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

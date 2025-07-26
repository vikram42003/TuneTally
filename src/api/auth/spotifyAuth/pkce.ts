import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// The url to redirect to after auth should be the app's current url (wihtout query string)
const redirectUri = window.location.href.split("?")[0];

export const redirectAndGetCodeFromSpotify = async (clientId: string, scope: string): Promise<void> => {
  // generate codeVerifer, codeChallenge and state
  const codeVerifier: string = generateCodeVerifier();
  const hashed: ArrayBuffer = await sha256(codeVerifier);
  const codeChallenge: string = base64UrlEncode(hashed);
  const state: string = uuidv4();

  // set the authentication status to pending so that
  // when we come back to this page we know how much progress we've made
  sessionStorage.setItem("spotifyAuthenticationStatus", "pending");

  // save uuid to session storage
  sessionStorage.setItem("state", state);

  // TEMP - save code verifier to session storage
  sessionStorage.setItem("code_verifier", codeVerifier);

  // send state and codeVerifier to the Lambda function

  // send state and codeChallenge to Spotify
  const authUrl = new URL("https://accounts.spotify.com/authorize");

  // The parameters to pass in the fetch request
  const params = {
    response_type: "code",
    client_id: clientId,
    scope,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
    state,
  };

  // Append the parameters that we set in previous step to the url search params
  authUrl.search = new URLSearchParams(params).toString();
  // Redirect the user to the Spotify authorization page directly by setting window.location.href value
  window.location.href = authUrl.toString();
};

export const getAccessToken = async (clientId: string, code: string) => {
  const codeVerifier = sessionStorage.getItem("code_verifier");

  const params = new URLSearchParams({
    client_id: clientId,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier!,
  });

  const url = "https://accounts.spotify.com/api/token";

  const body = await axios.post(url, params);

  console.log(body);
  // const response = await body.json();

  if (body?.data?.access_token) {
    return body.data.access_token;
  }
};

// Create a code verifier and code challenge according to the PKCE standard
const generateCodeVerifier = (): string => {
  const array = new Uint8Array(64);
  window.crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

const sha256 = async (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
};

const base64UrlEncode = (input: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

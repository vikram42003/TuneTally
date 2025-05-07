import axios from "axios";
import { redirectAndGetCodeFromSpotify, getAccessToken } from "./pkce";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

// The type of data to fetch
// go to https://developer.spotify.com/documentation/web-api/concepts/scopes for details
const scope = "user-top-read";

export const spotifyAuth = async () => {
  // check the authentication status that we have/will store
  const spotifyAuthenticationStatus = sessionStorage.getItem("spotifyAuthenticationStatus");

  if (!spotifyAuthenticationStatus) {
    console.log("TRIGGERING CONDITION 1");
    // If we dont find it then that means we're starting fresh
    await redirectAndGetCodeFromSpotify(clientId, scope);
  } else if (spotifyAuthenticationStatus === "pending") {
    // TODO
    console.log("TRIGGERING CONDITION 2");
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) {
      console.log("Code aint there my guy");
      return;
    }
    const accessToken = await getAccessToken(clientId, code);
    console.log("accessToken", accessToken);
    sessionStorage.setItem("accessToken", accessToken);
    sessionStorage.removeItem("state");
    sessionStorage.setItem("spotifyAuthenticationStatus", "finished");
  } else {
    console.log("TRIGGERING CONDITION 3");
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      console.log("Access Token aint there my guy");
      return;
    }
    const response = await testRequest(accessToken);
    console.log("Response: ", response);
    // await checkAccessToken();
  }
};

const checkAccessToken = async (): Promise<boolean> => {
  // TODO - remove the spotifyAuthenticationStatus and state variables from session storage incase the access token check fails
  // so that the user can start anew or we can just start authentication then and there

  try {
    await axios.get("https://api.spotify.com/v1/users/smedjan");
  } catch (error) {
    console.log("Some error occured in checkAccessToken");
    console.log(error);
    return false;
  }

  return true;
};

const testRequest = async (accessToken: string) => {
  const url = "https://api.spotify.com/v1/me/top/artists";
  return await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

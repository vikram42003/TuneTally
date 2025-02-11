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
    // If we dont fint it then that means we're starting fresh
    await redirectAndGetCodeFromSpotify(clientId, scope);
  } else if (spotifyAuthenticationStatus === "pending") {
    // TODO
    await getAccessToken();
  } else {
    await checkAccessToken();
  }

  const response = await testRequest();
  console.log("Response: ", response);
};

const checkAccessToken = async (): Promise<boolean> => {
  try {
    await axios.get("https://api.spotify.com/v1/users/smedjan");
  } catch (error) {
    console.log("Some error occured in checkAccessToken");
    console.log(error);
    return false;
  }

  return true;
};

const testRequest = async () => {
  const url = "https://api.spotify.com/v1/me/top/artists";
  await axios.get(url);
}

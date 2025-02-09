import axios from "axios";
import { redirectAndAuthenticateUser, getAccessToken } from "./pkce";

export const spotifyAuth = async () => {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) {
    console.log(code);
    // If the url query params doesnt have a code then redirect user to Spotify authorization page
    redirectAndAuthenticateUser(clientId);
  } else {
    return await getAccessToken(clientId, code);

    const accessToken = sessionStorage.getItem("access_token");
    if (!accessToken) {
      return await getAccessToken(clientId, code);
    }

    const url = "https://api.spotify.com/v1/me/top/artists";

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log(response);
  }
};

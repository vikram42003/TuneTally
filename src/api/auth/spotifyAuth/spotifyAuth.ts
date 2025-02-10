import axios, { AxiosError } from "axios";
import { redirectAndAuthenticateUser, getAccessToken } from "./pkce";
import { SpotifyError } from "../../../types/spotifyTypes";

export const spotifyAuth = async () => {
  let doWeHaveTheAccessToken;
  try {
    doWeHaveTheAccessToken = await axios.get("https://api.spotify.com/v1/users/smedjan");
  } catch (error) {
    // handle zod validation and type guarding to AxiosError<
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<SpotifyError>;
      console.log(axiosError.response?.data);
    }
    console.log(error);
  }

  return;




  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) {
    console.log(code);
    // If the url query params doesnt have a code then redirect user to Spotify authorization page
    redirectAndAuthenticateUser(clientId);
  } else {
    return await getAccessToken(clientId, code);

    // const accessToken = sessionStorage.getItem("access_token");
    // if (!accessToken) {
    //   return await getAccessToken(clientId, code);
    // }

    // const url = "https://api.spotify.com/v1/me/top/artists";

    // const response = await axios.get(url, {
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    // });

    // console.log(response);
  }
};

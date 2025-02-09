import { redirectAndAuthenticateUser, getAccessToken } from "./pkce";

export const auth = async () => {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  
  if (!code) {
    console.log(code);
    // If the url query params doesnt have a code then redirect user to Spotify authorization page
    redirectAndAuthenticateUser(clientId);
  } else {
    if (!localStorage.getItem("access_token")) {
      // If we do have a code then request an access token with the code
      /* const accessToken = */await getAccessToken(clientId, code);
    }
  }
};

import axios from "axios";

// The login process follows OAuth2 so just change the url to initiate the process
const apiSpotifyBaseUrl = import.meta.env.VITE_LAMBDA_SPOTIFY_BASE_URL;

export const loginWithSpotify = () => {
  // Warm up the requestProxy lambda func
  axios.get(apiSpotifyBaseUrl + "/spotify/warm");
  window.location.href = apiSpotifyBaseUrl + "/spotifyLogin";
};

export const loginWithSpotifyDEMO = () => {
  // Warm up the requestProxy lambda func
  axios.get(apiSpotifyBaseUrl + "/spotify/warm");
  window.location.href = apiSpotifyBaseUrl + "/spotifyLogin?demo_mode=login";
};

export const loginWithSpotifyRefreshTokenDEMO = () => {
  // Warm up the requestProxy lambda func
  axios.get(apiSpotifyBaseUrl + "/spotify/warm");
  window.location.href = apiSpotifyBaseUrl + "/spotifyLogin?demo_mode=refreshSession";
};

export const logoutSpotify = () => {
  axios.get(apiSpotifyBaseUrl + "/spotifyLogout", { withCredentials: true });
  window.location.href = "/"
};

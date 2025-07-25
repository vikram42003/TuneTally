import axios from "axios";

// import { spotifyAuth } from "../auth/spotifyAuth/spotifyAuth"

// const fetchTopArtists = async () => {
//   const accessToken = await spotifyAuth();
// }

// Make a request to the /me endpoint to check if we're already logged in
const checkForAuth = async (): Promise<boolean> => {
  try {
    await axios.get("https://api.spotify.com/v1/me");
    return true;
  } catch (e) {
    console.log("https://api.spotify.com/v1/me request failed that means we are not logged in!", e);
    return false;
  }
};

export default {
  checkForAuth,
};

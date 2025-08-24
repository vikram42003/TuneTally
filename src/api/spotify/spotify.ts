import axios from "axios";

const apiSpotifyBaseUrl = import.meta.env.VITE_LAMBDA_SPOTIFY_BASE_URL;

export const getSpotifyUserDetails = async () => {
  const data = axios.get(apiSpotifyBaseUrl + "/spotify/me", { withCredentials: true });
  // parse and validate the fetched data with ts and zod
  return data;
};

export const getSpotifyTopArtists = async (time_range: string) => {
  const data = axios.get(apiSpotifyBaseUrl + `/spotify/me/top/artists?${time_range}`, { withCredentials: true });
  // parse and validate the fetched data with ts and zod
  return data;
};

export const getSpotifyTopSongs = async (time_range: string) => {
  const data = axios.get(apiSpotifyBaseUrl + `/spotify/me/top/tracks?${time_range}`, { withCredentials: true });
  // parse and validate the fetched data with ts and zod
  return data;
};

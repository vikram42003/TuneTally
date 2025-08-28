import axios from "axios";
import { SpotifyUserDetails, SpotifyUserDetailsSchema } from "../../types/spotifyTypes";

const apiSpotifyBaseUrl = import.meta.env.VITE_LAMBDA_SPOTIFY_BASE_URL;

export const getSpotifyUserDetails = async (): Promise<SpotifyUserDetails> => {
  const response = await axios.get(apiSpotifyBaseUrl + "/spotify/me", { withCredentials: true });
  SpotifyUserDetailsSchema.safeParse(response.data)
  return response.data;
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

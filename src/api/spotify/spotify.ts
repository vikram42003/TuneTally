import axios from "axios";
import {
  SpotifyTopArtists,
  SpotifyTopArtistsSchema,
  SpotifyTopSongs,
  SpotifyTopSongsSchema,
  SpotifyUserDetails,
  SpotifyUserDetailsSchema,
} from "../../types/spotifyTypes";

const apiSpotifyBaseUrl = import.meta.env.VITE_LAMBDA_SPOTIFY_BASE_URL;

export const getSpotifyUserDetails = async (): Promise<SpotifyUserDetails> => {
  const response = await axios.get(apiSpotifyBaseUrl + "/spotify/me", { withCredentials: true });
  const validation = SpotifyUserDetailsSchema.safeParse(response.data);
  if (!validation.success) {
    console.log("Zod validation failed for SpotifyUserDetails, continuing anyway");
    console.log(validation);
  }
  return response.data;
};

export const getSpotifyTopArtists = async (time_range: string): Promise<SpotifyTopArtists> => {
  const response = await axios.get(apiSpotifyBaseUrl + `/spotify/me/top/artists?${time_range}`, {
    withCredentials: true,
  });
  const validation = SpotifyTopArtistsSchema.safeParse(response.data);
  if (!validation.success) {
    console.log("Zod validation failed for SpotifyTopArtists, continuing anyway");
    console.log(validation);
  }
  return response.data;
};

export const getSpotifyTopSongs = async (time_range: string): Promise<SpotifyTopSongs> => {
  const response = await axios.get(apiSpotifyBaseUrl + `/spotify/me/top/tracks?${time_range}`, {
    withCredentials: true,
  });
  const validation = SpotifyTopSongsSchema.safeParse(response.data);
  if (!validation.success) {
    console.log("Zod validation failed for SpotifyTopSongs, continuing anyway");
    console.log(validation);
  }
  return response.data;
};

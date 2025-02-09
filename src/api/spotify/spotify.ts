import { spotifyAuth } from "../auth/spotifyAuth/spotifyAuth"


const fetchTopArtists = async () => {
  const accessToken = await spotifyAuth();
}
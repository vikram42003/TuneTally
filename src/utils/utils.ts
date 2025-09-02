import axios from "axios";

import { isApiError, isSpotifyError } from "../validators/spotifyValidators";
import { SpotifyTopArtists } from "../types/spotifyTypes";

export const getErrorText = (error: unknown): string | undefined => {
  if (!axios.isAxiosError(error)) {
    return;
  }

  const data = error.response?.data;
  if (error.status && error.status >= 400 && error.status < 500) {
    if (error.status === 401) {
      return "Your session has expired. Please try logging in again";
    } else if (isApiError(data)) {
      return data.error_message;
    } else if (isSpotifyError(data)) {
      return data.message;
    }
  }
};

export const calculateTopGenres = (data: SpotifyTopArtists): Map<string, number> => {
  const genresMap = new Map<string, number>();

  for (const d of data.items) {
    for (const g of d.genres) {
      genresMap.set(g, (genresMap.get(g) ?? 0) + 1);
    }
  }

  // genresMap.entries() will return an Iterator, so we gotta enclose it in square brackets
  return new Map([...genresMap.entries()].sort(([, a], [, b]) => b - a).slice(0, 10));
};

export const isJson = (str: string): boolean => {
  try {
    JSON.parse(str);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_e) {
    return false;
  }
  return true;
};

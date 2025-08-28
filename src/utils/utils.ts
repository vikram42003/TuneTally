import axios from "axios";

import { isApiError, isSpotifyError } from "../validators/spotifyValidators";

export const getErrorText = (error: unknown): string | undefined => {
  if (!axios.isAxiosError(error)) {
    return;
  }

  const data = error.response?.data;
  if (error.code && +error.code >= 400 && +error.code < 500) {
    if (isApiError(data)) {
      return data.error_message;
    } else if (isSpotifyError(data)) {
      return data.message;
    }
  }
};

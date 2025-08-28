import axios from "axios";

import { isApiError, isSpotifyError } from "../validators/spotifyValidators";

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

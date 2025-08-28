import { ApiError, ApiErrorSchema, SpotifyError, SpotifyErrorSchema, SpotifyUserDetails, SpotifyUserDetailsSchema } from "../types/spotifyTypes";

export const isApiError = (error: unknown): error is ApiError => {
  return ApiErrorSchema.safeParse(error).success;
};

export const isSpotifyError = (error: unknown): error is SpotifyError => {
  return SpotifyErrorSchema.safeParse(error).success;
};

export const isSpotifyUserDetails = (data: unknown): data is SpotifyUserDetails => {
  return SpotifyUserDetailsSchema.safeParse(data).success
}
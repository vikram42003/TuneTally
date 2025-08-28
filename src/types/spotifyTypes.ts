import { z } from "zod";

export type SpotifyTimeRange = "short_term" | "medium_term" | "long_term";

export const ApiErrorSchema = z.object({
  error: z.string(),
  error_message: z.any(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

export const SpotifyErrorSchema = z.object({
  status: z.string(),
  message: z.string(),
});

export type SpotifyError = z.infer<typeof SpotifyErrorSchema>;

const SpotifyImageSchema = z.object({
  url: z.string(),
  height: z.number().nullish(),
  width: z.number().nullish()
})

export const SpotifyUserDetailsSchema = z.object({
  display_name: z.string(),
  id: z.string(),
  images: z.array(SpotifyImageSchema),
  country: z.string().nullish(),
  external_urls: z.string(),
  followers: z.number()
})

export type SpotifyUserDetails = z.infer<typeof SpotifyUserDetailsSchema>
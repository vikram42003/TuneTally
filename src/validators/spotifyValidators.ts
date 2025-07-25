import { z } from "zod";

export const SpotifyAuthenticationErrorSchema = z.object({
  error: z.string(),
  error_description: z.string(),
});

export type SpotifyAuthenticationError = z.infer<typeof SpotifyAuthenticationErrorSchema>;

export const SpotifyErrorSchema = z.object({
  status: z.string(),
  message: z.string(),
});

export type SpotifyError = z.infer<typeof SpotifyErrorSchema>;

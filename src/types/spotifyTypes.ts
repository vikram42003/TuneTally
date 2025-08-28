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

// IMPORTANT NOTE - THE TYPES FOR SPOTIFY TOP SONGS, TOP ARTISTS, IMAGES ETC ARE <TIGHTLY COUPLE> WITH
// THE REQUEST PROXY LAMBDA FUNC, ANY CHANGES MADE THERE SHOULD BE MATCHED HERE AND THAT SHOULD
// BE TAKEN AS THE SOURCE OF TRUTH

const SpotifyImageSchema = z.object({
  url: z.string(),
  height: z.number().nullish(),
  width: z.number().nullish(),
});

export const SpotifyUserDetailsSchema = z.object({
  display_name: z.string(),
  id: z.string(),
  images: z.array(SpotifyImageSchema),
  country: z.string().nullish(),
  external_urls: z.string(),
  followers: z.number(),
});

export type SpotifyUserDetails = z.infer<typeof SpotifyUserDetailsSchema>;

export const SpotifyArtistSchema = z.object({
  external_urls: z.string(),
  followers: z.number(),
  genres: z.array(z.string()),
  id: z.string(),
  images: z.array(SpotifyImageSchema),
  name: z.string(),
});

export type SpotifyArtist = z.infer<typeof SpotifyArtistSchema>;

export const SpotifyTopArtistsSchema = z.object({
  href: z.string(),
  items: z.array(SpotifyArtistSchema),
  limit: z.number(),
  next: z.string().nullish(),
  offset: z.number(),
  previous: z.string().nullish(),
  total: z.number(),
});

export type SpotifyTopArtists = z.infer<typeof SpotifyTopArtistsSchema>;

export const SpotifyArtistInTopSongsSchema = SpotifyArtistSchema.pick({
  external_urls: true,
  id: true,
  name: true,
});

export const SpotifyAlbumSchema = z.object({
  external_urls: z.string(),
  id: z.string(),
  images: z.array(SpotifyImageSchema),
  name: z.string(),
  total_tracks: z.number(),
});

export const SpotifySongSchema = z.object({
  album: SpotifyAlbumSchema,
  artists: z.array(SpotifyArtistInTopSongsSchema),
  duration_ms: z.number(),
  external_urls: z.string(),
  id: z.string(),
  name: z.string(),
});

export type SpotifySong = z.infer<typeof SpotifySongSchema>;

export const SpotifyTopSongsSchema = z.object({
  href: z.string(),
  items: z.array(SpotifySongSchema),
  limit: z.number(),
  next: z.string().nullish(),
  offset: z.number(),
  previous: z.string().nullish(),
  total: z.number(),
});

export type SpotifyTopSongs = z.infer<typeof SpotifyTopSongsSchema>;

export const SpotifySongInRecentlyPlayedSchema = z.object({
  ...SpotifySongSchema.shape,
  played_at: z.string().datetime(),
});

export type SpotifySongInRecentlyPlayed = z.infer<typeof SpotifySongInRecentlyPlayedSchema>;

export const SpotifyRecentlyPlayedSongsSchema = z.object({
  cursors: z.object({
    before: z.string(),
    after: z.string(),
  }),
  href: z.string(),
  items: z.array(SpotifySongInRecentlyPlayedSchema),
  limit: z.number(),
  next: z.string(),
});

export type SpotifyRecentlyPlayedSongs = z.infer<typeof SpotifyRecentlyPlayedSongsSchema>;

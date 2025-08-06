# The variables will be loaded from ./.env, so make soure to do source .env or something before running terraform 

variable "SPOTIFY_CLIENT_ID" {
  description = "Spotify Client ID"
  type        = string
  sensitive   = true
  default = ""
}

variable "SPOTIFY_CLIENT_SECRET" {
  description = "Spotify Client Secret"
  type        = string
  sensitive   = true
  default = ""
}
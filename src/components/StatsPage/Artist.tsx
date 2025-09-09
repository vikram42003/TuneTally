import { Link } from "react-router";
import { SpotifyArtist } from "../../types/spotifyTypes";

interface ArtistProps {
  artist: SpotifyArtist;
  idx: number;
}

const Artist = ({ artist, idx }: ArtistProps) => {
  return (
    <div className="text-center hover:underline">
      <Link to={artist.external_urls}>
        <img
          src={artist.images[1].url}
          alt={`Image for artist ${artist.name}`}
          className="aspect-square w-full object-cover"
        />
        {idx + 1}. {artist.name}
      </Link>
    </div>
  );
};

export default Artist;

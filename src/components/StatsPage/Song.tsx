import { Link } from "react-router";
import { SpotifySong } from "../../types/spotifyTypes";

interface SongProps {
  song: SpotifySong;
  idx: number;
}

const Song = ({ song, idx }: SongProps) => {
  const durationMinutes = ~~(song.duration_ms / 1000 / 60);
  const durationSeconds = ~~((song.duration_ms / 1000) % 60);
  return (
    <div key={song.id} className="flex pt-2 items-center">
      <div className="flex-1/12">{idx + 1}</div>
      {/* ADD THE SONG/ALBUM PHOTO HERE */}
      <div className="flex-6/12">
        <Link to={song.external_urls} className="hover:underline">{song.name}</Link>
        <div>
          {song.artists.map((a, idx) => (
            <span key={a.id}>
              <Link to={a.external_urls} className="hover:underline text-spotify-text-gray">{a.name}</Link>
              {idx < song.artists.length - 1 && ", "}
            </span>
          ))}
        </div>
      </div>
      <Link to={song.album.external_urls} className="flex-4/12 text-spotify-text-gray hover:underline">{song.album.name}</Link>
      <div className="flex-1/12 text-spotify-text-gray">
        {durationMinutes}:{durationSeconds}
      </div>
    </div>
  );
};

export default Song;

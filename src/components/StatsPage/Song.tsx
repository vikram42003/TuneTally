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
    <div className="flex items-center pt-2 gap-2">
      <div className="flex-1/24">{idx + 1}</div>
      {/* ADD THE SONG/ALBUM PHOTO HERE */}
      <div className="flex flex-13/24 items-center gap-2">
        <Link to={song.external_urls} className="hover:underline">
          <img
            src={song.album.images[2].url}
            className="h-[48px] w-[48px]"
            alt={`Cover art for the album of the song ${song.name}`}
          />
        </Link>
        <div>
          <Link to={song.external_urls} className="hover:underline">
            {song.name}
          </Link>
          <div>
            {song.artists.map((a, idx) => (
              <span key={a.id}>
                <Link to={a.external_urls} className="text-spotify-text-gray hover:underline">
                  {a.name}
                </Link>
                {idx < song.artists.length - 1 && ", "}
              </span>
            ))}
          </div>
        </div>
      </div>
      <Link to={song.album.external_urls} className="text-spotify-text-gray flex-8/24 hover:underline">
        {song.album.name}
      </Link>
      <div className="text-spotify-text-gray flex-2/24">
        {durationMinutes}:{durationSeconds || "00"}
      </div>
    </div>
  );
};

export default Song;

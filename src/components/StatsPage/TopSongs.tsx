import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { SpotifyTimeRange, SpotifyTopSongs } from "../../types/spotifyTypes";
import { getSpotifyTopSongs } from "../../api/spotify/spotify";
import StatsPageErrorComponent from "./StatsPageErrorComponent";
import { getErrorText } from "../../utils/utils";
import Song from "./Song";

const TopSongs = () => {
  const [timeRange, setTimeRange] = useState<SpotifyTimeRange>("medium_term");

  const { isLoading, error, data } = useQuery<SpotifyTopSongs>({
    queryKey: [`/spotify/me/top/tracks?${timeRange}`],
    queryFn: () => getSpotifyTopSongs(timeRange),
  });

  if (isLoading) {
    return <div>SKELETON</div>;
  }

  if (error) {
    console.log(error);
    const errorText = getErrorText(error);
    return <StatsPageErrorComponent errorText={errorText} />;
  }

  if (!data) {
    return <StatsPageErrorComponent errorText="No user data available" />;
  }

  console.log("/me/top/tracks", data);

  return (
    <div className="">
      TopSongs
      <div className="">
        <div className="flex gap-2">
          <div className="flex-1/24">#</div>
          <div className="flex-13/24">Title</div>
          <div className="flex-8/24">Album</div>
          <div className="flex-2/24">⏱</div>
        </div>

        {data.items.map((i, idx) => (
          <Song key={i.id} song={i} idx={idx} />
        ))}
      </div>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
};

export default TopSongs;

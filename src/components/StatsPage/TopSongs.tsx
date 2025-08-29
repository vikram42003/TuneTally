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

  // console.log("/me/top/tracks", data);

  return (
    <div className="">
      TopSongs
      <div className="border border-red-500">
        <div className="flex">
          <div className="flex-1/12">#</div>
          <div className="flex-6/12">Title</div>
          <div className="flex-4/12">Album</div>
          <div className="flex-1/12">⏱</div>
        </div>

        {data.items.map((i, idx) => <Song song={i} idx={idx}/>)}
      </div>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
};

export default TopSongs;

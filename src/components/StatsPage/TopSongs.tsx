import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { SpotifyTimeRange, SpotifyTopSongs } from "../../types/spotifyTypes";
import { getSpotifyTopSongs } from "../../api/spotify/spotify";
import StatsPageErrorComponent from "./StatsPageErrorComponent";
import { getErrorText } from "../../utils/utils";
import Song from "./Song";
import TimeRangePicker from "./TimeRangePicker";

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
    <div className="w-[40vw] overflow-auto">
      {/* We offset the content 16px with pr-4 to account for the scrollbar */}
      <h4 className="text-spotify-green pr-4 text-center text-3xl font-bold">Top {data.items.length} Songs</h4>

      <div className="p-4">
        <TimeRangePicker timeRange={timeRange} setTimeRange={setTimeRange}/>
      </div>

      <div>
        <div className="flex gap-2 pt-4 pr-4 text-xl">
          <div className="flex-1/24">#</div>
          <div className="flex-13/24">Title</div>
          <div className="flex-8/24">Album</div>
          <div className="flex-2/24">⏱</div>
        </div>

        <div className="scrollbar scrollbar-thumb-gray-400 scrollbar-track-spotify-dark h-[100vh] overflow-y-scroll">
          {data.items.map((i, idx) => (
            <Song key={i.id} song={i} idx={idx} />
          ))}
        </div>
      </div>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
};

export default TopSongs;

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { SpotifyTimeRange } from "../../types/spotifyTypes";
import { getSpotifyTopArtists } from "../../api/spotify/spotify";
import { getErrorText } from "../../utils/utils";
import StatsPageErrorComponent from "./StatsPageErrorComponent";
import TimeRangePicker from "./TimeRangePicker";
import Artist from "./Artist";

const TopSongs = () => {
  const [timeRange, setTimeRange] = useState<SpotifyTimeRange>("medium_term");

  const { isLoading, error, data } = useQuery({
    queryKey: [`/spotify/me/top/artists?${timeRange}`],
    queryFn: () => getSpotifyTopArtists(timeRange),
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

  console.log("/me/top/artists", data);

  return (
    <div className="w-[40vw] overflow-auto">
      {/* We offset the content 16px with pr-4 to account for the scrollbar */}
      <h4 className="text-spotify-green pr-4 text-center text-3xl font-bold">Top {data.items.length} Artists</h4>

      <div className="py-4 pr-3.5">
        <TimeRangePicker timeRange={timeRange} setTimeRange={setTimeRange} />
      </div>

      <div className="scrollbar scrollbar-thumb-gray-400 scrollbar-track-spotify-dark grid h-[100vh] grid-cols-3 gap-6 overflow-auto overflow-y-scroll pt-4">
        {data.items.map((i, idx) => (
          <Artist key={i.id} artist={i} idx={idx} />
        ))}
      </div>
    </div>
  );
};

export default TopSongs;

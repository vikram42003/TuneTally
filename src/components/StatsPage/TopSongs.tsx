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

  const exp = sessionStorage.getItem("sessionExpiry");
  if (!exp) {
    return <StatsPageErrorComponent componentName="Top Songs" errorText="You aren't logged in!" />;
  }

  if (isLoading) {
    return <TopSongsSkeleton />;
  }

  if (error) {
    console.log(error);
    const errorText = getErrorText(error);
    return <StatsPageErrorComponent componentName="Top Songs" errorText={errorText} />;
  }

  if (!data) {
    return <StatsPageErrorComponent componentName="Top Songs" errorText="No user data available" />;
  }

  return (
    <div className="overflow-auto lg:py-8 py-6">
      {/* We offset the content 16px with pr-4 to account for the scrollbar */}
      <h4 className="text-spotify-green md:pr-4 text-center md:text-3xl text-2xl font-bold">Top {data.items.length} Songs</h4>

      <div className="lg:py-4 p-2 pr-4">
        <TimeRangePicker timeRange={timeRange} setTimeRange={setTimeRange} />
      </div>

      <div>
        <div className="flex lg:gap-2 gap-1 lg:pt-4 lg:text-xl text-base">
          <div className="flex-1/24">#</div>
          <div className="flex-13/24">Title</div>
          <div className="flex-8/24">Album</div>
          <div className="flex-2/24">⏱</div>
        </div>

        <div className="scrollbar scrollbar-thumb-gray-400 scrollbar-track-spotify-dark lg:h-[100vh] h-[60vh] overflow-y-scroll">
          {data.items.map((i, idx) => (
            <Song key={i.id} song={i} idx={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

const TopSongsSkeleton = () => {
  return (
    <div className="space-y-4 overflow-auto lg:py-8 py-6">
      {/* We offset the content 16px with pr-4 to account for the scrollbar */}
      <h4 className="text-spotify-green md:pr-4 text-center md:text-3xl text-2xl font-bold">Top Songs</h4>

      <div className="animate-pulse">
        <div className="mx-16 lg:mb-4 lg:h-3 h-2 rounded bg-gray-700 py-4 pr-3.5"></div>

        <div className="scrollbar scrollbar-thumb-gray-400 scrollbar-track-spotify-dark lg:h-[100vh] h-[60vh] lg:space-y-4 space-y-3 lg:space-x-2 space-x-1 overflow-auto overflow-y-scroll pt-4">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="lg:h-12 h-10 rounded bg-gray-700"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopSongs;

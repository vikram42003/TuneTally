import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { SpotifyTimeRange } from "../../types/spotifyTypes";
import { getSpotifyTopArtists } from "../../api/spotify/spotify";
import { calculateTopGenres, getErrorText } from "../../utils/utils";
import StatsPageErrorComponent from "./StatsPageErrorComponent";
import TimeRangePicker from "./TimeRangePicker";
import Artist from "./Artist";
import TopGenres from "./TopGenres";

const TopArtists = () => {
  const [timeRange, setTimeRange] = useState<SpotifyTimeRange>("medium_term");

  const { isLoading, error, data } = useQuery({
    queryKey: [`/spotify/me/top/artists?${timeRange}`],
    queryFn: () => getSpotifyTopArtists(timeRange),
  });

  const genresMap = useMemo(() => {
    if (!data) return new Map();
    return calculateTopGenres(data);
  }, [data]);

  if (isLoading) {
    return <div>SKELETON</div>;
  }

  if (error) {
    console.log(error);
    const errorText = getErrorText(error);
    return <StatsPageErrorComponent componentName="Top Artists" errorText={errorText} />;
  }

  if (!data) {
    return <StatsPageErrorComponent componentName="Top Artists" errorText="No user data available" />;
  }

  return (
    <>
      <div className="w-[40vw] overflow-auto py-8">
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

      {/* Although TopArtists and TopGenres are their own components. I'm rendering them together because 
        1. theyre closely related and their timeRange and data should match 
        2. Lifting timeRange and useQuery up would make my separating of concerins between Layout components and Logic components inconsistent
        3. May turn useQuery (and maybe timeRange too into a custom hook, but thats not needed for now since the logic here is simple enough
      */}
      <div className="pt-10">
        <TopGenres genresMap={genresMap} />
      </div>
    </>
  );
};

export default TopArtists;

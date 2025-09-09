import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { SpotifyTimeRange } from "../../types/spotifyTypes";
import { getSpotifyTopArtists } from "../../api/spotify/spotify";
import { calculateTopGenres, getErrorText } from "../../utils/utils";
import StatsPageErrorComponent from "./StatsPageErrorComponent";
import TimeRangePicker from "./TimeRangePicker";
import Artist from "./Artist";
import TopGenres, { TopGenresSkeleton } from "./TopGenres";

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

  const exp = sessionStorage.getItem("sessionExpiry");
  if (!exp) {
    return (
      <>
        <StatsPageErrorComponent componentName="Top Artists" errorText="You aren't logged in!" />
        <StatsPageErrorComponent componentName="Top Genres" errorText="You aren't logged in!" />
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <TopArtistsSkeleton />
        <div className="pt-1">
          <TopGenresSkeleton />
        </div>
      </>
    );
  }

  if (error) {
    console.log(error);
    const errorText = getErrorText(error);
    return (
      <>
        <StatsPageErrorComponent componentName="Top Artists" errorText={errorText} />
        <StatsPageErrorComponent componentName="Top Genres" errorText={errorText} />
      </>
    );
  }

  if (!data) {
    return <StatsPageErrorComponent componentName="Top Artists" errorText="No user data available" />;
  }

  return (
    <>
      <div className="lg:py-8 py-6">
        {/* We offset the content 16px with pr-4 to account for the scrollbar */}
        <h4 className="text-spotify-green md:pr-4 text-center md:text-3xl text-2xl font-bold">Top {data.items.length} Artists</h4>

        <div className="lg:py-4 p-2 pr-3.5">
          <TimeRangePicker timeRange={timeRange} setTimeRange={setTimeRange} />
        </div>

        <div className="scrollbar scrollbar-thumb-gray-400 scrollbar-track-spotify-dark grid lg:h-[100vh] h-[60vh] grid-cols-3 lg:gap-6 gap-2 overflow-auto overflow-y-scroll lg:pt-4 pt-2">
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
      <div className="lg:pt-10 md:pt-6 pt-2">
        <TopGenres genresMap={genresMap} />
      </div>
    </>
  );
};

const TopArtistsSkeleton = () => {
  return (
    <div className="flex-col space-y-4 lg:py-8 py-6">
      <h4 className="text-spotify-green md:pr-4 text-center md:text-3xl text-2xl font-bold">Top Artists</h4>

      <div className="animate-pulse">
        <div className="mx-16 lg:mb-4 lg:h-3 h-2 rounded bg-gray-700 py-4 pr-3.5"></div>

        <div className="scrollbar scrollbar-thumb-gray-400 scrollbar-track-spotify-dark grid lg:h-[100vh] h-[60vh] grid-cols-3 lg:gap-6 gap-4 overflow-auto overflow-y-scroll lg:pt-4 pt-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-2">
              {/* Square artist image placeholder */}
              <div className="lg:h-40 lg:w-40 h-24 w-24 rounded-md bg-gray-700 opacity-70" />
              <div className="h-4 w-24 rounded bg-gray-700 opacity-70" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopArtists;

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { SpotifyTimeRange } from "../../types/spotifyTypes";
import { getSpotifyTopSongs } from "../../api/spotify/spotify";

const TopSongs = () => {
  const [timeRange, setTimeRange] = useState<SpotifyTimeRange>("medium_term");

  const { isLoading, error, data } = useQuery({
    queryKey: [`/spotify/me/top/tracks?${timeRange}`],
    queryFn: () => getSpotifyTopSongs(timeRange),
    enabled: false,
  });

  if (isLoading) {
    return <div>SKELETON</div>;
  }

  if (error) {
    return <div>Some went wrong, please try logging in again</div>;
  }

  return (
    <div>
      TopSongs
      <pre>{JSON.stringify(data?.data, null, 2)}</pre>
    </div>
  );
};

export default TopSongs;

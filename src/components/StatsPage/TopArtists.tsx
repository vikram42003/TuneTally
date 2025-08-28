import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { SpotifyTimeRange } from "../../types/spotifyTypes";
import { getSpotifyTopArtists } from "../../api/spotify/spotify";
import { getErrorText } from "../../utils/utils";
import StatsPageErrorComponent from "./StatsPageErrorComponent";

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

  // console.log("/me/top/artists", data);

  return (
    <div>
      TopArtists
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default TopSongs;

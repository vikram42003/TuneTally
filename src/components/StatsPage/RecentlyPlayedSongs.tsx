import { useQuery } from "@tanstack/react-query";

import { getSpotifyRecentlyPlayedSongs } from "../../api/spotify/spotify";
import StatsPageErrorComponent from "./StatsPageErrorComponent";
import { getErrorText } from "../../utils/utils";

const RecentlyPlayedSongs = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: [`/spotify/me/player/recently-played`],
    queryFn: () => getSpotifyRecentlyPlayedSongs(),
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

  console.log("/me/player/recently-played", data);

  return (
    <div className="">
      RecentlyPlayed
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default RecentlyPlayedSongs;

import { useQuery } from "@tanstack/react-query";

import { getSpotifyRecentlyPlayedSongs } from "../../api/spotify/spotify";
import StatsPageErrorComponent from "./StatsPageErrorComponent";
import { getErrorText } from "../../utils/utils";
import Song from "./Song";

const RecentlyPlayedSongs = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: [`/spotify/me/player/recently-played`],
    queryFn: () => getSpotifyRecentlyPlayedSongs(),
  });

  const exp = sessionStorage.getItem("sessionExpiry");
  if (!exp) {
    return <StatsPageErrorComponent componentName="Recently Played Songs" errorText="You aren't logged in!" />;
  }

  if (isLoading) {
    return <RecentlyPlayedSongsSkeleton />;
  }

  if (error) {
    console.log(error);
    const errorText = getErrorText(error);
    return <StatsPageErrorComponent componentName="Recently Played Songs" errorText={errorText} />;
  }

  if (!data) {
    return <StatsPageErrorComponent componentName="Recently Played Songs" errorText="No user data available" />;
  }

  return (
    <div className="overflow-auto py-6 lg:py-8">
      {/* We offset the content 16px with pr-4 to account for the scrollbar */}
      <h4 className="text-spotify-green text-center text-2xl font-bold md:pr-4 md:text-3xl">Recently Played Songs</h4>

      <div>
        <div className="flex gap-1 text-base lg:gap-2 lg:pt-4 lg:text-xl">
          <div className="flex-1/24">#</div>
          <div className="flex-13/24">Title</div>
          <div className="flex-8/24">Album</div>
          <div className="flex-2/24">⏱</div>
        </div>

        <div className="scrollbar scrollbar-thumb-gray-400 scrollbar-track-spotify-dark h-[60vh] overflow-y-scroll lg:h-[100vh]">
          {data.items.map((i, idx) => (
            // Same song may be present mutiple times in the list but song.id + time would be unique
            <Song key={i.id + i.played_at} song={i} idx={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

const RecentlyPlayedSongsSkeleton = () => {
  return (
    <div className="space-y-4 overflow-auto py-6 lg:py-8">
      <h4 className="text-spotify-green text-center text-2xl font-bold md:pr-4 md:text-3xl">Recently Played Songs</h4>

      <div className="animate-pulse">
        <div className="scrollbar scrollbar-thumb-gray-400 scrollbar-track-spotify-dark h-[60vh] space-y-3 space-x-1 overflow-auto overflow-y-scroll pt-2 lg:h-[100vh] lg:space-y-4 lg:space-x-2 lg:pt-4">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="h-10 rounded bg-gray-700 lg:h-12"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyPlayedSongs;

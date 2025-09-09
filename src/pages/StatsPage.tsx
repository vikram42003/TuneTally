import RecentlyPlayedSongs from "../components/StatsPage/RecentlyPlayedSongs";
import TopArtists from "../components/StatsPage/TopArtists";
import TopSongs from "../components/StatsPage/TopSongs";
import UserDetails from "../components/StatsPage/UserDetails";

const StatsPage = () => {
  return (
    <div>
      <section className="bg-spotify-gray lg:py-8 py-4">
        <div className="layout-container">
          <UserDetails />
        </div>
      </section>

      <section className="bg-spotify-dark lg:py-8 md:px-0 px-8">
        <div className="layout-container flex flex-col md:gap-8 md:flex-row lg:gap-16">
          <div className="shrink grow basis-1/2 order-2 md:order-1">
            <TopArtists />
          </div>
          <div className="shrink grow basis-1/2 order-1 md:order-2">
            <TopSongs />
            <RecentlyPlayedSongs />
          </div>
        </div>
      </section>
    </div>
  );
};

export default StatsPage;

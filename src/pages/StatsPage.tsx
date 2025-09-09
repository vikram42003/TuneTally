import RecentlyPlayedSongs from "../components/StatsPage/RecentlyPlayedSongs";
import TopArtists from "../components/StatsPage/TopArtists";
import TopSongs from "../components/StatsPage/TopSongs";
import UserDetails from "../components/StatsPage/UserDetails";

const StatsPage = () => {
  return (
    <>
      <section className="bg-spotify-gray px-8 py-6 md:px-0 lg:py-8">
        <div className="layout-container">
          <UserDetails />
        </div>
      </section>

      <section className="bg-spotify-dark flex-grow px-8 md:px-0 lg:py-8">
        <div className="layout-container flex flex-col md:flex-row md:gap-8 lg:gap-16">
          <div className="order-2 shrink grow basis-1/2 md:order-1">
            <TopArtists />
          </div>
          <div className="order-1 shrink grow basis-1/2 md:order-2">
            <TopSongs />
            <RecentlyPlayedSongs />
          </div>
        </div>
      </section>
    </>
  );
};

export default StatsPage;

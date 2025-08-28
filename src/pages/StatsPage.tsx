import RecentlyPlayedSongs from "../components/StatsPage/RecentlyPlayedSongs"
import TopArtists from "../components/StatsPage/TopArtists"
import TopSongs from "../components/StatsPage/TopSongs"
import UserDetails from "../components/StatsPage/UserDetails"

const StatsPage = () => {
  return (
    <div>
      <section className="bg-spotify-gray">
        <div className="layout-container">
          <UserDetails />
        </div>

        <RecentlyPlayedSongs />

        <div className="layout-container flex items-center">
          <div className="grow shrink basis-1/2">
            <TopArtists />
          </div>
          <div className="grow shrink basis-1/2">
            <TopSongs />
          </div>
        </div>
      </section>
    </div>
  )
}

export default StatsPage
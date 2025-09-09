import RecentlyPlayedSongs from "../components/StatsPage/RecentlyPlayedSongs"
import TopArtists from "../components/StatsPage/TopArtists"
import TopSongs from "../components/StatsPage/TopSongs"
import UserDetails from "../components/StatsPage/UserDetails"

const StatsPage = () => {
  return (
    <div>
      <section className="bg-spotify-gray py-8">
        <div className="layout-container">
          <UserDetails />
        </div>
      </section>

      <section className="bg-spotify-dark py-8">
        <div className="layout-container flex lg:gap-16 md:gap-8">
          <div className="grow shrink basis-1/2">
            <TopArtists />
          </div>
          <div className="grow shrink basis-1/2">
            <TopSongs />
            <RecentlyPlayedSongs />
          </div>
        </div>
      </section>
    </div>
  )
}

export default StatsPage
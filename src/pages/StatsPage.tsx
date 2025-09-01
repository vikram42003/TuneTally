import RecentlyPlayedSongs from "../components/StatsPage/RecentlyPlayedSongs"
import TopArtists from "../components/StatsPage/TopArtists"
import TopGenres from "../components/StatsPage/TopGenres"
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
        {/* <RecentlyPlayedSongs /> */}

        <div className="layout-container flex gap-16">
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
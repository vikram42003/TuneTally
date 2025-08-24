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

        <div className="layout-container flex items-center">
          <TopArtists />
          <TopSongs />
        </div>
      </section>
    </div>
  )
}

export default StatsPage
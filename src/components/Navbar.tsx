import { Link } from "react-router";
import SpotifyButton from "./SpotifyButton";
import { logoutSpotify } from "../api/auth/spotifyAuth/spotifyAuth";

const Navbar = () => {
  return (
    <section className="bg-spotify-dark py-4 text-lg">
      <nav className="layout-container flex items-center justify-between">
        <div>
          <Link to="/" className="hover:text-spotify-green navbar-text-shadow transition-all duration-500">
            TuneTally
          </Link>
        </div>

        <div className="flex gap-12 font-semibold items-center">
          <div>
            <Link
              to="/stats"
              className="hover:text-spotify-green navbar-text-shadow transition-all duration-500 hover:underline"
            >
              Stats
            </Link>
          </div>

          <div>
            <Link
              to="/privacy"
              className="hover:text-spotify-green navbar-text-shadow transition-all duration-500 hover:underline"
            >
              Privacy
            </Link>
          </div>

          <div>
            <Link
              to="/about"
              className="hover:text-spotify-green navbar-text-shadow transition-all duration-500 hover:underline"
            >
              About
            </Link>
          </div>

          <div>
            <SpotifyButton handler={logoutSpotify} text="Logout" className="px-5! py-1!"/>
          </div>
        </div>
      </nav>
    </section>
  );
};

export default Navbar;

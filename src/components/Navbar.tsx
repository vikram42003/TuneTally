import { Link } from "react-router";
import { HashLink } from "react-router-hash-link";
import SpotifyButton from "./SpotifyButton";
import { logoutSpotify } from "../api/auth/spotifyAuth/spotifyAuth";

const Navbar = () => {
  const exp = sessionStorage.getItem("sessionExpiry");
  const areWeLoggedInWithAValidSession = !exp ? false : +exp < Date.now();

  return (
    <section className="bg-spotify-dark py-4 text-xs md:text-lg">
      <nav className="layout-container flex items-center justify-between">
        <div>
          <Link
            to="/"
            className="logo-font navbar-text-shadow flex items-center text-lg transition-all duration-500 md:text-3xl"
          >
            {/* svg credits - https://www.svgrepo.com/svg/486541/barchart */}
            <img
              src="/images/logo_barchart.svg"
              className="w-8 -translate-y-1 md:w-10"
              alt="app logo thats a green barchart"
            />
            <span className="text-spotify-green">Tune</span>
            Tally
          </Link>
        </div>

        <div className="flex items-center gap-2 font-semibold md:gap-12">
          <div>
            <HashLink
              smooth
              to="/#features"
              className="hover:text-spotify-green navbar-text-shadow transition-all duration-500 hover:underline"
            >
              Features
            </HashLink>
          </div>

          <div>
            <Link
              to="/stats"
              className={`${areWeLoggedInWithAValidSession ? "text-spotify-green" : "hover:text-spotify-green"} navbar-text-shadow transition-all duration-500 hover:underline`}
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

          {areWeLoggedInWithAValidSession && (
            <div>
              <SpotifyButton handler={logoutSpotify} text="Logout" className="px-2! py-1! md:px-5!" />
            </div>
          )}
        </div>
      </nav>
    </section>
  );
};

export default Navbar;

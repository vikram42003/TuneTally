import { Link } from "react-router";

import { loginWithSpotify } from "../api/auth/spotifyAuth/spotifyAuth";

const Navbar = () => {
  return (
    <section className="bg-spotify-dark py-4 text-lg">
      <nav className="layout-container flex justify-between items-center">
        <div>
          <Link to="/" className="hover:text-spotify-green transition-all duration-500 navbar-text-shadow">TuneTally</Link>
        </div>

        <div className="flex gap-16">
          <div>
            <Link to="/stats" className="hover:text-spotify-green transition-all duration-500 navbar-text-shadow">Stats</Link>
          </div>
          <div>
            <Link to="/privacy" className="hover:text-spotify-green transition-all duration-500 navbar-text-shadow">Privacy</Link>
          </div>
          <div>
            <Link to="/about" className="hover:text-spotify-green transition-all duration-500 navbar-text-shadow">About</Link>
          </div>
        </div>

        <button
          type="button"
          onClick={loginWithSpotify}
          // shadow-[0_0_20px_rgba(29,185,84,0.6)] does the green glow effect
          className="bg-spotify-green cursor-pointer rounded-4xl text-sm px-4 py-2 font-bold text-black shadow-[0_0_20px_rgba(29,185,84,0.6)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(29,185,84,0.9)]"
        >
          Login with Spotify
        </button>
      </nav>
    </section>
  );
};

export default Navbar;

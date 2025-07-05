import { Link } from "react-router";

const Navbar = () => {
  return (
    <section className="bg-spotify-dark px-6 py-4">
      <nav className="layout-container flex justify-between">
        <div>
          <Link to="/" className="hover:text-spotify-green transition-all duration-500 navbar-text-shadow">TuneTally</Link>
        </div>
        <div>
          <Link to="#features" className="hover:text-spotify-green transition-all duration-500 navbar-text-shadow">Features</Link>
        </div>
        <div>
          <Link to="/privacy" className="hover:text-spotify-green transition-all duration-500 navbar-text-shadow">Privacy</Link>
        </div>
        <div>
          <Link to="/about" className="hover:text-spotify-green transition-all duration-500 navbar-text-shadow">About</Link>
        </div>
      </nav>
    </section>
  );
};

export default Navbar;

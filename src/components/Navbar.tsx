import { Link } from "react-router";

const Navbar = () => {
  return (
    <section className="bg-spotify-dark py-4 px-6">
      <nav className="layout-container flex justify-between">
        <div>
          <Link to="/">TuneTally</Link>
        </div>
        <div>
          <Link to="#features">Features</Link>
        </div>
        <div>
          <Link to="/privacy">Privacy</Link>
        </div>
        <div>
          <Link to="/about">About</Link>
        </div>
      </nav>
    </section>
  );
};

export default Navbar;

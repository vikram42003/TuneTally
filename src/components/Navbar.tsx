import { Link } from "react-router";

const Navbar = () => {
  return (
    <section className="bg-gray-100 py-4">
      <nav className="max-w-7xl mx-auto flex justify-between">
        <div>
          <Link to="/">Logo</Link>
        </div>
        <div>
          <Link to="/features">Features</Link>
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

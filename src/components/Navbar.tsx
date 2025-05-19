import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="flex justify-evenly">
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
  );
};

export default Navbar;

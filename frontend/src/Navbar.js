import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Praneeth's E-Commerce</h1>
      <div className="links">
        <Link to="/Login">Login</Link>
        <Link to="/Register">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;

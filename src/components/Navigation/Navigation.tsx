import React from "react";
import { Link, useNavigate }  from "react-router-dom";
import './Navigation.css'

const Navbar: React.FC = () => {

  // Logout
   const navigate = useNavigate();
   const handleLogout = () => {

      // remove user from local storage
      localStorage.removeItem("user_data");
      navigate("/login");
   }

  return (
    <nav className="navbar navbar-expand-lg custom-navbar fixed-top">
      <div className="container-fluid">

        <Link className="navbar-brand" id="syncopate-regular" to="/">FLICKS</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link active" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/explore">Explore</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profile">Profile</Link>
            </li>
            <li className="nav-item">
              <button className="btn btn-primary ms-2" onClick={handleLogout}>Log Out</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

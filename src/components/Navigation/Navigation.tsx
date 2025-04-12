import React from "react";
import { Link }  from "react-router-dom";
import './Navigation.css'

const Navbar: React.FC = () => {

  const handleLogout = () => {
    localStorage.clear();
    console.log("User logged out");
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar fixed-top">
      <div className="container-fluid">

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto" id="buttonContainer">
            <li className="nav-item">
              <Link className="nav-link active" id="linkButton" to="/"><i id="con" className="material-icons">holiday_village</i>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" id="linkButton" to="/explore"><i id="con" className="material-icons">explore</i>Explore</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" id="linkButton" to="/profile"><i id="con" className="material-icons">people_alt</i>Profile</Link>
            </li>
            <li className="nav-item">
              <button className="nav-link" id="linkButton" onClick={handleLogout}><i id="con" className="material-icons">exit_to_app</i>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

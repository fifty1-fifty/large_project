import React from "react";
import { Link, useNavigate } from "react-router-dom"; 
import './Navigation.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate(); 

  // Get user data from localStorage
  const storedUser = localStorage.getItem("user_data");
  const currentUser = storedUser ? JSON.parse(storedUser) : null; 

  const handleLogout = () => {
    localStorage.clear(); 
    console.log("User logged out");

    
    navigate("/login");
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
            {/* Profile link updated dynamically */}
            <li className="nav-item">
              {currentUser ? (
                <Link className="nav-link" id="linkButton" to={`/profile/${currentUser._id}`}><i id="con" className="material-icons">people_alt</i>Profile</Link>
              ) : (
                <Link className="nav-link" id="linkButton" to="/login"><i id="con" className="material-icons">people_alt</i>Login</Link>
              )}
            </li>
            <li className="nav-item">
              <Link className="nav-link" id="linkButton" to="/login" onClick={handleLogout}><i id="con" className="material-icons">exit_to_app</i>Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

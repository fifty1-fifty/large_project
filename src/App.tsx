// This file is dedicated to setting up the routing between pages
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegisterComplete from './pages/RegisterComplete';
import MoviePage from './pages/MoviePage';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';
import Layout from "./components/Layout"; 
import EditProfilePage from "./pages/EditProfilePage"; 
/*  test  */
import { Buffer } from 'buffer';
if(!window.Buffer) {
  window.Buffer = Buffer;
}

function App() {
  return (
    <Router>
      <Routes>

        {/* require layout */}
        <Route path="/explore" element={<Layout><ExplorePage /></Layout>} />
        <Route path="/registerComplete" element={<Layout><RegisterComplete /></Layout>} />
        <Route path="/movie" element={<Layout><MoviePage /></Layout>} />
        <Route path="/home" element={<Layout><HomePage /></Layout>} />
        <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
        <Route path="/edit" element={<Layout><EditProfilePage /></Layout>} />

        {/* don't require layout */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />}/>

        {/* redirects */}
        <Route path="/" element={<Navigate to="/home" />} /> 
        <Route path="*" element={<Navigate to="/login" />} /> 

      </Routes>
    </Router>
  );
}

export default App;

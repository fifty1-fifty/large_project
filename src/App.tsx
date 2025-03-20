// This file is dedicated to setting up the routing between pages

import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ExplorePage from './pages/ExplorePage';
import RegisterComplete from './pages/RegisterComplete';
import MoviePage from './pages/MoviePage';

/*  test  */
import { Buffer } from 'buffer';
window.Buffer = Buffer;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/registerComplete" element={<RegisterComplete />} />
        <Route path="/movie" element={<MoviePage />} />
        
        <Route path="/" element={<Navigate to="/login" />} /> 
        <Route path="*" element={<Navigate to="/login" />} /> 
      </Routes>
    </Router>
  );
}

export default App;

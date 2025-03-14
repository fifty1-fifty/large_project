// This file is dedicated to setting up the routing between pages

import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';
import FriendPage from './pages/FriendPage';
import RegisterPage from './pages/RegisterPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/cards" element={<CardPage />} />
        <Route path="/friends" element={<FriendPage />} />
        <Route path="/" element={<Navigate to="/login" />} /> 
        <Route path="*" element={<Navigate to="/login" />} /> 
      </Routes>
    </Router>
  );
}

export default App;

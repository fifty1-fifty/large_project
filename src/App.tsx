import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';
import FriendPage from './pages/FriendPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cards" element={<CardPage />} />
        <Route path="/friends" element={<FriendPage />} />
        <Route path="/" element={<Navigate to="/login" />} /> 
        <Route path="*" element={<Navigate to="/login" />} /> 
      </Routes>
    </Router>
  );
}

export default App;

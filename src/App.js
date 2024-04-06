// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from './services/firebase';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import MainPage from './components/MainPage';
import ProfilePage from './components/ProfilePage';
import LeaderboardPage from './components/LeaderboardPage';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div>
        <Header user={currentUser} />
        <Container>
          <Routes>
            <Route path="/" element={<MainPage currentUser={currentUser} />} />
            <Route path="/profile" element={<ProfilePage currentUser={currentUser} />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;

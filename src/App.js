import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import supabase from './services/supabase'; // Import Supabase client
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import MainPage from './components/MainPage';
import ProfilePage from './components/ProfilePage';
import LeaderboardPage from './components/LeaderboardPage';
import UserDataPage from './components/UserDataPage';
import ScoresPage from "./components/ScoresPage";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserMetadata, setCurrentUserMetadata] = useState(null);

  useEffect(() => {
    const session = supabase.auth.getSession();
    console.log('Session:', session);

    const unsubscribe = supabase.auth.onAuthStateChange((event, session) => {
      setCurrentUser(session?.user || null);
      setCurrentUserMetadata(session?.user?.user_metadata || null);
    });

    // Ensure that unsubscribe is a function before returning
    if (typeof unsubscribe === 'function') {
      return () => unsubscribe();
    }
  }, []);

  return (
      <Router>
        <div>
          <Header user={currentUser} />
          <Container>
            <Routes>
              <Route path="/" element={<MainPage currentUser={currentUser} currentUserMetadata={currentUserMetadata} />} />
              <Route path="/profile" element={<ProfilePage currentUser={currentUser} currentUserMetadata={currentUserMetadata} />} />
              <Route path="/scores" element={<ScoresPage currentUser={currentUser} currentUserMetadata={currentUserMetadata} />} />
              <Route path="/userdata" element={<UserDataPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
            </Routes>
          </Container>
        </div>
      </Router>
  );
}

export default App;

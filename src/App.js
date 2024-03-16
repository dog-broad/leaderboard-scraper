// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from './services/firebase';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import ProfileForm from './components/ProfileForm';

function App() {
  const [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={currentUser ? <Dashboard /> : <LoginPage />} />
        <Route path="/profile" element={currentUser ? <ProfileForm /> : <LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;

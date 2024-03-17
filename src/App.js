import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate
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
        <Route
          path="/"
          element={currentUser ? <Dashboard /> : <Navigate to="/login" />} // Use Navigate to redirect to /login
        />
        <Route
          path="/dashboard"
          element={currentUser ? <Dashboard /> : <Navigate to="/login" />} // Use Navigate to redirect to /login
        />
        <Route
          path="/profile"
          element={currentUser ? <ProfileForm /> : <Navigate to="/login" />} // Use Navigate to redirect to /login
        />
        <Route path="/login" 
        element={currentUser ? <Navigate to="/dashboard" />: <LoginPage />} // Define the /login route
        />
      </Routes>
    </Router>
  );
}

export default App;
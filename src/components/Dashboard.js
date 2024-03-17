import React, { useState, useEffect } from 'react';
import { BrowserRouter as Navigate, Link } from 'react-router-dom'; // Import Navigate
import { auth } from '../services/firebase';
import './Dashboard.css';

function Dashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const [userNotLoggedIn, setUserNotLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUserInfo({
          name: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
        });
      }
      else{
        setUserNotLoggedIn(true);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Redirect to Login or handle success accordingly
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (userNotLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Welcome to the Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      {userInfo && (
        <div className="user-info">
          <img src={userInfo.photoURL} alt="User" className="user-avatar" />
          <div>
            <h2>{userInfo.name}</h2>
            <p>{userInfo.email}</p>
          </div>
        </div>
      )}
      <div className="buttons-container">
        <Link to="/profile" className="profile-button">Go to Profile</Link>
        {/* Add more buttons as needed */}
      </div>
      {!userInfo && <p>Loading user information...</p>}
    </div>
  );
}

export default Dashboard;

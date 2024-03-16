import React from 'react';
import { auth } from '../services/firebase';

function Dashboard() {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Redirect to Login or handle success accordingly
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;

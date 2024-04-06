// src/components/LoginPage.js
import React from 'react';
import { Button } from 'react-bootstrap';

const LoginPage = ({ onLogin }) => {
  return (
    <div className="container">
      <h2>Login to Coding Leaderboard</h2>
      <Button onClick={onLogin} variant="primary">Login with Firebase</Button>
    </div>
  );
}

export default LoginPage;

import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut, getAuth } from "firebase/auth";
import { auth, googleProvider } from '../services/firebase';
import 'firebaseui/dist/firebaseui.css'; // Import Firebase UI CSS
import LoadingScreen from './LoadingScreen';
import './LoginPage.css'; // Import custom CSS for styling

const delay = 2000; // milliseconds

function LoginPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        setUser(await getAuth().currentUser);
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    }
    setTimeout(checkLogin, delay);
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  } else if (user) {
    return (
      <div className="login-container">
        <p className="welcome-message">Welcome, {user.displayName}!</p>
        <button onClick={handleSignOut} className="sign-out-button">Sign out</button>
      </div>
    );
  } else {
    return (
      <div className="login-container">
        <div id="firebaseui-auth-container"></div>
        <button onClick={signInWithGoogle} className="sign-in-button">Sign in with Google</button>
      </div>
    );
  }
}

export default LoginPage;

import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut, getAuth } from "firebase/auth";
import { auth, googleProvider } from '../services/firebase';
import 'firebaseui/dist/firebaseui.css'; // Import Firebase UI CSS
import LoadingScreen from './LoadingScreen';
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import './LoginPage.css'; // Import custom CSS for styling

const delay = 10000; // milliseconds

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

    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    });
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

  const particlesOptions = {
    // Other options...
    detectRetina: true,
    motion: {
      reduce: {
        factor: 4,
        value: true
      }
    },
    particles: {
      // Other particle options...
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: true,
        straight: false,
        outModes: {
          default: "out"
        },
        attract: {
          enable: false,
          rotate: {
            x: 600,
            y: 1200
          }
        }
      }
    }
  };

  return (
    <div className="login-container">
      {isLoading && <LoadingScreen />}
      <div id="particles-js" className="particles-js">
        <canvas className="particles-canvas"></canvas>
      </div>
      <div id="firebaseui-auth-container"></div>
      <button onClick={signInWithGoogle} className="sign-in-button">Sign in with Google</button>
      {!isLoading && user && (
        <>
          <p className="welcome-message">Welcome, {user.displayName}!</p>
          <button onClick={handleSignOut} className="sign-out-button">Sign out</button>
        </>
      )}
    </div>
  );
}

export default LoginPage;

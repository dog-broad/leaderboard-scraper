import React, { useState } from 'react';
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from '../services/firebase';

function LoginPage() {

  const signInWithGoogle = async () => {
    try {
    await signInWithPopup(auth,googleProvider);
    } catch (err){
      console.error(err);
    }
  };

  const logOut = async () => {
    try {
    await signOut(auth);
    } catch (err){
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={signInWithGoogle}> Signin with google</button>
    </div>
  );
}

export default LoginPage;

import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import './ProfilePage.css';

function ProfileForm() {
  const [geeksForGeeks, setGeeksForGeeks] = useState({ platform: 'geeksforgeeks', username: '', verified: false });
  const [codeforces, setCodeforces] = useState({ platform: 'codeforces', username: '', verified: false });
  const [leetCode, setLeetCode] = useState({ platform: 'leetcode', username: '', verified: false });
  const [codeChef, setCodeChef] = useState({ platform: 'codechef', username: '', verified: false });
  const [hackerRank, setHackerRank] = useState({ platform: 'hackerrank', username: '', verified: false });
  const [errorMessage, setErrorMessage] = useState('');
  const [saveDisabled, setSaveDisabled] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

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
    };

    fetchUserInfo();
  }, []);

  const handleVerify = async (platform, setUsername, setVerified) => {
    const response = await fetch(`https://leetcode.com/`,{
      // Set CORS Headers
      headers: {  
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      }
    });
    const data = await response.json();
    console.log(data);
    if (!data.errors) {
      setVerified(true);
      setUsername({ ...setUsername, verified: true });
    } else {
      setVerified(false);
      setUsername({ ...setUsername, verified: false });
    }
  };

  const handleSave = async () => {
    // Save to database if all usernames are verified
    // For simplicity, just displaying an alert
    alert('Data saved successfully!');
  };

  const handleUsernameChange = (e, setUsername) => {
    const inputUsername = e.target.value;
    const formattedUsername = inputUsername.replace(/[A-Z]/g, (match) => match.toLowerCase()); // Convert uppercase to lowercase
    if (/^[a-z0-9_]{1,20}$/.test(formattedUsername)) { // Check character limit and format
      setUsername({ username: formattedUsername, verified: false });
      setErrorMessage(''); // Clear previous error message
    } else {
      setErrorMessage('Username should be 1-20 characters long, lowercase, and may only contain letters, numbers, or underscores.'); // Display error message
    }
  };

  return (
    <div className="profile-form-container">
      <div className="profile-form-user-info">
        <img src={userInfo?.photoURL} alt="User" className="profile-form-user-avatar" />
        <div>
          <h2>{userInfo?.name}</h2>
          <p>{userInfo?.email}</p>
        </div>
      </div>
      <div className="profile-form-input-container">
        <input
          type="text"
          value={geeksForGeeks.username}
          onChange={(e) => handleUsernameChange(e, setGeeksForGeeks)}
          placeholder="GeeksforGeeks Username"
          className={errorMessage ? 'profile-form-input invalid' : 'profile-form-input'}
        />
        <button onClick={() => handleVerify('geeksforgeeks', geeksForGeeks, setGeeksForGeeks)} className={geeksForGeeks.verified ? 'profile-form-button verified' : 'profile-form-button'}>Verify</button>
      </div>

      <div className="profile-form-input-container">
        <input
          type="text"
          value={codeforces.username}
          onChange={(e) => handleUsernameChange(e, setCodeforces)}
          placeholder="Codeforces Username"
          className={errorMessage ? 'profile-form-input invalid' : 'profile-form-input'}
        />
        <button onClick={() => handleVerify('codeforces', codeforces, setCodeforces)} className={codeforces.verified ? 'profile-form-button verified' : 'profile-form-button'}>Verify</button>
      </div>

      <div className="profile-form-input-container">
        <input
          type="text"
          value={leetCode.username}
          onChange={(e) => handleUsernameChange(e, setLeetCode)}
          placeholder="LeetCode Username"
          className={errorMessage ? 'profile-form-input invalid' : 'profile-form-input'}
        />
        <button onClick={() => handleVerify('leetcode', leetCode, setLeetCode)} className={leetCode.verified ? 'profile-form-button verified' : 'profile-form-button'}>Verify</button>
      </div>

      <div className="profile-form-input-container">
        <input
          type="text"
          value={codeChef.username}
          onChange={(e) => handleUsernameChange(e, setCodeChef)}
          placeholder="CodeChef Username"
          className={errorMessage ? 'profile-form-input invalid' : 'profile-form-input'}
        />
        <button onClick={() => handleVerify('codechef', codeChef, setCodeChef)} className={codeChef.verified ? 'profile-form-button verified' : 'profile-form-button'}>Verify</button>
      </div>

      <div className="profile-form-input-container">
        <input
          type="text"
          value={hackerRank.username}
          onChange={(e) => handleUsernameChange(e, setHackerRank)}
          placeholder="HackerRank Username"
          className={errorMessage ? 'profile-form-input invalid' : 'profile-form-input'}
        />
        <button onClick={() => handleVerify('hackerrank', hackerRank, setHackerRank)} className={hackerRank.verified ? 'profile-form-button verified' : 'profile-form-button'}>Verify</button>
      </div>     

      {errorMessage && <p className="profile-form-error-message">{errorMessage}</p>}

      <button onClick={handleSave} className="profile-form-button" disabled={saveDisabled}>Save</button>
    </div>
  );
}

export default ProfileForm;

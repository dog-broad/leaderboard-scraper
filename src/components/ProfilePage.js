import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import $ from 'jquery';
import './ProfilePage.css';

// Import Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function ProfileForm() {
  const platforms = [
    { platform: 'geeksforgeeks', state: useState({ platform: 'geeksforgeeks', username: '', verificationStatus: 'unchecked', loading: false }) },
    { platform: 'codeforces', state: useState({ platform: 'codeforces', username: '', verificationStatus: 'unchecked', loading: false }) },
    { platform: 'leetcode', state: useState({ platform: 'leetcode', username: '', verificationStatus: 'unchecked', loading: false }) },
    { platform: 'codechef', state: useState({ platform: 'codechef', username: '', verificationStatus: 'unchecked', loading: false }) },
    { platform: 'hackerrank', state: useState({ platform: 'hackerrank', username: '', verificationStatus: 'unchecked', loading: false }) },
  ];

  const [errorMessage, setErrorMessage] = useState('');
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

  const handleVerify = async (platform, userData, setData) => {
    try {
      console.log(`Verifying ${platform} username...`);
      let url = '';
      if (platform === 'leetcode') {
        url = `https://alfa-leetcode-api.onrender.com/${userData.username}`;
      } else {
        url = `https://codeprofilevalidator.onrender.com/check-url-platform/?platform=${platform}&username=${userData.username}`;
      }

      setData(prevData => ({ ...prevData, loading: true }));
      setErrorMessage('');

      $.ajax({
        url: url,
        dataType: 'json',
        statusCode: {
          200: function (d) {
            if (userData.username === '') {
              console.log("status code 200 returned");
              setData({ platform, username: userData.username, verificationStatus: 'verified_false', loading: false });
              setErrorMessage('Username cannot be empty.');
              return;
            }
            if ('errors' in d) {
              console.log(d.errors);
              console.log("status code 200 returned");
              setData({ platform, username: userData.username, verificationStatus: 'verified_false', loading: false });
            } else {
              console.log(d);
              console.log("status code 200 returned");
              setData({ platform, username: userData.username, verificationStatus: 'verified_true', loading: false });
            }
          },
          400: function (d) {
            console.log(d);
            setData({ platform, username: userData.username, verificationStatus: 'verified_false', loading: false });
            setErrorMessage(d.responseJSON.error);
          },
          404: function (d) {
            console.log(d);
            console.log("status code 404 returned");
            setData({ platform, username: userData.username, verificationStatus: 'verified_false', loading: false });
          }
        },
      })
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    alert('Data saved successfully!');
  };

  const handleUsernameChange = (e, setUsername) => {
    const inputUsername = e.target.value;
    const formattedUsername = inputUsername.replace(/[A-Z]/g, (match) => match.toLowerCase());
    if (inputUsername === '' || /^[a-z0-9_]{1,20}$/.test(formattedUsername)) {
      setUsername({ username: formattedUsername, verified: false });
      setErrorMessage('');
    } else {
      setErrorMessage('Username should be 1-20 characters long, lowercase, and may only contain letters, numbers, or underscores.');
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

      {platforms.map(({ platform, state }) => (
        <div key={platform} className="profile-form-input-container">
          <input
            type="text"
            value={state[0].username}
            onChange={(e) => handleUsernameChange(e, state[1])}
            placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} Username`}
            className={errorMessage ? 'profile-form-input invalid' : 'profile-form-input'}
          />
          <button onClick={() => handleVerify(platform, state[0], state[1])} className={state[0].loading ? 'profile-form-button loading' : state[0].verificationStatus === 'unchecked' ? 'profile-form-button' : state[0].verificationStatus === 'verified_true' ? 'profile-form-button verified' : state[0].verificationStatus === 'verified_false' ? 'profile-form-button invalid' : 'profile-form-button'}>
            {state[0].loading ? <FontAwesomeIcon icon={faSpinner} spin /> : state[0].verificationStatus === 'verified_true' ? 'Exists' : state[0].verificationStatus === 'verified_false' ? 'Invalid' : 'Verify'}
          </button>
        </div>
      ))}

      {errorMessage && <p className="profile-form-error-message">{errorMessage}</p>}
      <button onClick={handleSave} className="profile-form-button">Save</button>
    </div>
  );
}

export default ProfileForm;

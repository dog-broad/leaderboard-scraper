import React, { useState } from 'react';
import { firestore } from '../services/firebase';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProfileForm.css'; // Keep your custom styles if needed

function ProfileForm({ currentUser }) {
  const platforms = [
    { platform: 'geeksforgeeks', state: useState({ platform: 'geeksforgeeks', username: '', verificationStatus: 'unchecked', loading: false }) },
    { platform: 'codeforces', state: useState({ platform: 'codeforces', username: '', verificationStatus: 'unchecked', loading: false }) },
    { platform: 'leetcode', state: useState({ platform: 'leetcode', username: '', verificationStatus: 'unchecked', loading: false }) },
    { platform: 'codechef', state: useState({ platform: 'codechef', username: '', verificationStatus: 'unchecked', loading: false }) },
    { platform: 'hackerrank', state: useState({ platform: 'hackerrank', username: '', verificationStatus: 'unchecked', loading: false }) },
  ];

  const [errorMessage, setErrorMessage] = useState('');

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
          429: function (d) {
            console.log(d);
            console.log("status code 429 returned");
            setData({ platform, username: userData.username, verificationStatus: 'verified_false', loading: false });
            setErrorMessage(d.response);
            alert(d);
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
    try {
      if (!currentUser) {
        alert('User not authenticated. Please sign in.');
        return;
      }
  
      // Construct the data to be saved
      const userDataToSave = {
        userId: currentUser.uid,
        platforms: platforms.map(({ platform, state }) => ({
          platform: platform,
          username: state[0].username,
          verificationStatus: state[0].verificationStatus,
        })),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
  
      // Ensure all usernames are verified
      if (platforms.some(({ state }) => state[0].verificationStatus !== 'verified_true')) {
        alert('Please verify all usernames before saving.');
        return;
      }
  
      // Save data to Firestore
      await setDoc(doc(firestore, 'users', currentUser.uid), userDataToSave);
  
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data to Firestore:', error);
      alert('Error saving data. Please try again later.');
    }
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
    <div className="container">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card profile-form-container">
            <div className="card-body">
              {platforms.map(({ platform, state }) => (
                <div key={platform} className="profile-form-input-container d-flex align-items-center mb-3">
                  <input
                    type="text"
                    value={state[0].username}
                    onChange={(e) => handleUsernameChange(e, state[1])}
                    placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} Username`}
                    className={errorMessage ? 'profile-form-input form-control is-invalid' : 'profile-form-input form-control'}
                  />
                  <button onClick={() => handleVerify(platform, state[0], state[1])} className={state[0].loading ? 'profile-form-button loading btn btn-primary' : state[0].verificationStatus === 'unchecked' ? 'profile-form-button btn btn-primary' : state[0].verificationStatus === 'verified_true' ? 'profile-form-button verified btn btn-success' : state[0].verificationStatus === 'verified_false' ? 'profile-form-button invalid btn btn-danger' : 'profile-form-button btn btn-primary'}>
                    {state[0].loading ? <FontAwesomeIcon icon={faSpinner} spin /> : state[0].verificationStatus === 'verified_true' ? 'Exists' : state[0].verificationStatus === 'verified_false' ? 'Invalid' : 'Verify'}
                  </button>
                </div>
              ))}

              {errorMessage && <p className="profile-form-error-message">{errorMessage}</p>}
              <button onClick={handleSave} className="profile-form-button btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileForm;

import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import $ from 'jquery';
import './ProfilePage.css';

// Import Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function ProfileForm() {
  const [geeksForGeeks, setGeeksForGeeks] = useState({ platform: 'geeksforgeeks', username: '', verificationStatus: 'unchecked', loading: false });
  const [codeforces, setCodeforces] = useState({ platform: 'codeforces', username: '', verificationStatus: 'unchecked', loading: false });
  const [leetCode, setLeetCode] = useState({ platform: 'leetcode', username: '', verificationStatus: 'unchecked', loading: false });
  const [codeChef, setCodeChef] = useState({ platform: 'codechef', username: '', verificationStatus: 'unchecked', loading: false });
  const [hackerRank, setHackerRank] = useState({ platform: 'hackerrank', username: '', verificationStatus: 'unchecked', loading: false });
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
        // url = `https://www.${platform}.com/${userData.username}`
        // url = `https://leetcode.com/graphql?query=query{userContestRanking(username:"${userData.username}"){rating}}`;
        url = `https://alfa-leetcode-api.onrender.com/${userData.username}`;
      } else {
        url = `https://codeprofilevalidator.onrender.com/check-url-platform/?platform=${platform}&username=${userData.username}`;
      }

      // Set loading state to true when verification process starts
      setData(prevData => ({ ...prevData, loading: true }));
      setErrorMessage('');

      $.ajax({
        url: url,
        dataType: 'json',
        statusCode: {
          200: function (d) {
            // check if response json has "errors" key
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
    // Save to database if all usernames are verified
    // For simplicity, just displaying an alert
    alert('Data saved successfully!');
  };

  const handleUsernameChange = (e, setUsername) => {
    const inputUsername = e.target.value;
    const formattedUsername = inputUsername.replace(/[A-Z]/g, (match) => match.toLowerCase()); // Convert uppercase to lowercase
    if (inputUsername === '' || /^[a-z0-9_]{1,20}$/.test(formattedUsername)) { // Check if input is empty or matches the format
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
      {/* GeeksForGeeks */}
      <div className="profile-form-input-container">
        <input
          type="text"
          value={geeksForGeeks.username}
          onChange={(e) => handleUsernameChange(e, setGeeksForGeeks)}
          placeholder="GeeksforGeeks Username"
          className={errorMessage ? 'profile-form-input invalid' : 'profile-form-input'}
        />
        <button onClick={() => handleVerify('geeksforgeeks', geeksForGeeks, setGeeksForGeeks)} className={geeksForGeeks.loading ? 'profile-form-button loading' : geeksForGeeks.verificationStatus === 'unchecked' ? 'profile-form-button' : geeksForGeeks.verificationStatus === 'verified_true' ? 'profile-form-button verified' : geeksForGeeks.verificationStatus === 'verified_false' ? 'profile-form-button invalid' : 'profile-form-button'}>
          {geeksForGeeks.loading ? <FontAwesomeIcon icon={faSpinner} spin /> : geeksForGeeks.verificationStatus === 'verified_true' ? 'Exists' : geeksForGeeks.verificationStatus === 'verified_false' ? 'Invalid' : 'Verify'}
        </button>
      </div>

      {/* Codeforces */}
      <div className="profile-form-input-container">
        <input
          type="text"
          value={codeforces.username}
          onChange={(e) => handleUsernameChange(e, setCodeforces)}
          placeholder="Codeforces Username"
          className={errorMessage ? 'profile-form-input invalid' : 'profile-form-input'}
        />
        <button onClick={() => handleVerify('codeforces', codeforces, setCodeforces)} className={codeforces.loading ? 'profile-form-button loading' : codeforces.verificationStatus === 'unchecked' ? 'profile-form-button' : codeforces.verificationStatus === 'verified_true' ? 'profile-form-button verified' : codeforces.verificationStatus === 'verified_false' ? 'profile-form-button invalid' : 'profile-form-button'}>
          {codeforces.loading ? <FontAwesomeIcon icon={faSpinner} spin /> : codeforces.verificationStatus === 'verified_true' ? 'Exists' : codeforces.verificationStatus === 'verified_false' ? 'Invalid' : 'Verify'}
        </button>
      </div>

      {/* LeetCode */}
      <div className="profile-form-input-container">
        <input
          type="text"
          value={leetCode.username}
          onChange={(e) => handleUsernameChange(e, setLeetCode)}
          placeholder="LeetCode Username"
          className={errorMessage ? 'profile-form-input invalid' : 'profile-form-input'}
        />
        <button onClick={() => handleVerify('leetcode', leetCode, setLeetCode)} className={leetCode.loading ? 'profile-form-button loading' : leetCode.verificationStatus === 'unchecked' ? 'profile-form-button' : leetCode.verificationStatus === 'verified_true' ? 'profile-form-button verified' : leetCode.verificationStatus === 'verified_false' ? 'profile-form-button invalid' : 'profile-form-button'}>
          {leetCode.loading ? <FontAwesomeIcon icon={faSpinner} spin /> : leetCode.verificationStatus === 'verified_true' ? 'Exists' : leetCode.verificationStatus === 'verified_false' ? 'Invalid' : 'Verify'}
        </button>
      </div>

      {/* CodeChef */}
      <div className="profile-form-input-container">
        <input
          type="text"
          value={codeChef.username}
          onChange={(e) => handleUsernameChange(e, setCodeChef)}
          placeholder="CodeChef Username"
          className={errorMessage ? 'profile-form-input invalid' : 'profile-form-input'}
        />
        <button onClick={() => handleVerify('codechef', codeChef, setCodeChef)} className={codeChef.loading ? 'profile-form-button loading' : codeChef.verificationStatus === 'unchecked' ? 'profile-form-button' : codeChef.verificationStatus === 'verified_true' ? 'profile-form-button verified' : codeChef.verificationStatus === 'verified_false' ? 'profile-form-button invalid' : 'profile-form-button'}>
          {codeChef.loading ? <FontAwesomeIcon icon={faSpinner} spin /> : codeChef.verificationStatus === 'verified_true' ? 'Exists' : codeChef.verificationStatus === 'verified_false' ? 'Invalid' : 'Verify'}
        </button>
      </div>

      {/* HackerRank */}
      <div className="profile-form-input-container">
        <input
          type="text"
          value={hackerRank.username}
          onChange={(e) => handleUsernameChange(e, setHackerRank)}
          placeholder="HackerRank Username"
          className={errorMessage ? 'profile-form-input invalid' : 'profile-form-input'}
        />
        <button onClick={() => handleVerify('hackerrank', hackerRank, setHackerRank)} className={hackerRank.loading ? 'profile-form-button loading' : hackerRank.verificationStatus === 'unchecked' ? 'profile-form-button' : hackerRank.verificationStatus === 'verified_true' ? 'profile-form-button verified' : hackerRank.verificationStatus === 'verified_false' ? 'profile-form-button invalid' : 'profile-form-button'}>
          {hackerRank.loading ? <FontAwesomeIcon icon={faSpinner} spin /> : hackerRank.verificationStatus === 'verified_true' ? 'Exists' : hackerRank.verificationStatus === 'verified_false' ? 'Invalid' : 'Verify'}
        </button>
      </div>

      {errorMessage && <p className="profile-form-error-message">{errorMessage}</p>}
      <button onClick={handleSave} className="profile-form-button">Save</button>
    </div>
  );
}

export default ProfileForm;

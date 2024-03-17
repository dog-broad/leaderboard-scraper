import React, { useState } from 'react';
import './ProfileForm.css';

function ProfileForm() {
  const [geeksForGeeks, setGeeksForGeeks] = useState({ platform: 'geeksforgeeks', username: '', verified: false });
  const [codeforces, setCodeforces] = useState({ platform: 'codeforces', username: '', verified: false });
  const [leetCode, setLeetCode] = useState({ platform: 'leetcode', username: '', verified: false });
  const [codeChef, setCodeChef] = useState({ platform: 'codechef', username: '', verified: false });
  const [hackerRank, setHackerRank] = useState({ platform: 'hackerrank', username: '', verified: false });
  const [errorMessage, setErrorMessage] = useState('');
  const [saveDisabled, setSaveDisabled] = useState(true);

  const handleVerify = (platform, setUsername) => {
    // Perform verification logic here
    // For simplicity, assuming verification is successful
    setUsername({ ...setUsername, verified: true });
  };

  const handleSave = async () => {
    // Save to database if all usernames are verified
    // For simplicity, just displaying an alert
    alert('Data saved successfully!');
  };

  const handleInputChange = (e, setPlatform, setUsername) => {
    setPlatform(e.target.value);
    setUsername('');
  };

  const handleUsernameChange = (e, setUsername) => {
    const inputUsername = e.target.value;
    setUsername(inputUsername);
    // Validation logic can be added here
  };

  return (
    <div className="profile-form-container">
      <div className="profile-form-input-container">
        <input
          type="text"
          value={geeksForGeeks.username}
          onChange={(e) => handleUsernameChange(e, setGeeksForGeeks)}
          placeholder="GeeksforGeeks Username"
          className={errorMessage ? 'profile-form-input invalid' : 'profile-form-input'}
        />
        <button onClick={() => handleVerify('geeksforgeeks', setGeeksForGeeks)} className="profile-form-button">Verify</button>
      </div>

      <div className="profile-form-input-container">
        <input
          type="text"
          value={codeforces.username}
          onChange={(e) => handleUsernameChange(e, setCodeforces)}
          placeholder="Codeforces Username"
          className={errorMessage ? 'profile-form-input invalid' : 'profile-form-input'}
        />
        <button onClick={() => handleVerify('codeforces', setCodeforces)} className="profile-form-button">Verify</button>
      </div>

      <div className="profile-form-input-container">
        <input
          type="text"
          value={leetCode.username}
          onChange={(e) => handleUsernameChange(e, setLeetCode)}
          placeholder="LeetCode Username"
          className={errorMessage ? 'profile-form-input invalid' : 'profile-form-input'}
        />
        <button onClick={() => handleVerify('leetcode', setLeetCode)} className="profile-form-button">Verify</button>
      </div>

      <div className="profile-form-input-container">
        <input
          type="text"
          value={codeChef.username}
          onChange={(e) => handleUsernameChange(e, setCodeChef)}
          placeholder="CodeChef Username"
          className={errorMessage ? 'profile-form-input invalid' : 'profile-form-input'}
        />
        <button onClick={() => handleVerify('codechef', setCodeChef)} className="profile-form-button">Verify</button>
      </div>

      <div className="profile-form-input-container">
        <input
          type="text"
          value={hackerRank.username}
          onChange={(e) => handleUsernameChange(e, setHackerRank)}
          placeholder="HackerRank Username"
          className={errorMessage ? 'profile-form-input invalid' : 'profile-form-input'}
        />
        <button onClick={() => handleVerify('hackerrank', setHackerRank)} className="profile-form-button">Verify</button>
      </div>     
      
      {errorMessage && <p className="profile-form-error-message">{errorMessage}</p>}

      <button onClick={handleSave} className="profile-form-button" disabled={saveDisabled}>Save</button>
    </div>
  );
}

export default ProfileForm;

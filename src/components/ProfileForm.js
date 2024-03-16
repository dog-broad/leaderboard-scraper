import React, { useState } from 'react';
import { database } from '../services/firebase';

function ProfileForm() {
  const [platform, setPlatform] = useState('');
  const [username, setUsername] = useState('');

  const handleVerify = async () => {
    // Perform verification logic here
  };

  const handleSave = async () => {
    // Save to database if verification succeeds
  };

  return (
    <div>
      <input type="text" value={platform} onChange={(e) => setPlatform(e.target.value)} placeholder="Platform" />
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <button onClick={handleVerify}>Verify</button>
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default ProfileForm;

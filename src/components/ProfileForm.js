// Inside the ProfileForm component

import React, { useState, useEffect } from 'react';
import { firestore } from '../services/firebase';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProfileForm.css'; // Keep your custom styles if needed

// Import platform icons
import codechefIcon from '../assets/codechef.png';
import codeforcesIcon from '../assets/codeforces.png';
import gfgIcon from '../assets/gfg.png';
import hackerrankIcon from '../assets/hackerrank.png';
import leetcodeIcon from '../assets/leetcode.png';

function ProfileForm({ currentUser }) {
  const platforms = [
    { platform: 'geeksforgeeks', state: useState({ platform: 'geeksforgeeks', username: '', verificationStatus: 'unchecked', loading: false }) },
    { platform: 'codeforces', state: useState({ platform: 'codeforces', username: '', verificationStatus: 'unchecked', loading: false }) },
    { platform: 'leetcode', state: useState({ platform: 'leetcode', username: '', verificationStatus: 'unchecked', loading: false }) },
    { platform: 'codechef', state: useState({ platform: 'codechef', username: '', verificationStatus: 'unchecked', loading: false }) },
    { platform: 'hackerrank', state: useState({ platform: 'hackerrank', username: '', verificationStatus: 'unchecked', loading: false }) },
  ];

  const [yearOfPassing, setYearOfPassing] = useState('');
  const [hallTicketNo, setHallTicketNo] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUpdatable, setIsUpdatable] = useState(true); // State to manage updatable status

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!currentUser) return;
  
        const docRef = doc(firestore, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setYearOfPassing(userData.yearOfPassing || '');
          setHallTicketNo(userData.hallTicketNo || '');
          platforms.forEach(({ platform, state }) => {
            const userPlatformData = userData.platforms.find(item => item.platform === platform);
            if (userPlatformData) {
              state[1]({ ...state[0], username: userPlatformData.username });
            }
          });
          // Check if the updatedAt date is same as today
          const updatedAt = userData.updatedAt ? userData.updatedAt.toDate() : null;
          const today = new Date();
          setIsUpdatable(!updatedAt || updatedAt.getDate() !== today.getDate() || updatedAt.getMonth() !== today.getMonth() || updatedAt.getFullYear() !== today.getFullYear());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchData();
  }); // Empty dependency array ensures this effect runs only once after the initial render  

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
            setErrorMessage(d.responseText);
            alert(d.responseText);
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

      // Validation for year of passing
      const selectedYear = parseInt(yearOfPassing);
      if (isNaN(selectedYear) || selectedYear < 2025) {
        setErrorMessage('Please select a valid year of passing.');
        return;
      }

      // Construct the data to be saved
      const userDataToSave = {
        userId: currentUser.uid,
        name: currentUser.displayName,
        email: currentUser.email,
        photoURL: currentUser.photoURL,
        yearOfPassing: selectedYear,
        hallTicketNo: hallTicketNo,
        updatedAt: Timestamp.now(),
        platforms: platforms.map(({ platform, state }) => ({
          platform: platform,
          username: state[0].username,
          verificationStatus: state[0].verificationStatus,
        })),
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

  // Generate options for year of passing dropdown
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear + i);

  // Map platform names to their corresponding icons
  const platformIcons = {
    codechef: codechefIcon,
    codeforces: codeforcesIcon,
    geeksforgeeks: gfgIcon,
    hackerrank: hackerrankIcon,
    leetcode: leetcodeIcon
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="card profile-form-container" style={{ filter: isUpdatable ? 'none' : 'blur(4px)', pointerEvents: isUpdatable ? 'auto' : 'none' }}>
            <div className="card-body">
              {/* Year of Passing */}
              <Form.Group controlId="yearOfPassing" className="mb-3">
                <Form.Label className="h5">Year of Passing</Form.Label>
                <Form.Control
                  as="select"
                  value={yearOfPassing}
                  onChange={(e) => setYearOfPassing(e.target.value)}
                  disabled={!isUpdatable} // Disable the field if not updatable
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              
              {/* Hall Ticket No. */}
              <Form.Group controlId="hallTicketNo" className="mb-3">
                <Form.Label className="h5">Hall Ticket No.</Form.Label>
                <Form.Control
                  type="text"
                  value={hallTicketNo}
                  onChange={(e) => setHallTicketNo(e.target.value)}
                  placeholder="Enter Hall Ticket No."
                  disabled={!isUpdatable} // Disable the field if not updatable
                />
              </Form.Group>
  
              {/* Platforms */}
              <Form.Group controlId="platforms">
                <Form.Label className="h5">Platforms</Form.Label>
                {platforms.map(({ platform, state }) => (
                  <div key={platform} className="d-flex align-items-center mb-3">
                    <img src={platformIcons[platform]} alt={platform} className="mr-2" style={{ width: '30px', height: '30px', marginRight: '10px' }} />
                    <Form.Control
                      type="text"
                      value={state[0].username}
                      onChange={(e) => handleUsernameChange(e, state[1])}
                      placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} Username`}
                      className={errorMessage ? 'form-control is-invalid' : 'form-control'}
                      disabled={!isUpdatable} // Disable the field if not updatable
                    />
                    <Button
                      onClick={() => handleVerify(platform, state[0], state[1])}
                      className={state[0].loading ? 'profile-form-button loading btn btn-primary' : state[0].verificationStatus === 'unchecked' ? 'profile-form-button btn btn-primary' : state[0].verificationStatus === 'verified_true' ? 'profile-form-button verified btn btn-success' : state[0].verificationStatus === 'verified_false' ? 'profile-form-button invalid btn btn-danger' : 'profile-form-button btn btn-primary'}
                      disabled={!isUpdatable} // Disable the button if not updatable
                    >
                      {state[0].loading ? <FontAwesomeIcon icon={faSpinner} spin /> : state[0].verificationStatus === 'verified_true' ? 'Exists' : state[0].verificationStatus === 'verified_false' ? 'Invalid' : 'Verify'}
                    </Button>
                  </div>
                ))}
              </Form.Group>
  
              {/* Error message and save button */}
              <div>
                {errorMessage && <p className="profile-form-error-message">{errorMessage}</p>}
                {!isUpdatable && <p className="profile-form-info">Note: Year of Passing and Hall Ticket No. can be modified only once per day.</p>}
                <Button onClick={handleSave} className="profile-form-button btn btn-primary" disabled={!isUpdatable}>Save</Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfileForm;

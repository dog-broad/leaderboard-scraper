import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { firestore } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';

// Import platform icons
import codechefIcon from '../assets/codechef.png';
import codeforcesIcon from '../assets/codeforces.png';
import gfgIcon from '../assets/gfg.png';
import hackerrankIcon from '../assets/hackerrank.png';
import leetcodeIcon from '../assets/leetcode.png';

const MainPage = ({ currentUser }) => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if a user is logged in
        if (!currentUser) {
          setLoading(false);
          return;
        }

        const querySnapshot = await getDocs(collection(firestore, 'users'));
        const usersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // find the user data for the current user
        const currentUserData = usersData.find(user => user.userId === currentUser.uid);
        // update the state with the current user's data
        setUserData(currentUserData ? [currentUserData] : []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Function to render platform status
  const renderPlatformStatus = (verificationStatus) => {
    switch (verificationStatus) {
      case 'verified_true':
        return <FontAwesomeIcon icon={faCheckCircle} className="text-success" />;
      case 'verified_false':
        return <FontAwesomeIcon icon={faExclamationCircle} className="text-danger" />;
      case 'loading':
        return <FontAwesomeIcon icon={faSpinner} className="text-primary" spin />;
      default:
        return <span className="text-danger">Null Data</span>;
    }
  };

  // Map platform names to their corresponding icons
  const platformIcons = {
    codechef: codechefIcon,
    codeforces: codeforcesIcon,
    geeksforgeeks: gfgIcon,
    hackerrank: hackerrankIcon,
    leetcode: leetcodeIcon
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Welcome to Coding Leaderboard!</h1>
      <Row className="justify-content-center">
        <Col md={6}>
          {currentUser ? (
            <Card className="rounded shadow">
              <Card.Body>
                <Card.Title className="text-center">Welcome, {currentUser.displayName}!</Card.Title>
                <Card.Text className="text-center">Email: {currentUser.email}</Card.Text>
                <div className="d-flex justify-content-center">
                  <img src={currentUser.photoURL} alt="User" className="rounded-circle" style={{ width: '150px', height: '150px' }} />
                </div>
              </Card.Body>
            </Card>
          ) : (
            <p className="text-center">Please log in to view your profile status.</p>
          )}
        </Col>
      </Row>
      {/* Conditionally render Profile Status card */}
      {currentUser && (
        <Row className="mt-4 justify-content-center">
          <Col md={8}>
            <Card className="mb-4 rounded shadow">
              <Card.Body>
                <h3 className="mb-3 text-center">Profile Status</h3>
                {loading ? (
                  <p className="text-center">Loading...</p>
                ) : userData.length === 0 ? (
                  <p className="text-center">No user data found. Please move to Profile Page to update your profile.</p>
                ) : (
                  userData.map((user, index) => (
                    <div key={index} className="mb-4">
                      <ul className="list-unstyled">
                        <li><strong>Year of Passing:</strong> {user.yearOfPassing ? user.yearOfPassing : <FontAwesomeIcon icon={faExclamationCircle} className="text-danger" />} {user.yearOfPassing ? '' : 'Year of Passing not provided'}</li>
                        <li><strong>Hall Ticket No.:</strong> {user.hallTicketNo ? user.hallTicketNo : <FontAwesomeIcon icon={faExclamationCircle} className="text-danger" />} {user.hallTicketNo ? '' : 'Hall Ticket No. not provided'}</li>
                        <li className="mt-3">
                          <strong>Platforms:</strong>
                          <ul className="list-unstyled">
                            {user.platforms.map((platform, index) => (
                              <li key={index} className="d-flex align-items-center mb-2">
                                <img src={platformIcons[platform.platform]} alt={platform.platform} className="mr-2" style={{ width: '30px', height: '30px', marginRight: '10px' }} />
                                <p className="mb-0">
                                    <strong>{platform.platform.charAt(0).toUpperCase() + platform.platform.slice(1)}:</strong>{' '}
                                {platform.username} {renderPlatformStatus(platform.verificationStatus)}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </div>
                  ))
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default MainPage;

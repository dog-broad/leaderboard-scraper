import React, {useEffect, useState} from 'react';
import {Container, Row, Col, Card, Button} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheckCircle, faExclamationCircle, faSpinner, faUser} from '@fortawesome/free-solid-svg-icons';
import supabase from '../services/supabase';

import codechefIcon from '../assets/codechef.png';
import codeforcesIcon from '../assets/codeforces.png';
import gfgIcon from '../assets/gfg.png';
import hackerrankIcon from '../assets/hackerrank.png';
import leetcodeIcon from '../assets/leetcode.png';

const MainPage = ({currentUser, currentUserMetadata}) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!currentUser) {
                    setLoading(false);
                    return;
                }

                const cachedUserData = sessionStorage.getItem('userData');
                if (cachedUserData) {
                    const userData = JSON.parse(cachedUserData);
                    setUserData(userData);
                    setLoading(false);
                } else {
                    const {data, error} = await supabase.from('users').select().eq('user_id', currentUser.id).single();
                    if (error) {
                        throw error;
                    }

                    if (data) {
                        sessionStorage.setItem('userData', JSON.stringify(data));
                        setUserData(data);
                        setLoading(false);
                    } else {
                        setUserData(null);
                        setLoading(false);
                    }
                }
            } catch (error) {
                console.error('Error fetching users data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser]);

    const renderPlatformStatus = (verificationStatus) => {
        switch (verificationStatus) {
            case 'verified_true':
                return <FontAwesomeIcon icon={faCheckCircle} className="text-success"/>;
            case 'verified_false':
                return <FontAwesomeIcon icon={faExclamationCircle} className="text-danger"/>;
            case 'loading':
                return <FontAwesomeIcon icon={faSpinner} className="text-primary" spin/>;
            default:
                return <span className="text-danger">Null Data</span>;
        }
    };

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
                                <Card.Title
                                    className="text-center">Welcome, {currentUserMetadata.full_name}!</Card.Title>
                                <Card.Text className="text-center">Email: {currentUser.email}</Card.Text>
                                <div className="d-flex justify-content-center">
                                    <img src={currentUserMetadata.avatar_url} alt="User" className="rounded-circle"
                                         style={{width: '150px', height: '150px'}}/>
                                </div>
                            </Card.Body>
                        </Card>
                    ) : (
                        <p className="text-center">Please log in to view your profile status.</p>
                    )}
                </Col>
            </Row>
            {currentUser && (
                <Row className="mt-4 justify-content-center">
                    <Col md={8}>
                        <Card className="mb-4 rounded shadow">
                            <Card.Body>
                                <h3 className="mb-3 text-center">Profile Status</h3>
                                {loading ? (
                                    <p className="text-center">Loading...</p>
                                ) : !userData ? (
                                    <div>
                                        <p className="text-center">No user data found. Please move to Profile Page to
                                            update your profile.</p>
                                        <div className="text-center mt-3">
                                            <Button variant="primary" onClick={() => window.location.href = '/profile'}>
                                                <FontAwesomeIcon icon={faUser} className="mr-2"/> Go to Profile
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <ul className="list-unstyled">
                                            <li><strong>Year of
                                                Passing:</strong> {userData.year_of_passing ? userData.year_of_passing :
                                                <FontAwesomeIcon icon={faExclamationCircle}
                                                                 className="text-danger"/>} {userData.year_of_passing ? '' : 'Year of Passing not provided'}
                                            </li>
                                            <li><strong>Hall Ticket
                                                No.:</strong> {userData.hall_ticket_no ? userData.hall_ticket_no :
                                                <FontAwesomeIcon icon={faExclamationCircle}
                                                                 className="text-danger"/>} {userData.hall_ticket_no ? '' : 'Hall Ticket No. not provided'}
                                            </li>
                                            <li className="mt-3">
                                                <strong>Platforms:</strong>
                                                <ul className="list-unstyled">
                                                    {Object.entries(userData.platforms).map(([platformName, platformData], index) => (
                                                        <li key={index} className="d-flex align-items-center mb-2">
                                                            <img src={platformIcons[platformName]} alt={platformName}
                                                                 className="mr-2" style={{
                                                                width: '30px',
                                                                height: '30px',
                                                                marginRight: '10px'
                                                            }}/>
                                                            <p className="mb-0">
                                                                <strong>{platformName.charAt(0).toUpperCase() + platformName.slice(1)}:</strong>{' '}
                                                                {platformData.platform_username} {renderPlatformStatus(platformData.verification_status)}
                                                            </p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
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

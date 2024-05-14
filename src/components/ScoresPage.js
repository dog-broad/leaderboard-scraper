import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import supabase from '../services/supabase'; // Import Supabase client

// Import platform icons
import codechefIcon from '../assets/codechef.png';
import codeforcesIcon from '../assets/codeforces.png';
import gfgIcon from '../assets/gfg.png';
import hackerrankIcon from '../assets/hackerrank.png';
import leetcodeIcon from '../assets/leetcode.png';

function ScoresPage({ currentUser }) {
    const [userPlatformData, setUserPlatformData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [lastUpdate, setLastUpdate] = useState(null);

    useEffect(() => {
        if (!currentUser) {
            return;
        }

        const cachedUserData = sessionStorage.getItem(`userData_${currentUser.id}`);
        if (cachedUserData) {
            setUserPlatformData(JSON.parse(cachedUserData));
        } else {
            fetchUserData().then(r => r);
        }
    }, [currentUser]);

    useEffect(() => {
        if (userPlatformData) {
            sessionStorage.setItem(`userData_${currentUser.id}`, JSON.stringify(userPlatformData));
        }
    }, [userPlatformData, currentUser]);

    const fetchUserData = async () => {
        try {
            // Fetch user data from the platforms table
            const { data, error } = await supabase
                .from('platform_data')
                .select()
                .eq('user_id', currentUser.id);

            if (error) {
                throw error;
            }

            setUserPlatformData(data);
            return data;
        } catch (error) {
            console.error('Error fetching user data:', error);
            setErrorMessage('Error fetching user data. Please try again later.');
            return null;
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

    // Function to update scores
    const updateScores = async () => {
        try {
            // Check if last update was more than a day ago
            if (lastUpdate && (new Date() - new Date(lastUpdate) < 24 * 60 * 60 * 1000)) {
                // If last update was less than a day ago, show error message
                setErrorMessage('You can only update scores once a day.');
                return;
            }

            // Run scraper scripts to update scores
            console.log('Updating scores...');

            // Call Django API to update scores with POST request
            let url = `https://codeprofilevalidator.onrender.com/update_scores/${currentUser.id}/`;
            await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // Update last update time
            setLastUpdate(new Date().toISOString());
            setErrorMessage('');
        } catch (error) {
            console.error('Error updating scores:', error);
            setErrorMessage('Error updating scores. Please try again later.');
        }
    };

    return (
        <Container className="mt-5 mb-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="rounded shadow">
                        <Card.Body>
                            <h3 className="mb-3 text-center">Your Scores</h3>
                            {errorMessage && <p className="text-danger">{errorMessage}</p>}
                            <Row>
                                {userPlatformData && userPlatformData.map((platform, index) => (
                                    <Col key={index} md={6} className="mb-3">
                                        <Card className="rounded shadow">
                                            <Card.Body>
                                                <div className="d-flex align-items-center mb-3">
                                                    <img src={platformIcons[platform.platform_name]} alt={platform.platform_name} className="mr-2" style={{ width: '30px', height: '30px' }} />
                                                    <h5 className="card-title mb-0">{platform.platform_name.charAt(0).toUpperCase() + platform.platform_name.slice(1)}</h5>
                                                </div>
                                                <p className="card-text">Username: {platform.platform_username}</p>
                                                <p className="card-text">Score: {platform.score ? platform.score : '~'}</p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                            <Button onClick={updateScores} variant="primary" className="mt-3">Update Scores</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default ScoresPage;
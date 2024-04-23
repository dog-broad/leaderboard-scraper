import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios'; // Import Axios for making HTTP requests
import supabase from '../services/supabase'; // Import Supabase client

function ScoresPage( { currentUser } ) {
    const [scores, setScores] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    // Function to fetch data
    const fetchData = async () => {
        try {
            // Fetch user data from the platforms table
            const { data: userData, error: userError } = await supabase
                .from('platforms')
                .select()
                .eq('user_id', currentUser.id);

            if (userError) {
                throw userError;
            }

            if (!userData) {
                // Handle case when user data is not found
                return;
            }

            // Array to store promises for fetching data from different platforms
            const platformPromises = [];

            // Iterate over userData to fetch data for each platform
            userData.forEach(platform => {
                // Fetch data for each platform and push the promise to the platformPromises array
                switch (platform.platform_name) {
                    case 'codeforces':
                        platformPromises.push(fetchCodeforcesData(platform.platform_username));
                        break;
                    case 'leetcode':
                        platformPromises.push(fetchLeetcodeData(platform.platform_username));
                        break;
                    case 'geeksforgeeks':
                        platformPromises.push(fetchGeeksforgeeksData(platform.platform_username));
                        break;
                    case 'hackerrank':
                        platformPromises.push(fetchHackerrankData(platform.yearOfPassing));
                        break;
                    case 'codechef':
                        platformPromises.push(fetchCodechefData(platform.platform_username));
                        break;
                    default:
                        console.log(`Unknown platform: ${platform.platform_name}`);
                }
            });

            // Wait for all promises to resolve
            await Promise.all(platformPromises);

            // Fetch and update scores from the database
            const { data: updatedScores, error: scoresError } = await supabase
                .from('platforms')
                .select()
                .eq('user_id', currentUser.id);

            if (scoresError) {
                throw scoresError;
            }

            setScores(updatedScores);
        } catch (error) {
            console.error('Error fetching or updating scores:', error);
            setErrorMessage('Error fetching or updating scores. Please try again later.');
        }
    };

    // Function to fetch Codeforces data
    const fetchCodeforcesData = async (username) => {
        try {
            const response = await axios.get(`https://codeforces.com/api/user.info?handles=${username}&checkHistoricHandles=false`);
            console.log('Codeforces data:', response.data);
            // Store or process the data as needed
        } catch (error) {
            console.error('Error fetching Codeforces data:', error);
        }
    };

    // Function to fetch LeetCode data
    const fetchLeetcodeData = async (username) => {
        try {
            const response = await axios.get(`https://alfa-leetcode-api.onrender.com/${username}/contest`);
            console.log('LeetCode data:', response.data);
            // Store or process the data as needed
        } catch (error) {
            console.error('Error fetching LeetCode data:', error);
        }
    };

    // Function to fetch GeeksforGeeks data
    const fetchGeeksforgeeksData = async (username) => {
        try {
            const response = await axios.get(`https://geeks-for-geeks-api.vercel.app/${username}`);
            console.log('GeeksforGeeks data:', response.data);
            // Store or process the data as needed
        } catch (error) {
            console.error('Error fetching GeeksforGeeks data:', error);
        }
    };

    // Function to fetch HackerRank data
    const fetchHackerrankData = async (yearOfPassing) => {
        try {
            const { data: searchTokens, error: searchTokensError } = await supabase
                .from('search_tokens')
                .select('urls')
                .eq('year_of_passing', yearOfPassing)
                .single();

            if (searchTokensError) {
                throw searchTokensError;
            }

            const SEARCH_TOKENS = searchTokens.urls;

            // Array to store promises for fetching HackerRank data
            const hackerrankPromises = [];

            // Iterate over SEARCH_TOKENS to fetch data for each trackerName
            for (const trackerName of SEARCH_TOKENS) {
                if (trackerName === "null") {
                    break;
                }
                for (let j = 0; j < 10000; j += 100) {
                    try {
                        const url = `https://www.hackerrank.com/rest/contests/${trackerName}/leaderboard?offset=${j}&limit=100`;
                        // Push the promise to the hackerrankPromises array
                        hackerrankPromises.push(axios.get(url));
                    } catch (e) {
                        console.error(`Error fetching Hackerrank rating for ${trackerName}: ${e}`);
                    }
                }
            }

            // Wait for all promises to resolve
            const responses = await Promise.all(hackerrankPromises);
            responses.forEach(response => {
                const leaderboard = response.data;
                const models = leaderboard.models;
                if (!models) {
                    return;
                }
                for (const model of models) {
                    if (model.username === 'null') {
                        return;
                    }
                    const username = model.username;
                    const rating = model.rating;
                    const data = {
                        username: username,
                        score: rating
                    };
                    console.log(data);
                    // Process the data as needed
                }
            });
        } catch (error) {
            console.error('Error fetching HackerRank data:', error);
        }
    };

    // Function to fetch CodeChef data
    const fetchCodechefData = async (username) => {
        try {
            const response = await axios.get(`https://codechef-api.vercel.app/${username}`);
            console.log('CodeChef data:', response.data);
            // Store or process the data as needed
        } catch (error) {
            console.error('Error fetching CodeChef data:', error);
        }
    };


    // Function to store scores in the database
    const storeScoresInDatabase = async (userId, scores) => {
        try {
            const records = scores.map(score => ({
                user_id: userId,
                platform_name: score.platform,
                platform_username: score.username,
                platform_data: score.data,
                updated_at: new Date().toISOString()
            }));

            await supabase
                .from('platforms')
                .upsert(records);
        } catch (error) {
            console.error('Error storing scores in the database:', error);
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card>
                        <Card.Body>
                            <h3 className="mb-3 text-center">Your Scores</h3>
                            {errorMessage && <p className="text-danger">{errorMessage}</p>}
                            <Button onClick={fetchData} variant="primary">Fetch Data</Button>
                            <Row>
                                {scores.map((score, index) => (
                                    <Col key={index} md={6} className="mb-3">
                                        <Card>
                                            <Card.Body>
                                                <h5 className="card-title">{score.platform_name}</h5>
                                                <p className="card-text">Score: {score.platform_data.score}</p>
                                                <p className="card-text">Last Updated: {new Date(score.updated_at).toLocaleString()}</p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default ScoresPage;

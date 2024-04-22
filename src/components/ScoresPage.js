import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import supabase from '../services/supabase'; // Import Supabase client
import axios from 'axios'; // Import Axios for making HTTP requests

function ScoresPage({ currentUser }) {
    const [scores, setScores] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!currentUser) return;

                // Fetch last update time from the database
                const { data: lastUpdate, error: lastUpdateError } = await supabase
                    .from('platforms')
                    .select('updated_at')
                    .eq('user_id', currentUser.id)
                    .order('updated_at', { ascending: false })
                    .limit(1)
                    .single();

                if (lastUpdateError) {
                    throw lastUpdateError;
                }

                // Check if last update time is more than 24 hours ago
                const lastUpdateDate = new Date(lastUpdate.updated_at);
                const twentyFourHoursAgo = new Date();
                twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);
                if (lastUpdateDate > twentyFourHoursAgo) {
                    // If less than 24 hours ago, skip update
                    return;
                }

                // Fetch new data
                const codeforcesData = await axios.get(`https://codeforces.com/api/user.info?handles=${currentUser.codeforcesHandle}&checkHistoricHandles=false`);
                console.log('Codeforces data:', codeforcesData.data);

                const leetcodeData = await axios.get(`https://alfa-leetcode-api.onrender.com/${currentUser.leetcodeUsername}/contest`);
                console.log('LeetCode data:', leetcodeData.data);

                const geeksforgeeksData = await axios.get(`https://geeks-for-geeks-api.vercel.app/${currentUser.geeksforgeeksUsername}`);
                console.log('Geeks for Geeks data:', geeksforgeeksData.data);

                const hackerrankData = await getHackerrankInfo(currentUser.yearOfPassing);
                console.log('HackerRank data:', hackerrankData);

                const codechefData = await get_codechef_info(currentUser.codechefHandles);
                console.log('CodeChef data:', codechefData);

                // Store new scores in the database
                await storeScoresInDatabase(currentUser.id, [codeforcesData, leetcodeData, geeksforgeeksData, hackerrankData, codechefData]);

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

        fetchData().then(r => console.log(r));
    }, [currentUser]);

    // Function to fetch data from HackerRank
    const getHackerrankInfo = async (yearOfPassing) => {
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

            // Proceed with fetching data using SEARCH_TOKENS
            for (const trackerName of SEARCH_TOKENS) {
                if (trackerName === "null") {
                    break;
                }
                for (let j = 0; j < 10000; j += 100) {
                    try {
                        const url = `https://www.hackerrank.com/rest/contests/${trackerName}/leaderboard?offset=${j}&limit=100`;
                        const response = await axios.get(url);
                        const leaderboard = response.data;
                        const models = leaderboard.models;
                        if (!models) {
                            break;
                        }
                        for (const model of models) {
                            const userHandle = model.hacker.toLowerCase();
                            // Process the user handle
                        }
                    } catch (e) {
                        console.error(`Error fetching Hackerrank rating for ${trackerName}: ${e}`);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching search tokens:', error);
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

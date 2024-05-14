import React, {useState, useEffect, useMemo, useRef} from 'react';
import supabase from '../services/supabase'; // Import Supabase client
import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import './ProfileForm.css'; // Keep your custom styles if needed
import $ from 'jquery';

// Import platform icons
import codechefIcon from '../assets/codechef.png';
import codeforcesIcon from '../assets/codeforces.png';
import gfgIcon from '../assets/gfg.png';
import hackerrankIcon from '../assets/hackerrank.png';
import leetcodeIcon from '../assets/leetcode.png';

function ProfileForm({currentUser, currentUserMetadata}) {
    const [geeksforgeeksState, setGeeksforgeeksState] = useState({
        platform: 'geeksforgeeks',
        username: '',
        verificationStatus: 'unchecked',
        loading: false
    });
    const [codeforcesState, setCodeforcesState] = useState({
        platform: 'codeforces',
        username: '',
        verificationStatus: 'unchecked',
        loading: false
    });
    const [leetcodeState, setLeetcodeState] = useState({
        platform: 'leetcode',
        username: '',
        verificationStatus: 'unchecked',
        loading: false
    });
    const [codechefState, setCodechefState] = useState({
        platform: 'codechef',
        username: '',
        verificationStatus: 'unchecked',
        loading: false
    });
    const [hackerrankState, setHackerrankState] = useState({
        platform: 'hackerrank',
        username: '',
        verificationStatus: 'unchecked',
        loading: false
    });

    const platforms = useMemo(() => [
        {platform: 'geeksforgeeks', state: [geeksforgeeksState, setGeeksforgeeksState]},
        {platform: 'codeforces', state: [codeforcesState, setCodeforcesState]},
        {platform: 'leetcode', state: [leetcodeState, setLeetcodeState]},
        {platform: 'codechef', state: [codechefState, setCodechefState]},
        {platform: 'hackerrank', state: [hackerrankState, setHackerrankState]},
    ], [codechefState, codeforcesState, geeksforgeeksState, hackerrankState, leetcodeState]);

    const [yearOfPassing, setYearOfPassing] = useState('');
    const [hallTicketNo, setHallTicketNo] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isUpdatable, setIsUpdatable] = useState(true); // State to manage updatable status
    const [dataFetched, setDataFetched] = useState(false); // Flag to track whether data has been fetched
    const [userDataEmpty, setUserDataEmpty] = useState(false); // Flag to track whether user data is empty

    const platformsRef = useRef(platforms);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!currentUser || dataFetched) return;

                const userDataFromStorage = sessionStorage.getItem('userData');
                if (userDataFromStorage) {
                    const userData = JSON.parse(userDataFromStorage);
                    setYearOfPassing(userData.year_of_passing || '');
                    setHallTicketNo(userData.hall_ticket_no || '');
                    const platformsData = userData.platforms || {};
                    platformsRef.current.forEach(({platform, state}) => {
                        const userPlatformData = platformsData[platform];
                        if (userPlatformData) {
                            state[1]({...state[0], username: userPlatformData.platform_username});
                        }
                    });
                    const updatedAt = userData.updated_at ? new Date(userData.updated_at) : null;
                    const today = new Date();
                    setIsUpdatable(!updatedAt || updatedAt.getDate() !== today.getDate() || updatedAt.getMonth() !== today.getMonth() || updatedAt.getFullYear() !== today.getFullYear());
                } else {
                    if (userDataEmpty) return;
                    const {data, error} = await supabase
                        .from('users')
                        .select()
                        .eq('user_id', currentUser.id)
                        .single();
                    if (error) {
                        if (error.code === 'PGRST116') {
                            setUserDataEmpty(true);
                            return;
                        }
                        throw error;
                    }

                    if (data) {
                        setYearOfPassing(data.year_of_passing || '');
                        setHallTicketNo(data.hall_ticket_no || '');
                        const platformsData = data.platforms || {};
                        platformsRef.current.forEach(({platform, state}) => {
                            const userPlatformData = platformsData[platform];
                            if (userPlatformData) {
                                state[1]({...state[0], username: userPlatformData.platform_username});
                            }
                        });
                        const updatedAt = data.updated_at ? new Date(data.updated_at) : null;
                        const today = new Date();
                        setIsUpdatable(!updatedAt || updatedAt.getDate() !== today.getDate() || updatedAt.getMonth() !== today.getMonth() || updatedAt.getFullYear() !== today.getFullYear());

                        sessionStorage.setItem('userData', JSON.stringify(data));
                        setDataFetched(true);
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData().then(r => console.log(r));
    }, [currentUser, userDataEmpty, dataFetched, platformsRef]);


    const handleVerify = async (platform, userData, setData) => {
        try {
            console.log(`Verifying ${platform} username...`);
            let url = '';
            if (platform === 'leetcode') {
                url = `https://alfa-leetcode-api-v3y6.onrender.com/${userData.username}`;
            } else {
                url = `https://codeprofilevalidator.onrender.com/check-url-platform/?platform=${platform}&username=${userData.username}`;
            }

            setData(prevData => ({...prevData, loading: true}));
            setErrorMessage('');

            $.ajax({
                url: url,
                dataType: 'json',
                statusCode: {
                    200: function (d) {
                        if (userData.username === '') {
                            console.log("status code 200 returned");
                            setData({
                                platform,
                                username: userData.username,
                                verificationStatus: 'verified_false',
                                loading: false
                            });
                            setErrorMessage('Username cannot be empty.');
                            return;
                        }
                        if ('errors' in d) {
                            console.log(d.errors);
                            console.log("status code 200 returned");
                            setData({
                                platform,
                                username: userData.username,
                                verificationStatus: 'verified_false',
                                loading: false
                            });
                        } else {
                            console.log(d);
                            console.log("status code 200 returned");
                            setData({
                                platform,
                                username: userData.username,
                                verificationStatus: 'verified_true',
                                loading: false
                            });
                        }
                    },
                    400: function (d) {
                        console.log(d);
                        setData({
                            platform,
                            username: userData.username,
                            verificationStatus: 'verified_false',
                            loading: false
                        });
                        setErrorMessage(d.responseJSON.error);
                    },
                    429: function (d) {
                        console.log(d);
                        console.log("status code 429 returned");
                        setData({
                            platform,
                            username: userData.username,
                            verificationStatus: 'verified_false',
                            loading: false
                        });
                        setErrorMessage(d.responseText);
                        alert(d.responseText);
                    },
                    404: function (d) {
                        console.log(d);
                        console.log("status code 404 returned");
                        setData({
                            platform,
                            username: userData.username,
                            verificationStatus: 'verified_false',
                            loading: false
                        });
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

            // Check if any username is empty
            const emptyUsernames = platforms.filter(({state}) => state[0].username.trim() === '');
            if (emptyUsernames.length > 0) {
                alert('Please fill in all usernames before saving.');
                return;
            }

            // Verify all usernames
            platforms.forEach(({state}) => {
                const verificationStatus = state[0].verificationStatus;
                if (verificationStatus !== 'verified_true') {
                    alert(`Username ${state[0].username} is not verified.`);
                }
            });

            // Validation for year of passing
            const selectedYear = parseInt(yearOfPassing);
            if (isNaN(selectedYear) || selectedYear < 2025) {
                setErrorMessage('Please select a valid year of passing.');
                return;
            }

            // Construct the data to be saved
            const userDataToSave = {
                user_id: currentUser.id,
                name: currentUserMetadata.full_name,
                email: currentUser.email,
                photo_url: currentUserMetadata.avatar_url,
                year_of_passing: selectedYear,
                hall_ticket_no: hallTicketNo,
                updated_at: new Date().toISOString(),
                platforms: platforms.reduce((acc, {platform, state}) => {
                    acc[platform] = {
                        platform_name: platform,
                        platform_username: state[0].username,
                        verification_status: state[0].verificationStatus,
                    };
                    return acc;
                }, {}),
            };

            // Save data to Supabase
            const {error} = await supabase.from('users').upsert(userDataToSave, {returning: 'minimal'});
            if (error) {
                throw error;
            }

            alert('Data saved successfully!');
            // Dirty hack to trigger re-render
            setUserDataEmpty(false);
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Error saving data. Please try again later.' + error.message);
        }
    };

    const handleUsernameChange = (e, setUsername) => {
        const inputUsername = e.target.value;
        const formattedUsername = inputUsername.replace(/[A-Z]/g, (match) => match.toLowerCase());
        if (inputUsername === '' || /^[a-z0-9_]{1,20}$/.test(formattedUsername)) {
            setUsername({username: formattedUsername, verified: false});
            setErrorMessage('');
        } else {
            setErrorMessage('Username should be 1-20 characters long, lowercase, and may only contain letters, numbers, or underscores.');
        }
    };

    // Generate options for year of passing dropdown
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({length: 5}, (_, i) => currentYear + i);

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
                    <div className="card profile-form-container" style={{
                        filter: isUpdatable ? 'none' : 'blur(4px)',
                        pointerEvents: isUpdatable ? 'auto' : 'none'
                    }}>
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
                                {platforms.map(({platform, state}) => (
                                    <div key={platform} className="d-flex align-items-center mb-3">
                                        <img src={platformIcons[platform]} alt={platform} className="mr-2"
                                             style={{width: '30px', height: '30px', marginRight: '10px'}}/>
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
                                            {state[0].loading ? <FontAwesomeIcon icon={faSpinner}
                                                                                 spin/> : state[0].verificationStatus === 'verified_true' ? 'Exists' : state[0].verificationStatus === 'verified_false' ? 'Invalid' : 'Verify'}
                                        </Button>
                                    </div>
                                ))}
                            </Form.Group>

                            {/* Error message and save button */}
                            <div>
                                {errorMessage && <p className="profile-form-error-message">{errorMessage}</p>}
                                {!isUpdatable &&
                                    <p className="profile-form-info">Note: Year of Passing and Hall Ticket No. can be
                                        modified only once per day.</p>}
                                <Button onClick={handleSave} className="profile-form-button btn btn-primary"
                                        disabled={!isUpdatable}>Save</Button>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default ProfileForm;

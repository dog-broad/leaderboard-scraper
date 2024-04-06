import React from 'react';
import { Container, Card, Col, Row } from 'react-bootstrap';
import ProfileForm from './ProfileForm';

const ProfilePage = ({ currentUser }) => {
  const profileFormInactiveStyle = {
    filter: currentUser ? 'none' : 'blur(4px)',
    pointerEvents: currentUser ? 'auto' : 'none',
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="text-center mb-4">
            {currentUser ? (
              <Card className="rounded shadow">
                <Card.Body>
                  <h4>Welcome, {currentUser.displayName}!</h4>
                  <p>Email: {currentUser.email}</p>
                  <img src={currentUser.photoURL} alt="User" className="rounded-circle img-fluid" style={{ maxWidth: '150px' }} />
                </Card.Body>
              </Card>
            ) : (
              <p>We're glad you're here! Unfortunately, you're not signed in at the moment. Sign in or create an account to get started.</p>
            )}
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="mb-4 rounded shadow" style={profileFormInactiveStyle}>
            <Card.Body>
              <h3 className="mb-3 text-center">Verify Your Coding Profiles</h3>
              <ProfileForm currentUser={currentUser} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="text-center">
            <h3 className="mb-3">How It Works</h3>
            <p>
              Enter your usernames for various coding platforms in the form below to verify your profiles. Once entered, click the "Verify" button next to each platform to check if the username is valid.
            </p>
            <p>
              Upon verification, the button will display "Exists" if the username is valid, and "Invalid" otherwise. You can then click the "Save" button at the bottom of the form to save your information.
            </p>
            <p>
              <strong>Note:</strong> Usernames should be 1-20 characters long, lowercase, and may only contain letters, numbers, or underscores.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;

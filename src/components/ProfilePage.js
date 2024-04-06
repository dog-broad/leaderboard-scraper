import React, { useState } from 'react';
import { Container, Card, Col, Row, Modal } from 'react-bootstrap';
import ProfileForm from './ProfileForm';

const ProfilePage = ({ currentUser }) => {
  const profileFormInactiveStyle = {
    filter: currentUser ? 'none' : 'blur(4px)',
    pointerEvents: currentUser ? 'auto' : 'none',
  };

  // State to control the visibility of the modal
  const [showModal, setShowModal] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setShowInstructions(true);
  };

  // Shared content for modal and instructions section
  const setupInstructions = (
    <div className="text-justify">
      <p>
        To set up your profile, follow these simple steps:
      </p>
      <ol className="text-left">
        <li>Enter your Year of Passing and Hall Ticket Number, along with your usernames for various coding platforms in the form below.</li>
        <li>Click the "Verify" button next to each platform to check if the username is valid.</li>
        <li>Upon verification, the button will display "Exists" if the username is valid, and "Invalid" otherwise.</li>
        <li>Ensure all usernames are verified.</li>
        <li>Click the "Save" button at the bottom of the form to save your information.</li>
      </ol>
      <p>
        <strong>Note:</strong> Usernames should be 1-20 characters long, lowercase, and may only contain letters, numbers, or underscores. Year of Passing and Hall Ticket Number can be modified only <strong>once per day</strong> for all fields, so ensure they are accurate before saving.
      </p>
    </div>
  );

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
              <h3 className="mb-3 text-center">Your Profile</h3>
              <ProfileForm currentUser={currentUser} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>How It Works</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {setupInstructions}
        </Modal.Body>
      </Modal>
      {showInstructions && (
        <Row className="justify-content-center">
          <Col md={8}>
            <h3 className="mb-3">Instructions</h3>
            {setupInstructions}
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default ProfilePage;

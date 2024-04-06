// src/components/MainPage.js
import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';

const MainPage = ({ currentUser }) => {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Welcome to Coding Leaderboard!</h1>
      <Row className="justify-content-center">
        <Col md={6}>
          {currentUser ? (
            <Card className="rounded shadow">
              <Card.Body>
                <Card.Title className="text-center">Welcome, {currentUser.displayName}!</Card.Title>
                <Card.Text>
                  <p className="text-center">Email: {currentUser.email}</p>
                </Card.Text>
                <div className="d-flex justify-content-center">
                  <img src={currentUser.photoURL} alt="User" className="rounded-circle" style={{ width: '150px', height: '150px' }} />
                </div>
              </Card.Body>
            </Card>
          ) : (
            <p className="text-center">This is the main page content. You can add your content here.</p>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default MainPage;

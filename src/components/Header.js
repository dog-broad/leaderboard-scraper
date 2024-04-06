// src/components/Header.js
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { signInWithPopup } from "firebase/auth"; // Update import statement
import { auth, googleProvider } from '../services/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

const Header = ({ user }) => {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // Store user data in local storage
      localStorage.setItem(`firebase:authUser:${auth.currentUser.uid}`, JSON.stringify(auth.currentUser.toJSON()));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Move user to Main page
      window.location.href = "/";
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Coding Leaderboard</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="mr-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              {user && <Nav.Link as={Link} to="/profile">Profile</Nav.Link>}
              <Nav.Link as={Link} to="/leaderboard">Leaderboard</Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <>
                <Nav.Link onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link onClick={handleLogin}>
                  <FontAwesomeIcon icon={faGoogle} /> Login with Google
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;

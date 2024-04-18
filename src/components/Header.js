// src/components/Header.js
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import supabase from '../services/supabase'; // Import Supabase client
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

const Header = ({ user }) => {
  const handleLogin = async () => {
    try {
      // Sign in with Google using Supabase authentication
      const { user, session, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        console.error('Error signing in with Google:', error.message);
      } else {
        console.log('User:', user);
        console.log('Session:', session);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Clear all local storage data and session data
      localStorage.clear();
      sessionStorage.clear();
      // Redirect to the main page after logout
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
              <Nav.Link as={Link} to="/userdata">User Data</Nav.Link>
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

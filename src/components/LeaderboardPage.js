// src/components/LeaderboardPage.js
import React from 'react';
import { Table } from 'react-bootstrap';

const LeaderboardPage = () => {
  // Example data for leaderboard
  const data = [
    { rank: 1, username: 'User1', score: 100 },
    { rank: 2, username: 'User2', score: 90 },
    { rank: 3, username: 'User3', score: 80 },
    // Add more data as needed
  ];

  return (
    <div className="container">
      <h2>Leaderboard</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.rank}</td>
              <td>{item.username}</td>
              <td>{item.score}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default LeaderboardPage;

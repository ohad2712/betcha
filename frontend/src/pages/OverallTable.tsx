import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface UserOverallStats {
  username: string;
  totalPoints: number;
  exactGuesses: number;
  directionGuesses: number;
}

const OverallTable = () => {
  const [stats, setStats] = useState<UserOverallStats[]>([]);

  useEffect(() => {
    const fetchOverallStats = async () => {
      try {
        const response = await axios.get('/api/season/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch overall stats', error);
      }
    };

    fetchOverallStats();
  }, []);

  return (
    <div>
      <h2>Overall Table</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Total Points</th>
            <th>Exact Guesses</th>
            <th>Direction Guesses</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((userStats) => (
            <tr key={userStats.username}>
              <td>{userStats.username}</td>
              <td>{userStats.totalPoints}</td>
              <td>{userStats.exactGuesses}</td>
              <td>{userStats.directionGuesses}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OverallTable;

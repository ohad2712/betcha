import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface UserGameweekStats {
  username: string;
  exactGuesses: number;
  directionGuesses: number;
  totalPoints: number;
}

const ThisGameweek = () => {
  const [stats, setStats] = useState<UserGameweekStats[]>([]);

  useEffect(() => {
    const fetchGameweekStats = async () => {
      try {
        const response = await axios.get('/api/gameweek/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch gameweek stats', error);
      }
    };

    fetchGameweekStats();
  }, []);

  return (
    <div>
      <h2>This Gameweek</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Exact Guesses</th>
            <th>Direction Guesses</th>
            <th>Total Points</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((userStats) => (
            <tr key={userStats.username}>
              <td>{userStats.username}</td>
              <td>{userStats.exactGuesses}</td>
              <td>{userStats.directionGuesses}</td>
              <td>{userStats.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ThisGameweek;

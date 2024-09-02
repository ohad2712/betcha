import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ThisGameweek.module.css';

interface GameweekStats {
  username: string;
  exactGuesses: number;
  directionGuesses: number;
  totalPoints: number;
}

const ThisGameweek: React.FC = () => {
  const [gameweekStats, setGameweekStats] = useState<GameweekStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameweekStats = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/gameweek/current`);
        const statsData = response.data;

        const sortedStats = statsData.sort((a: GameweekStats, b: GameweekStats) => b.totalPoints - a.totalPoints);
        setGameweekStats(sortedStats);
      } catch (error) {
        console.error('Error fetching gameweek stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameweekStats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h2>Current Gameweek Standings</h2>
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
          {gameweekStats.map((stats, index) => (
            <tr key={index} className={index === 0 ? styles['leader-row'] : ''}>
              <td>{stats.username}</td>
              <td>{stats.exactGuesses}</td>
              <td>{stats.directionGuesses}</td>
              <td>{stats.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ThisGameweek;

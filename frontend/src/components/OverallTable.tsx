import React, { useEffect, useState } from 'react';
import axios from 'axios';

import styles from './Table.module.css';

interface SeasonStats {
  username: string;
  exactGuesses: number;
  directionGuesses: number;
  totalPoints: number;
}

const OverallTable: React.FC = () => {
  const [seasonStats, setSeasonStats] = useState<SeasonStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeasonStats = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/season/standings`);
        setSeasonStats(response.data);        
      } catch (error) {
        console.error('Error fetching season stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeasonStats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h2>Season Standings</h2>
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
          {seasonStats.map((stats, index) => (
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

export default OverallTable;

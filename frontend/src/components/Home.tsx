import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { login } from '../store/userSlice';
import styles from './Home.module.css'; // Import the CSS module
import teams from '../utils'; // Import the teams utility

const Home: React.FC = () => {
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const username = useSelector((state: RootState) => state.user.username);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/matches/upcoming`);
        setMatches(response.data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoadingMatches(false);
      }
    };

    fetchMatches();
  }, [dispatch, username]);

  if (!username) {
    return <div>Loading user data...</div>;
  }

  if (loadingMatches) {
    return <div>Loading matches...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Welcome, {username}</h1>
      <h2>Upcoming Matches</h2>
      <ul>
        {matches.map((match: any) => {
          // Get team info from the utility
          const homeTeam = teams[match.homeTeam];
          const awayTeam = teams[match.awayTeam];

          return (
            <li key={match.id} className={styles.match}>
              <div className={styles.team}>
                <img
                  src={`${process.env.PUBLIC_URL}/team_logos/${homeTeam.formatted}.png`}
                  alt={homeTeam.name}
                  className={styles.logo}
                />
                <span className={styles.name}>{homeTeam.shortcut}</span>
              </div>
              <input
                type="number"
                placeholder="0"
                className={styles.input}
                onChange={(e) =>
                  handleGuessChange(match.id, parseInt(e.target.value), match.awayGoals)
                }
              />
              <span className={styles.colon}>:</span>
              <input
                type="number"
                placeholder="0"
                className={styles.input}
                onChange={(e) =>
                  handleGuessChange(match.id, match.homeGoals, parseInt(e.target.value))
                }
              />
              <div className={styles.team}>
                <span className={styles.name}>{awayTeam.shortcut}</span>
                <img
                  src={`${process.env.PUBLIC_URL}/team_logos/${awayTeam.formatted}.png`}
                  alt={awayTeam.name}
                  className={styles.logo}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const handleGuessChange = (matchId: number, homeGoals: number, awayGoals: number) => {
  // Implement save logic here, with a debounce for 3 seconds of idle time
};

export default Home;

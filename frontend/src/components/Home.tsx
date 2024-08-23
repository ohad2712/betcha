import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { login } from '../store/userSlice'; // Import the login action

const Home: React.FC = () => {
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const username = useSelector((state: RootState) => state.user.username);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/matches/upcoming`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
    <div>
      <h1>Welcome, {username}</h1>
      <h2>Upcoming Matches</h2>
      <ul>
        {matches.map((match: any) => (
          <li key={match.id}>
            {match.homeTeam} vs {match.awayTeam}
            <input
              type="number"
              placeholder="Home Goals"
              onChange={(e) => handleGuessChange(match.id, parseInt(e.target.value), match.awayGoals)}
            />
            <input
              type="number"
              placeholder="Away Goals"
              onChange={(e) => handleGuessChange(match.id, match.homeGoals, parseInt(e.target.value))}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

const handleGuessChange = (matchId: number, homeGoals: number, awayGoals: number) => {
  // Implement save logic here, with a debounce for 3 seconds of idle time
};

export default Home;

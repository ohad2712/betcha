import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Home: React.FC = () => {
  const [matches, setMatches] = useState([]);
  const username = useSelector((state: RootState) => state.user.username);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('/api/matches/upcoming');
        setMatches(response.data.matches);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, []);

  const handleGuessChange = (matchId: number, homeGoals: number, awayGoals: number) => {
    // Implement save logic here, with a debounce for 3 seconds of idle time
  };

  return (
    <div>
      <h1>Welcome, {username}</h1>
      <h2>Upcoming Matches</h2>
      <ul>
        {matches.map((match: any) => (
          <li key={match.id}>
            {match.homeTeam.name} vs {match.awayTeam.name}
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

export default Home;

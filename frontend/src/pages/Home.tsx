import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  homeGoals?: number;
  awayGoals?: number;
}

const Home = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [guesses, setGuesses] = useState<{ [key: number]: { homeGoals: number; awayGoals: number } }>({});

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('/api/matches/upcoming');
        setMatches(response.data);
      } catch (error) {
        console.error('Failed to fetch matches', error);
      }
    };

    fetchMatches();
  }, []);

  const handleGuessChange = (matchId: number, team: 'home' | 'away', goals: number) => {
    setGuesses((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team === 'home' ? 'homeGoals' : 'awayGoals']: goals,
      },
    }));

    // Implement debounced save
    setTimeout(() => saveGuesses(matchId), 3000); // TODO: Add this to config
  };

  const saveGuesses = async (matchId: number) => {
    try {
      const guess = guesses[matchId];
      await axios.post(`/api/guesses/${matchId}`, guess);
      console.log('Guesses saved');
    } catch (error) {
      console.error('Failed to save guesses', error);
    }
  };

  return (
    <div>
      <h2>Upcoming Matches</h2>
      <ul>
        {matches.map((match) => (
          <li key={match.id}>
            <img src={match.homeLogo} alt={match.homeTeam} />
            {match.homeTeam} vs {match.awayTeam}
            <img src={match.awayLogo} alt={match.awayTeam} />
            <input
              type="number"
              value={guesses[match.id]?.homeGoals || ''}
              onChange={(e) => handleGuessChange(match.id, 'home', Number(e.target.value))}
              disabled={false} /* Add condition to disable if past deadline */
            />
            -
            <input
              type="number"
              value={guesses[match.id]?.awayGoals || ''}
              onChange={(e) => handleGuessChange(match.id, 'away', Number(e.target.value))}
              disabled={false} /* Add condition to disable if past deadline */
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;

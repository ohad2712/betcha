import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import styles from './Home.module.css';
import teams from '../utils';
import SyncIcon from './SyncIcon';

// TODO: use the saved guesses when loading the matches
// TODO: add a sticky date and time. The matches should be ordered by ascending order by their kickoff time, and
// grouped by them.

const Home: React.FC = () => {
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [gameweek, setGameweek] = useState<number | null>(null);
  const [guesses, setGuesses] = useState<{ [key: number]: { homeGoals: number | null; awayGoals: number | null } }>({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const username = useSelector((state: RootState) => state.user.username);
  const userId = useSelector((state: RootState) => state.user.id);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/matches/upcoming`);
        setMatches(response.data);

        if (response.data.length > 0) {
          setGameweek(response.data[0].gameweekId);
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoadingMatches(false);
      }
    };

    fetchMatches();
  }, [dispatch, username]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveGuessesToDB();
    }, 1500);

    return () => clearTimeout(timer);
  }, [guesses]);

  const handleGuessChange = (matchId: number, homeGoals: number | null, awayGoals: number | null) => {
    setGuesses((prevGuesses) => ({
      ...prevGuesses,
      [matchId]: { homeGoals, awayGoals },
    }));
  };

  const saveGuessesToDB = async () => {
    if (!userId) return;

    const completeGuesses = Object.entries(guesses).filter(
      ([, { homeGoals, awayGoals }]) => homeGoals !== null && awayGoals !== null
    );

    if (completeGuesses.length === 0) {
      return;
    }

    setSaving(true);
    try {      
      const guessesObjects = completeGuesses.map(([matchId, { homeGoals, awayGoals }]) => ({
        userId,
        matchId: parseInt(matchId),
        gameweekId: gameweek!,
        homeGoals,
        awayGoals,
      }));

      await axios.post(`${process.env.REACT_APP_API_URL}/api/guesses`, { guesses: guessesObjects });
      
      setSaveSuccess(true);
      
      setTimeout(() => {
        setSaving(false);
      }, 1000);

      setTimeout(() => {
        setSaveSuccess(false); // Reset success message after a delay
      }, 3000);

    } catch (error) {
      console.error('Error saving guesses:', error);
      setSaving(false);
      setSaveSuccess(false); // Ensure success state is reset on error
    }
  };

  
  if (!username || !userId) {
    return <div>Loading user data...</div>;
  }
  
  if (loadingMatches) {
    return <div>Loading matches...</div>;
  }

  const formatKickoffTime = (dateString: string) => {
    const date = new Date(dateString);
  
    // Options for formatting date and time
    const optionsDate: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: '2-digit', 
      month: '2-digit' 
    };
    const optionsTime: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false // 24-hour time format
    };
  
    // Format the date and time
    const formattedDate = date.toLocaleDateString('en-GB', optionsDate); // Format to dd/mm/yyyy
    const formattedTime = date.toLocaleTimeString('en-GB', optionsTime); // Format to 24-hour time
  
    return `${formattedDate} - ${formattedTime}`;
  };
  

  return (
    <div className={styles.container}>
      <h2 className={styles.h2}>Upcoming Matches - GW {gameweek}</h2>
      <h4 className={styles.h4}>{process.env.REACT_APP_ACTIVE_SEASON}</h4>

      <SyncIcon saving={saving} success={saveSuccess} />

      <ul className={styles["matches-list"]}>
        {matches.map((match: any) => {
          const homeTeam = teams[match.homeTeam];
          const awayTeam = teams[match.awayTeam];
          const formattedKickoffTime = formatKickoffTime(match.kickoffTime);

          return (
            <li key={match.id} className={styles.match}>
              {/* <div className={styles.kickoffTime}>{formattedKickoffTime}</div> Display kickoff time */}

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
                placeholder="-"
                className={styles.input}
                value={guesses[match.id]?.homeGoals ?? ''}
                onChange={(e) =>
                  handleGuessChange(match.id, e.target.value === '' ? null : parseInt(e.target.value), guesses[match.id]?.awayGoals ?? null)
                }
              />
              <span className={styles.colon}>:</span>
              <input
                type="number"
                placeholder="-"
                className={styles.input}
                value={guesses[match.id]?.awayGoals ?? ''}
                onChange={(e) =>
                  handleGuessChange(match.id, guesses[match.id]?.homeGoals ?? null, e.target.value === '' ? null : parseInt(e.target.value))
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

export default Home;

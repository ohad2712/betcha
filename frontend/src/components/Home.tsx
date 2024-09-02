import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import styles from './Home.module.css';
import teams from '../utils';
import SyncIcon from './SyncIcon';
import LockIcon from './LockIcon';
import CountdownTimer from './CountdownTimer';

// TODO: fix issue where if a guess exists (if (completeGuesses.length === 0) is falsy), then any other input we fill triggers the sync icon, when it should only be triggered if a certain match has both home AND away guesses put. The actual guess is not saved with only half of the guess. It's just the sync icon animation that should not work as well.

const ONE_HOUR_IN_MS = 60 * 60 * 1000;
const SAVE_GUESSES_FREQUENCY_MS = 1500;
const SAVE_GUESSES_IDLE_WAIT_MS = 1000;
const SAVE_GUESSES_SAVING_ANIMATION_DURATION_MS = 3000;

const Home: React.FC = () => {
  const [groupedMatches, setGroupedMatches] = useState<{ [key: string]: any[] }>({});
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [gameweek, setGameweek] = useState<number | null>(null);
  const [guesses, setGuesses] = useState<{ [key: number]: { homeGoals: number | null; awayGoals: number | null, correctDirection: boolean,  exact: boolean } }>({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [deadlinePassed, setDeadlinePassed] = useState(false);

  const username = useSelector((state: RootState) => state.user.username);
  const userId = useSelector((state: RootState) => state.user.id);

  const dispatch = useDispatch();

  const formatKickoffTime = (dateString: string) => {
    const date = new Date(dateString);
    const optionsDate: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: '2-digit', 
      month: '2-digit' 
    };
    const optionsTime: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    };
    const formattedDate = date.toLocaleDateString('en-GB', optionsDate);
    const formattedTime = date.toLocaleTimeString('en-GB', optionsTime);
    
    return `${formattedDate} - ${formattedTime}`;
  };

  useEffect(() => {
    const fetchMatchesAndGuesses = async () => {
      try {
        const matchesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/matches/upcoming`);
        const upcomingMatches = matchesResponse.data;

        const firstKickoffTime = new Date(upcomingMatches[0].matches[0].kickoffTime);
        const deadline = new Date(firstKickoffTime.getTime() - ONE_HOUR_IN_MS); // 1 hour before first kickoff
        
        setDeadline(deadline);
        setDeadlinePassed(new Date() > deadline);

        const groupedMatches = upcomingMatches.reduce((acc: any, matchGroup: any) => {
          const formattedKickoffTime = formatKickoffTime(matchGroup.kickoffTime);
          if (!acc[formattedKickoffTime]) {
            acc[formattedKickoffTime] = [];
          }
          
          acc[formattedKickoffTime].push(...matchGroup.matches);
          
          return acc;
        }, {});
        
        setGroupedMatches(groupedMatches);

        if (upcomingMatches.length > 0) {
          const fetchedGameweek = upcomingMatches[0].matches[0].gameweekId;
          setGameweek(fetchedGameweek);

          const guessesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/guesses/${fetchedGameweek}`);
          const userGuesses = guessesResponse.data;

          const transformedGuesses = userGuesses.reduce((acc: any, guess: any) => {
            acc[guess.matchId] = {
              homeGoals: guess.homeGoals,
              awayGoals: guess.awayGoals,
              correctDirection: guess.correctDirection,
              exact: guess.exact,
            };
            return acc;
          }, {});          
    
          setGuesses(transformedGuesses);
        }
      } catch (error) {
        console.error('Error fetching matches or guesses:', error);
      } finally {
        setLoadingMatches(false);
      }
    };

    fetchMatchesAndGuesses();
  }, [dispatch, username]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveGuessesToDB();
    }, SAVE_GUESSES_FREQUENCY_MS);

    return () => clearTimeout(timer);
  }, [guesses]);

  const handleGuessChange = (matchId: number, homeGoals: number | null, awayGoals: number | null) => {
    setGuesses((prevGuesses) => ({
      ...prevGuesses,
      [matchId]: { 
        ...prevGuesses[matchId],
        homeGoals, 
        awayGoals 
      },
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
      }, SAVE_GUESSES_IDLE_WAIT_MS);

      setTimeout(() => {
        setSaveSuccess(false);
      }, SAVE_GUESSES_SAVING_ANIMATION_DURATION_MS);

    } catch (error) {
      console.error('Error saving guesses:', error);
      setSaving(false);
      setSaveSuccess(false);
    }
  };

  if (!username || !userId) {
    return <div>Loading user data...</div>;
  }

  if (loadingMatches) {
    return <div>Loading matches...</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.h2}>
        Upcoming Matches - GW {gameweek} {deadlinePassed && <LockIcon />}
      </h2>
      <div className={styles.header}>
        <CountdownTimer deadline={deadline!}/>
        <h4 className={styles.h4}>{process.env.REACT_APP_ACTIVE_SEASON}</h4>
      </div>

      <SyncIcon saving={saving} success={saveSuccess} />

      <ul className={styles["matches-list"]}>
        {Object.entries(groupedMatches).map(([kickoffTime, matches]) => (
          <React.Fragment key={kickoffTime}>
            <div className={styles.kickoffTime}>{kickoffTime}</div>
            {matches.map((match: any) => {
              const homeTeam = teams[match.homeTeam];
              const awayTeam = teams[match.awayTeam];

              const matchGuess = guesses[match.id] || {};

              const { homeGoals, awayGoals, correctDirection, exact } = matchGuess;

              const borderStyle = exact
                ? styles.exactBorder
                : correctDirection
                ? styles.correctDirectionBorder
                : '';                

              return (
                <li key={match.id} className={`${styles.match} ${borderStyle}`} style={{ opacity: deadlinePassed ? 0.5 : 1 }}>
                  <div className={styles.team} style={{ color: deadlinePassed ? '#b0bec5' : '#37474f' }}>
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
                    value={homeGoals ?? ''}
                    onChange={(e) =>
                      handleGuessChange(
                        match.id,
                        e.target.value === '' ? null : parseInt(e.target.value),
                        awayGoals ?? null
                      )
                    }
                    disabled={deadlinePassed}
                  />
                  <span className={styles.colon}>:</span>
                  <input
                    type="number"
                    placeholder="-"
                    className={styles.input}
                    value={awayGoals ?? ''}
                    onChange={(e) =>
                      handleGuessChange(
                        match.id,
                        homeGoals ?? null,
                        e.target.value === '' ? null : parseInt(e.target.value)
                      )
                    }
                    disabled={deadlinePassed}
                  />
                  <div className={styles.team} style={{ color: deadlinePassed ? '#b0bec5' : '#37474f' }}>
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
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default Home;

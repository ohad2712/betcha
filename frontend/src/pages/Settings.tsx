import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface UserStats {
  username: string;
  championships: number;
  cupWins: number;
}

const Settings = () => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await axios.get('/api/user/stats');
        setUserStats(response.data);
      } catch (error) {
        console.error('Failed to fetch user stats', error);
      }
    };

    fetchUserStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h2>Settings</h2>

      <h3>Logged in as: {userStats ? userStats.username : 'Loading...'}</h3>
      <button onClick={handleLogout}>Log out</button>

      <h3>Rules</h3>
      <p>
        {/* Replace this with actual rules */}
        The game is simple: you predict the number of goals each team will score for every match.
        Exact guesses earn 3 points, direction guesses earn 2 points, and wrong guesses earn 0
        points.
      </p>

      <h3>Statistics</h3>
      {userStats ? (
        <>
          <p>Championships won: {userStats.championships}</p>
          <p>Cup wins: {userStats.cupWins}</p>
        </>
      ) : (
        <p>Loading statistics...</p>
      )}
    </div>
  );
};

export default Settings;

// src/components/SettingsWidget.tsx
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/userSlice';
import './SettingsWidget.css';

const SettingsWidget: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [rules, setRules] = useState('');
  const [history, setHistory] = useState<{ [player: string]: { championships: number; cups: number } }>({});
  const username = useSelector((state: RootState) => state.user.username);
  const dispatch = useDispatch();
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSettingsData = async () => {
      try {
        // Fetch competition rules from the text file
        const response = await fetch('/rules.txt');
        const text = await response.text();
        setRules(text);

        // Fetch history data
        const historyResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/settings/history`);
        setHistory(historyResponse.data);
      } catch (error) {
        console.error('Error fetching settings data:', error);
      }
    };

    fetchSettingsData();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/login'; // Redirect to login page
  };

  // Close the widget when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={`settings-widget ${isOpen ? 'open' : ''}`} ref={widgetRef}>
      <button className="close-button" onClick={onClose}>×</button>
      <div>
        <h3>Account Information</h3>
        <p>Username: {username}</p>
        <button onClick={handleLogout}>Log Out</button>
      </div>
      <div>
        <h3>Competition Rules</h3>
        <pre>{rules}</pre> {/* Use <pre> for preserving formatting */}
      </div>
      <div>
        <h3>History</h3>
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Championships</th>
              <th>Cups</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(history).map(([player, stats]) => (
              <tr key={player}>
                <td>{player}</td>
                <td>{stats.championships}</td>
                <td>{stats.cups}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SettingsWidget;

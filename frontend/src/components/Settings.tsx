// src/components/Settings.tsx
import React, { useState } from 'react';
import axios from 'axios';

const Settings: React.FC = () => {
  const [username, setUsername] = useState('');
  const [emailPreferences, setEmailPreferences] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    try {
      const response = await axios.post('/api/settings/login', {
        username,
        emailPreferences,
        notificationPreferences,
      });
      setMessage('Settings updated successfully!');
    } catch (error) {
      setMessage('Error updating settings.');
      console.error('Error updating settings:', error);
    }
  };

  const handleLogout = () => {
    // Implement logout logic (e.g., clear tokens, redirect to login page)
    console.log('User logged out');
  };

  return (
    <div>
      <h2>Settings</h2>
      <div>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Email Preferences:
          <input
            type="checkbox"
            checked={emailPreferences}
            onChange={(e) => setEmailPreferences(e.target.checked)}
          />
        </label>
      </div>
      <div>
        <label>
          Notification Preferences:
          <input
            type="checkbox"
            checked={notificationPreferences}
            onChange={(e) => setNotificationPreferences(e.target.checked)}
          />
        </label>
      </div>
      <button onClick={handleSave}>Save Settings</button>
      <button onClick={handleLogout}>Log Out</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Settings;

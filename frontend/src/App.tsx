import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Home from './components/Home';
import ThisGameweek from './components/ThisGameweek';
import OverallTable from './components/OverallTable';
import Cup from './components/Cup';
import SettingsWidget from './components/SettingsWidget';
import ProtectedRoute from './components/ProtectedRoute';
import BottomNav from './components/BottomNav';
import UserInitials from './components/UserInitials';
import Login from './components/Login';

import UserProvider from './UserContext';
import { hydrate, login } from './store/userSlice';
import { RootState } from './store';
import Register from './components/Register';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.user.username);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    dispatch(hydrate());
    setIsHydrated(true);
  }, [dispatch]);

  const fetchUsername = () => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername && !username) {
      dispatch(login({ username: storedUsername })); // Dispatch login action if username isn't set
    }
  };

  fetchUsername();

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  console.log("Home", {isHydrated, username});
  
  if (!isHydrated) {
    return <div>Loading...</div>; // or a spinner/loading component
  }

  return (
    <UserProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute username={username}>
              <div className="app-container">
                <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="/this-gameweek" element={<ThisGameweek />} />
                  <Route path="/overall-table" element={<OverallTable />} />
                  <Route path="/cup" element={<Cup />} />
                </Routes>
                <BottomNav />
                <UserInitials username={username || ''} onOpenSettings={handleOpenSettings} />
                {isSettingsOpen && <SettingsWidget isOpen={isSettingsOpen} onClose={handleCloseSettings} />}
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </UserProvider>
  );
};

export default App;

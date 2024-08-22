import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import AuthPage from './components/AuthPage';
import Home from './components/Home';
import ThisGameweek from './components/ThisGameweek';
import OverallTable from './components/OverallTable';
import Cup from './components/Cup';
import SettingsWidget from './components/SettingsWidget';
import ProtectedRoute from './components/ProtectedRoute';
import BottomNav from './components/BottomNav';
import UserInitials from './components/UserInitials';

import UserProvider from './UserContext';
import { hydrate } from './store/userSlice';
import { RootState } from './store';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.user.username);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    dispatch(hydrate());
  }, [dispatch]);

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<AuthPage />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
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

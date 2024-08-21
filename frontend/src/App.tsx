import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import ThisGameweek from './components/ThisGameweek';
import OverallTable from './components/OverallTable';
import Cup from './components/Cup';
import Settings from './components/Settings';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import UserProvider from './UserContext';

const App: React.FC = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/this-gameweek" element={<ThisGameweek />} />
                <Route path="/overall-table" element={<OverallTable />} />
                <Route path="/cup" element={<Cup />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </UserProvider>
  );
};

export default App;

import { createSlice } from '@reduxjs/toolkit';

interface UserState {
  isAuthenticated: boolean;
  username: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  username: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.username = action.payload.username;
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', action.payload.username);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = null;
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('username');
    },
    hydrate: (state) => {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const username = localStorage.getItem('username');
      if (isAuthenticated && username) {
        state.isAuthenticated = isAuthenticated;
        state.username = username;
      }
    },
  },
});

export const { login, logout, hydrate } = userSlice.actions;
export default userSlice.reducer;

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
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;

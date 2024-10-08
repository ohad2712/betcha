import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface UserState {
  isAuthenticated: boolean;
  username: string | null;
  id: number | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  username: null,
  id: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {      
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.id = action.payload.id;
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', action.payload.username);
      localStorage.setItem('id', action.payload.id);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = null;
      state.id = null;
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('username');
      localStorage.removeItem('id');
      localStorage.removeItem('token');
    },
    hydrate: (state) => {
      const token = localStorage.getItem('token');
      const expirationTime = localStorage.getItem('tokenExpiration');
      const currentTime = Date.now();      

      if (token && expirationTime && currentTime < parseInt(expirationTime)) { 
        const decodedToken: any = jwtDecode(token);
        state.isAuthenticated = true;
        state.username = decodedToken.username;
        state.id = decodedToken.id;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {                
        state.isAuthenticated = false;
        state.username = null;
        state.id = null;
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
      }
    },
  },
});


export const { login, logout, hydrate } = userSlice.actions;
export default userSlice.reducer;

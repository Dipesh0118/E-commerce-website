import { createSlice } from '@reduxjs/toolkit';

// Enhanced localStorage parsing with cleanup
const getInitialUser = () => {
  try {
    const user = localStorage.getItem('user');
    // Handle "undefined" string case
    if (user === 'undefined') {
      localStorage.removeItem('user');
      return null;
    }
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Failed to parse user data from localStorage:', error);
    localStorage.removeItem('user'); // Cleanup corrupted data
    return null;
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: getInitialUser(),
    isAuthenticated: Boolean(getInitialUser()),
    status: 'idle',   // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
      try {
        localStorage.setItem('user', JSON.stringify(action.payload));
      } catch (error) {
        console.error('Failed to save user data to localStorage:', error);
      }
    },
    logout: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setCredentials, logout, setStatus, setError } = userSlice.actions;

export const selectCurrentUser = (state) => state.user.userInfo;
export const selectIsAdmin = (state) => state.user.userInfo?.role === 'admin';
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;

export default userSlice.reducer;
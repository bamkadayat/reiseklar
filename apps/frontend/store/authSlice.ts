import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/lib/api/auth.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean; // Track if auth check is complete
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitialized: false, // Start as false, set to true after first check
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isInitialized = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
  },
});

export const { setUser, clearUser, setInitialized } = authSlice.actions;
export default authSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isLoading: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
        state.user = action.payload;
    },
    logout: (state) => {
        state.user = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
  }
  },
});

export const { login, logout, setLoading } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const isLoading = (state) => state.auth.isLoading;

export default authSlice.reducer;

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

import AuthService from '../../services/authService';

/**
 * Social Login Thunk using Supabase OAuth
 */
export const socialLogin = createAsyncThunk(
  'auth/socialLogin',
  async (provider, {rejectWithValue}) => {
    try {
      const result = await AuthService.supabaseOAuth(provider);
      if (!result.success) {
        return rejectWithValue(result.error);
      }
      return {
        user: result.user,
        token: result.session?.access_token,
        provider: result.provider,
      };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

const initialState = {
  user: null,
  token: null,
  provider: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    setProvider(state, action) {
      state.provider = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.provider = null;
      state.status = 'idle';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(socialLogin.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(socialLogin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.provider = action.payload.provider;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(socialLogin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {setUser, setToken, setProvider, logout} = authSlice.actions;
export default authSlice.reducer;

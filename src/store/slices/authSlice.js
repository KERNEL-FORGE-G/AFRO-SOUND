import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

// Placeholder async thunks for social login flows. Actual implementation
// should use OAuth libraries (expo-auth-session / react-native-app-auth)
// or Supabase OAuth helpers.
export const socialLogin = createAsyncThunk('auth/socialLogin', async (provider, thunkAPI) => {
  // provider: 'google' | 'github' | 'spotify'
  // Implement OAuth flow in the app and return user object + token
  return {user: null, token: null, provider};
});

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

export const {setUser, setToken, logout} = authSlice.actions;
export default authSlice.reducer;

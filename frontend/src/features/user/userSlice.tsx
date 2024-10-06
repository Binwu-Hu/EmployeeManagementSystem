import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginUserApi } from '../../api/user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const token = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');

const initialState: UserState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

// Async action for logging in the user
export const loginUser = createAsyncThunk(
  'user/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);

      localStorage.setItem('token', response.token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: response._id,
          name: response.name,
          email: response.email,
          role: response.role,
        })
      );

      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      // localStorage.removeItem('token');
      // localStorage.removeItem('user');
      localStorage.clear();
      state.user = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = {
        id: action.payload._id,
        name: action.payload.name,
        email: action.payload.email,
        role: action.payload.role,
        token: action.payload.token,
      };
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;

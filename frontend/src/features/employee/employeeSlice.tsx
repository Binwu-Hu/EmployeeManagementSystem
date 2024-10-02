import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchEmployeeDetails } from '../../api/visaStatus';

// Initial state for employee slice
const initialState = {
  employee: null, // or define employee structure here
  loading: false,
  error: null,
};

// Async action to fetch employee details
export const fetchEmployee = createAsyncThunk(
  'employee/fetchEmployee',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await fetchEmployeeDetails(email); // API call by email
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    clearEmployee: (state) => {
      state.employee = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload;
      })
      .addCase(fetchEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
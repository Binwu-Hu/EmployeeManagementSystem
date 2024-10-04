import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';
import { fetchEmployeeDetails } from '../../api/visaStatus';

interface EmployeeState {
  employee: any | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: EmployeeState = {
  employee: null,
  loading: false,
  error: null,
};

export const fetchEmployeeByUserId = createAsyncThunk(
  'employee/fetchByUserId',
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/employees/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('employee:', response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Async action to fetch employee details
// export const fetchEmployee = createAsyncThunk(
//   'employee/fetchEmployee',
//   async (email: string, { rejectWithValue }) => {
//     try {
//       const response = await fetchEmployeeDetails(email); // API call by email
//       return response;
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

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
      .addCase(fetchEmployeeByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload;
      })
      .addCase(fetchEmployeeByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    //   .addCase(fetchEmployee.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(fetchEmployee.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.employee = action.payload;
    //   })
    //   .addCase(fetchEmployee.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload as string;
    //   });
  },
});

export const { clearEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;

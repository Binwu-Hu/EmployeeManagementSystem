import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Define Application interface (based on your model)
export interface Application {
  status: 'Pending' | 'Approved' | 'Rejected';
  feedback?: string;
  submittedAt?: string;
  employeeId: string;
}

// Define ApplicationState interface
export interface ApplicationState {
  applications: Application[];
  application: Application | null;
  loading: boolean;
  error: string | null;
  applicationMessage: string | null;
}

// Initial state
const initialState: ApplicationState = {
  applications: [],
  application: null,
  loading: false,
  error: null,
  applicationMessage: null,
};

// Thunk to fetch the application status
export const getApplicationStatus = createAsyncThunk(
  'application/getApplicationStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/application', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Return the data which contains applicationMessage and application
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.applicationMessage
          ? error.response.data.applicationMessage
          : error.applicationMessage
      );
    }
  }
);

// Thunk to fetch the application by employee ID
export const fetchApplicationByEmployeeId = createAsyncThunk(
  'application/fetchByEmployeeId',
  async (employeeId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/application/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.applicationMessage
          ? error.response.data.applicationMessage
          : error.applicationMessage
      );
    }
  }
);

// Thunk to fetch all applications (for HR)
export const fetchAllApplications = createAsyncThunk(
  'application/fetchAllApplications',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/application/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.applicationMessage
          ? error.response.data.applicationMessage
          : error.applicationMessage
      );
    }
  }
);

// Slice
const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    clearApplication: (state) => {
      state.application = null;
      state.applicationMessage = null; // Clear the applicationMessage when the application is cleared
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle getApplicationStatus
      .addCase(getApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.applicationMessage = null; // Clear previous applicationMessage when fetching begins
      })
      .addCase(getApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.application = action.payload.application || null;
        state.applicationMessage = action.payload.applicationMessage || null; // Store the applicationMessage from the response
      })
      .addCase(getApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Handle fetchApplicationByEmployeeId
      .addCase(fetchApplicationByEmployeeId.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.applicationMessage = null; // Clear previous applicationMessage when fetching begins
      })
      .addCase(fetchApplicationByEmployeeId.fulfilled, (state, action) => {
        state.loading = false;
        state.application = action.payload.application || null;
        state.applicationMessage = action.payload.applicationMessage || null; // Store the applicationMessage from the response
      })
      .addCase(fetchApplicationByEmployeeId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Handle fetchAllApplications
      .addCase(fetchAllApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.applicationMessage = null;
      })
      .addCase(fetchAllApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchAllApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearApplication } = applicationSlice.actions;
export default applicationSlice.reducer;

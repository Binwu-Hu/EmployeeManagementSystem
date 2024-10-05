import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Application {
  status: 'Pending' | 'Approved' | 'Rejected';
  feedback?: string;
  submittedAt?: string;
  employeeId: string;
  userId: string;
}

export interface ApplicationState {
  applications: Application[];
  application: Application | null;
  tokens: any[];
  loading: boolean;
  error: string | null;
  applicationMessage: string | null;
}

const initialState: ApplicationState = {
  applications: [],
  application: null,
  tokens: [],
  loading: false,
  error: null,
  applicationMessage: null,
};

export const fetchTokenList = createAsyncThunk(
  'application/fetchTokenList',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/application/tokenlist', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    clearApplication: (state) => {
      state.application = null;
      state.applicationMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.applicationMessage = null;
      })
      .addCase(getApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.application = action.payload.application || null;
        state.applicationMessage = action.payload.applicationMessage || null;
      })
      .addCase(getApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchApplicationByEmployeeId.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.applicationMessage = null;
      })
      .addCase(fetchApplicationByEmployeeId.fulfilled, (state, action) => {
        state.loading = false;
        state.application = action.payload.application || null;
        state.applicationMessage = action.payload.applicationMessage || null;
      })
      .addCase(fetchApplicationByEmployeeId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

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
      })

      .addCase(fetchTokenList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTokenList.fulfilled, (state, action) => {
        state.loading = false;
        state.tokens = action.payload;
      })
      .addCase(fetchTokenList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearApplication } = applicationSlice.actions;
export default applicationSlice.reducer;

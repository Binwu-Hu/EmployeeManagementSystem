import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchVisaStatusApi, fetchVisaStatusesApi, uploadVisaDocumentApi } from '../../api/visaStatus';
import { get, post, patch } from '../../api/base';

export const fetchVisaStatus = createAsyncThunk(
  'visaStatus/fetchVisaStatus',
  async (employeeId: string, { rejectWithValue }) => {
    try {
      const response = await fetchVisaStatusApi(employeeId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch all employees' visa statuses
export const fetchVisaStatuses = createAsyncThunk(
  'visaStatus/fetchVisaStatuses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchVisaStatusesApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Upload visa documents
export const uploadVisaDocument = createAsyncThunk(
  'visaStatus/uploadVisaDocument',
  async ({ employeeId, fileType, files }: { employeeId: string, fileType: string, files: File[] }, { rejectWithValue }) => {
    try {
      const response = await uploadVisaDocumentApi(employeeId, fileType, files);
      // console.log('response', response);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const approveOrRejectVisaDocument = createAsyncThunk(
  'visaStatus/approveOrRejectVisaDocument',
  async ({ employeeId, fileType, action }: { employeeId: string, fileType: string, action: string }) => {
    const response = await post(`/visa-status/approve/${employeeId}`, { fileType, action });
    return response;
  }
);

const visaStatusSlice = createSlice({
  name: 'visaStatus',
  initialState: {
    visaStatus: null,       // Single employee's visa status
    visaStatuses: [],       // All employees' visa statuses
    loading: false,
    error: null,
  },
  reducers: {
    clearVisaStatus: (state) => {
      state.visaStatus = null;
      state.visaStatuses = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch single visa status
      .addCase(fetchVisaStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVisaStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.visaStatus = action.payload;
      })
      .addCase(fetchVisaStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch all visa statuses
      .addCase(fetchVisaStatuses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVisaStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.visaStatuses = action.payload;  // Store all visa statuses
      })
      .addCase(fetchVisaStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload document
      .addCase(uploadVisaDocument.fulfilled, (state, action) => {
        state.visaStatus = action.payload;
      })
      // Approve or reject document
      .addCase(approveOrRejectVisaDocument.fulfilled, (state, action) => {
        state.visaStatus = action.payload;
      });
  }
});

export const { clearVisaStatus } = visaStatusSlice.actions;
export default visaStatusSlice.reducer;
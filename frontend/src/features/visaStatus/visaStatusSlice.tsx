import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, post } from '../../api/base';

export const fetchVisaStatus = createAsyncThunk(
  'visaStatus/fetchVisaStatus',
  async (employeeId: string) => {
    const response = await get(`/visa-status/${employeeId}`);
    console.log('visaStatus', response);
    return response;
  }
);

export const uploadVisaDocument = createAsyncThunk(
  'visaStatus/uploadVisaDocument',
  async ({ employeeId, fileType, files }: { employeeId: string, fileType: string, files: File[] }) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('fileType', fileType);
    const response = await post(`/visa-status/upload/${employeeId}`, formData);
    return response;
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
    visaStatus: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisaStatus.fulfilled, (state, action) => {
        state.visaStatus = action.payload;
      })
      .addCase(uploadVisaDocument.fulfilled, (state, action) => {
        state.visaStatus = action.payload;
      })
      .addCase(approveOrRejectVisaDocument.fulfilled, (state, action) => {
        state.visaStatus = action.payload;
      });
  }
});

export default visaStatusSlice.reducer;
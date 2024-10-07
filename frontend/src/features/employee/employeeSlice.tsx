import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { Employee } from '../../utils/type';
import axios from 'axios';

export interface EmployeeState {
  employees: Employee[];
  employee: Employee | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: EmployeeState = {
  employees: [],
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
      //   console.log('employee:', response.data);
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

export const updateEmployee = createAsyncThunk(
  'employee/updateEmployee',
  async (
    { userId, updatedData }: { userId: string; updatedData: Employee },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `/api/employees/user/${userId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('updated employee:', response.data);
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

export const fetchEmployees = createAsyncThunk(
  'employeeProfiles/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/employees', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch all employees'
      );
    }
  }
);

export const uploadEmployeeFile = createAsyncThunk(
  'employee/uploadFile',
  async (
    {
      userId,
      file,
      visaType,
    }: { userId: string; file: File; visaType: string },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token');

      // Prepare the form data for file upload
      const formData = new FormData();
      formData.append('file', file); // Append the file

      const response = await axios.post(
        `/api/employees/upload/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Required for file uploads
          },
        }
      );

      const { filePath, fileType } = response.data;
      return { filePath, fileType, visaType };
    } catch (error: any) {
      // Return the error message in case of failure
      return rejectWithValue(
        error.response?.data?.message || 'File upload failed'
      );
    }
  }
);

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setSelectedEmployee: (state, action) => {
      state.employee = action.payload;
    },
    clearEmployee: (state) => {
      state.employee = null;
      state.employees = [];
    },
    updateEmployeeField: (
      state,
      action: PayloadAction<{ field: string[]; value: any }>
    ) => {
      const { field, value } = action.payload;
      if (!state.employee) return;

      let currentField: any = state.employee; // Reference to traverse the employee object

      // Traverse through the field path, except for the last key
      for (let i = 0; i < field.length - 1; i++) {
        const key = field[i];
        if (Array.isArray(currentField)) {
          // If we're working with an array, ensure the index exists
          const index = parseInt(key, 10);
          if (isNaN(index) || index >= currentField.length) {
            return;
          }
          currentField = currentField[index];
        } else {
          // If it's an object, ensure the key exists
          if (!currentField[key]) {
            currentField[key] = {}; // Create a nested object if it doesn't exist
          }
          currentField = currentField[key];
        }
      }

      // Update the final key with the new value
      const lastKey = field[field.length - 1];
      if (Array.isArray(currentField)) {
        const index = parseInt(lastKey, 10);
        if (!isNaN(index) && index < currentField.length) {
          currentField[index] = value;
        }
      } else {
        currentField[lastKey] = value;
      }
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
      })
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadEmployeeFile.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(uploadEmployeeFile.fulfilled, (state, action) => {
        state.loading = false;
        if (state.employee) {
          const { filePath, fileType, visaType } = action.payload;
          if (fileType === '.pdf') {
            state.employee.workAuthorization.visaType = visaType;
            state.employee.workAuthorization.files.push(filePath);
          } else {
            state.employee.profilePicture = filePath;
          }
        }
      })
      .addCase(uploadEmployeeFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearEmployee, setSelectedEmployee, updateEmployeeField } = employeeSlice.actions;
export default employeeSlice.reducer;

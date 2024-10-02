import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import visaStatusReducer from '../features/visaStatus/visaStatusSlice';
import employeeReducer from '../features/employee/employeeSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    visaStatus: visaStatusReducer,
    employee: employeeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

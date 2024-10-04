import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import AppLayout from './components/Layout/Layout';
import ErrorPage from './pages/error/ErrorPage';
import HomePage from './pages/home/HomePage';
import Login from './pages/auth/Login';
import PrivateRoute from './components/PrivateRoute';
import SendRegistrationLink from './pages/protected/SendRegistrationLink';
import Signup from './pages/auth/Signup';
import VisaStatus from './pages/protected/VisaStatus';

const App = () => {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup/:token' element={<Signup />} />
          <Route path='/error' element={<ErrorPage />} />
          <Route
            path='/'
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path='/visa-status'
            element={
              <PrivateRoute>
                <VisaStatus />
              </PrivateRoute>
            }
          />
          {/* <Route
            path='/onboarding'
            element={
              <PrivateRoute requiredRole='Employee'>
                <Onboarding />
              </PrivateRoute>
            }
          />
          <Route
            path='/personal-info'
            element={
              <PrivateRoute requiredRole='Employee'>
                <PersonalInfo />
              </PrivateRoute>
            }
          />
          <Route
            path='/employee-profiles'
            element={
              <PrivateRoute requiredRole='HR'>
                <EmployeeProfiles />
              </PrivateRoute>
            }
          />
          <Route
            path='/hiring-management'
            element={
              <PrivateRoute requiredRole='HR'>
                <HiringManagement />
              </PrivateRoute>
            }
          /> */}
          <Route
            path='/send-registration-link'
            element={
              <PrivateRoute requiredRole='HR'>
                <SendRegistrationLink />
              </PrivateRoute>
            }
          />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;

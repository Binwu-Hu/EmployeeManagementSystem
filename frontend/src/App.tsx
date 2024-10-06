import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import AppLayout from './components/Layout/Layout';
import EmployeeProfiles from './pages/hr/EmployeeProfiles';
import ErrorPage from './pages/error/ErrorPage';
import HomePage from './pages/home/HomePage';
import Login from './pages/auth/Login';
import Onboarding from './pages/employee/Onboarding';
import PersonalInfo from './pages/employee/PersonalInfo';
import PrivateRoute from './components/PrivateRoute';
//import SendRegistrationLink from './pages/protected/SendRegistrationLink';
import Signup from './pages/auth/Signup';
import VisaStatus from './pages/employee/VisaStatus';
import HiringManagement from './pages/hr/HiringManagement';
import VisaStatusManagement from './pages/hr/VisaStatusManagement';
import ApplicationManagement from './pages/hr/ApplicationManagement';
// import LinkHistory from './pages/hr/LinkHistory';

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
            path='/visa-status/user/:id'
            element={
              <PrivateRoute requiredRole='Employee'>
                <VisaStatus />
              </PrivateRoute>
            }
          />
          <Route
            path='/onboarding/user/:id'
            element={
              <PrivateRoute requiredRole='Employee'>
                <Onboarding />
              </PrivateRoute>
            }
          />
          <Route
            path='/employees/user/:id'
            element={
              <PrivateRoute>
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
            path='/hiring/user/:userId'
            element={
              <PrivateRoute requiredRole='HR'>
                <ApplicationManagement />
              </PrivateRoute>
            }
          />
          <Route
            path='/visa-status-management'
            element={
              <PrivateRoute requiredRole='HR'>
                <VisaStatusManagement />
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
          />
          {/* <Route
            path='/link-history'
            element={
              <PrivateRoute requiredRole='HR'>
                <LinkHistory />
              </PrivateRoute>
            }
          /> */}
          {/* <Route
            path='/send-registration-link'
            element={
              <PrivateRoute requiredRole='HR'>
                <SendRegistrationLink />
              </PrivateRoute>
            }
          /> */}
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;

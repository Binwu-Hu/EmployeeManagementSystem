import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import SendRegistrationLink from './pages/protected/SendRegistrationLink';
import PrivateRoute from './components/PrivateRoute';
import AppLayout from './components/Layout/Layout';

const App = () => {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup/:token' element={<Signup />} />
          <Route 
            path='/send-registration-link' 
            element={
              <PrivateRoute>
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
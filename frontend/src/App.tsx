import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import SendRegistrationLink from './pages/auth/SendRegistrationLink';
import AppLayout from './components/Layout/Layout';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<AppLayout />}>
          <Route path='/login' element={<Login />} />
          <Route path='/signup/:token' element={<Signup />} />
          <Route path='/send-registration-link' element={<SendRegistrationLink />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
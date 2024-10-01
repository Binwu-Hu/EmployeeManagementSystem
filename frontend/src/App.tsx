import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import AppLayout from './components/Layout/Layout';

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path='/' element={<AppLayout />}>
          <Route path='/login' element={<LoginPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
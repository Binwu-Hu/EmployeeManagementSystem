import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import AppLayout from './components/Layout/Layout';

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path='/' element={<AppLayout />}>
          <Route path='/login' element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
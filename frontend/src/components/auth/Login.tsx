import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../app/store';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();  // Initialize the useNavigate hook
  const { loading, error: loginError } = useSelector((state: RootState) => state.user);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Dispatch the loginUser action
      await dispatch(loginUser({ email, password }));

      // Redirect to the home page upon successful login
      navigate('/');
    } catch (err) {
      setError('Login failed, please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      {loginError && <p className="error">{loginError}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
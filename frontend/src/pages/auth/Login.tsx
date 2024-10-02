import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Card } from 'antd';
import { loginUser, clearError } from '../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../app/store';
import AuthForm from '../../components/auth/Form';

const { Title, Text } = Typography;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.user);

  const handleSubmit = (values: { email: string; password: string }) => {
    dispatch(loginUser(values));  // Dispatch the loginUser action with form values
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');  // Redirect to home page if authenticated
    }
  }, [isAuthenticated, navigate]);

  // Clear error on component mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card style={{ width: 400, textAlign: 'center' }}>
        <Title level={3}>Login</Title>

        {/* Reusing the AuthForm for login */}
        <AuthForm formType="login" onSubmit={handleSubmit} loading={loading} />

        {/* Error Handling */}
        {error && <Text type="danger">{error}</Text>}
      </Card>
    </div>
  );
};

export default Login;
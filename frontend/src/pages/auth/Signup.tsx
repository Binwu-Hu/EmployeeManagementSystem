import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, message } from 'antd';
import AuthForm from '../../components/auth/Form';
import { signupUserApi } from '../../api/user'; 

const Signup: React.FC = () => {
  const { token } = useParams<{ token: string }>(); // Extract token from URL params
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      // Make signup API call with token and user details
      await signupUserApi({ ...values, token });
      message.success('Signup successful');
      navigate('/login');  // Redirect user to login page
    } catch (error: any) {
      console.log('Signup error:', error);
      message.error(error.message || 'Signup failed. Please try again.');
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card title="Sign Up" style={{ width: 400 }}>
        <AuthForm formType="signup" onSubmit={handleSubmit} loading={loading} />
      </Card>
    </div>
  );
};

export default Signup;
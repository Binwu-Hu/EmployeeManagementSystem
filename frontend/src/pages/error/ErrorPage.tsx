import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { WarningOutlined } from '@ant-design/icons';

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className='text-center'>
        <WarningOutlined
          style={{ fontSize: '96px', color: '#1890ff', marginBottom: '24px' }}
        />
        <h1 className='text-3xl font-semibold text-gray-800 mb-4'>
          Oops, something went wrong!
        </h1>
        <Button
          type='primary'
          className='text-white rounded-lg px-6 py-3'
          onClick={handleGoHome}
        >
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;

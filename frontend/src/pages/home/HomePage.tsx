import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

const HomePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>
        {user?.role === 'HR'
          ? 'This is home page for HR'
          : user?.role === 'Employee'
          ? 'This is home page for Employee'
          : 'Welcome to the Home Page'}
      </h1>
    </div>
  );
};

export default HomePage;
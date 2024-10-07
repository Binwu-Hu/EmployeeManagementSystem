import { Navigate, useParams } from 'react-router-dom';

import React from 'react';
import { RootState } from '../app/store';
import { useSelector } from 'react-redux';

interface PrivateRouteProps {
  children: JSX.Element;
  requiredRole?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to='/error' />;
  }

  if (id && storedUser?.id && id !== storedUser.id) {
    return <Navigate to='/error' />;
  }

  return children;
};
export default PrivateRoute;

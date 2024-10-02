import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

interface PrivateRouteProps {
  children: JSX.Element;
  requiredRole?: string; 
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
  
    if (requiredRole && user?.role !== requiredRole) {
      return <Navigate to="/error" />;
    }
  
    return children;
  };
export default PrivateRoute;
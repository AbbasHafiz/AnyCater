// ProtectedRoute.js
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import useAuth from '../../shared/hooks/useAuth';
import Unauthorized from './Unauthorized';

const ProtectedRoute = ({ element, requiredRole, ...rest }) => {
  const { isLoggedIn, role } = useAuth();
  console.log('isLoggedin?', isLoggedIn, 'role', role);

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Unauthorized />;
  }

  return (
    // Use Routes to wrap the Route component
    <Routes>
      <Route {...rest} element={element} />
    </Routes>
  );
};

export default ProtectedRoute;

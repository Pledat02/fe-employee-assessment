import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useRoleAccess } from '../hooks/useRoleAccess';

/**
 * Component redirect user về trang mặc định dựa trên role
 */
const RedirectToDefaultRoute: React.FC = () => {
  const { getDefaultRoute } = useRoleAccess();
  
  const defaultRoute = getDefaultRoute();
  
  return <Navigate to={defaultRoute} replace />;
};

export default RedirectToDefaultRoute;

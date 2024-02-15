import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token'); // Or your logic to check auth status
  
  if (!isAuthenticated) {
    // User not authenticated, redirect to login
    return <Navigate to="/login" />;
  }

  return children; // User is authenticated, render children components
};

export default ProtectedRoute;

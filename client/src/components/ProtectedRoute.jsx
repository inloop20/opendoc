import { useContext } from 'react';
import { Navigate } from 'react-router';
import { AuthContext } from '../features/auth/context/AuthContext'; 

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div className="loading-spinner">Loading session...</div>; 
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
import { useAppSelector } from '../../store/store';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAppSelector(state => state.auth);

  //  Wait for auth check to complete
  // If we have a token and are still loading, show spinner
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Verifying authentication...</p>
      </div>
    );
  }

  // After loading completes, check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated, render the protected content
  return <>{children}</>;
};

export default PrivateRoute;
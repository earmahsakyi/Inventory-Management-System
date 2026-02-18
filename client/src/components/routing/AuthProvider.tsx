// AuthProvider.tsx
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../store/store';
import { loadUser } from '../../store/authSlice';
import { Loader2 } from 'lucide-react';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await dispatch(loadUser()).unwrap();
      } catch (error) {
        // User not authenticated, that's okay
        
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
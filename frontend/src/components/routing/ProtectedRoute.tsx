// T044: Protected route components and auth guards
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { User } from '../../types/user';

interface ProtectedRouteProps {
  children: ReactNode;
  user: User | null;
  isLoading?: boolean;
}

export function ProtectedRoute({ children, user, isLoading }: ProtectedRouteProps) {
  const location = useLocation();

  if (isLoading) {
    return null; // Or a loading component
  }

  if (!user) {
    // Redirect to login with the current location as redirect target
    return (
      <Navigate
        to={`/auth/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return <>{children}</>;
}
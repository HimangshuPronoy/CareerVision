import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface RouteGuardProps {
  children: React.ReactNode;
  requiresSubscription?: boolean;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children, requiresSubscription = false }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Temporarily bypass subscription check
  const subscriptionStatus = { status: 'active', current_period_end: new Date(2099, 11, 31) };
  const isLoading = false;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Always allow access to protected routes
  return <>{children}</>;
};

export default RouteGuard;

import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUnlock } from '@/contexts/UnlockContext';
import { UnlockDialog } from './UnlockDialog';

interface RouteGuardProps {
  children: React.ReactNode;
  requiresSubscription?: boolean;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children, requiresSubscription = false }) => {
  const { user } = useAuth();
  const { isUnlocked } = useUnlock();
  const location = useLocation();
  const [showUnlockDialog, setShowUnlockDialog] = useState(!isUnlocked);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isUnlocked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <UnlockDialog 
          isOpen={true} 
          onClose={() => setShowUnlockDialog(false)} 
          disableClose={true}
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default RouteGuard;

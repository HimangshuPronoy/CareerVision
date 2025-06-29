
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Toggle this to true to enforce subscription paywall
const PAYWALL_ENABLED = false;

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, session, loading } = useAuth();
  const navigate = useNavigate();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [subLoading, setSubLoading] = useState(PAYWALL_ENABLED);
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(PAYWALL_ENABLED ? null : true);

  // First ensure user is authenticated. Then check subscription status once per mount.
  useEffect(() => {
    const checkSub = async () => {
      if (!PAYWALL_ENABLED) {
        setSubLoading(false);
        return;
      }
      if (!user || !session) {
        setShouldRedirect(true);
        navigate('/auth');
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('check-subscription');
        if (error) throw error;
        setIsSubscribed(data.subscribed);
      } catch (err) {
        console.error('Subscription check failed', err);
        setIsSubscribed(false);
      } finally {
        setSubLoading(false);
      }
    };

    if (!loading) {
      checkSub();
    }
  }, [user, session, loading, navigate]);

  if (loading || subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (shouldRedirect || !user || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // If paywall disabled, just render children
  if (!PAYWALL_ENABLED) {
    return <>{children}</>;
  }

  // If user is not subscribed, redirect to pricing page
  if (isSubscribed === false) {
    const timer = setTimeout(() => {
      navigate('/pricing');
    }, 100);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to pricing...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

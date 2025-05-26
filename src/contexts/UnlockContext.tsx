import React, { createContext, useContext, useEffect, useState } from 'react';

interface UnlockContextType {
  isUnlocked: boolean;
  unlockWithCode: (code: string) => boolean;
  remainingTime: number | null;
}

const UnlockContext = createContext<UnlockContextType | undefined>(undefined);

const UNLOCK_CODE = "4E21";
const UNLOCK_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
const STORAGE_KEY = "dev_unlock_expiry";

export function UnlockProvider({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  useEffect(() => {
    // Check localStorage for existing unlock expiry
    const expiryStr = localStorage.getItem(STORAGE_KEY);
    if (expiryStr) {
      const expiry = parseInt(expiryStr);
      if (expiry > Date.now()) {
        setIsUnlocked(true);
        setRemainingTime(expiry - Date.now());
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    // Set up timer to check remaining time
    const interval = setInterval(() => {
      const expiryStr = localStorage.getItem(STORAGE_KEY);
      if (expiryStr) {
        const expiry = parseInt(expiryStr);
        const remaining = expiry - Date.now();
        if (remaining > 0) {
          setRemainingTime(remaining);
        } else {
          setIsUnlocked(false);
          setRemainingTime(null);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const unlockWithCode = (code: string): boolean => {
    if (code === UNLOCK_CODE) {
      const expiry = Date.now() + UNLOCK_DURATION;
      localStorage.setItem(STORAGE_KEY, expiry.toString());
      setIsUnlocked(true);
      setRemainingTime(UNLOCK_DURATION);
      return true;
    }
    return false;
  };

  return (
    <UnlockContext.Provider value={{ isUnlocked, unlockWithCode, remainingTime }}>
      {children}
    </UnlockContext.Provider>
  );
}

export function useUnlock() {
  const context = useContext(UnlockContext);
  if (context === undefined) {
    throw new Error('useUnlock must be used within an UnlockProvider');
  }
  return context;
} 
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome!",
            description: "You've successfully signed in.",
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You've been signed out successfully.",
          });
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      console.log('Attempting to sign in with:', { email });
      
      // Try to sign in directly
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });
      
      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      if (!data?.user) {
        throw new Error('No user data received after successful sign in');
      }

      // After successful sign in, ensure profile exists
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          username: email,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });
      
      if (profileError) {
        console.error('Error ensuring profile exists:', profileError);
        // Don't throw here, as the user is already authenticated
      }
      
      console.log('Sign in successful:', { userId: data.user.id });
    } catch (error: any) {
      console.error('Sign in failed:', error);
      setError(error.message);
      
      // Provide more user-friendly error messages
      let errorMessage = error.message;
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'The email or password you entered is incorrect. Please try again.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email address before signing in.';
      }
      
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    try {
      setError(null);
      
      // First, check if email already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', email)
        .single();
      
      if (existingUser) {
        throw new Error('This email is already registered. Please use a different email or try logging in.');
      }
      
      if (checkError && checkError.code !== 'PGRST116') {
        // Only throw if it's not a "no rows returned" error
        console.error('Error checking existing user:', checkError);
      }

      // Proceed with signup
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/login`
        }
      });
      
      if (error) throw error;
      
      if (data && data.user) {
        // Try to create profile manually if needed
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              full_name: metadata?.full_name || '',
              username: email,
              updated_at: new Date().toISOString()
            });
          
          if (profileError && profileError.code !== '23505') { // Not a duplicate key error
            console.error('Manual profile creation error:', profileError);
          }
          
          // Also try to create user settings
          const { error: settingsError } = await supabase
            .from('user_settings')
            .insert({
              id: data.user.id
            });
          
          if (settingsError && settingsError.code !== '23505') { // Not a duplicate key error
            console.error('Manual user settings creation error:', settingsError);
          }
        } catch (err) {
          console.error('Error creating user profile manually:', err);
          // Continue anyway, as the user is created in auth
        }
      }
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully. Please check your email for verification.",
      });
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

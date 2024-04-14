import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase'; // Ensure this path is correct
import { User } from '@supabase/supabase-js'; // Import User type if it exists

export const useUser = () => {
  const [user, setUser] = useState<null | User>(null); // Specify the type for user state
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false); // Specify boolean type

  const checkUser = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        return;
      }
      const session = data.session;
      setUser(session?.user ?? null);
      setIsSignedIn(!!session);
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  }, []);

  useEffect(() => {
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setIsSignedIn(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [checkUser]);

  return { user, isSignedIn };
};

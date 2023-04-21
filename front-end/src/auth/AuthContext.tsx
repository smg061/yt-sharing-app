import React, { useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Session, User } from '@supabase/supabase-js'
import api from '../utils/api'


type AuthCtx = {
    user: Session | null,
    login: Login
    logout: () => void
}



type Login = (email: string, password: string) => Promise<{data: {
  user: User | null;
  session: Session | null;
} | {
  user: null;
  session: null;
}}>

export const login = async (email: string, password: string) => {
  const { data } = await supabase.auth.signInWithPassword({
      email,
      password,
  })
  return {
      data,
  }
}

const logout = async () => {
  await supabase.auth.signOut();
}

const AuthContext = React.createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Session | null>(null);
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const { data } = supabase.auth.onAuthStateChange(async(event, session) => {
          if(session) {
            const res = await api.setSession(session);
            console.log(res);
          }
          if (event === "SIGNED_IN" && session ) {
            setUser(session);
            setAuth(true);
          }
        });

        const getUser = async () => {
          const { data } = await supabase.auth.getSession();
          const { session: currentUser } = data;
          setUser(currentUser ?? null);
          setLoading(false);
        };
        getUser();
        return () => {
          data.subscription.unsubscribe();
        };
      }, []);
    
      return (
        <AuthContext.Provider value={{ user, login, logout }}>
          {children}
        </AuthContext.Provider>
      );
  };

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
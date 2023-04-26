import React, { useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

type AuthCtx = {
  loading: boolean;
  user: Session | null;
  login: Login;
  logout: () => void;
};

type Login = (
  email: string,
  password: string
) => Promise<{
  data:
    | {
        user: User | null;
        session: Session | null;
      }
    | {
        user: null;
        session: null;
      };
}>;

export const login = async (email: string, password: string) => {
  const { data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return {
    data,
  };
};

const logout = async () => {
  await supabase.auth.signOut();
  
};

const AuthContext = React.createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Session | null>(null);
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
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
  const logoutandRedirect = async () => {
    await logout();
    navigate("/");
  }
  return (
    <AuthContext.Provider value={{ loading, user, login, logout: logoutandRedirect }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

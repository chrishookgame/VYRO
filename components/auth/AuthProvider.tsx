"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  Session,
  User,
} from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextValue | null>(
    null,
  );

type Props = {
  children: ReactNode;
};

export function AuthProvider({
  children,
}: Props) {
  const [session, setSession] =
    useState<Session | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const {
        data,
      } =
        await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      setSession(
        data.session,
      );

      setLoading(false);
    }

    void loadSession();

    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        (_event, nextSession) => {
          setSession(
            nextSession,
          );

          setLoading(false);
        },
      );

    return () => {
      mounted = false;

      authListener.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();

    setSession(null);
  }

  const value =
    useMemo<AuthContextValue>(
      () => ({
        session,
        user:
          session?.user ?? null,
        loading,
        signOut,
      }),
      [session, loading],
    );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider.",
    );
  }

  return context;
}

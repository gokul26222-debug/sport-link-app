import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  preferred_sports: string[];
  skill_level: string | null;
  area: string | null;
}

interface AppState {
  isLoggedIn: boolean;
  user: SupabaseUser | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  // Prevent double-loading from getSession + onAuthStateChange race
  const initialised = useRef(false);

  const fetchProfile = async (userId: string) => {
    // Use maybeSingle() instead of single() — won't throw if no row
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (data) {
      setProfile({
        id: data.id,
        name: data.name,
        email: data.email,
        avatar_url: data.avatar_url,
        preferred_sports: data.preferred_sports || [],
        skill_level: data.skill_level,
        area: data.area,
      });
    } else {
      // Profile row missing (e.g. trigger failed for OAuth) — create it now
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const fallbackName =
          authUser.user_metadata?.name ||
          authUser.user_metadata?.full_name ||
          authUser.email?.split("@")[0] ||
          "Player";

        await supabase.from("profiles").upsert({
          id: userId,
          name: fallbackName,
          email: authUser.email || null,
          avatar_url: authUser.user_metadata?.avatar_url || null,
          preferred_sports: [],
        });

        setProfile({
          id: userId,
          name: fallbackName,
          email: authUser.email || null,
          avatar_url: authUser.user_metadata?.avatar_url || null,
          preferred_sports: [],
          skill_level: null,
          area: null,
        });
      }
    }
  };

  useEffect(() => {
    // Listen for auth state changes (handles OAuth redirects, token refresh, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Use setTimeout to avoid Supabase deadlock during OAuth callback
          setTimeout(() => fetchProfile(session.user.id), 0);
        } else {
          setProfile(null);
        }

        // Only set loading=false once
        if (!initialised.current) {
          initialised.current = true;
          setLoading(false);
        }
      }
    );

    // Also check current session immediately (handles page refresh)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!initialised.current) {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        }
        initialised.current = true;
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        // Don't set emailRedirectTo so Supabase uses project default
      },
    });

    if (!error && data.user) {
      // Manually create the profile immediately so user can use the app
      // even if email confirmation is pending
      await supabase.from("profiles").upsert({
        id: data.user.id,
        name,
        email,
        preferred_sports: [],
      });
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  };

  const signInWithApple = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: { redirectTo: window.location.origin },
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setUser(null);
    setSession(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    // Use upsert so it works even if the row doesn't exist yet
    await supabase.from("profiles").upsert({
      id: user.id,
      ...updates,
    });
    await fetchProfile(user.id);
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn: !!session,
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithApple,
        logout,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

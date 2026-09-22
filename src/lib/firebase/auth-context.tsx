'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from './config';
import { UserProfile } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isEmailVerified: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  verifyMagicLink: (email: string, href?: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  register: (email: string, pass: string, displayName: string, subscribeUpdates?: boolean) => Promise<{ needVerification: boolean }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateAccountName: (newName: string) => Promise<void>;
  toggleEmailSubscription: (subscribed: boolean) => Promise<void>;
  demoLoginAsUser: () => void;
  demoLoginAsAdmin: (secret?: string) => void;
}



const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync profile with backend API
  const syncWithBackend = async (uid: string, email: string, displayName: string) => {
    try {
      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: uid, email, display_name: displayName }),
      });
      if (res.status === 403 || res.status === 410) {
        // Account has been deleted by an administrator
        try {
          await signOut(auth);
        } catch (err) {}
        setUser(null);
        setProfile(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('project_she_demo_session');
        }
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      }
    } catch (e) {
      console.warn('Backend profile sync failed:', e);
    }
  };

  useEffect(() => {
    // Check for demo mock session in localStorage
    const savedDemo = typeof window !== 'undefined' ? localStorage.getItem('project_she_demo_session') : null;
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        setUser(parsed.user);
        setProfile(parsed.profile);
        setLoading(false);
        return;
      } catch (e) {}
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        await syncWithBackend(fbUser.uid, fbUser.email || '', fbUser.displayName || '');
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isEmailVerified = Boolean(user?.emailVerified);

  const login = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    setUser(cred.user);
    await syncWithBackend(cred.user.uid, cred.user.email || '', cred.user.displayName || '');
  };

  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    setUser(cred.user);
    await syncWithBackend(cred.user.uid, cred.user.email || '', cred.user.displayName || '');
  };

  const sendMagicLink = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const actionCodeSettings = {
      url: typeof window !== 'undefined' ? `${window.location.origin}/auth/verify` : 'http://localhost:3000/auth/verify',
      handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, cleanEmail, actionCodeSettings);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('emailForSignIn', cleanEmail);
    }
  };

  const verifyMagicLink = async (email: string, href?: string) => {
    const targetHref = href || (typeof window !== 'undefined' ? window.location.href : '');
    if (!isSignInWithEmailLink(auth, targetHref)) {
      throw new Error('This sign-in link is invalid or has expired.');
    }
    const cred = await signInWithEmailLink(auth, email.trim().toLowerCase(), targetHref);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('emailForSignIn');
    }
    setUser(cred.user);
    await syncWithBackend(cred.user.uid, cred.user.email || '', cred.user.displayName || '');
  };

  const register = async (email: string, pass: string, displayName: string, subscribeUpdates = true) => {
    const cleanEmail = email.trim().toLowerCase();
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
    if (cred.user) {
      await updateProfile(cred.user, { displayName });
      try {
        await sendEmailVerification(cred.user);
      } catch (err) {
        console.warn('Verification email dispatch failed:', err);
      }
      setUser(cred.user);
      await syncWithBackend(cred.user.uid, cleanEmail, displayName);
      if (!subscribeUpdates) {
        await toggleEmailSubscription(false);
      }
      return { needVerification: !cred.user.emailVerified };
    }
    return { needVerification: true };
  };

  const resendVerificationEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    } else {
      throw new Error('No user is currently signed in to receive a verification email.');
    }
  };


  const logout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('project_she_demo_session');
      localStorage.removeItem('project_she_admin_key');
    }
    try {
      await signOut(auth);
    } catch (e) {}
    setUser(null);
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      if (err.code === 'auth/api-key-not-valid' || !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        return; // Handled gracefully in mock mode
      }
      throw err;
    }
  };

  const updateAccountName = async (newName: string) => {
    if (user) {
      try {
        await updateProfile(user, { displayName: newName });
      } catch (e) {}
      if (profile) {
        await syncWithBackend(user.uid, user.email || '', newName);
      }
    }
  };

  const toggleEmailSubscription = async (subscribed: boolean) => {
    if (!profile) return;
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile.id, subscribed }),
      });
      if (res.ok) {
        setProfile((prev) => (prev ? { ...prev, email_subscribed: subscribed } : null));
      }
    } catch (e) {
      console.warn('Subscription toggle failed:', e);
    }
  };

  // Instant demo helper for testing user dashboard
  const demoLoginAsUser = () => {
    const mockUser: any = {
      uid: 'demo-user-survivor-ally',
      email: 'advocate.riya@gmail.com',
      displayName: 'Riya Sharma',
    };
    const mockProfile: UserProfile = {
      id: mockUser.uid,
      email: mockUser.email,
      display_name: mockUser.displayName,
      is_admin: false,
      email_subscribed: true,
      created_at: new Date().toISOString(),
    };
    setUser(mockUser);
    setProfile(mockProfile);
    localStorage.setItem('project_she_demo_session', JSON.stringify({ user: mockUser, profile: mockProfile }));
  };

  // Instant demo helper for testing single administrator command center
  const demoLoginAsAdmin = (secret = 'she_admin_secret_2026_goated') => {
    const adminUser: any = {
      uid: 'admin-project-she-single',
      email: 'admin@projectshe.org',
      displayName: 'Executive Director',
    };
    const adminProfile: UserProfile = {
      id: adminUser.uid,
      email: adminUser.email,
      display_name: adminUser.displayName,
      is_admin: true,
      email_subscribed: true,
      created_at: new Date().toISOString(),
    };
    setUser(adminUser);
    setProfile(adminProfile);
    localStorage.setItem('project_she_admin_key', secret);
    localStorage.setItem('project_she_demo_session', JSON.stringify({ user: adminUser, profile: adminProfile }));
  };

  const isAdmin = Boolean(profile?.is_admin || user?.email === 'admin@projectshe.org');

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        isEmailVerified,
        login,
        loginWithGoogle,
        sendMagicLink,
        verifyMagicLink,
        resendVerificationEmail,
        register,
        logout,
        resetPassword,
        updateAccountName,
        toggleEmailSubscription,
        demoLoginAsUser,
        demoLoginAsAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

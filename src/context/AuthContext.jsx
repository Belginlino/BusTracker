import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, isFirebaseConfigured } from '../services/firebase/config';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { ROLES } from '../utils/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children, initialRole = ROLES.PASSENGER }) {
  const [user, setUser] = useState(null);
  const [role, setRoleState] = useState(() => {
    return localStorage.getItem('transitpulse_role') || initialRole;
  });
  const [loading, setLoading] = useState(true);

  const setRole = (newRole) => {
    setRoleState(newRole);
    localStorage.setItem('transitpulse_role', newRole);
  };

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Mock mode default user
      setUser({
        uid: 'demo_user_1',
        email: 'demo@transitpulse.city',
        displayName: 'Demo Transit Operator',
      });
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    if (isFirebaseConfigured && auth) {
      return await signInWithEmailAndPassword(auth, email, password);
    }
    // Mock login
    const mockUser = {
      uid: 'demo_user_' + Date.now(),
      email,
      displayName: email.split('@')[0],
    };
    setUser(mockUser);
    return { user: mockUser };
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, setRole, login, logout, loading }}>
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

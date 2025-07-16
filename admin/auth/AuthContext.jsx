import React, { createContext, useContext, useEffect, useState } from 'react';
import { checkAuth } from './api';

const AuthContext = createContext({
  authed: false,
  loading: true,
  role: null,          // 'admin' | 'advocate' | null
  setAuthed: () => {},
  setLoading: () => {},
  setRole: () => {},
});

export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null); // New state

  useEffect(() => {
    let isMounted = true;

    checkAuth().then((res) => {
      if (isMounted) {
        setAuthed(res.ok);
        setRole(res.role);       // Set role from API
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ authed, loading, role, setAuthed, setLoading, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  return useContext(AuthContext);
}

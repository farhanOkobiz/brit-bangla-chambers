import { createContext, useContext, useEffect, useState } from 'react';
import { checkAuth } from './api';

const AuthContext = createContext({
  authed: false,
  loading: true,
  role: null, // 'admin' | 'advocate' | null
  userName: null,
  profilePhoto: null,          
  setAuthed: () => {},
  setLoading: () => {},
  setRole: () => {},
  setUserName: () => {},
  setProfilePhoto: () => {},
});

export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null); // New state
  const [userName, setUserName] = useState(null); // New state for user name
  const [profilePhoto, setProfilePhoto] = useState(null); // New state for profile photo

  useEffect(() => {
    let isMounted = true;

    checkAuth().then((res) => {
      console.log("Auth check response:", res);
      if (isMounted) {
        setAuthed(res.ok);
        setRole(res.role);       // Set role from API
        setUserName(res.userName || null); // Set user name from API"
        setProfilePhoto(res.profilePhoto || null); // Set profile photo from API
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ authed, loading, role, userName, profilePhoto, setAuthed, setLoading, setRole , setUserName, setProfilePhoto}}>
      {children}
    </AuthContext.Provider>
  );
}

export const UseAuth = () => useContext(AuthContext);


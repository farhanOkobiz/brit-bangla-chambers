import { createContext, useContext, useEffect, useState } from 'react';
import { checkAuth } from './api';

const AuthContext = createContext({
  authed: false,
  loading: true,
  role: null, // 'admin' | 'advocate' | null
  userName: null,
  profilePhoto: null,
  accountStatus: null, // 'active' | 'inactive' | 'suspended' | null          
  setAuthed: () => {},
  setLoading: () => {},
  setRole: () => {},
  setUserName: () => {},
  setProfilePhoto: () => {},
  setAccountStatus: () => {},
});

export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null); // New state
  const [userName, setUserName] = useState(null); // New state for user name
  const [profilePhoto, setProfilePhoto] = useState(null); // New state for profile photo
  const [accountStatus, setAccountStatus] = useState(null); // New state for account status

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
        setAccountStatus(res.accountStatus || null); // Set account status from API
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ authed, loading, role, userName, profilePhoto, accountStatus, setAuthed, setLoading, setRole , setUserName, setProfilePhoto, setAccountStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export const UseAuth = () => useContext(AuthContext);


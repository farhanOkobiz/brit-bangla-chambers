import { UseAuth } from './AuthContext';

export default function Auth() {
  const { authed, setAuthed, role, setRole , setUserName } = UseAuth();

  const handleLogout = () => {
    // Reset auth state
    setAuthed(false);
    setUserName(null); // Clear user name on logout
    setRole(null); // Clear role on logout
    
  };

  return (
    <nav>
      {authed ? (
        <>
          <span>Logged in as: <strong>{role}</strong></span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <span>Please login</span>
      )}
    </nav>
  );
}
0
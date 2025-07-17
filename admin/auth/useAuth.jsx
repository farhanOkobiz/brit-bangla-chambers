import { useAuth } from './AuthContext';

export default function Auth() {
  const { authed, setAuthed, role, setRole } = useAuth();

  const handleLogout = () => {
    // Reset auth state
    setAuthed(false);
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
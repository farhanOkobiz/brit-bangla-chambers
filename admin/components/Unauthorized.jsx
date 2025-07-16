import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>403 - Unauthorized</h1>
      <p style={styles.message}>You do not have permission to access this page.</p>
      <Link to="/login" style={styles.link}>Go to Login</Link>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '50px',
  },
  heading: {
    fontSize: '2rem',
    color: '#cc0000',
  },
  message: {
    fontSize: '1.2rem',
    margin: '20px 0',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

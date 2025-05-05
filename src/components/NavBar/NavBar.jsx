import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import styles from './NavBar.module.css';

const NavBar = () => {
  const { user, handleSignOut } = useContext(UserContext);

  return (
    <nav className={styles.container}>
      <div className={styles.title}>Jeoprady</div>
      <ul>
        <li><Link to="/">HOME</Link></li>
        {user ? (
          <>
            <li><Link to="/jeopardy">Jeopardy</Link></li>
            <li><Link to="/jeoprady/new">New Jeoprady</Link></li>
            <li><span onClick={handleSignOut}>Sign Out</span></li>
          </>
        ) : (
          <>
            <li><Link to="/sign-in">Sign In</Link></li>
            <li><Link to="/sign-up">Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
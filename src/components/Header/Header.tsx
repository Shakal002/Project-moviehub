import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link to="/movies" className={styles.logo}>
          <span className={styles.logoIcon}>🎞️</span>
          <span className={styles.logoText}>MovieHub</span>
        </Link>
        <nav className={styles.nav}>
          <Link 
            to="/movies" 
            className={`${styles.navLink} ${isActive('/movies') ? styles.active : ''}`}
          >
            Фильмы
          </Link>
          {user ? (
            <>
              <Link 
                to="/profile" 
                className={`${styles.navLink} ${isActive('/profile') ? styles.active : ''}`}
              >
                Профиль
              </Link>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Выйти
              </button>
            </>
          ) : (
            <Link to="/login" className={styles.loginBtn}>
              Войти
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
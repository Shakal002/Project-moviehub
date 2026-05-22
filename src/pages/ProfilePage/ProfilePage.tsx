import { useAuth } from '../../context/AuthContext';
import { useMovies } from '../../context/MoviesContext';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const { user } = useAuth();
  const { movies } = useMovies();

  if (!user) return null;

  const watchedCount = movies.filter((m) => m.watched).length;
  const favCount = movies.filter((m) => m.favorite).length;

  return (
    <main className={styles.container}>
      <div className={styles.card}>
      <div className={styles.avatar}>👤</div>
        <h3>Ваш профиль</h3>
        <div className={styles.info}>
          <p><strong>Имя:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{movies.length}</span>
            <span className={styles.statLabel}>всего фильмов</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{watchedCount}</span>
            <span className={styles.statLabel}>просмотрено</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{favCount}</span>
            <span className={styles.statLabel}>в избранном</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
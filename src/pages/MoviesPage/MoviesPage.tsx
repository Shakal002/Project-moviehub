import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMovies } from '../../context/MoviesContext';
import Tabs from '../../components/Tabs/Tabs';
import MovieCard from '../../components/MovieCard/MovieCard';
import AddMovieForm from '../../components/AddMovieForm/AddMovieForm';
import styles from './MoviesPage.module.css';

const TABS = [
  { key: 'all', label: 'Все' },
  { key: 'action', label: 'Боевики' },
  { key: 'drama', label: 'Драмы' },
  { key: 'comedy', label: 'Комедии' },
  { key: 'horror', label: 'Ужасы' },
  { key: 'scifi', label: 'Фантастика' },
  { key: 'favorites', label: '⭐ Избранное' },
  { key: 'watched', label: '✓ Просмотрено' },
];

const MoviesPage = () => {
  const { user } = useAuth();
  const { movies } = useMovies();
  const [activeTab, setActiveTab] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const filteredMovies = useMemo(() => {
    if (activeTab === 'favorites') return movies.filter((m) => m.favorite);
    if (activeTab === 'watched') return movies.filter((m) => m.watched);
    if (activeTab === 'all') return movies;
    return movies.filter((m) => m.genre === activeTab);
  }, [movies, activeTab]);

  const watchedCount = movies.filter((m) => m.watched).length;
  const favCount = movies.filter((m) => m.favorite).length;

  return (
    <main className={styles.container}>
      {/* Хиро-секция */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Моя коллекция
            <span className={styles.heroAccent}> фильмов</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Сохраняйте, оценивайте и отслеживайте просмотренные фильмы
          </p>
          
          {/* Статистика */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{movies.length}</span>
              <span className={styles.statLabel}>Всего</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{watchedCount}</span>
              <span className={styles.statLabel}>Просмотрено</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{favCount}</span>
              <span className={styles.statLabel}>В избранном</span>
            </div>
          </div>
        </div>
        <div className={styles.heroDecoration}>
          <span className={styles.heroEmoji}>🎥</span>
        </div>
      </div>

      {/* Вкладки */}
      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {/* Кнопка добавления */}
      {user ? (
        <button
          className={styles.addButton}
          onClick={() => setShowForm(!showForm)}
        >
          <span className={styles.addButtonIcon}>{showForm ? '−' : '+'}</span>
          {showForm ? 'Скрыть форму' : 'Добавить фильм'}
        </button>
      ) : (
        <div className={styles.authPrompt}>
          <span className={styles.authPromptIcon}>🔒</span>
          <div>
            <p className={styles.authPromptTitle}>Войдите в аккаунт</p>
            <p className={styles.authPromptText}>чтобы добавлять и редактировать фильмы</p>
          </div>
          <button className={styles.authButton} onClick={() => navigate('/login')}>
            Войти
          </button>
        </div>
      )}

      {/* Форма добавления */}
      {user && showForm && <AddMovieForm onCancel={() => setShowForm(false)} />}

      {/* Список фильмов */}
      {filteredMovies.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIconWrapper}>
            <span className={styles.emptyIcon}>🎬</span>
          </div>
          <h3>Здесь пока пусто</h3>
          <p>Добавьте первый фильм в свою коллекцию</p>
          {user && (
            <button className={styles.emptyButton} onClick={() => setShowForm(true)}>
              + Добавить фильм
            </button>
          )}
        </div>
      ) : (
        <>
          <p className={styles.resultCount}>
            Найдено: {filteredMovies.length} {filteredMovies.length === 1 ? 'фильм' : filteredMovies.length >= 2 && filteredMovies.length <= 4 ? 'фильма' : 'фильмов'}
          </p>
          <ul className={styles.movieGrid}>
            {filteredMovies.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </ul>
        </>
      )}
    </main>
  );
};

export default MoviesPage;
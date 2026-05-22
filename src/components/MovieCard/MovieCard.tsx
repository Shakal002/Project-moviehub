import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMovies } from '../../context/MoviesContext';
import type { Movie } from '../../types';
import styles from './MovieCard.module.css';

interface Props {
  movie: Movie;
}


const genreNames: Record<string, string> = {
  action: 'Боевик',
  drama: 'Драма',
  comedy: 'Комедия',
  horror: 'Ужасы',
  scifi: 'Фантастика',
};

const MovieCard = ({ movie }: Props) => {
  const { user } = useAuth();
  const { deleteMovie, toggleWatched, toggleFavorite } = useMovies();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Преобразуем 0/1 в boolean
  const isWatched = !!movie.watched;
  const isFavorite = !!movie.favorite;

  const firstLetter = movie.title.charAt(0).toUpperCase();

  return (
    <li className={styles.card}>
      <div className={styles.posterContainer}>
        {movie.poster && !imageError ? (
          <>
            {!imageLoaded && (
              <div className={styles.posterSkeleton}>
                <div className={styles.skeletonShimmer} />
              </div>
            )}
            <img
              src={movie.poster}
              alt={movie.title}
              className={`${styles.poster} ${imageLoaded ? styles.posterLoaded : ''}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
              loading="lazy"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </>
        ) : (
          <div className={styles.posterPlaceholder}>
            <span className={styles.posterLetter}>{firstLetter}</span>
            <span className={styles.posterSubtext}>Нет постера</span>
          </div>
        )}
        {isWatched && (
          <div className={styles.watchedBadge} title="Просмотрено">
            ✓
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{movie.title}</h3>
        <p className={styles.director}>{movie.director}</p>
        <div className={styles.meta}>
          <span className={styles.year}>{movie.year}</span>
          <span className={styles.dot}>•</span>
          <span className={styles.genre}>{genreNames[movie.genre] || movie.genre}</span>
        </div>
        <div className={styles.rating}>
          <span className={styles.starIcon}>★</span>
          <span className={styles.ratingValue}>{movie.rating}</span>
          <span className={styles.ratingMax}>/10</span>
        </div>
      </div>

      {user && (
        <div className={styles.actions}>
          <button
            className={`${styles.actionBtn} ${isWatched ? styles.actionActive : ''}`}
            onClick={() => toggleWatched(movie.id)}
            title={isWatched ? 'Убрать из просмотренных' : 'Отметить как просмотренный'}
          >
            {isWatched ? '✓' : '○'}
          </button>
          <button
            className={`${styles.actionBtn} ${isFavorite ? styles.actionFavorite : ''}`}
            onClick={() => toggleFavorite(movie.id)}
            title={isFavorite ? 'Убрать из избранного' : 'В избранное'}
          >
            {isFavorite ? '♥' : '♡'}
          </button>
          <button
            className={`${styles.actionBtn} ${styles.actionDelete}`}
            onClick={() => deleteMovie(movie.id)}
            title="Удалить"
          >
            ×
          </button>
        </div>
      )}
    </li>
  );
};

export default MovieCard;
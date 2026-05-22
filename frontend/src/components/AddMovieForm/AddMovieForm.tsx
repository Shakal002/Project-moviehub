import { useState } from 'react';
import { useMovies } from '../../context/MoviesContext';
import styles from './AddMovieForm.module.css';

interface Props {
  onCancel: () => void;
}

const AddMovieForm = ({ onCancel }: Props) => {
  const { addMovie } = useMovies();
  const [title, setTitle] = useState('');
  const [director, setDirector] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState<'action' | 'drama' | 'comedy' | 'horror' | 'scifi'>('drama');
  const [poster, setPoster] = useState('');
  const [rating, setRating] = useState('5');
  const [errors, setErrors] = useState<{ title?: string; director?: string; poster?: string }>({});
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewError, setPreviewError] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Обработчик изменения ссылки на постер
  const handlePosterChange = (url: string) => {
    setPoster(url);
    setPreviewError(false);
    setPreviewLoading(false);
    
    if (url.trim()) {
      // Проверяем, похоже ли на URL
      try {
        new URL(url);
        setPreviewUrl(url);
        setPreviewLoading(true);
        setErrors(prev => ({ ...prev, poster: undefined }));
        
        // Предзагружаем картинку для проверки
        const img = new Image();
        img.onload = () => {
          setPreviewLoading(false);
          setPreviewError(false);
        };
        img.onerror = () => {
          setPreviewLoading(false);
          setPreviewError(true);
        };
        img.src = url;
      } catch {
        setPreviewUrl('');
        setPreviewLoading(false);
        setErrors(prev => ({ ...prev, poster: 'Введите корректную ссылку (начинается с http:// или https://)' }));
      }
    } else {
      setPreviewUrl('');
      setPreviewLoading(false);
      setErrors(prev => ({ ...prev, poster: undefined }));
    }
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = 'Введите название';
    if (!director.trim()) newErrors.director = 'Укажите режиссёра';
    
    if (poster.trim()) {
      try {
        new URL(poster);
      } catch {
        newErrors.poster = 'Некорректная ссылка';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addMovie({
      title: title.trim(),
      director: director.trim(),
      year: parseInt(year) || new Date().getFullYear(),
      genre,
      poster: poster.trim() || undefined,
      rating: parseInt(rating) || 5,
      watched: false,
      favorite: false,
    });
    
    setTitle('');
    setDirector('');
    setYear('');
    setPoster('');
    setPreviewUrl('');
    setPreviewError(false);
    setPreviewLoading(false);
    onCancel();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3 className={styles.formTitle}>Добавить новый фильм</h3>
      
      <div className={styles.formGrid}>
        <div className={styles.formLeft}>
          <div className={styles.field}>
            <label className={styles.label}>Название фильма *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
              placeholder="Например: Интерстеллар"
            />
            {errors.title && <span className={styles.error}>{errors.title}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Режиссёр *</label>
            <input
              value={director}
              onChange={(e) => setDirector(e.target.value)}
              className={`${styles.input} ${errors.director ? styles.inputError : ''}`}
              placeholder="Кристофер Нолан"
            />
            {errors.director && <span className={styles.error}>{errors.director}</span>}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Год</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={styles.input}
                placeholder="2014"
                min="1888"
                max="2030"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Оценка</label>
              <div className={styles.ratingInput}>
                <input
                  type="number"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className={styles.input}
                  min="1"
                  max="10"
                />
                <span className={styles.ratingMax}>/10</span>
              </div>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Жанр</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value as any)}
              className={styles.select}
            >
              <option value="drama">🎭 Драма</option>
              <option value="action">💥 Боевик</option>
              <option value="comedy">😂 Комедия</option>
              <option value="horror">👻 Ужасы</option>
              <option value="scifi">🚀 Фантастика</option>
            </select>
          </div>
        </div>

        <div className={styles.formRight}>
          <div className={styles.field}>
            <label className={styles.label}>
              Ссылка на постер
              <span className={styles.labelHint}> (любой размер — подгонится автоматически)</span>
            </label>
            <input
              value={poster}
              onChange={(e) => handlePosterChange(e.target.value)}
              className={`${styles.input} ${errors.poster ? styles.inputError : ''}`}
              placeholder="https://example.com/poster.jpg"
            />
            {errors.poster && <span className={styles.error}>{errors.poster}</span>}
          </div>

          {/* Предпросмотр постера */}
          <div className={styles.previewContainer}>
            <p className={styles.previewLabel}>Предпросмотр:</p>
            <div className={`${styles.previewBox} ${previewUrl && !previewError ? styles.previewBoxActive : ''}`}>
              {!poster.trim() ? (
                <div className={styles.previewPlaceholder}>
                  <span className={styles.previewIcon}>📸</span>
                  <span className={styles.previewText}>Вставьте ссылку на постер</span>
                </div>
              ) : previewLoading ? (
                <div className={styles.previewPlaceholder}>
                  <div className={styles.spinner} />
                  <span className={styles.previewText}>Проверяем изображение...</span>
                </div>
              ) : previewError ? (
                <div className={styles.previewPlaceholder}>
                  <span className={styles.previewIcon}>❌</span>
                  <span className={styles.previewText}>Не удалось загрузить изображение</span>
                  <span className={styles.previewHint}>Проверьте ссылку или попробуйте другую</span>
                </div>
              ) : previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Предпросмотр постера"
                  className={styles.previewImage}
                  onError={() => setPreviewError(true)}
                  onLoad={() => setPreviewLoading(false)}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.buttons}>
        <button type="submit" className={styles.submitBtn}>
          ✅ Добавить фильм
        </button>
        <button type="button" onClick={onCancel} className={styles.cancelBtn}>
          Отмена
        </button>
      </div>
    </form>
  );
};

export default AddMovieForm;
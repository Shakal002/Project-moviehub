import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/movies');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.logoArea}>
          <span className={styles.icon}>✨</span>
          <h2>Регистрация</h2>
          <p className={styles.subtitle}>Создайте аккаунт, чтобы сохранять фильмы</p>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.field}>
          <label>Имя</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя" />
        </div>
        <div className={styles.field}>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" />
        </div>
        <div className={styles.field}>
          <label>Пароль</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••" />
        </div>
        <button type="submit" className={styles.btn} disabled={loading}>
          {loading ? 'Загрузка...' : 'Зарегистрироваться'}
        </button>
        <p className={styles.switch}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </form>
    </main>
  );
};

export default RegisterPage;
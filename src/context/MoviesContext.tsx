import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Movie } from '../types';
import API from '../api';
import { useAuth } from './AuthContext';

interface MoviesContextType {
  movies: Movie[];
  loading: boolean;
  addMovie: (movie: Omit<Movie, 'id'>) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;
  toggleWatched: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
}

const MoviesContext = createContext<MoviesContextType | undefined>(undefined);

export const MoviesProvider = ({ children }: { children: ReactNode }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchMovies = async () => {
    if (!token) {
      setMovies([]);
      return;
    }
    setLoading(true);
    try {
      const res = await API.get('/movies');
      setMovies(res.data);
    } catch (err) {
      console.error('Ошибка загрузки фильмов:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [token]);

  const addMovie = async (movieData: Omit<Movie, 'id'>) => {
    const res = await API.post('/movies', movieData);
    setMovies((prev) => [res.data, ...prev]);
  };

  const deleteMovie = async (id: string) => {
    await API.delete(`/movies/${id}`);
    setMovies((prev) => prev.filter((m) => m.id !== id));
  };

  const toggleFavorite = async (id: string) => {
    const res = await API.patch(`/movies/${id}/favorite`);
    setMovies((prev) => prev.map((m) => (m.id === id ? res.data : m)));
  };

  const toggleWatched = async (id: string) => {
    const res = await API.patch(`/movies/${id}/watched`);
    setMovies((prev) => prev.map((m) => (m.id === id ? res.data : m)));
  };

  return (
    <MoviesContext.Provider value={{ movies, loading, addMovie, deleteMovie, toggleWatched, toggleFavorite }}>
      {children}
    </MoviesContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MoviesContext);
  if (!context) throw new Error('useMovies must be used within MoviesProvider');
  return context;
};
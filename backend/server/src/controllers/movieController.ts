import { Response } from 'express';
import { v4 as uuid } from 'uuid';
import { MovieStore } from '../store';
import { AuthRequest } from '../middleware/auth';

export const getMovies = (req: AuthRequest, res: Response) => {
  try {
    res.json(MovieStore.findAllByUser(req.userId!));
  } catch {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const addMovie = (req: AuthRequest, res: Response) => {
  try {
    const { title, director, year, genre, poster, rating } = req.body;
    const movie = MovieStore.create({
      id: uuid(), userId: req.userId!, title, director,
      year: Number(year), genre, poster, rating: Number(rating) || 5,
      watched: 0, favorite: 0,
    });
    res.status(201).json(movie);
  } catch {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const updateMovie = (req: AuthRequest, res: Response) => {
  try {
    const movie = MovieStore.findById(req.params.id) as any;
    if (!movie || movie.userId !== req.userId!) return res.status(404).json({ message: 'Фильм не найден' });
    res.json(MovieStore.update(req.params.id, req.body));
  } catch {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const deleteMovie = (req: AuthRequest, res: Response) => {
  try {
    const movie = MovieStore.findById(req.params.id) as any;
    if (!movie || movie.userId !== req.userId!) return res.status(404).json({ message: 'Фильм не найден' });
    MovieStore.delete(req.params.id);
    res.json({ message: 'Фильм удалён' });
  } catch {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const toggleFavorite = (req: AuthRequest, res: Response) => {
  try {
    const movie = MovieStore.findById(req.params.id) as any;
    if (!movie || movie.userId !== req.userId!) return res.status(404).json({ message: 'Фильм не найден' });
    res.json(MovieStore.update(req.params.id, { favorite: movie.favorite ? 0 : 1 }));
  } catch {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const toggleWatched = (req: AuthRequest, res: Response) => {
  try {
    const movie = MovieStore.findById(req.params.id) as any;
    if (!movie || movie.userId !== req.userId!) return res.status(404).json({ message: 'Фильм не найден' });
    res.json(MovieStore.update(req.params.id, { watched: movie.watched ? 0 : 1 }));
  } catch {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
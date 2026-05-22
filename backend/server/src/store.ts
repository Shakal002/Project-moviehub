import db from './db';

export const UserStore = {
  findAll: () => db.prepare('SELECT * FROM users').all(),
  findByEmail: (email: string) => db.prepare('SELECT * FROM users WHERE email = ?').get(email),
  findById: (id: string) => db.prepare('SELECT * FROM users WHERE id = ?').get(id),
  create: (user: { id: string; name: string; email: string; password: string }) => {
    db.prepare('INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)').run(
      user.id, user.name, user.email, user.password
    );
    return user;
  },
};

export const MovieStore = {
  findAllByUser: (userId: string) =>
    db.prepare('SELECT * FROM movies WHERE userId = ? ORDER BY createdAt DESC').all(userId),
  findById: (id: string) => db.prepare('SELECT * FROM movies WHERE id = ?').get(id),
  create: (movie: {
    id: string; userId: string; title: string; director: string; year: number;
    genre: string; poster?: string; rating?: number; watched?: number; favorite?: number;
  }) => {
    db.prepare(
      `INSERT INTO movies (id, userId, title, director, year, genre, poster, rating, watched, favorite)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(movie.id, movie.userId, movie.title, movie.director, movie.year, movie.genre,
      movie.poster || '', movie.rating || 5, movie.watched ? 1 : 0, movie.favorite ? 1 : 0);
    return movie;
  },
  update: (id: string, updates: Record<string, any>) => {
    const keys = Object.keys(updates);
    if (keys.length === 0) return null;
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => updates[k]);
    db.prepare(`UPDATE movies SET ${setClause} WHERE id = ?`).run(...values, id);
    return db.prepare('SELECT * FROM movies WHERE id = ?').get(id);
  },
  delete: (id: string) => {
    db.prepare('DELETE FROM movies WHERE id = ?').run(id);
  },
};
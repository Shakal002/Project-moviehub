import dotenv from 'dotenv';
dotenv.config();

// Импортируем db, чтобы он инициализировался
import './db';
import app from './app';

const PORT = process.env.PORT || 5000;

// Даём время на инициализацию sql.js
setTimeout(() => {
  app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
  });
}, 100);
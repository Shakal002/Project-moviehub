import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'data', 'moviehub.db');

const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db: Database;

// Загружаем или создаём базу
const buffer = fs.existsSync(DB_PATH) ? fs.readFileSync(DB_PATH) : null;

initSqlJs().then((SQL) => {
  db = new SQL.Database(buffer);

  // Создаём таблицы, если их нет
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS movies (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      title TEXT NOT NULL,
      director TEXT NOT NULL,
      year INTEGER NOT NULL,
      genre TEXT NOT NULL,
      poster TEXT DEFAULT '',
      rating INTEGER DEFAULT 5,
      watched INTEGER DEFAULT 0,
      favorite INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now'))
    );
  `);

  saveDB();
  console.log('SQLite база данных готова');
});

// Сохранение БД в файл
function saveDB() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

// Экспортируем объект с теми же методами, что и раньше
export default {
  prepare: (sql: string) => {
    return {
      all: (...params: any[]) => {
        const stmt = db.prepare(sql);
        if (params.length) stmt.bind(params);
        const results: any[] = [];
        while (stmt.step()) {
          results.push(stmt.getAsObject());
        }
        stmt.free();
        saveDB();
        return results;
      },
      get: (...params: any[]) => {
        const stmt = db.prepare(sql);
        if (params.length) stmt.bind(params);
        let result = null;
        if (stmt.step()) {
          result = stmt.getAsObject();
        }
        stmt.free();
        saveDB();
        return result;
      },
      run: (...params: any[]) => {
        const stmt = db.prepare(sql);
        if (params.length) stmt.bind(params);
        stmt.step();
        stmt.free();
        saveDB();
      },
    };
  },
  exec: (sql: string) => {
    db.run(sql);
    saveDB();
  },
};
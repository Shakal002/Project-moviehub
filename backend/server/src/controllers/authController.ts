import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { UserStore } from '../store';

const generateToken = (id: string) =>
  jwt.sign({ userId: id }, process.env.JWT_SECRET!, { expiresIn: '30d' });

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Заполните все поля' });

    if (UserStore.findByEmail(email))
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });

    const hashed = await bcrypt.hash(password, 10);
    const user = UserStore.create({ id: uuid(), name, email, password: hashed });

    res.status(201).json({ id: user.id, name: user.name, email: user.email, token: generateToken(user.id) });
  } catch {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = UserStore.findByEmail(email) as any;
    if (!user) return res.status(401).json({ message: 'Неверный email или пароль' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Неверный email или пароль' });

    res.json({ id: user.id, name: user.name, email: user.email, token: generateToken(user.id) });
  } catch {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
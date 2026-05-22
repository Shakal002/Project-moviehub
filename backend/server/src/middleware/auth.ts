import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ message: 'Нет токена' });

  try {
    const { userId } = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET!) as any;
    req.userId = userId;
    next();
  } catch {
    res.status(401).json({ message: 'Токен недействителен' });
  }
};

export default authMiddleware;
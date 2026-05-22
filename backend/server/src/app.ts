import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth';
import movieRoutes from './routes/movies';
import errorHandler from './middleware/errorHandler';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use(errorHandler);
export default app;
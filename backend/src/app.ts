import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import quizRoutes from './routes/quizRoutes';
import redisService from './services/redisService';

import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

dotenv.config();

const app: Application = express();

app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') 
    : true,
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', async (req, res) => {
  try {
    // Check Redis connection
    const redisStatus = redisService.isConnected() ? 'connected' : 'disconnected';
    const redisPing = redisService.isConnected() ? await redisService.ping() : 'unavailable';
    
    res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        redis: {
          status: redisStatus,
          ping: redisPing
        }
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      error: 'Service health check failed',
      services: {
        redis: {
          status: 'error',
          ping: 'failed'
        }
      }
    });
  }
});

app.use('/api/v1', quizRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
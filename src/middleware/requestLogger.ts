import morgan from 'morgan';
import { env } from '../config/env';

// Concise coloured output in dev, structured in production
export const requestLogger = morgan(
  env.NODE_ENV === 'production' ? 'combined' : 'dev'
);

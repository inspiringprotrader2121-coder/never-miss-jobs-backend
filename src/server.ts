import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { env } from './config/env';
import { authRouter } from './modules/auth/auth.routes';
import { aiRouter } from './modules/ai/ai.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

app.use(
  cors({
    origin: env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',') : undefined
  })
);

app.use(compression());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRouter);
app.use('/ai', aiRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Never Miss Another Job System API listening on port ${env.PORT}`
  );
});


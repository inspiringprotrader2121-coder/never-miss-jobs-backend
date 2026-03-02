import { initSentry } from './config/sentry';
initSentry(); // Must be called before anything else

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { env } from './config/env';
import { authRouter } from './modules/auth/auth.routes';
import { aiRouter } from './modules/ai/ai.routes';
import { billingRouter } from './modules/billing/billing.routes';
import { handleStripeWebhook } from './modules/billing/billing.webhook';
import { bookingRouter } from './modules/booking/booking.routes';
import { smsRouter } from './modules/sms/sms.routes';
import { crmRouter } from './modules/crm/crm.routes';
import { businessRouter } from './modules/business/business.routes';
import { voiceRouter } from './modules/voice/voice.routes';
import { setupRouter } from './modules/setup/setup.routes';
import { startAppointmentReminderJob } from './jobs/appointmentReminders';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { apiLimiter, authLimiter } from './middleware/rateLimiter';

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
app.use(requestLogger);

// Stripe webhook must receive raw body AND must be before apiLimiter
// to avoid Stripe retries being rate-limited
app.post(
  '/billing/webhook',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
);

app.use(apiLimiter);

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authLimiter, authRouter);
app.use('/ai', aiRouter);
app.use('/billing', billingRouter);
app.use('/bookings', bookingRouter);
app.use('/crm/leads', crmRouter);
app.use('/business', businessRouter);
app.use('/voice', voiceRouter);
app.use('/sms', smsRouter);
app.use('/setup', setupRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`TradeBooking API listening on port ${env.PORT}`);
  startAppointmentReminderJob();
});


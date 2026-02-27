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
import { startAppointmentReminderJob } from './jobs/appointmentReminders';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { apiLimiter, authLimiter, publicChatLimiter, twilioWebhookLimiter } from './middleware/rateLimiter';

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
app.use(apiLimiter);

// Stripe webhook must receive raw body - mount before express.json()
app.post(
  '/billing/webhook',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
);

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authLimiter, authRouter);
app.use('/ai/public', publicChatLimiter);
app.use('/ai', aiRouter);
app.use('/billing', billingRouter);
app.use('/bookings', bookingRouter);
app.use('/crm/leads', crmRouter);
app.use('/business', businessRouter);
app.use('/voice', twilioWebhookLimiter, voiceRouter);
app.use('/sms', twilioWebhookLimiter, smsRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`TradeBooking API listening on port ${env.PORT}`);
  startAppointmentReminderJob();
});


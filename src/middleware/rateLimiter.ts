import rateLimit from 'express-rate-limit';

// Strict limiter for auth endpoints — prevents brute force
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later' }
});

// Limiter for public AI widget — prevents abuse
export const publicChatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many messages, please slow down' }
});

// Twilio webhook limiter — Twilio sends from a known IP range but we still
// cap to 60 req/min per IP to prevent replay / spoofing abuse
export const twilioWebhookLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many webhook requests' }
});

// General API limiter for all other routes
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later' }
});

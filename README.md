# TradeBooking – Backend API

Multi-tenant SaaS backend for UK trades (plumbers, electricians, roofers).  
AI chat, lead qualification, appointment booking, SMS confirmations, Stripe subscriptions.

**Domain:** [tradebooking.co.uk](https://tradebooking.co.uk)  
**API:** `https://api.tradebooking.co.uk`

## Stack

- **Runtime:** Node.js, TypeScript
- **Framework:** Express
- **Database:** PostgreSQL, Prisma ORM
- **Auth:** JWT, bcrypt
- **Integrations:** Stripe, Twilio, OpenAI (Phase 1/2)

## Setup (local)

1. **Clone and install**

   ```bash
   git clone <repo-url> .
   npm install
   ```

2. **Environment**

   ```bash
   cp .env.example .env
   # Edit .env: set DATABASE_URL and JWT_SECRET at minimum
   ```

3. **Database**

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Run**

   ```bash
   npm run dev
   ```

   API: `http://localhost:4000`  
   Health: `GET /health`  
   Auth: `POST /auth/register`, `POST /auth/login`

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/auth/register` | Public | Register business + owner |
| POST | `/auth/login` | Public | Login, get JWT |
| POST | `/ai/chat` | JWT | Dashboard AI chat |
| POST | `/ai/public/chat/:businessId` | Public | Website widget chat |
| GET | `/billing/subscription` | OWNER | Current subscription |
| POST | `/billing/checkout-session` | OWNER | Start Stripe checkout |
| POST | `/billing/webhook` | Stripe | Subscription lifecycle |
| GET | `/bookings` | JWT | List appointments |
| POST | `/bookings` | JWT | Create + SMS confirm |
| PATCH | `/bookings/:id` | JWT | Update appointment |
| PATCH | `/bookings/:id/cancel` | JWT | Cancel appointment |
| GET | `/sms/logs` | JWT | SMS log history |
| GET | `/crm/leads` | JWT | List leads |
| GET | `/crm/leads/:id` | JWT | Lead detail + history |
| PATCH | `/crm/leads/:id` | JWT | Update lead |
| DELETE | `/crm/leads/:id` | JWT | Archive lead |
| GET | `/business` | JWT | Business profile |
| GET | `/business/ai-settings` | JWT | AI settings |
| PATCH | `/business` | OWNER/ADMIN | Update business |
| PATCH | `/business/ai-settings` | OWNER/ADMIN | Update AI config |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (ts-node-dev) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run production build |
| `npx prisma migrate dev` | Apply migrations (dev) |
| `npx prisma migrate deploy` | Apply migrations (prod) |

## Production

- Use managed PostgreSQL; set `DATABASE_URL` and `JWT_SECRET` in production env.
- Run `npx prisma migrate deploy` then `npm run build` and `npm start`.
- Run behind Nginx with HTTPS; set `CORS_ORIGIN=https://tradebooking.co.uk`.

## License

ISC

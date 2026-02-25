<<<<<<< HEAD
# never-miss-jobs-backend
=======
# Never Miss Another Job System – Backend

Multi-tenant SaaS backend for UK trades (plumbers, electricians, roofers): AI chat, lead qualification, booking, SMS, Stripe subscriptions.

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
   Protected: `GET /ai/test-protected` (header: `Authorization: Bearer <token>`)

## Scripts

| Command              | Description                    |
|----------------------|--------------------------------|
| `npm run dev`        | Start dev server (ts-node-dev) |
| `npm run build`      | Compile TypeScript to `dist/`   |
| `npm start`          | Run production build            |
| `npx prisma migrate dev`  | Apply migrations (dev)    |
| `npx prisma migrate deploy` | Apply migrations (prod)  |

## Production

- Use managed PostgreSQL; set `DATABASE_URL` and `JWT_SECRET` in production env.
- Run `npx prisma migrate deploy` then `npm run build` and `npm start`.
- Run behind Nginx (or similar) with HTTPS; set `CORS_ORIGIN` to your frontend domain(s).

## License

ISC
>>>>>>> bfe38b5 (Add .env.example, README, and update .gitignore)

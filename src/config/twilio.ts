import twilio from 'twilio';
import { env } from './env';

let client: ReturnType<typeof twilio> | null = null;

export function getTwilioClient(): ReturnType<typeof twilio> {
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN) {
    throw new Error('TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are not configured');
  }

  if (!client) {
    client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
  }

  return client;
}

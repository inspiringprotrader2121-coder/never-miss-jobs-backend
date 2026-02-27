import { google } from 'googleapis';
import { env } from './env';

/**
 * Returns an OAuth2 client pre-configured with TradeBooking's credentials.
 * Each business stores their own refresh token in the Business record.
 */
export function getOAuth2Client(refreshToken?: string) {
  const client = new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_REDIRECT_URI
  );

  if (refreshToken) {
    client.setCredentials({ refresh_token: refreshToken });
  }

  return client;
}

/**
 * Returns the URL the business owner must visit once to grant calendar access.
 */
export function getAuthUrl(): string {
  const client = getOAuth2Client();
  return client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/calendar.events']
  });
}

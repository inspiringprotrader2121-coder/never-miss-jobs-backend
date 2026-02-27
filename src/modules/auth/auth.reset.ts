import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from '../../config/prisma';
import { AppError } from '../../middleware/errorHandler';
import { sendEmail } from '../../config/mailer';
import { env } from '../../config/env';

const RESET_TOKEN_EXPIRY_HOURS = 2;

const requestResetSchema = z.object({
  email: z.string().email()
});

const confirmResetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8)
});

/**
 * Generates a reset token and emails it to the user.
 * Always returns 200 even if the email doesn't exist (prevents user enumeration).
 */
export async function requestPasswordReset(rawInput: unknown): Promise<void> {
  const { email } = requestResetSchema.parse(rawInput);

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return; // Silent — don't reveal whether email exists

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: token,
      passwordResetExpiresAt: expiresAt
    }
  });

  const resetUrl = `${env.APP_URL}/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: 'Reset your TradeBooking password',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
        <h2 style="color:#1e293b;">Reset your password</h2>
        <p>Hi ${user.fullName},</p>
        <p>We received a request to reset your TradeBooking password. Click the button below to choose a new password.</p>
        <p style="margin:24px 0;">
          <a href="${resetUrl}"
             style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">
            Reset Password
          </a>
        </p>
        <p style="color:#64748b;font-size:13px;">
          This link expires in ${RESET_TOKEN_EXPIRY_HOURS} hours.<br>
          If you didn't request this, you can safely ignore this email.
        </p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
        <p style="color:#94a3b8;font-size:12px;">TradeBooking · tradebooking.co.uk</p>
      </div>
    `,
    text: `Reset your TradeBooking password: ${resetUrl}\n\nThis link expires in ${RESET_TOKEN_EXPIRY_HOURS} hours.`
  });
}

/**
 * Validates the token and sets the new password.
 */
export async function confirmPasswordReset(rawInput: unknown): Promise<void> {
  const { token, password } = confirmResetSchema.parse(rawInput);

  const user = await prisma.user.findUnique({
    where: { passwordResetToken: token }
  });

  if (!user || !user.passwordResetExpiresAt) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  if (user.passwordResetExpiresAt < new Date()) {
    throw new AppError('This reset link has expired. Please request a new one.', 400);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpiresAt: null
    }
  });
}

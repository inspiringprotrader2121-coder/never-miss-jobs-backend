import type { Request, Response, NextFunction } from 'express';
import { SmsDirection, SmsStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { handleChat } from '../ai/ai.service';

/**
 * Twilio inbound SMS webhook.
 * URL: POST /sms/inbound/:businessId
 * Configure in Twilio console → Phone Numbers → Messaging webhook.
 */
export async function handleInboundSms(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { businessId } = req.params;
    const { From, Body, MessageSid } = req.body as {
      From: string;
      Body: string;
      MessageSid: string;
    };

    if (!From || !Body || !businessId) {
      res.type('text/xml').send('<Response/>');
      return;
    }

    // Log the inbound message
    await prisma.smsLog.create({
      data: {
        businessId,
        toPhone: req.body.To ?? '',
        fromPhone: From,
        body: Body,
        status: SmsStatus.DELIVERED,
        direction: SmsDirection.INBOUND,
        providerMessageId: MessageSid
      }
    });

    // Pass to AI chat as a public widget message (no auth needed)
    let replyText: string;

    try {
      const result = await handleChat(
        { businessId, source: 'publicWidget' },
        { message: Body }
      );
      replyText = result.reply;
    } catch {
      replyText = 'Thanks for your message. We will get back to you shortly.';
    }

    // Respond with TwiML so Twilio sends the reply as an SMS
    res.type('text/xml').send(
      `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(replyText)}</Message></Response>`
    );
  } catch (err) {
    next(err);
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

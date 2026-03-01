import { prisma } from '../../config/prisma';
import { sendSms } from '../sms/sms.service';

interface TwilioCallParams {
  CallSid: string;
  From: string;
  To: string;
  CallStatus: string;
  BusinessId?: string;
}

interface TwilioRecordingParams {
  CallSid: string;
  RecordingUrl: string;
  RecordingDuration: string;
  TranscriptionText?: string;
}

/**
 * Called when Twilio hits the /voice/incoming webhook.
 * Returns TwiML that either connects the call or captures a voicemail.
 */
export async function handleIncomingCall(
  params: TwilioCallParams,
  businessId: string
): Promise<string> {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: { aiSettings: true }
  });

  if (!business) {
    return buildTwiml('<Say>Sorry, this number is not configured. Goodbye.</Say><Hangup/>');
  }

  const isAfterHours = isOutsideWorkingHours(
    business.aiSettings?.workingHoursJson ?? null,
    business.aiSettings?.timezone ?? 'Europe/London'
  );

  // Create a VOICE conversation record
  await prisma.conversation.create({
    data: {
      businessId,
      type: 'VOICE',
      twilioCallSid: params.CallSid,
      fromNumber: params.From,
      toNumber: params.To,
      isAfterHours
    }
  });

  if (isAfterHours) {
    const afterHoursMsg =
      business.aiSettings?.afterHoursMessage ??
      `Thanks for calling ${business.name}. We are currently closed. Please leave a message after the tone and we will call you back.`;

    return buildTwiml(`
      <Say voice="alice">${escapeXml(afterHoursMsg)}</Say>
      <Record
        maxLength="120"
        transcribe="true"
        transcribeCallback="/voice/transcription/${businessId}"
        action="/voice/recording/${businessId}"
        playBeep="true"
      />
    `);
  }

  // During working hours — forward to the business owner's phone number
  if (!business.phoneNumber) {
    // No forwarding number configured — go straight to voicemail
    return buildTwiml(`
      <Say voice="alice">Thanks for calling ${escapeXml(business.name)}. Please leave a message after the tone.</Say>
      <Record
        maxLength="120"
        transcribe="true"
        transcribeCallback="/voice/transcription/${businessId}"
        action="/voice/recording/${businessId}"
        playBeep="true"
      />
    `);
  }

  return buildTwiml(`
    <Say voice="alice">Thanks for calling ${escapeXml(business.name)}. Connecting you now.</Say>
    <Dial timeout="30">
      <Number>${escapeXml(business.phoneNumber)}</Number>
    </Dial>
    <Say voice="alice">Sorry, we could not connect your call. Please leave a message after the tone.</Say>
    <Record
      maxLength="120"
      transcribe="true"
      transcribeCallback="/voice/transcription/${businessId}"
      action="/voice/recording/${businessId}"
      playBeep="true"
    />
  `);
}

/**
 * Called when Twilio posts the transcription of a voicemail.
 * Stores the transcript and sends an SMS alert to the business owner.
 */
export async function handleTranscription(
  params: TwilioRecordingParams,
  businessId: string
): Promise<void> {
  const conversation = await prisma.conversation.findFirst({
    where: { businessId, twilioCallSid: params.CallSid }
  });

  if (!conversation) return;

  const transcriptText =
    params.TranscriptionText ?? '[Transcription not available]';

  // Store transcript as a message in the conversation
  await prisma.message.create({
    data: {
      businessId,
      conversationId: conversation.id,
      senderLabel: 'caller',
      content: transcriptText
    }
  });

  // Update conversation with recording URL
  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { endedAt: new Date() }
  });

  // Find or create a lead from the caller's number
  if (conversation.fromNumber) {
    let lead = await prisma.lead.findFirst({
      where: { businessId, phone: conversation.fromNumber }
    });

    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          businessId,
          phone: conversation.fromNumber,
          source: 'missed-call'
        }
      });
    }

    // Link lead to conversation
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { leadId: lead.id }
    });

    // SMS alert to business owner
    const business = await prisma.business.findUnique({
      where: { id: businessId }
    });

    if (business?.phoneNumber) {
      const alertBody =
        `TradeBooking: Missed call from ${conversation.fromNumber}. ` +
        `Voicemail: "${transcriptText.slice(0, 100)}${transcriptText.length > 100 ? '…' : ''}"`;

      await sendSms({
        businessId,
        toPhone: business.phoneNumber,
        body: alertBody
      }).catch(() => {
        // Non-fatal: don't crash if SMS alert fails
      });
    }
  }
}

/**
 * Called when Twilio posts the recording status callback.
 */
export async function handleRecordingCallback(
  params: TwilioRecordingParams,
  businessId: string
): Promise<void> {
  const conversation = await prisma.conversation.findFirst({
    where: { businessId, twilioCallSid: params.CallSid }
  });

  if (!conversation) return;

  const existingRecording = await prisma.message.findFirst({
    where: { conversationId: conversation.id, senderLabel: 'system' }
  });

  if (existingRecording) {
    await prisma.message.update({
      where: { id: existingRecording.id },
      data: { content: `Recording: ${params.RecordingUrl} (${params.RecordingDuration}s)` }
    });
  } else {
    await prisma.message.create({
      data: {
        businessId,
        conversationId: conversation.id,
        senderLabel: 'system',
        content: `Recording: ${params.RecordingUrl} (${params.RecordingDuration}s)`
      }
    });
  }
}

export async function listVoiceConversations(
  businessId: string,
  page = 1,
  limit = 20
) {
  const skip = (page - 1) * limit;

  const [conversations, total] = await Promise.all([
    prisma.conversation.findMany({
      where: { businessId, type: 'VOICE' },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        lead: { select: { id: true, fullName: true, phone: true } },
        messages: { orderBy: { createdAt: 'asc' } }
      }
    }),
    prisma.conversation.count({ where: { businessId, type: 'VOICE' } })
  ]);

  return { conversations, total, page, limit };
}

export async function getMissedCallStats(businessId: string) {
  const [total, afterHours, withTranscript] = await Promise.all([
    prisma.conversation.count({ where: { businessId, type: 'VOICE' } }),
    prisma.conversation.count({ where: { businessId, type: 'VOICE', isAfterHours: true } }),
    prisma.conversation.count({
      where: {
        businessId,
        type: 'VOICE',
        messages: { some: { senderLabel: 'caller' } }
      }
    })
  ]);

  return { total, afterHours, withTranscript };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function buildTwiml(inner: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?><Response>${inner}</Response>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function isOutsideWorkingHours(
  workingHoursJson: string | null,
  timezone: string
): boolean {
  if (!workingHoursJson) return false;

  const now = new Date();
  const dayName = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    weekday: 'short'
  })
    .format(now)
    .toLowerCase();

  const timeStr = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(now);

  try {
    const hours = JSON.parse(workingHoursJson) as Record<
      string,
      { open: string; close: string; enabled: boolean }
    >;
    const day = hours[dayName];
    if (!day || !day.enabled) return true;
    return !(timeStr >= day.open && timeStr < day.close);
  } catch {
    return false;
  }
}

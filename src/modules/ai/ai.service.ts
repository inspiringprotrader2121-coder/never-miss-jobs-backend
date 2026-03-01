import { z } from 'zod';
import type { Conversation, Lead } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { getOpenAIClient } from '../../config/openai';
import { AppError } from '../../middleware/errorHandler';
import { isWithinWorkingHours } from '../business/business.service';

const chatInputSchema = z.object({
  conversationId: z.string().cuid().optional(),
  leadId: z.string().cuid().optional(),
  message: z.string().min(1)
});

const leadUpdateSchema = z.object({
  fullName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(3).optional(),
  jobType: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  urgency: z.string().optional(),
  budget: z.string().optional()
});

const aiResponseSchema = z.object({
  reply: z.string(),
  leadUpdate: leadUpdateSchema.nullable().optional()
});

export interface ChatResult {
  conversationId: string;
  reply: string;
  lead: {
    id: string;
    fullName: string | null;
    email: string | null;
    phone: string | null;
    status: string;
  } | null;
}

interface TenantContext {
  businessId: string;
  source: 'dashboard' | 'publicWidget';
}

export async function handleChat(
  tenant: TenantContext,
  rawInput: unknown
): Promise<ChatResult> {
  const input = chatInputSchema.parse(rawInput);

  const business = await prisma.business.findUnique({
    where: { id: tenant.businessId },
    include: { aiSettings: true }
  });

  if (!business) {
    throw new AppError('Business not found', 404);
  }

  const aiSettings = business.aiSettings;

  // After-hours check: respond with configured message instead of calling OpenAI
  if (tenant.source === 'publicWidget' && aiSettings) {
    const withinHours = isWithinWorkingHours(
      aiSettings.workingHoursJson,
      aiSettings.timezone
    );

    if (!withinHours && aiSettings.afterHoursMessage) {
      const conversation = await prisma.conversation.create({
        data: { businessId: tenant.businessId, type: 'CHAT', isAfterHours: true }
      });

      await prisma.message.create({
        data: {
          businessId: tenant.businessId,
          conversationId: conversation.id,
          senderLabel: 'visitor',
          content: input.message
        }
      });

      const autoReply = await prisma.message.create({
        data: {
          businessId: tenant.businessId,
          conversationId: conversation.id,
          senderLabel: 'assistant',
          content: aiSettings.afterHoursMessage
        }
      });

      return {
        conversationId: conversation.id,
        reply: autoReply.content,
        lead: null
      };
    }
  }

  let conversation: Conversation;

  if (input.conversationId) {
    const existing = await prisma.conversation.findFirst({
      where: {
        id: input.conversationId,
        businessId: tenant.businessId
      }
    });

    if (!existing) {
      throw new AppError('Conversation not found', 404);
    }

    conversation = existing;
  } else {
    conversation = await prisma.conversation.create({
      data: {
        businessId: tenant.businessId,
        type: 'CHAT'
      }
    });
  }

  const userMessage = await prisma.message.create({
    data: {
      businessId: tenant.businessId,
      conversationId: conversation.id,
      senderLabel: tenant.source === 'dashboard' ? 'staff' : 'visitor',
      content: input.message
    }
  });

  const recentMessages = await prisma.message.findMany({
    where: {
      businessId: tenant.businessId,
      conversationId: conversation.id
    },
    orderBy: { createdAt: 'asc' },
    take: 20
  });

  const openai = getOpenAIClient();

  const systemPromptParts: string[] = [
    `You are the AI assistant for a UK trades business called "${business.name}".`,
    'Your job is to qualify leads for jobs (plumbing, electrics, roofing, etc.), capture their details, and respond clearly and politely.',
    'Always respond as a friendly assistant for this business.',
    'In addition to your natural language reply, you MUST also return a JSON object summarising the lead if appropriate.',
    'The JSON must have this shape: { "reply": string, "leadUpdate": { "fullName"?: string, "email"?: string, "phone"?: string, "jobType"?: string, "description"?: string, "location"?: string, "urgency"?: string, "budget"?: string } | null }.',
    'If you do not have enough information to update the lead yet, set "leadUpdate" to null.',
    'Return ONLY valid JSON. Do not include any extra text before or after the JSON.'
  ];

  if (aiSettings?.welcomeMessage) {
    systemPromptParts.push(
      `Use this as the general tone and intro when relevant: "${aiSettings.welcomeMessage}".`
    );
  }

  if (aiSettings?.qualificationPrompt) {
    systemPromptParts.push(
      `Follow these business-specific qualification instructions: "${aiSettings.qualificationPrompt}".`
    );
  }

  const messagesForModel = recentMessages.map((m) => ({
    role: m.senderLabel === 'assistant' ? ('assistant' as const) : ('user' as const),
    content: m.content
  }));

  const completion = await openai.chat.completions.create({
    model: aiSettings?.modelName ?? 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: systemPromptParts.join(' ')
      },
      ...messagesForModel,
      {
        role: 'user',
        content: userMessage.content
      }
    ],
    temperature: 0.7
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new AppError('AI did not return a response', 502);
  }

  let parsed;
  try {
    parsed = aiResponseSchema.parse(JSON.parse(content));
  } catch {
    throw new AppError('Failed to parse AI response', 502);
  }

  const assistantMessage = await prisma.message.create({
    data: {
      businessId: tenant.businessId,
      conversationId: conversation.id,
      senderLabel: 'assistant',
      content: parsed.reply
    }
  });

  let lead: Lead | null = null;

  if (parsed.leadUpdate) {
    const update = parsed.leadUpdate;
    const hasKeyField = Boolean(update.email || update.phone || update.fullName);

    if (hasKeyField) {
      if (input.leadId) {
        lead = await prisma.lead.findFirst({
          where: {
            id: input.leadId,
            businessId: tenant.businessId
          }
        });
      }

      if (!lead && (update.email || update.phone)) {
        lead = await prisma.lead.findFirst({
          where: {
            businessId: tenant.businessId,
            OR: [
              update.email ? { email: update.email } : undefined,
              update.phone ? { phone: update.phone } : undefined
            ].filter(Boolean) as Array<{ email?: string; phone?: string }>
          }
        });
      }

      if (!lead) {
        lead = await prisma.lead.create({
          data: {
            businessId: tenant.businessId,
            fullName: update.fullName ?? null,
            email: update.email ?? null,
            phone: update.phone ?? null,
            source: tenant.source === 'dashboard' ? 'dashboard-chat' : 'website-chat',
            notes: update.description ?? null
          }
        });
      } else {
        lead = await prisma.lead.update({
          where: { id: lead.id },
          data: {
            fullName: lead.fullName ?? update.fullName,
            email: lead.email ?? update.email,
            phone: lead.phone ?? update.phone,
            notes: lead.notes ?? update.description
          }
        });
      }

      if (!conversation.leadId && lead) {
        conversation = await prisma.conversation.update({
          where: { id: conversation.id },
          data: { leadId: lead.id }
        });
      }
    }
  }

  return {
    conversationId: conversation.id,
    reply: assistantMessage.content,
    lead: lead
      ? {
          id: lead.id,
          fullName: lead.fullName,
          email: lead.email,
          phone: lead.phone,
          status: lead.status
        }
      : null
  };
}


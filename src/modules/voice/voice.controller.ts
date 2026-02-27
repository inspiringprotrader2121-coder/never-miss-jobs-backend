import type { NextFunction, Request, Response } from 'express';
import * as voiceService from './voice.service';

export async function incomingCall(req: Request, res: Response, next: NextFunction) {
  try {
    const { businessId } = req.params;
    const twiml = await voiceService.handleIncomingCall(req.body, businessId as string);
    res.type('text/xml').send(twiml);
  } catch (err) {
    next(err);
  }
}

export async function transcriptionCallback(req: Request, res: Response, next: NextFunction) {
  try {
    const { businessId } = req.params;
    await voiceService.handleTranscription(req.body, businessId as string);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

export async function recordingCallback(req: Request, res: Response, next: NextFunction) {
  try {
    const { businessId } = req.params;
    await voiceService.handleRecordingCallback(req.body, businessId as string);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

export async function listVoiceLogs(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) { res.status(401).json({ message: 'Unauthenticated' }); return; }
    const page = Number(req.query['page'] ?? 1);
    const limit = Number(req.query['limit'] ?? 20);
    const result = await voiceService.listVoiceConversations(req.user.businessId, page, limit);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getVoiceStats(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) { res.status(401).json({ message: 'Unauthenticated' }); return; }
    const stats = await voiceService.getMissedCallStats(req.user.businessId);
    res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
}

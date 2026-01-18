import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import config from '../config/index.js';
import logger from '../utils/logger.js';

/**
 * Verify Shopify webhook signature
 */
export function verifyWebhookSignature(req: Request, res: Response, next: NextFunction): void {
  const hmac = req.headers['x-shopify-hmac-sha256'] as string;
  const body = (req as any).rawBody; // Assuming raw body is attached to request

  if (!hmac || !body) {
    logger.warn('Missing webhook signature or body');
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const hash = crypto
    .createHmac('sha256', config.shopify.webhookSecret)
    .update(body, 'utf8')
    .digest('base64');

  if (hash !== hmac) {
    logger.warn('Invalid webhook signature');
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
}

/**
 * Middleware to capture raw body for webhook verification
 */
export function captureRawBody(req: Request, res: Response, next: NextFunction): void {
  const chunks: Buffer[] = [];
  
  req.on('data', (chunk: Buffer) => {
    chunks.push(chunk);
  });

  req.on('end', () => {
    (req as any).rawBody = Buffer.concat(chunks).toString('utf8');
    next();
  });
}

/**
 * Extract Shopify ID from GID format
 */
export function extractShopifyId(gid: string): string {
  const parts = gid.split('/');
  return parts[parts.length - 1];
}

/**
 * Normalize Shopify GID to numeric ID
 */
export function normalizeShopifyId(id: string): string {
  if (id.includes('gid://')) {
    return extractShopifyId(id);
  }
  return id;
}

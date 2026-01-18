import express, { Request, Response } from 'express';
import { verifyWebhookSignature, captureRawBody } from '../utils/shopify.js';
import {
  handleOrderCreate,
  handleOrderUpdate,
  handleProductUpdate,
  handleInventoryUpdate,
  handleRefundCreate,
} from '../webhooks/handlers.js';

const router = express.Router();

// Apply raw body capture for all webhook routes
router.use(captureRawBody);
router.use(express.json());
router.use(verifyWebhookSignature);

/**
 * Webhook routes
 */
router.post('/orders/create', handleOrderCreate);
router.post('/orders/updated', handleOrderUpdate);
router.post('/products/update', handleProductUpdate);
router.post('/inventory_levels/update', handleInventoryUpdate);
router.post('/refunds/create', handleRefundCreate);

// Catch-all for other webhooks
router.post('/*', (req: Request, res: Response) => {
  console.log('Webhook received:', req.path, req.body);
  res.status(200).json({ success: true });
});

export default router;

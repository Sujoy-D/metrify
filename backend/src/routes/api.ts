import express, { Request, Response } from 'express';
import { ProductVariant } from '../models/ProductVariant.js';
import { DailyVariantMetrics } from '../models/DailyVariantMetrics.js';
import { CustomerMetrics } from '../models/CustomerMetrics.js';
import { Order } from '../models/Order.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * GET /api/variants - Get all variants with pagination
 */
router.get('/variants', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const variants = await ProductVariant.find()
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ProductVariant.countDocuments();

    res.json({
      data: variants,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    logger.error('Error fetching variants', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/variants/:id/metrics - Get metrics for a specific variant
 */
router.get('/variants/:id/metrics', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const days = parseInt(req.query.days as string) || 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const metrics = await DailyVariantMetrics.find({
      variantId: id,
      date: { $gte: startDate },
    }).sort({ date: 1 });

    const variant = await ProductVariant.findOne({ shopifyId: id });

    res.json({
      variant,
      metrics,
    });
  } catch (error: any) {
    logger.error('Error fetching variant metrics', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/metrics/summary - Get overall metrics summary
 */
router.get('/metrics/summary', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [
      totalRevenue,
      totalOrders,
      totalCustomers,
      topVariants,
    ] = await Promise.all([
      DailyVariantMetrics.aggregate([
        { $match: { date: { $gte: startDate } } },
        { $group: { _id: null, total: { $sum: '$revenue' } } },
      ]),
      Order.countDocuments({
        createdAt: { $gte: startDate },
        cancelledAt: null,
      }),
      CustomerMetrics.countDocuments(),
      DailyVariantMetrics.aggregate([
        { $match: { date: { $gte: startDate } } },
        { $group: {
          _id: '$variantId',
          totalRevenue: { $sum: '$revenue' },
          totalUnitsSold: { $sum: '$unitsSold' },
        }},
        { $sort: { totalRevenue: -1 } },
        { $limit: 10 },
      ]),
    ]);

    // Get variant details for top variants
    const variantIds = topVariants.map((v: any) => v._id);
    const variants = await ProductVariant.find({
      shopifyId: { $in: variantIds },
    });

    const variantMap = new Map(variants.map((v: any) => [v.shopifyId, v]));
    const topVariantsWithDetails = topVariants.map((v: any) => ({
      ...v,
      variant: variantMap.get(v._id),
    }));

    res.json({
      summary: {
        totalRevenue: totalRevenue[0]?.total || 0,
        totalOrders,
        totalCustomers,
        avgOrderValue: totalOrders > 0 ? (totalRevenue[0]?.total || 0) / totalOrders : 0,
      },
      topVariants: topVariantsWithDetails,
    });
  } catch (error: any) {
    logger.error('Error fetching metrics summary', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/customers - Get customer metrics
 */
router.get('/customers', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const customers = await CustomerMetrics.find()
      .sort({ lifetimeValue: -1 })
      .skip(skip)
      .limit(limit);

    const total = await CustomerMetrics.countDocuments();

    res.json({
      data: customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    logger.error('Error fetching customers', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/health - Health check
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

export default router;

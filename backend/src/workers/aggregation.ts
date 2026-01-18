import mongoose from 'mongoose';
import { Order } from '../models/Order.js';
import { ProductVariant } from '../models/ProductVariant.js';
import { DailyVariantMetrics } from '../models/DailyVariantMetrics.js';
import { CustomerMetrics } from '../models/CustomerMetrics.js';
import { getShopifyClient } from '../api/shopify/client.js';
import { QUERY_ORDERS, QUERY_CUSTOMERS } from '../api/shopify/queries.js';
import { normalizeShopifyId } from '../utils/shopify.js';
import logger from '../utils/logger.js';
import config from '../config/index.js';

/**
 * Aggregate daily variant metrics from orders
 */
export async function aggregateDailyVariantMetrics(date: Date = new Date()): Promise<void> {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    logger.info('Aggregating daily variant metrics', { date: startOfDay.toISOString() });

    // Get all orders for the day
    const orders = await Order.find({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      cancelledAt: null,
    });

    logger.info(`Found ${orders.length} orders for aggregation`);

    // Group by variant
    const variantMetrics = new Map<string, {
      unitsSold: number;
      grossRevenue: number;
      discountAmount: number;
      orderCount: number;
      uniqueCustomers: Set<string>;
      refundAmount: number;
      refundCount: number;
    }>();

    // Aggregate order data
    for (const order of orders) {
      for (const item of order.lineItems) {
        const variantId = item.variantId;
        
        if (!variantMetrics.has(variantId)) {
          variantMetrics.set(variantId, {
            unitsSold: 0,
            grossRevenue: 0,
            discountAmount: 0,
            orderCount: 0,
            uniqueCustomers: new Set(),
            refundAmount: 0,
            refundCount: 0,
          });
        }

        const metrics = variantMetrics.get(variantId)!;
        metrics.unitsSold += item.quantity;
        metrics.grossRevenue += item.price * item.quantity;
        metrics.discountAmount += item.totalDiscount || 0;
        metrics.orderCount += 1;
        
        if (order.customerId) {
          metrics.uniqueCustomers.add(order.customerId);
        }
      }

      // Add refund data
      if (order.refunds && order.refunds.length > 0) {
        for (const refund of order.refunds) {
          for (const item of order.lineItems) {
            const variantId = item.variantId;
            const metrics = variantMetrics.get(variantId);
            
            if (metrics) {
              // Proportional refund allocation
              const itemTotal = item.price * item.quantity;
              const orderTotal = order.totalPrice;
              const refundPortion = (itemTotal / orderTotal) * refund.amount;
              
              metrics.refundAmount += refundPortion;
              metrics.refundCount += 1;
            }
          }
        }
      }
    }

    // Get inventory snapshots
    const variants = await ProductVariant.find({
      shopifyId: { $in: Array.from(variantMetrics.keys()) },
    });

    const variantMap = new Map(variants.map(v => [v.shopifyId, v]));

    // Save or update daily metrics
    for (const [variantId, metrics] of variantMetrics) {
      const variant = variantMap.get(variantId);
      
      if (!variant) {
        logger.warn(`Variant not found: ${variantId}`);
        continue;
      }

      const revenue = metrics.grossRevenue - metrics.discountAmount - metrics.refundAmount;
      const discountRate = metrics.grossRevenue > 0 ? (metrics.discountAmount / metrics.grossRevenue) * 100 : 0;
      const refundRate = metrics.grossRevenue > 0 ? (metrics.refundAmount / metrics.grossRevenue) * 100 : 0;
      const avgOrderValue = metrics.orderCount > 0 ? revenue / metrics.orderCount : 0;

      // Calculate sell-through rate (units sold / starting inventory)
      const inventoryStart = variant.inventoryQuantity + metrics.unitsSold;
      const sellThroughRate = inventoryStart > 0 ? (metrics.unitsSold / inventoryStart) * 100 : 0;

      await DailyVariantMetrics.findOneAndUpdate(
        {
          variantId,
          date: startOfDay,
        },
        {
          unitsSold: metrics.unitsSold,
          revenue,
          grossRevenue: metrics.grossRevenue,
          discountAmount: metrics.discountAmount,
          discountRate,
          refundAmount: metrics.refundAmount,
          refundRate,
          refundCount: metrics.refundCount,
          avgOrderValue,
          orderCount: metrics.orderCount,
          uniqueCustomers: metrics.uniqueCustomers.size,
          inventoryStart,
          inventoryEnd: variant.inventoryQuantity,
          sellThroughRate,
          priceAtTime: variant.price,
          compareAtPriceAtTime: variant.compareAtPrice,
          aggregatedAt: new Date(),
        },
        { upsert: true, new: true }
      );
    }

    logger.info(`Aggregation complete: ${variantMetrics.size} variants processed`);
  } catch (error: any) {
    logger.error('Error aggregating daily variant metrics', { error: error.message, stack: error.stack });
    throw error;
  }
}

/**
 * Aggregate customer metrics
 */
export async function aggregateCustomerMetrics(): Promise<void> {
  try {
    logger.info('Aggregating customer metrics');

    const customers = await Order.aggregate([
      {
        $match: {
          customerId: { $exists: true, $ne: null },
          cancelledAt: null,
        },
      },
      {
        $group: {
          _id: '$customerId',
          ordersCount: { $sum: 1 },
          totalSpent: { $sum: '$totalPrice' },
          firstOrderDate: { $min: '$createdAt' },
          lastOrderDate: { $max: '$createdAt' },
          email: { $first: '$email' },
        },
      },
    ]);

    logger.info(`Processing ${customers.length} customers`);

    for (const customer of customers) {
      const avgOrderValue = customer.ordersCount > 0 ? customer.totalSpent / customer.ordersCount : 0;
      const isRepeatCustomer = customer.ordersCount > 1;
      const repeatPurchaseRate = isRepeatCustomer ? ((customer.ordersCount - 1) / customer.ordersCount) * 100 : 0;
      
      const daysSinceLastOrder = customer.lastOrderDate
        ? Math.floor((Date.now() - new Date(customer.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24))
        : undefined;

      await CustomerMetrics.findOneAndUpdate(
        { shopifyId: customer._id },
        {
          shopifyGid: `gid://shopify/Customer/${customer._id}`,
          email: customer.email,
          ordersCount: customer.ordersCount,
          totalSpent: customer.totalSpent,
          avgOrderValue,
          repeatPurchaseRate,
          daysSinceLastOrder,
          lifetimeValue: customer.totalSpent,
          isRepeatCustomer,
          firstOrderDate: customer.firstOrderDate,
          lastOrderDate: customer.lastOrderDate,
        },
        { upsert: true, new: true }
      );
    }

    logger.info('Customer metrics aggregation complete');
  } catch (error: any) {
    logger.error('Error aggregating customer metrics', { error: error.message, stack: error.stack });
    throw error;
  }
}

/**
 * Full reconciliation job - fetch fresh data from Shopify
 */
export async function runReconciliation(): Promise<void> {
  try {
    logger.info('Starting full reconciliation with Shopify');

    const client = getShopifyClient();
    
    // Sync orders from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const queryFilter = `created_at:>=${thirtyDaysAgo.toISOString()}`;

    logger.info('Fetching orders from Shopify', { since: thirtyDaysAgo.toISOString() });

    let orderCount = 0;
    for await (const orders of client.paginateQuery(QUERY_ORDERS, { query: queryFilter }, 100, ['orders'])) {
      for (const order of orders) {
        const shopifyId = normalizeShopifyId(order.id);
        
        await Order.findOneAndUpdate(
          { shopifyId },
          {
            shopifyGid: order.id,
            orderNumber: parseInt(order.name.replace('#', '')),
            email: order.email,
            customerId: order.customer?.id ? normalizeShopifyId(order.customer.id) : undefined,
            financialStatus: order.displayFinancialStatus,
            fulfillmentStatus: order.displayFulfillmentStatus,
            totalPrice: parseFloat(order.totalPriceSet.shopMoney.amount),
            subtotalPrice: parseFloat(order.subtotalPriceSet.shopMoney.amount),
            totalTax: parseFloat(order.totalTaxSet?.shopMoney.amount || '0'),
            totalDiscount: parseFloat(order.totalDiscountsSet?.shopMoney.amount || '0'),
            lineItems: order.lineItems.edges.map((edge: any) => ({
              variantId: normalizeShopifyId(edge.node.variant.id),
              variantGid: edge.node.variant.id,
              productId: normalizeShopifyId(edge.node.product.id),
              title: edge.node.title,
              quantity: edge.node.quantity,
              price: parseFloat(edge.node.originalUnitPriceSet.shopMoney.amount),
              totalDiscount: parseFloat(edge.node.totalDiscountSet?.shopMoney.amount || '0'),
              sku: edge.node.variant.sku,
            })),
            processedAt: order.processedAt ? new Date(order.processedAt) : undefined,
            cancelledAt: order.cancelledAt ? new Date(order.cancelledAt) : undefined,
            createdAt: new Date(order.createdAt),
          },
          { upsert: true, new: true }
        );

        orderCount++;
      }
    }

    logger.info(`Reconciliation complete: ${orderCount} orders synced`);

    // Run aggregations after reconciliation
    await aggregateDailyVariantMetrics();
    await aggregateCustomerMetrics();

  } catch (error: any) {
    logger.error('Error during reconciliation', { error: error.message, stack: error.stack });
    throw error;
  }
}

/**
 * Run the aggregation worker
 */
async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodb.uri, {
      maxPoolSize: config.mongodb.maxPoolSize,
    });
    logger.info('Connected to MongoDB');

    // Run aggregations
    await aggregateDailyVariantMetrics();
    await aggregateCustomerMetrics();

    logger.info('Aggregation worker completed successfully');
    process.exit(0);
  } catch (error: any) {
    logger.error('Aggregation worker failed', { error: error.message });
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as runAggregation };

import mongoose from 'mongoose';
import { getShopifyClient } from '../api/shopify/client.js';
import { QUERY_PRODUCTS, QUERY_ORDERS, QUERY_CUSTOMERS } from '../api/shopify/queries.js';
import { ProductVariant } from '../models/ProductVariant.js';
import { Order } from '../models/Order.js';
import { CustomerMetrics } from '../models/CustomerMetrics.js';
import { normalizeShopifyId } from '../utils/shopify.js';
import logger from '../utils/logger.js';
import config from '../config/index.js';

/**
 * Ingest all products from Shopify
 */
async function ingestProducts(): Promise<number> {
  logger.info('Starting product ingestion');
  const client = getShopifyClient();
  let count = 0;

  try {
    for await (const products of client.paginateQuery(QUERY_PRODUCTS, {}, 50, ['products'])) {
      for (const product of products) {
        const productId = normalizeShopifyId(product.id);
        
        // Process all variants
        for (const variantEdge of product.variants.edges) {
          const variant = variantEdge.node;
          const variantId = normalizeShopifyId(variant.id);

          await ProductVariant.findOneAndUpdate(
            { shopifyId: variantId },
            {
              shopifyGid: variant.id,
              productId,
              productGid: product.id,
              title: variant.title || product.title,
              sku: variant.sku || '',
              price: parseFloat(variant.price),
              compareAtPrice: variant.compareAtPrice ? parseFloat(variant.compareAtPrice) : undefined,
              inventoryQuantity: variant.inventoryQuantity || 0,
              inventoryItemId: normalizeShopifyId(variant.inventoryItem.id),
              currentPrice: parseFloat(variant.price),
              priceHistory: [],
              metadata: {
                vendor: product.vendor,
                productType: product.productType,
                tags: product.tags,
              },
            },
            { upsert: true, new: true }
          );

          count++;
        }
      }

      logger.info(`Ingested ${count} product variants so far...`);
    }

    logger.info(`Product ingestion complete: ${count} variants`);
    return count;
  } catch (error: any) {
    logger.error('Error ingesting products', { error: error.message });
    throw error;
  }
}

/**
 * Ingest orders from Shopify
 */
async function ingestOrders(daysBack: number = 90): Promise<number> {
  logger.info('Starting order ingestion', { daysBack });
  const client = getShopifyClient();
  let count = 0;

  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    const query = `created_at:>=${startDate.toISOString()}`;

    for await (const orders of client.paginateQuery(QUERY_ORDERS, { query }, 100, ['orders'])) {
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
              variantId: edge.node.variant ? normalizeShopifyId(edge.node.variant.id) : '',
              variantGid: edge.node.variant?.id || '',
              productId: normalizeShopifyId(edge.node.product.id),
              title: edge.node.title,
              quantity: edge.node.quantity,
              price: parseFloat(edge.node.originalUnitPriceSet.shopMoney.amount),
              totalDiscount: parseFloat(edge.node.totalDiscountSet?.shopMoney.amount || '0'),
              sku: edge.node.variant?.sku || '',
            })),
            refunds: order.refunds?.map((refund: any) => ({
              refundId: normalizeShopifyId(refund.id),
              amount: parseFloat(refund.totalRefundedSet.shopMoney.amount),
              createdAt: new Date(refund.createdAt),
            })) || [],
            processedAt: order.processedAt ? new Date(order.processedAt) : undefined,
            cancelledAt: order.cancelledAt ? new Date(order.cancelledAt) : undefined,
            createdAt: new Date(order.createdAt),
          },
          { upsert: true, new: true }
        );

        count++;
      }

      logger.info(`Ingested ${count} orders so far...`);
    }

    logger.info(`Order ingestion complete: ${count} orders`);
    return count;
  } catch (error: any) {
    logger.error('Error ingesting orders', { error: error.message });
    throw error;
  }
}

/**
 * Ingest customers from Shopify
 */
async function ingestCustomers(): Promise<number> {
  logger.info('Starting customer ingestion');
  const client = getShopifyClient();
  let count = 0;

  try {
    for await (const customers of client.paginateQuery(QUERY_CUSTOMERS, {}, 100, ['customers'])) {
      for (const customer of customers) {
        const shopifyId = normalizeShopifyId(customer.id);

        await CustomerMetrics.findOneAndUpdate(
          { shopifyId },
          {
            shopifyGid: customer.id,
            email: customer.email,
            firstName: customer.firstName,
            lastName: customer.lastName,
            ordersCount: customer.ordersCount || 0,
            totalSpent: parseFloat(customer.totalSpentV2?.amount || '0'),
            tags: customer.tags,
            isRepeatCustomer: (customer.ordersCount || 0) > 1,
          },
          { upsert: true, new: true }
        );

        count++;
      }

      logger.info(`Ingested ${count} customers so far...`);
    }

    logger.info(`Customer ingestion complete: ${count} customers`);
    return count;
  } catch (error: any) {
    logger.error('Error ingesting customers', { error: error.message });
    throw error;
  }
}

/**
 * Full data ingestion
 */
async function runFullIngestion() {
  try {
    await mongoose.connect(config.mongodb.uri, {
      maxPoolSize: config.mongodb.maxPoolSize,
    });
    logger.info('Connected to MongoDB');

    logger.info('=== Starting Full Data Ingestion ===');
    const startTime = Date.now();

    const productCount = await ingestProducts();
    const orderCount = await ingestOrders(90);
    const customerCount = await ingestCustomers();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    logger.info('=== Ingestion Complete ===', {
      products: productCount,
      orders: orderCount,
      customers: customerCount,
      duration: `${duration}s`,
    });

    process.exit(0);
  } catch (error: any) {
    logger.error('Ingestion failed', { error: error.message });
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runFullIngestion();
}

export { ingestProducts, ingestOrders, ingestCustomers, runFullIngestion };

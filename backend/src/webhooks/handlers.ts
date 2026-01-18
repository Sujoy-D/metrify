import { Request, Response } from 'express';
import { Order } from '../models/Order.js';
import { ProductVariant } from '../models/ProductVariant.js';
import { normalizeShopifyId } from '../utils/shopify.js';
import logger from '../utils/logger.js';

/**
 * Handle orders/create webhook
 */
export async function handleOrderCreate(req: Request, res: Response): Promise<void> {
  try {
    const orderData = req.body;
    
    logger.info('Processing orders/create webhook', { orderId: orderData.id });

    const order = new Order({
      shopifyId: normalizeShopifyId(orderData.id.toString()),
      shopifyGid: `gid://shopify/Order/${orderData.id}`,
      orderNumber: orderData.order_number,
      email: orderData.email,
      customerId: orderData.customer?.id ? normalizeShopifyId(orderData.customer.id.toString()) : undefined,
      financialStatus: orderData.financial_status,
      fulfillmentStatus: orderData.fulfillment_status,
      totalPrice: parseFloat(orderData.total_price),
      subtotalPrice: parseFloat(orderData.subtotal_price),
      totalTax: parseFloat(orderData.total_tax || '0'),
      totalDiscount: parseFloat(orderData.total_discounts || '0'),
      lineItems: orderData.line_items.map((item: any) => ({
        variantId: normalizeShopifyId(item.variant_id.toString()),
        variantGid: `gid://shopify/ProductVariant/${item.variant_id}`,
        productId: normalizeShopifyId(item.product_id.toString()),
        title: item.title,
        quantity: item.quantity,
        price: parseFloat(item.price),
        totalDiscount: parseFloat(item.total_discount || '0'),
        sku: item.sku,
      })),
      processedAt: orderData.processed_at ? new Date(orderData.processed_at) : undefined,
      cancelledAt: orderData.cancelled_at ? new Date(orderData.cancelled_at) : undefined,
      createdAt: new Date(orderData.created_at),
    });

    await order.save();

    logger.info('Order created successfully', { orderId: order.shopifyId });
    res.status(200).json({ success: true });
  } catch (error: any) {
    logger.error('Error processing orders/create webhook', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Handle orders/updated webhook
 */
export async function handleOrderUpdate(req: Request, res: Response): Promise<void> {
  try {
    const orderData = req.body;
    
    logger.info('Processing orders/updated webhook', { orderId: orderData.id });

    const shopifyId = normalizeShopifyId(orderData.id.toString());
    
    await Order.findOneAndUpdate(
      { shopifyId },
      {
        financialStatus: orderData.financial_status,
        fulfillmentStatus: orderData.fulfillment_status,
        totalPrice: parseFloat(orderData.total_price),
        subtotalPrice: parseFloat(orderData.subtotal_price),
        totalTax: parseFloat(orderData.total_tax || '0'),
        totalDiscount: parseFloat(orderData.total_discounts || '0'),
        processedAt: orderData.processed_at ? new Date(orderData.processed_at) : undefined,
        cancelledAt: orderData.cancelled_at ? new Date(orderData.cancelled_at) : undefined,
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    logger.info('Order updated successfully', { orderId: shopifyId });
    res.status(200).json({ success: true });
  } catch (error: any) {
    logger.error('Error processing orders/updated webhook', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Handle products/update webhook
 */
export async function handleProductUpdate(req: Request, res: Response): Promise<void> {
  try {
    const productData = req.body;
    
    logger.info('Processing products/update webhook', { productId: productData.id });

    const productId = normalizeShopifyId(productData.id.toString());

    // Update all variants for this product
    for (const variant of productData.variants) {
      const variantId = normalizeShopifyId(variant.id.toString());
      
      await ProductVariant.findOneAndUpdate(
        { shopifyId: variantId },
        {
          shopifyGid: `gid://shopify/ProductVariant/${variant.id}`,
          productId,
          productGid: `gid://shopify/Product/${productData.id}`,
          title: variant.title,
          sku: variant.sku,
          price: parseFloat(variant.price),
          compareAtPrice: variant.compare_at_price ? parseFloat(variant.compare_at_price) : undefined,
          inventoryQuantity: variant.inventory_quantity || 0,
          inventoryItemId: normalizeShopifyId(variant.inventory_item_id.toString()),
          currentPrice: parseFloat(variant.price),
          metadata: {
            vendor: productData.vendor,
            productType: productData.product_type,
            tags: productData.tags ? productData.tags.split(',').map((t: string) => t.trim()) : [],
          },
        },
        { upsert: true, new: true }
      );
    }

    logger.info('Product variants updated successfully', { productId, variantCount: productData.variants.length });
    res.status(200).json({ success: true });
  } catch (error: any) {
    logger.error('Error processing products/update webhook', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Handle inventory_levels/update webhook
 */
export async function handleInventoryUpdate(req: Request, res: Response): Promise<void> {
  try {
    const inventoryData = req.body;
    
    logger.info('Processing inventory_levels/update webhook', { inventoryItemId: inventoryData.inventory_item_id });

    const inventoryItemId = normalizeShopifyId(inventoryData.inventory_item_id.toString());
    
    // Find variant by inventory item ID and update quantity
    await ProductVariant.findOneAndUpdate(
      { inventoryItemId },
      { inventoryQuantity: inventoryData.available || 0 },
      { new: true }
    );

    logger.info('Inventory updated successfully', { inventoryItemId });
    res.status(200).json({ success: true });
  } catch (error: any) {
    logger.error('Error processing inventory_levels/update webhook', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Handle refunds/create webhook
 */
export async function handleRefundCreate(req: Request, res: Response): Promise<void> {
  try {
    const refundData = req.body;
    
    logger.info('Processing refunds/create webhook', { refundId: refundData.id, orderId: refundData.order_id });

    const orderId = normalizeShopifyId(refundData.order_id.toString());
    const refundId = normalizeShopifyId(refundData.id.toString());
    
    const order = await Order.findOne({ shopifyId: orderId });
    
    if (order) {
      if (!order.refunds) {
        order.refunds = [];
      }

      order.refunds.push({
        refundId,
        amount: parseFloat(refundData.total_refunded || '0'),
        createdAt: new Date(refundData.created_at),
      });

      await order.save();
      logger.info('Refund added to order', { orderId, refundId });
    } else {
      logger.warn('Order not found for refund', { orderId });
    }

    res.status(200).json({ success: true });
  } catch (error: any) {
    logger.error('Error processing refunds/create webhook', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
}

import mongoose from 'mongoose';
import { ProductVariant } from '../models/ProductVariant.js';
import { DailyVariantMetrics } from '../models/DailyVariantMetrics.js';
import { getShopifyClient } from '../api/shopify/client.js';
import { MUTATION_UPDATE_VARIANT_PRICE } from '../api/shopify/queries.js';
import logger from '../utils/logger.js';
import config from '../config/index.js';

interface PricingScore {
  variantId: string;
  currentPrice: number;
  suggestedPrice: number;
  priceChange: number;
  priceChangePercent: number;
  confidence: number;
  factors: {
    salesVelocity: number;
    inventoryPressure: number;
    discountEffectiveness: number;
    sellThroughRate: number;
  };
  shouldUpdate: boolean;
  reason: string;
}

/**
 * Calculate pricing score for a variant
 */
async function calculatePricingScore(variantId: string): Promise<PricingScore | null> {
  try {
    const variant = await ProductVariant.findOne({ shopifyId: variantId });
    
    if (!variant) {
      return null;
    }

    // Get last 30 days of metrics
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const metrics = await DailyVariantMetrics.find({
      variantId,
      date: { $gte: thirtyDaysAgo },
    }).sort({ date: -1 });

    if (metrics.length === 0) {
      logger.debug(`No metrics found for variant ${variantId}`);
      return null;
    }

    // Calculate factors
    const totalUnitsSold = metrics.reduce((sum, m) => sum + m.unitsSold, 0);
    const avgDailySales = totalUnitsSold / metrics.length;
    const avgSellThroughRate = metrics.reduce((sum, m) => sum + m.sellThroughRate, 0) / metrics.length;
    const avgDiscountRate = metrics.reduce((sum, m) => sum + m.discountRate, 0) / metrics.length;
    const avgRevenue = metrics.reduce((sum, m) => sum + m.revenue, 0) / metrics.length;

    // Sales velocity (0-100)
    const salesVelocity = Math.min(100, avgDailySales * 10);

    // Inventory pressure (0-100) - higher when inventory is low
    const daysOfInventory = avgDailySales > 0 ? variant.inventoryQuantity / avgDailySales : 999;
    const inventoryPressure = daysOfInventory < 30 ? (30 - daysOfInventory) / 30 * 100 : 0;

    // Discount effectiveness (0-100) - higher when discounts drive sales
    const discountEffectiveness = avgDiscountRate > 0 && avgRevenue > 0 ? 
      Math.min(100, (avgRevenue / (avgRevenue + (avgRevenue * avgDiscountRate / 100))) * 100) : 50;

    // Sell-through rate (0-100)
    const sellThroughRate = avgSellThroughRate;

    // Calculate suggested price adjustment
    let priceMultiplier = 1.0;
    let reason = '';

    // Strong sales + low inventory = increase price
    if (salesVelocity > 60 && inventoryPressure > 50) {
      priceMultiplier = 1.03; // +3%
      reason = 'High demand with low inventory';
    }
    // Good sell-through + healthy inventory = slight increase
    else if (sellThroughRate > 70 && inventoryPressure < 30) {
      priceMultiplier = 1.02; // +2%
      reason = 'Strong sell-through rate';
    }
    // Low sales + high inventory = decrease price
    else if (salesVelocity < 20 && inventoryPressure < 10 && variant.inventoryQuantity > 50) {
      priceMultiplier = 0.97; // -3%
      reason = 'Slow-moving inventory';
    }
    // Very low sales + excess inventory = larger decrease
    else if (salesVelocity < 10 && variant.inventoryQuantity > 100) {
      priceMultiplier = 0.95; // -5%
      reason = 'Excess inventory clearance';
    }
    // High discount rate = product may be overpriced
    else if (avgDiscountRate > 20) {
      priceMultiplier = 0.98; // -2%
      reason = 'High discount dependency';
    } else {
      reason = 'No change recommended';
    }

    const currentPrice = variant.currentPrice || variant.price;
    const suggestedPrice = Math.round(currentPrice * priceMultiplier * 100) / 100;
    const priceChange = suggestedPrice - currentPrice;
    const priceChangePercent = (priceChange / currentPrice) * 100;

    // Safety checks
    const maxChange = config.pricing.maxChangePercent;
    const minInventory = config.pricing.minInventoryThreshold;
    let shouldUpdate = Math.abs(priceChangePercent) > 0.5; // Only update if change > 0.5%

    // Don't update if change exceeds max
    if (Math.abs(priceChangePercent) > maxChange) {
      shouldUpdate = false;
      reason += ' (exceeds max change limit)';
    }

    // Don't update if inventory too low
    if (variant.inventoryQuantity < minInventory) {
      shouldUpdate = false;
      reason += ' (inventory below threshold)';
    }

    // Calculate confidence (0-100)
    const dataPoints = metrics.length;
    const confidence = Math.min(100, (dataPoints / 30) * 100);

    return {
      variantId,
      currentPrice,
      suggestedPrice,
      priceChange,
      priceChangePercent,
      confidence,
      factors: {
        salesVelocity,
        inventoryPressure,
        discountEffectiveness,
        sellThroughRate,
      },
      shouldUpdate,
      reason,
    };
  } catch (error: any) {
    logger.error(`Error calculating pricing score for variant ${variantId}`, { error: error.message });
    return null;
  }
}

/**
 * Update variant price in Shopify
 */
async function updateVariantPrice(variantGid: string, price: number): Promise<boolean> {
  try {
    const client = getShopifyClient();

    const variables = {
      input: {
        id: variantGid,
        price: price.toFixed(2),
      },
    };

    const response = await client.query(MUTATION_UPDATE_VARIANT_PRICE, variables);

    if (response.data?.productVariantUpdate?.userErrors?.length > 0) {
      logger.error('Error updating variant price', {
        errors: response.data.productVariantUpdate.userErrors,
        variantGid,
      });
      return false;
    }

    return true;
  } catch (error: any) {
    logger.error('Error updating variant price in Shopify', {
      error: error.message,
      variantGid,
    });
    return false;
  }
}

/**
 * Run pricing engine
 */
export async function runPricingEngine(): Promise<void> {
  try {
    logger.info('Starting pricing engine', { dryRun: config.pricing.dryRun });

    // Get all active variants
    const variants = await ProductVariant.find({
      inventoryQuantity: { $gt: 0 },
    }).limit(1000); // Process in batches

    logger.info(`Processing ${variants.length} variants`);

    const scores: PricingScore[] = [];
    let updateCount = 0;
    let skipCount = 0;

    for (const variant of variants) {
      const score = await calculatePricingScore(variant.shopifyId);
      
      if (!score) {
        skipCount++;
        continue;
      }

      scores.push(score);

      if (score.shouldUpdate) {
        logger.info('Price update recommended', {
          variantId: score.variantId,
          sku: variant.sku,
          title: variant.title,
          currentPrice: score.currentPrice,
          suggestedPrice: score.suggestedPrice,
          change: `${score.priceChangePercent.toFixed(2)}%`,
          reason: score.reason,
          dryRun: config.pricing.dryRun,
        });

        if (!config.pricing.dryRun) {
          const success = await updateVariantPrice(variant.shopifyGid, score.suggestedPrice);
          
          if (success) {
            // Update local database
            variant.currentPrice = score.suggestedPrice;
            variant.lastPriceUpdate = new Date();
            variant.priceHistory.push({
              price: score.suggestedPrice,
              timestamp: new Date(),
              reason: score.reason,
            });
            await variant.save();

            updateCount++;
          }
        } else {
          updateCount++; // Count for dry run stats
        }
      }
    }

    logger.info('Pricing engine completed', {
      totalVariants: variants.length,
      analyzed: scores.length,
      skipped: skipCount,
      updates: updateCount,
      dryRun: config.pricing.dryRun,
    });

    // Log summary statistics
    if (scores.length > 0) {
      const avgConfidence = scores.reduce((sum, s) => sum + s.confidence, 0) / scores.length;
      const avgPriceChange = scores
        .filter(s => s.shouldUpdate)
        .reduce((sum, s) => sum + Math.abs(s.priceChangePercent), 0) / (updateCount || 1);

      logger.info('Pricing summary', {
        avgConfidence: avgConfidence.toFixed(2),
        avgPriceChange: avgPriceChange.toFixed(2) + '%',
      });
    }
  } catch (error: any) {
    logger.error('Error running pricing engine', { error: error.message, stack: error.stack });
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    await mongoose.connect(config.mongodb.uri, {
      maxPoolSize: config.mongodb.maxPoolSize,
    });
    logger.info('Connected to MongoDB');

    await runPricingEngine();

    logger.info('Pricing engine completed successfully');
    process.exit(0);
  } catch (error: any) {
    logger.error('Pricing engine failed', { error: error.message });
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as runPricing };

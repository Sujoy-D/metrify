import mongoose, { Schema, Document } from 'mongoose';

export interface IDailyVariantMetrics extends Document {
  variantId: string; // Reference to ProductVariant.shopifyId
  date: Date;
  unitsSold: number;
  revenue: number;
  grossRevenue: number;
  discountAmount: number;
  discountRate: number; // percentage
  refundAmount: number;
  refundRate: number; // percentage
  refundCount: number;
  avgOrderValue: number;
  orderCount: number;
  uniqueCustomers: number;
  inventoryStart: number;
  inventoryEnd: number;
  sellThroughRate: number; // percentage
  priceAtTime: number;
  compareAtPriceAtTime?: number;
  aggregatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DailyVariantMetricsSchema = new Schema<IDailyVariantMetrics>({
  variantId: { type: String, required: true, index: true },
  date: { type: Date, required: true, index: true },
  unitsSold: { type: Number, required: true, default: 0 },
  revenue: { type: Number, required: true, default: 0 },
  grossRevenue: { type: Number, required: true, default: 0 },
  discountAmount: { type: Number, default: 0 },
  discountRate: { type: Number, default: 0 },
  refundAmount: { type: Number, default: 0 },
  refundRate: { type: Number, default: 0 },
  refundCount: { type: Number, default: 0 },
  avgOrderValue: { type: Number, default: 0 },
  orderCount: { type: Number, default: 0 },
  uniqueCustomers: { type: Number, default: 0 },
  inventoryStart: { type: Number, required: true },
  inventoryEnd: { type: Number, required: true },
  sellThroughRate: { type: Number, default: 0 },
  priceAtTime: { type: Number, required: true },
  compareAtPriceAtTime: { type: Number },
  aggregatedAt: { type: Date, required: true },
}, {
  timestamps: true,
});

// Compound indexes for efficient queries
DailyVariantMetricsSchema.index({ variantId: 1, date: -1 }, { unique: true });
DailyVariantMetricsSchema.index({ date: -1 });
DailyVariantMetricsSchema.index({ sellThroughRate: -1 });

export const DailyVariantMetrics = mongoose.model<IDailyVariantMetrics>('DailyVariantMetrics', DailyVariantMetricsSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomerMetrics extends Document {
  shopifyId: string; // Normalized customer ID
  shopifyGid: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  ordersCount: number;
  totalSpent: number;
  avgOrderValue: number;
  repeatPurchaseRate: number;
  daysSinceLastOrder?: number;
  lifetimeValue: number;
  isRepeatCustomer: boolean;
  firstOrderDate?: Date;
  lastOrderDate?: Date;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CustomerMetricsSchema = new Schema<ICustomerMetrics>({
  shopifyId: { type: String, required: true, unique: true, index: true },
  shopifyGid: { type: String, required: true },
  email: { type: String, index: true },
  firstName: String,
  lastName: String,
  ordersCount: { type: Number, required: true, default: 0 },
  totalSpent: { type: Number, required: true, default: 0 },
  avgOrderValue: { type: Number, default: 0 },
  repeatPurchaseRate: { type: Number, default: 0 },
  daysSinceLastOrder: Number,
  lifetimeValue: { type: Number, default: 0 },
  isRepeatCustomer: { type: Boolean, default: false },
  firstOrderDate: Date,
  lastOrderDate: Date,
  tags: [String],
}, {
  timestamps: true,
});

// Indexes
CustomerMetricsSchema.index({ email: 1 });
CustomerMetricsSchema.index({ isRepeatCustomer: 1 });
CustomerMetricsSchema.index({ lifetimeValue: -1 });

export const CustomerMetrics = mongoose.model<ICustomerMetrics>('CustomerMetrics', CustomerMetricsSchema);

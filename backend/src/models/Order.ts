import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  shopifyId: string;
  shopifyGid: string;
  orderNumber: number;
  email?: string;
  customerId?: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: number;
  subtotalPrice: number;
  totalTax: number;
  totalDiscount: number;
  lineItems: Array<{
    variantId: string;
    variantGid: string;
    productId: string;
    title: string;
    quantity: number;
    price: number;
    totalDiscount: number;
    sku?: string;
  }>;
  refunds?: Array<{
    refundId: string;
    amount: number;
    createdAt: Date;
  }>;
  createdAt: Date;
  processedAt?: Date;
  cancelledAt?: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  shopifyId: { type: String, required: true, unique: true, index: true },
  shopifyGid: { type: String, required: true },
  orderNumber: { type: Number, required: true },
  email: String,
  customerId: { type: String, index: true },
  financialStatus: { type: String, required: true },
  fulfillmentStatus: String,
  totalPrice: { type: Number, required: true },
  subtotalPrice: { type: Number, required: true },
  totalTax: { type: Number, default: 0 },
  totalDiscount: { type: Number, default: 0 },
  lineItems: [{
    variantId: { type: String, required: true },
    variantGid: { type: String, required: true },
    productId: { type: String, required: true },
    title: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    totalDiscount: { type: Number, default: 0 },
    sku: String,
  }],
  refunds: [{
    refundId: String,
    amount: Number,
    createdAt: Date,
  }],
  processedAt: Date,
  cancelledAt: Date,
}, {
  timestamps: true,
});

// Indexes
OrderSchema.index({ customerId: 1, createdAt: -1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ 'lineItems.variantId': 1 });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);

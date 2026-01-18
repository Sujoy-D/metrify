import mongoose, { Schema, Document } from 'mongoose';

export interface IProductVariant extends Document {
  shopifyId: string; // Normalized Shopify ID (numeric only)
  shopifyGid: string; // Full GID format
  productId: string;
  productGid: string;
  title: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  inventoryQuantity: number;
  inventoryItemId: string;
  currentPrice: number; // AI-optimized price
  lastPriceUpdate?: Date;
  priceHistory: Array<{
    price: number;
    timestamp: Date;
    reason: string;
  }>;
  metadata: {
    vendor?: string;
    productType?: string;
    tags?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductVariantSchema = new Schema<IProductVariant>({
  shopifyId: { type: String, required: true, unique: true, index: true },
  shopifyGid: { type: String, required: true },
  productId: { type: String, required: true, index: true },
  productGid: { type: String, required: true },
  title: { type: String, required: true },
  sku: { type: String, index: true },
  price: { type: Number, required: true },
  compareAtPrice: { type: Number },
  inventoryQuantity: { type: Number, required: true, default: 0 },
  inventoryItemId: { type: String, required: true },
  currentPrice: { type: Number, required: true },
  lastPriceUpdate: { type: Date },
  priceHistory: [{
    price: { type: Number, required: true },
    timestamp: { type: Date, required: true },
    reason: { type: String, required: true },
  }],
  metadata: {
    vendor: String,
    productType: String,
    tags: [String],
  },
}, {
  timestamps: true,
});

// Indexes for efficient queries
ProductVariantSchema.index({ shopifyId: 1, updatedAt: -1 });
ProductVariantSchema.index({ sku: 1 });

export const ProductVariant = mongoose.model<IProductVariant>('ProductVariant', ProductVariantSchema);

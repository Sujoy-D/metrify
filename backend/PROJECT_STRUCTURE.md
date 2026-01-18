# Metrify Backend - Complete Project Structure

## 📁 Directory Tree

```
backend/
├── src/
│   ├── api/
│   │   └── shopify/
│   │       ├── client.ts              # GraphQL client with rate limiting & retry
│   │       └── queries.ts             # Shopify GraphQL queries & mutations
│   ├── config/
│   │   └── index.ts                   # Centralized configuration
│   ├── models/
│   │   ├── ProductVariant.ts          # Product variant model
│   │   ├── DailyVariantMetrics.ts     # Daily aggregated metrics
│   │   ├── CustomerMetrics.ts         # Customer analytics model
│   │   └── Order.ts                   # Order data model
│   ├── routes/
│   │   ├── api.ts                     # REST API endpoints
│   │   └── webhooks.ts                # Webhook routes
│   ├── utils/
│   │   ├── logger.ts                  # Pino logger configuration
│   │   └── shopify.ts                 # Shopify utilities (ID normalization, HMAC)
│   ├── webhooks/
│   │   └── handlers.ts                # Webhook event handlers
│   ├── workers/
│   │   ├── aggregation.ts             # Metrics aggregation worker
│   │   ├── pricing.ts                 # AI pricing engine
│   │   └── ingestion.ts               # Initial data ingestion
│   └── index.ts                       # Express server entry point
├── .env.example                       # Environment variables template
├── .gitignore                         # Git ignore rules
├── package.json                       # Dependencies and scripts
├── tsconfig.json                      # TypeScript configuration
├── README.md                          # Full documentation
└── QUICKSTART.md                      # Quick start guide
```

## 🎯 Core Components

### 1. Shopify GraphQL Client (`api/shopify/client.ts`)
- Rate limiting with p-queue (40 req/sec)
- Automatic retry with exponential backoff
- Cost-aware throttling
- Cursor-based pagination
- Error handling for access denied, rate limits

### 2. MongoDB Models (`models/`)

#### ProductVariant
```typescript
{
  shopifyId: string;           // Normalized ID
  shopifyGid: string;          // Full GID
  productId: string;
  title: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  inventoryQuantity: number;
  currentPrice: number;        // AI-optimized price
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
}
```

#### DailyVariantMetrics
```typescript
{
  variantId: string;
  date: Date;
  unitsSold: number;
  revenue: number;
  grossRevenue: number;
  discountAmount: number;
  discountRate: number;
  refundAmount: number;
  refundRate: number;
  avgOrderValue: number;
  orderCount: number;
  uniqueCustomers: number;
  inventoryStart: number;
  inventoryEnd: number;
  sellThroughRate: number;     // Key metric for pricing
  priceAtTime: number;
}
```

#### CustomerMetrics
```typescript
{
  shopifyId: string;
  email?: string;
  ordersCount: number;
  totalSpent: number;
  avgOrderValue: number;
  repeatPurchaseRate: number;
  lifetimeValue: number;
  isRepeatCustomer: boolean;
  firstOrderDate?: Date;
  lastOrderDate?: Date;
}
```

#### Order
```typescript
{
  shopifyId: string;
  orderNumber: number;
  customerId?: string;
  financialStatus: string;
  totalPrice: number;
  totalDiscount: number;
  lineItems: Array<{
    variantId: string;
    quantity: number;
    price: number;
    totalDiscount: number;
  }>;
  refunds?: Array<{
    refundId: string;
    amount: number;
    createdAt: Date;
  }>;
}
```

### 3. Webhook Handlers (`webhooks/handlers.ts`)

All handlers include:
- HMAC signature verification
- Idempotent processing (upsert)
- Error handling and logging
- Shopify ID normalization

**Supported Webhooks:**
- `orders/create` - New orders
- `orders/updated` - Order status changes
- `products/update` - Product/variant updates
- `inventory_levels/update` - Inventory changes
- `refunds/create` - Refund processing

### 4. Aggregation Worker (`workers/aggregation.ts`)

**Daily Variant Metrics:**
- Groups orders by variant
- Calculates: units sold, revenue, discounts, refunds
- Computes: sell-through rate, discount effectiveness
- Tracks unique customers per variant

**Customer Metrics:**
- Aggregates total spend across orders
- Identifies repeat customers
- Calculates lifetime value
- Computes days since last order

**Reconciliation:**
- Full sync from Shopify (last 30 days)
- Ensures data consistency
- Runs nightly at 3 AM

### 5. Pricing Engine (`workers/pricing.ts`)

**Scoring Factors:**
1. **Sales Velocity** (0-100): Based on avg daily sales
2. **Inventory Pressure** (0-100): Days of inventory remaining
3. **Discount Effectiveness** (0-100): Revenue vs discounts
4. **Sell-Through Rate** (0-100): From daily metrics

**Pricing Logic:**
```typescript
High sales + Low inventory    → +3% price
Good sell-through            → +2% price
Low sales + High inventory   → -3% price
Very slow moving             → -5% price
High discount dependency     → -2% price
```

**Safety Rules:**
- Max change: ±5% per run
- Min inventory: 10 units
- Confidence scoring (based on data points)
- Dry-run mode for testing

**Update Process:**
1. Calculate score for each variant
2. Apply safety rules
3. Log recommendations
4. Update Shopify via GraphQL (if not dry-run)
5. Save price history to MongoDB

### 6. REST API (`routes/api.ts`)

**Endpoints:**
- `GET /api/health` - Health check
- `GET /api/variants` - List variants (paginated)
- `GET /api/variants/:id/metrics` - Variant metrics (last N days)
- `GET /api/metrics/summary` - Overall metrics summary
- `GET /api/customers` - Customer list (paginated by LTV)

### 7. Express Server (`index.ts`)

**Features:**
- Express middleware setup
- MongoDB connection
- Cron job scheduling
- Graceful shutdown handling
- Error middleware

**Scheduled Jobs:**
```typescript
Hourly    → aggregateDailyVariantMetrics()
2:00 AM   → runPricingEngine()
3:00 AM   → runReconciliation()
```

## 🔄 Data Flow

```
┌─────────────┐
│   Shopify   │
└──────┬──────┘
       │
       │ Webhooks (real-time)
       ├──────────────────────┐
       │                      │
       ▼                      ▼
┌─────────────┐        ┌──────────────┐
│   Orders    │        │   Products   │
│  Inventory  │        │  Inventory   │
└──────┬──────┘        └──────┬───────┘
       │                      │
       └──────────┬───────────┘
                  │
                  ▼
           ┌─────────────┐
           │   MongoDB   │
           └──────┬──────┘
                  │
                  │ Aggregation Worker (hourly)
                  ▼
          ┌───────────────┐
          │ Daily Metrics │
          └───────┬───────┘
                  │
                  │ Pricing Engine (daily)
                  ▼
          ┌───────────────┐
          │ Price Updates │
          └───────┬───────┘
                  │
                  │ GraphQL API
                  ▼
           ┌─────────────┐
           │   Shopify   │
           └─────────────┘
```

## 🚀 Usage Commands

```bash
# Install dependencies
npm install

# Initial data ingestion
npm run ingest

# Start development server
npm run dev

# Run aggregation manually
npm run worker

# Run pricing engine (dry-run)
npm run pricing

# Type checking
npm run typecheck

# Build for production
npm run build

# Start production server
npm start
```

## 🎯 Key Features

✅ **Fully Typed** - Complete TypeScript coverage
✅ **Rate Limited** - Respects Shopify API limits
✅ **Retries** - Automatic retry with exponential backoff
✅ **Idempotent** - Webhook handlers use upsert
✅ **Paginated** - Handles large datasets efficiently
✅ **Secure** - HMAC verification on webhooks
✅ **Monitored** - Structured logging with Pino
✅ **Scheduled** - Cron jobs for automation
✅ **Safe** - Price change limits and dry-run mode
✅ **Scalable** - MongoDB indexes and connection pooling

## 📊 Metrics Computed

**Variant Level:**
- Units sold, Revenue, Gross revenue
- Discount amount & rate
- Refund amount & rate
- Average order value
- Unique customers
- Sell-through rate
- Inventory turnover

**Customer Level:**
- Total orders, Total spent
- Average order value
- Repeat purchase rate
- Lifetime value
- Days since last order

**Summary Level:**
- Total revenue, Total orders
- Average order value
- Top-performing variants
- Customer segments

## 🔧 Configuration

All configuration via environment variables:
- MongoDB connection
- Shopify credentials
- Rate limits
- Pricing rules (max change, min inventory)
- Cron schedules
- Dry-run mode
- Log level

## 📈 Production Ready

- Error handling throughout
- Graceful shutdown
- Connection pooling
- Index optimization
- Retry logic
- Rate limiting
- Logging
- Environment-based config
- Type safety

---

**Total Files Created:** 18
**Lines of Code:** ~2,500+
**Tech Stack:** TypeScript, Express, MongoDB, Mongoose, Shopify GraphQL API

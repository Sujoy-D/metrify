# Metrify - Shopify Analytics & AI-Driven Pricing Backend

A production-ready backend system for ingesting Shopify store metrics, computing aggregated analytics, and applying AI-driven pricing decisions.

## 🏗️ Architecture

```
backend/
├── src/
│   ├── api/
│   │   └── shopify/
│   │       ├── client.ts         # GraphQL client with rate limiting
│   │       └── queries.ts        # Shopify GraphQL queries
│   ├── config/
│   │   └── index.ts              # Configuration management
│   ├── models/
│   │   ├── ProductVariant.ts     # Product variant schema
│   │   ├── DailyVariantMetrics.ts # Daily aggregated metrics
│   │   ├── CustomerMetrics.ts    # Customer analytics
│   │   └── Order.ts              # Order data
│   ├── routes/
│   │   ├── api.ts                # REST API endpoints
│   │   └── webhooks.ts           # Shopify webhook handlers
│   ├── utils/
│   │   ├── logger.ts             # Pino logger
│   │   └── shopify.ts            # Shopify utilities
│   ├── webhooks/
│   │   └── handlers.ts           # Webhook processing logic
│   ├── workers/
│   │   ├── aggregation.ts        # Metrics aggregation worker
│   │   └── pricing.ts            # AI pricing engine
│   └── index.ts                  # Express app entry point
├── package.json
├── tsconfig.json
└── .env.example
```

## 🚀 Features

### Shopify Ingestion Layer
- ✅ GraphQL client with automatic rate limiting
- ✅ Cursor-based pagination for large datasets
- ✅ Retry logic with exponential backoff
- ✅ Cost-aware query throttling

### Real-time Webhook Processing
- ✅ `orders/create` - New order ingestion
- ✅ `orders/updated` - Order status updates
- ✅ `products/update` - Product/variant changes
- ✅ `inventory_levels/update` - Inventory tracking
- ✅ `refunds/create` - Refund processing
- ✅ HMAC signature verification
- ✅ Idempotent processing

### MongoDB Data Models
- **ProductVariant**: Tracks variants, prices, inventory, and price history
- **DailyVariantMetrics**: Daily aggregated sales, revenue, discounts, refunds
- **CustomerMetrics**: Customer lifetime value, repeat purchase rate
- **Order**: Complete order data with line items and refunds

### Aggregation Worker
- ✅ Daily metrics computation
- ✅ Sell-through rate calculation
- ✅ Discount effectiveness analysis
- ✅ Customer behavior analytics
- ✅ Scheduled cron jobs

### AI Pricing Engine
- ✅ Multi-factor scoring:
  - Sales velocity
  - Inventory pressure
  - Discount effectiveness
  - Sell-through rate
- ✅ Safety rules:
  - Maximum price change limits
  - Minimum inventory thresholds
- ✅ Dry-run mode for testing
- ✅ Confidence scoring
- ✅ Price update batching

## 📦 Installation

```bash
cd backend
npm install
```

## ⚙️ Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Required Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/metrify

# Shopify
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_API_SECRET=your_api_secret_here
SHOPIFY_HOST=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_your_access_token
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret

# Pricing Engine
PRICING_MAX_CHANGE_PERCENT=5
PRICING_MIN_INVENTORY_THRESHOLD=10
PRICING_DRY_RUN=true
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Run Workers Manually

**Aggregation Worker:**
```bash
npm run worker
```

**Pricing Engine:**
```bash
npm run pricing
```

## 📊 API Endpoints

### Health Check
```bash
GET /api/health
```

### Get Variants
```bash
GET /api/variants?page=1&limit=50
```

### Get Variant Metrics
```bash
GET /api/variants/:id/metrics?days=30
```

### Get Metrics Summary
```bash
GET /api/metrics/summary?days=30
```

### Get Customers
```bash
GET /api/customers?page=1&limit=50
```

## 🪝 Webhook Endpoints

All webhooks are available at: `/webhooks/*`

Example:
```
POST /webhooks/orders/create
POST /webhooks/orders/updated
POST /webhooks/products/update
POST /webhooks/inventory_levels/update
POST /webhooks/refunds/create
```

## 🔄 Cron Jobs

The application automatically schedules:

- **Hourly**: Metrics aggregation
- **2:00 AM**: Pricing engine updates
- **3:00 AM**: Full Shopify reconciliation

Configure schedules in `.env`:
```env
AGGREGATION_CRON_SCHEDULE=0 * * * *
PRICING_CRON_SCHEDULE=0 2 * * *
RECONCILIATION_CRON_SCHEDULE=0 3 * * *
```

## 🧪 Testing the Pricing Engine

1. Set dry-run mode:
```env
PRICING_DRY_RUN=true
```

2. Run the pricing engine:
```bash
npm run pricing
```

3. Check logs for recommendations without applying changes

4. When ready, set `PRICING_DRY_RUN=false` to enable live updates

## 📈 Data Flow

1. **Webhooks** → Real-time order/product updates → MongoDB
2. **Aggregation Worker** → Computes daily metrics → `DailyVariantMetrics`
3. **Pricing Engine** → Analyzes metrics → Updates prices via Shopify API
4. **Reconciliation** → Periodic full sync from Shopify → Ensures data consistency

## 🔒 Security

- HMAC signature verification on all webhooks
- Environment variable secrets
- Rate limiting on Shopify API calls
- Input validation and sanitization

## 🛠️ Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Framework**: Express
- **Database**: MongoDB + Mongoose
- **API Client**: Axios with p-queue for rate limiting
- **Scheduling**: node-cron
- **Logging**: Pino

## 📝 Development

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

## 🚀 Deployment

1. Build the project:
```bash
npm run build
```

2. Set production environment variables

3. Start the server:
```bash
NODE_ENV=production npm start
```

### Docker (Optional)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## 📊 Monitoring

The application logs all operations using Pino. In production, pipe logs to a monitoring service:

```bash
npm start | pino-cloudwatch
```

## 🤝 Contributing

1. Ensure TypeScript types are correct
2. Follow the existing code structure
3. Add error handling
4. Update documentation

## 📄 License

MIT

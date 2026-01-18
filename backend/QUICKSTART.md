# Metrify Backend - Quick Start Guide

## Prerequisites

- Node.js 20+
- MongoDB (local or cloud)
- Shopify store with custom app credentials

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/metrify

# Shopify Credentials
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_HOST=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_your_access_token
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret

# Keep these for testing
PRICING_DRY_RUN=true
```

## Step 3: Initial Data Ingestion

Run the ingestion script to populate your database:

```bash
npm run ingest
```

This will:
- Fetch all products and variants
- Import last 90 days of orders
- Sync customer data

Expected output:
```
✓ Connected to MongoDB
✓ Starting product ingestion...
✓ Ingested 250 product variants
✓ Starting order ingestion...
✓ Ingested 1,523 orders
✓ Starting customer ingestion...
✓ Ingested 487 customers
✓ Ingestion complete (45.2s)
```

## Step 4: Run Aggregation

Generate initial metrics:

```bash
npm run worker
```

This computes:
- Daily variant metrics (sales, revenue, discounts)
- Customer lifetime value
- Sell-through rates

## Step 5: Test Pricing Engine (Dry Run)

```bash
npm run pricing
```

Review pricing recommendations without making changes:
```
Price update recommended:
  Variant: gid://shopify/ProductVariant/123
  Current: $49.99 → Suggested: $51.49 (+3%)
  Reason: High demand with low inventory
  Confidence: 85%
  [DRY RUN - No changes made]
```

## Step 6: Start the Server

```bash
npm run dev
```

Server will start on http://localhost:3000

## Step 7: Test API Endpoints

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Get Metrics Summary
```bash
curl http://localhost:3000/api/metrics/summary?days=30
```

### Get Variants
```bash
curl http://localhost:3000/api/variants?page=1&limit=10
```

### Get Variant Metrics
```bash
curl http://localhost:3000/api/variants/VARIANT_ID/metrics?days=30
```

## Step 8: Configure Webhooks in Shopify

In your Shopify admin:

1. Go to Settings → Apps and sales channels → Develop apps
2. Select your app → Configuration
3. Add webhooks:

```
orders/create          → https://your-domain.com/webhooks/orders/create
orders/updated         → https://your-domain.com/webhooks/orders/updated
products/update        → https://your-domain.com/webhooks/products/update
inventory_levels/update → https://your-domain.com/webhooks/inventory_levels/update
refunds/create         → https://your-domain.com/webhooks/refunds/create
```

## Step 9: Enable Live Pricing (Optional)

When ready to apply pricing changes:

1. Edit `.env`:
```env
PRICING_DRY_RUN=false
```

2. Restart server:
```bash
npm run dev
```

3. Pricing engine will now update Shopify prices automatically

## Scheduled Jobs

The server automatically runs:

- **Every hour**: Metrics aggregation
- **2:00 AM daily**: Pricing updates
- **3:00 AM daily**: Full reconciliation

## Monitoring Logs

Logs are output to console with color formatting in development:

```
[12:34:56] INFO: Server started
  port: 3000
  env: development
  
[12:35:01] INFO: Running scheduled aggregation
[12:35:15] INFO: Aggregation complete: 250 variants processed
```

## Troubleshooting

### MongoDB Connection Error
```bash
# Start MongoDB locally
brew services start mongodb-community
# or
docker run -d -p 27017:27017 mongo
```

### Shopify API Access Denied
- Verify access token has correct scopes
- Check that protected customer data access is approved
- Ensure API version is supported (2024-10)

### Rate Limiting
- Configured for 40 requests/second (Shopify's limit)
- Automatically throttles when approaching limit
- Retries failed requests with backoff

## Next Steps

1. **Review pricing recommendations** in dry-run mode
2. **Adjust pricing rules** in `src/workers/pricing.ts`
3. **Customize metrics** in `src/workers/aggregation.ts`
4. **Add monitoring** (Datadog, New Relic, etc.)
5. **Deploy to production** (AWS, Heroku, Railway)

## Production Deployment

### Build for production:
```bash
npm run build
```

### Set production environment:
```bash
NODE_ENV=production npm start
```

### Environment variables to change:
```env
NODE_ENV=production
LOG_LEVEL=warn
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/metrify
APP_URL=https://your-production-domain.com
```

## Support

For issues or questions:
1. Check logs for error messages
2. Review MongoDB data integrity
3. Verify Shopify API credentials
4. Test with dry-run mode first

## Key Files

- `src/index.ts` - Main server
- `src/workers/ingestion.ts` - Data ingestion
- `src/workers/aggregation.ts` - Metrics computation
- `src/workers/pricing.ts` - Pricing engine
- `src/api/shopify/client.ts` - Shopify API client
- `src/models/` - MongoDB schemas

Happy analyzing! 📊

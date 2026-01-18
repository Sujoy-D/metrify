# 🚀 Complete Pipeline - Step by Step Guide

## Prerequisites ✅

Before running the pipeline, ensure:
- ✅ MongoDB Atlas is connected (you've done this!)
- ✅ Backend server dependencies installed (`npm install`)
- ⚠️ **NEED: Shopify Access Token** (see GET_SHOPIFY_TOKEN.md)

---

## 🔐 FIRST: Get Your Shopify Access Token

1. Go to: https://admin.shopify.com/store/kiko-10882075/settings/apps/development
2. Click on **"metrify"**
3. Go to **"API credentials"** tab
4. Copy **"Admin API access token"** (starts with `shpat_`)
5. Edit `/backend/.env`:
   ```
   SHOPIFY_ACCESS_TOKEN=shpat_your_actual_token_here
   ```

---

## 🎯 Option 1: Run Full Pipeline Automatically

```bash
cd /Users/sujoydas/PycharmProjects/metrify/backend
./run-pipeline.sh
```

This will:
1. ✅ Verify configuration
2. 📥 Ingest all products, orders (90 days), customers
3. 📊 Compute daily metrics & analytics
4. 💰 Analyze pricing opportunities (dry-run)
5. 📈 Show summary statistics

**Estimated time:** 5-10 minutes (depends on store size)

---

## 🎯 Option 2: Run Steps Manually

### Step 1: Ingest Data from Shopify
```bash
npm run ingest
```
**What it does:**
- Fetches all products & variants
- Imports orders from last 90 days
- Syncs customer data
- Normalizes Shopify IDs
- Saves to MongoDB

**Expected output:**
```
✓ Starting product ingestion
✓ Ingested 250 product variants
✓ Starting order ingestion
✓ Ingested 1,523 orders
✓ Starting customer ingestion
✓ Ingested 487 customers
✓ Ingestion complete (45.2s)
```

---

### Step 2: Run Aggregation Worker
```bash
npm run worker
```
**What it does:**
- Computes daily variant metrics
- Calculates sell-through rates
- Analyzes discount effectiveness
- Computes customer lifetime value
- Identifies repeat customers

**Expected output:**
```
✓ Aggregating daily variant metrics
✓ Found 156 orders for aggregation
✓ Aggregation complete: 250 variants processed
✓ Aggregating customer metrics
✓ Processing 487 customers
✓ Customer metrics aggregation complete
```

---

### Step 3: Run Pricing Engine (Dry Run)
```bash
npm run pricing
```
**What it does:**
- Scores all active variants
- Calculates optimal prices
- Applies safety rules
- Shows recommendations WITHOUT applying

**Expected output:**
```
✓ Starting pricing engine (dryRun: true)
✓ Processing 250 variants

Price update recommended:
  Variant: Blue T-Shirt (SKU: BLUE-TEE-M)
  Current: $29.99 → Suggested: $30.89 (+3%)
  Reason: High demand with low inventory
  Confidence: 85%
  [DRY RUN - No changes made]

✓ Pricing engine completed
  Total variants: 250
  Analyzed: 245
  Updates recommended: 15
```

---

### Step 4: Start the API Server
```bash
npm run dev
```
**What it does:**
- Starts Express server on port 3000
- Enables REST API endpoints
- Schedules cron jobs
- Listens for webhooks

**Server will run at:** http://localhost:3000

---

## 📊 Verify Everything Worked

### Check Database
```bash
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  console.log('📊 Collections:');
  console.log('  Products:', await db.collection('productvariants').countDocuments());
  console.log('  Orders:', await db.collection('orders').countDocuments());
  console.log('  Customers:', await db.collection('customermetrics').countDocuments());
  console.log('  Metrics:', await db.collection('dailyvariantmetrics').countDocuments());
  await mongoose.connection.close();
});
"
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:3000/api/health

# Get summary
curl http://localhost:3000/api/metrics/summary?days=30

# Get variants
curl http://localhost:3000/api/variants?limit=5

# Get top customers
curl http://localhost:3000/api/customers?limit=10
```

---

## 🎨 View Data in MongoDB Atlas

1. Go to: https://cloud.mongodb.com/
2. Login with your account
3. Select your cluster: **metrify-data**
4. Click **"Browse Collections"**
5. Select database: **metrify**

You'll see collections:
- **productvariants** - All product data
- **orders** - Order history
- **dailyvariantmetrics** - Daily analytics
- **customermetrics** - Customer insights

---

## 🔄 Schedule Automatic Jobs

The server automatically runs:
- **Every hour** → Metrics aggregation
- **2:00 AM daily** → Pricing updates
- **3:00 AM daily** → Full reconciliation

To customize schedules, edit `.env`:
```env
AGGREGATION_CRON_SCHEDULE=0 * * * *      # Hourly
PRICING_CRON_SCHEDULE=0 2 * * *          # 2 AM daily
RECONCILIATION_CRON_SCHEDULE=0 3 * * *   # 3 AM daily
```

---

## 💰 Enable Live Pricing Updates

After testing in dry-run mode:

1. Edit `.env`:
   ```env
   PRICING_DRY_RUN=false
   ```

2. Run pricing engine:
   ```bash
   npm run pricing
   ```

3. Prices will be updated in Shopify! 🎉

---

## 🐛 Troubleshooting

### "Access Denied" Errors
- Check if Shopify access token is correct
- Verify scopes include: `read_products`, `read_orders`, `read_customers`
- For orders/customers: Request "Protected Customer Data Access"

### No Data After Ingestion
- Check Shopify has products/orders
- Verify date range (last 90 days)
- Check terminal output for errors

### MongoDB Connection Failed
- Verify connection string in `.env`
- Check MongoDB Atlas IP whitelist
- Ensure password doesn't contain special characters

### Port 3000 Already in Use
```bash
lsof -ti:3000 | xargs kill -9
```

---

## 📚 Available Commands

```bash
npm run dev       # Start server (with hot reload)
npm run build     # Build TypeScript to JavaScript
npm start         # Start production server
npm run ingest    # Load data from Shopify
npm run worker    # Run aggregation
npm run pricing   # Run pricing engine
npm run typecheck # Check TypeScript types
npm run lint      # Lint code
```

---

## 🎯 Quick Reference

**Configuration:** `/backend/.env`
**Logs:** Console output (development)
**Database:** MongoDB Atlas → metrify database
**API:** http://localhost:3000
**Docs:** `/backend/README.md`

---

## ✅ Success Checklist

- [ ] MongoDB Atlas connected
- [ ] Shopify access token configured
- [ ] Data ingested successfully
- [ ] Metrics aggregated
- [ ] Pricing recommendations generated
- [ ] API server running
- [ ] Tested API endpoints

---

**Ready to start?** Just add your Shopify access token to `.env` and run:

```bash
./run-pipeline.sh
```

🚀 Let's go!

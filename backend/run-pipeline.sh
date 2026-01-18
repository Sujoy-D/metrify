#!/bin/bash

# Metrify Backend - Complete Pipeline Runner
# This script runs the entire data pipeline from Shopify ingestion to pricing

set -e  # Exit on error

echo "🚀 Metrify Backend - Complete Pipeline"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Must run from backend/ directory${NC}"
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    echo "Copy .env.example to .env and configure it first"
    exit 1
fi

# Load environment variables
source .env

# Check critical env vars
if [ "$SHOPIFY_ACCESS_TOKEN" = "shpat_your_access_token_here" ] || [ -z "$SHOPIFY_ACCESS_TOKEN" ]; then
    echo -e "${RED}❌ Error: SHOPIFY_ACCESS_TOKEN not configured in .env${NC}"
    echo ""
    echo "To get your access token:"
    echo "1. Go to https://admin.shopify.com/store/kiko-10882075/settings/apps/development"
    echo "2. Click on your 'metrify' app"
    echo "3. Go to 'API credentials' tab"
    echo "4. Copy the 'Admin API access token'"
    echo "5. Add it to .env: SHOPIFY_ACCESS_TOKEN=shpat_xxxxx"
    exit 1
fi

echo -e "${GREEN}✓${NC} Environment configured"
echo ""

# Step 1: Install dependencies
echo -e "${YELLOW}Step 1/5: Installing dependencies...${NC}"
npm install --silent
echo -e "${GREEN}✓${NC} Dependencies installed"
echo ""

# Step 2: Ingest data from Shopify
echo -e "${YELLOW}Step 2/5: Ingesting data from Shopify...${NC}"
echo "This will fetch:"
echo "  - All products and variants"
echo "  - Orders from last 90 days"
echo "  - All customers"
echo ""
npm run ingest

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Data ingestion completed"
else
    echo -e "${RED}❌${NC} Data ingestion failed"
    exit 1
fi
echo ""

# Step 3: Run aggregation
echo -e "${YELLOW}Step 3/5: Computing daily metrics...${NC}"
echo "This will calculate:"
echo "  - Sales, revenue, discounts per variant"
echo "  - Sell-through rates"
echo "  - Customer lifetime value"
echo ""
npm run worker

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Metrics aggregation completed"
else
    echo -e "${RED}❌${NC} Aggregation failed"
    exit 1
fi
echo ""

# Step 4: Test pricing engine (dry run)
echo -e "${YELLOW}Step 4/5: Running pricing engine (DRY RUN)...${NC}"
echo "This will analyze pricing opportunities without making changes"
echo ""
npm run pricing

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Pricing analysis completed"
else
    echo -e "${RED}❌${NC} Pricing analysis failed"
    exit 1
fi
echo ""

# Step 5: Show summary
echo -e "${YELLOW}Step 5/5: Pipeline Summary${NC}"
echo ""

# Query MongoDB for stats
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  
  const variants = await db.collection('productvariants').countDocuments();
  const orders = await db.collection('orders').countDocuments();
  const customers = await db.collection('customermetrics').countDocuments();
  const metrics = await db.collection('dailyvariantmetrics').countDocuments();
  
  console.log('📊 Database Summary:');
  console.log('  • Product Variants:', variants);
  console.log('  • Orders:', orders);
  console.log('  • Customers:', customers);
  console.log('  • Daily Metrics:', metrics);
  console.log('');
  
  await mongoose.connection.close();
  process.exit(0);
}).catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
"

echo ""
echo -e "${GREEN}✅ Pipeline Complete!${NC}"
echo ""
echo "Next steps:"
echo "  • Start the server: npm run dev"
echo "  • View API docs: curl http://localhost:3000/api/health"
echo "  • Get metrics: curl http://localhost:3000/api/metrics/summary"
echo ""
echo "To enable live pricing updates:"
echo "  1. Edit .env and set: PRICING_DRY_RUN=false"
echo "  2. Run: npm run pricing"
echo ""

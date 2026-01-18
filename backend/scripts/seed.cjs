// backend/scripts/seed.cjs
require("dotenv").config();
const mongoose = require("mongoose");

async function seed() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing. Populate backend/.env first.");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  // Reset collections used by the API routes
  await Promise.all([
    db.collection("productvariants").deleteMany({}),
    db.collection("orders").deleteMany({}),
    db.collection("customermetrics").deleteMany({}),
    db.collection("dailyvariantmetrics").deleteMany({}),
  ]);

  // Use IDs that line up across collections
  const variantId = "123456"; // must match ProductVariant.shopifyId AND DailyVariantMetrics.variantId
  const customerId = "cust_1";

  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  // 1) Product Variant (used by /api/variants and to enrich topVariants)
  await db.collection("productvariants").insertOne({
    shopifyId: variantId,
    shopifyGid: `gid://shopify/ProductVariant/${variantId}`,
    title: "Sample T-Shirt / Medium",
    sku: "SAMPLE-TEE-M",
    price: 29.99,
    compareAtPrice: 39.99,
    inventoryQuantity: 42,
    metadata: { tags: [] },
    priceHistory: [],
    createdAt: now,
    updatedAt: now,
  });

  // 2) Order (used for totalOrders; also used by aggregation worker logic)
  // Order schema expects numeric totals and lineItems with variantId, price, totalDiscount, etc. :contentReference[oaicite:3]{index=3}
  await db.collection("orders").insertOne({
    shopifyId: "order_1",
    shopifyGid: "gid://shopify/Order/1",
    orderNumber: 1,
    email: "test@example.com",
    customerId,
    financialStatus: "PAID",
    fulfillmentStatus: "FULFILLED",
    subtotalPrice: 29.99,
    totalTax: 0,
    totalDiscount: 0,
    totalPrice: 29.99,
    lineItems: [
      {
        variantId,
        variantGid: `gid://shopify/ProductVariant/${variantId}`,
        productId: "prod_1",
        title: "Sample T-Shirt / Medium",
        quantity: 1,
        price: 29.99,
        totalDiscount: 0,
        sku: "SAMPLE-TEE-M",
      },
    ],
    refunds: [],
    createdAt: now,
    processedAt: now,
    cancelledAt: null,
    updatedAt: now,
  });

  // 3) Customer Metrics (used by /api/customers and totalCustomers count)
  await db.collection("customermetrics").insertOne({
    shopifyId: customerId,
    shopifyGid: "gid://shopify/Customer/1",
    email: "test@example.com",
    firstName: "Test",
    lastName: "Customer",
    ordersCount: 1,
    totalSpent: 29.99,
    avgOrderValue: 29.99,
    repeatPurchaseRate: 0,
    lifetimeValue: 29.99,
    isRepeatCustomer: false,
    tags: [],
    createdAt: now,
    updatedAt: now,
  });

  // 4) Daily Variant Metrics (THIS is what drives totalRevenue + topVariants)
  // Must have `revenue` + `variantId` + `date` in-range :contentReference[oaicite:4]{index=4}
  // Schema requires inventoryStart, inventoryEnd, priceAtTime, aggregatedAt, etc. :contentReference[oaicite:5]{index=5}
  await db.collection("dailyvariantmetrics").insertOne({
    variantId,
    date: startOfToday,
    unitsSold: 1,
    revenue: 29.99,
    grossRevenue: 29.99,
    discountAmount: 0,
    discountRate: 0,
    refundAmount: 0,
    refundRate: 0,
    refundCount: 0,
    avgOrderValue: 29.99,
    orderCount: 1,
    uniqueCustomers: 1,
    inventoryStart: 43, // inventoryEnd + unitsSold
    inventoryEnd: 42,
    sellThroughRate: (1 / 43) * 100,
    priceAtTime: 29.99,
    compareAtPriceAtTime: 39.99,
    aggregatedAt: now,
    createdAt: now,
    updatedAt: now,
  });

  console.log("✅ Seed complete");
  await mongoose.connection.close();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});

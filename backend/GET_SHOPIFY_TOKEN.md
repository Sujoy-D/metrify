# Getting Your Shopify Access Token

## Quick Steps

### 1. Go to Your Shopify Admin
Open: https://admin.shopify.com/store/kiko-10882075/settings/apps/development

### 2. Find Your App
Click on **"metrify"** in the list of apps

### 3. Get API Credentials
- Click the **"API credentials"** tab
- Scroll down to **"Admin API access token"**
- Click **"Reveal token once"** (if not shown)
- Copy the token (starts with `shpat_`)

### 4. Update Your .env File
Open `/Users/sujoydas/PycharmProjects/metrify/backend/.env`

Find this line:
```
SHOPIFY_ACCESS_TOKEN=shpat_your_access_token_here
```

Replace with your actual token:
```
SHOPIFY_ACCESS_TOKEN=shpat_abc123def456...
```

### 5. (Optional) Get API Secret
While you're there, also copy:
- **API secret key** → Update `SHOPIFY_API_SECRET=`

### 6. Save the .env file

---

## Alternative: Use GraphQL App in Shopify Admin

If you have access to the GraphQL App in Shopify:

1. Go to: https://kiko-10882075.myshopify.com/admin/apps
2. Install "Shopify GraphiQL App" (if not installed)
3. The access token is automatically used

---

## After You Have the Token

Run the complete pipeline:
```bash
cd /Users/sujoydas/PycharmProjects/metrify/backend
./run-pipeline.sh
```

Or run steps individually:
```bash
npm run ingest    # Step 1: Load data from Shopify
npm run worker    # Step 2: Compute metrics
npm run pricing   # Step 3: Analyze pricing (dry-run)
npm run dev       # Step 4: Start API server
```

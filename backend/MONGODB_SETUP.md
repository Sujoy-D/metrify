# MongoDB Setup Guide

## 📍 Where to Configure MongoDB

The MongoDB connection is configured in:
```
/backend/.env
```

Look for the `MONGODB_URI` variable (line 9-13).

---

## Option 1: Local MongoDB (Easiest for Development)

### Install MongoDB Locally

**macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

**Check if running:**
```bash
brew services list | grep mongodb
```

### Configure in `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/metrify
```

### Test Connection:
```bash
cd backend
npm install
npm run dev
```

You should see:
```
✓ Connected to MongoDB
✓ Server started on port 3000
```

---

## Option 2: MongoDB Atlas (Cloud - Free Tier Available)

### Setup Steps:

1. **Go to**: https://www.mongodb.com/cloud/atlas/register

2. **Create Free Cluster**:
   - Choose AWS or Google Cloud
   - Select free tier (M0)
   - Region: Choose closest to you

3. **Create Database User**:
   - Security → Database Access
   - Add New Database User
   - Username: `metrify_user`
   - Password: Generate strong password
   - Role: Read and write to any database

4. **Whitelist IP**:
   - Security → Network Access
   - Add IP Address
   - For development: `0.0.0.0/0` (allow all)
   - For production: Add your server IP

5. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

### Configure in `.env`:
```env
MONGODB_URI=mongodb+srv://metrify_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/metrify?retryWrites=true&w=majority
```

---

## Option 3: Docker MongoDB (Isolated)

### Run MongoDB in Docker:
```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:7.0
```

### Configure in `.env`:
```env
MONGODB_URI=mongodb://admin:password@localhost:27017/metrify?authSource=admin
```

---

## 🧪 Testing Your MongoDB Connection

### Quick Test:
```bash
cd backend
npm install
node -e "require('mongoose').connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/metrify').then(() => console.log('✓ Connected')).catch(e => console.error('✗ Failed:', e.message))"
```

### Or run the server:
```bash
npm run dev
```

**Success looks like:**
```
[INFO]: Connected to MongoDB
  uri: mongodb://localhost:27017/metrify
  poolSize: 10
[INFO]: Server started
  port: 3000
```

**Failure looks like:**
```
[ERROR]: Failed to connect to MongoDB
  error: connect ECONNREFUSED 127.0.0.1:27017
```

---

## 📊 Verify Database After Running

### Using MongoDB Compass (GUI):
1. Download: https://www.mongodb.com/try/download/compass
2. Connect to: `mongodb://localhost:27017`
3. Look for `metrify` database
4. Check collections: `productvariants`, `orders`, `customermetrics`, etc.

### Using MongoDB Shell:
```bash
mongosh mongodb://localhost:27017/metrify

# List collections
show collections

# Count documents
db.productvariants.countDocuments()
db.orders.countDocuments()
```

---

## 🚀 Full Setup Workflow

```bash
# 1. Start MongoDB (if local)
brew services start mongodb-community@7.0

# 2. Install dependencies
cd backend
npm install

# 3. Configure .env (already done)
# Edit MONGODB_URI if needed

# 4. Test connection
npm run dev

# 5. Load initial data from Shopify
npm run ingest

# 6. Verify data loaded
mongosh mongodb://localhost:27017/metrify
> db.productvariants.countDocuments()
> db.orders.countDocuments()
```

---

## 🔍 Common Issues

### Issue: "ECONNREFUSED 127.0.0.1:27017"
**Solution**: MongoDB is not running
```bash
# Start MongoDB
brew services start mongodb-community@7.0

# Or check status
brew services list
```

### Issue: "Authentication failed"
**Solution**: Check username/password in connection string
```env
# Correct format:
MONGODB_URI=mongodb://username:password@host:port/database
```

### Issue: "Network timeout"
**Solution**: 
- Check firewall settings
- For Atlas: Verify IP whitelist
- Check network connection

### Issue: "Too many connections"
**Solution**: Lower pool size in `.env`:
```env
MONGODB_MAX_POOL_SIZE=5
```

---

## 📝 Current Configuration

Your current `.env` file is set to:
```env
MONGODB_URI=mongodb://localhost:27017/metrify
```

This assumes MongoDB is running **locally on port 27017**.

**To change it:**
1. Open `/backend/.env`
2. Edit line 11: `MONGODB_URI=your_connection_string`
3. Restart the server: `npm run dev`

---

## 🎯 Next Steps After MongoDB is Connected

1. ✅ Verify connection: `npm run dev`
2. ✅ Load data: `npm run ingest`
3. ✅ Run aggregation: `npm run worker`
4. ✅ Test pricing: `npm run pricing`
5. ✅ Query API: `curl localhost:3000/api/health`

---

## 💡 Pro Tips

- **Development**: Use local MongoDB (faster)
- **Production**: Use MongoDB Atlas (managed, backups)
- **Testing**: Use separate database: `metrify_test`
- **Backups**: Use `mongodump` for local, Atlas has auto-backup

Need help? Check logs for connection errors:
```bash
npm run dev
```

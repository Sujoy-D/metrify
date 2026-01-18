import express from 'express';
import mongoose from 'mongoose';
import cron from 'node-cron';
import config from './config/index.js';
import logger from './utils/logger.js';
import webhooksRouter from './routes/webhooks.js';
import apiRouter from './routes/api.js';
import { aggregateDailyVariantMetrics, aggregateCustomerMetrics, runReconciliation } from './workers/aggregation.js';
import { runPricingEngine } from './workers/pricing.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip,
  });
  next();
});

// Routes
app.use('/webhooks', webhooksRouter);
app.use('/api', apiRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Metrify Analytics Backend',
    version: '1.0.0',
    status: 'running',
  });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    url: req.url,
  });
  
  res.status(500).json({
    error: 'Internal server error',
    message: config.node_env === 'development' ? err.message : undefined,
  });
});

/**
 * Initialize database connection
 */
async function connectDatabase() {
  try {
    await mongoose.connect(config.mongodb.uri, {
      maxPoolSize: config.mongodb.maxPoolSize,
    });
    logger.info('Connected to MongoDB', { uri: config.mongodb.uri });
  } catch (error: any) {
    logger.error('Failed to connect to MongoDB', { error: error.message });
    process.exit(1);
  }
}

/**
 * Setup cron jobs
 */
function setupCronJobs() {
  // Hourly aggregation
  cron.schedule(config.workers.aggregationCron, async () => {
    logger.info('Running scheduled aggregation');
    try {
      await aggregateDailyVariantMetrics();
      await aggregateCustomerMetrics();
      logger.info('Scheduled aggregation completed');
    } catch (error: any) {
      logger.error('Scheduled aggregation failed', { error: error.message });
    }
  });

  // Nightly pricing updates
  cron.schedule(config.pricing.cronSchedule, async () => {
    logger.info('Running scheduled pricing engine');
    try {
      await runPricingEngine();
      logger.info('Scheduled pricing engine completed');
    } catch (error: any) {
      logger.error('Scheduled pricing engine failed', { error: error.message });
    }
  });

  // Nightly reconciliation
  cron.schedule(config.workers.reconciliationCron, async () => {
    logger.info('Running scheduled reconciliation');
    try {
      await runReconciliation();
      logger.info('Scheduled reconciliation completed');
    } catch (error: any) {
      logger.error('Scheduled reconciliation failed', { error: error.message });
    }
  });

  logger.info('Cron jobs scheduled', {
    aggregation: config.workers.aggregationCron,
    pricing: config.pricing.cronSchedule,
    reconciliation: config.workers.reconciliationCron,
  });
}

/**
 * Start the server
 */
async function startServer() {
  try {
    await connectDatabase();
    
    if (config.node_env !== 'test') {
      setupCronJobs();
    }

    app.listen(config.port, config.host, () => {
      logger.info(`Server started`, {
        port: config.port,
        host: config.host,
        env: config.node_env,
      });
    });
  } catch (error: any) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

// Start the application
startServer();

export default app;

import dotenv from 'dotenv';

dotenv.config();

interface Config {
  node_env: string;
  port: number;
  host: string;
  mongodb: {
    uri: string;
    maxPoolSize: number;
  };
  shopify: {
    apiKey: string;
    apiSecret: string;
    scopes: string[];
    host: string;
    accessToken: string;
    webhookSecret: string;
    apiVersion: string;
    rateLimit: number;
    burstLimit: number;
  };
  app: {
    url: string;
    shopifyAppUrl: string;
  };
  pricing: {
    maxChangePercent: number;
    minInventoryThreshold: number;
    dryRun: boolean;
    cronSchedule: string;
  };
  workers: {
    aggregationCron: string;
    reconciliationCron: string;
  };
  logging: {
    level: string;
  };
}

const config: Config = {
  node_env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/metrify',
    maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '10', 10),
  },
  shopify: {
    apiKey: process.env.SHOPIFY_API_KEY || '',
    apiSecret: process.env.SHOPIFY_API_SECRET || '',
    scopes: (process.env.SHOPIFY_SCOPES || '').split(','),
    host: process.env.SHOPIFY_HOST || '',
    accessToken: process.env.SHOPIFY_ACCESS_TOKEN || '',
    webhookSecret: process.env.SHOPIFY_WEBHOOK_SECRET || '',
    apiVersion: '2024-10',
    rateLimit: parseInt(process.env.SHOPIFY_API_RATE_LIMIT || '40', 10),
    burstLimit: parseInt(process.env.SHOPIFY_API_BURST_LIMIT || '40', 10),
  },
  app: {
    url: process.env.APP_URL || 'http://localhost:3000',
    shopifyAppUrl: process.env.SHOPIFY_APP_URL || '',
  },
  pricing: {
    maxChangePercent: parseFloat(process.env.PRICING_MAX_CHANGE_PERCENT || '5'),
    minInventoryThreshold: parseInt(process.env.PRICING_MIN_INVENTORY_THRESHOLD || '10', 10),
    dryRun: process.env.PRICING_DRY_RUN === 'true',
    cronSchedule: process.env.PRICING_CRON_SCHEDULE || '0 2 * * *',
  },
  workers: {
    aggregationCron: process.env.AGGREGATION_CRON_SCHEDULE || '0 * * * *',
    reconciliationCron: process.env.RECONCILIATION_CRON_SCHEDULE || '0 3 * * *',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

export default config;

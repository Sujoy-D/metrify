import mongoose from 'mongoose';
import config from '../config/index.js';
import logger from './logger.js';

let isConnected = false;

/**
 * Connect to MongoDB
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (isConnected) {
    logger.debug('Using existing MongoDB connection');
    return mongoose;
  }

  try {
    const connection = await mongoose.connect(config.mongodb.uri, {
      maxPoolSize: config.mongodb.maxPoolSize,
    });

    isConnected = true;
    logger.info('MongoDB connected successfully', {
      uri: config.mongodb.uri.replace(/\/\/.*@/, '//***@'), // Hide credentials
      poolSize: config.mongodb.maxPoolSize,
    });

    // Handle connection events
    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error', { error: error.message });
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
      isConnected = true;
    });

    return connection;
  } catch (error: any) {
    logger.error('Failed to connect to MongoDB', {
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    logger.info('MongoDB disconnected successfully');
  } catch (error: any) {
    logger.error('Error disconnecting from MongoDB', { error: error.message });
    throw error;
  }
}

/**
 * Get connection status
 */
export function isConnectedToDatabase(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

/**
 * Get MongoDB connection statistics
 */
export function getConnectionStats() {
  return {
    connected: isConnected,
    readyState: mongoose.connection.readyState,
    name: mongoose.connection.name,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
  };
}

import axios, { AxiosInstance } from 'axios';
import PQueue from 'p-queue';
import pRetry from 'p-retry';
import config from '../../config/index.js';
import logger from '../../utils/logger.js';

export interface ShopifyGraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
  extensions?: {
    cost?: {
      requestedQueryCost: number;
      actualQueryCost: number;
      throttleStatus: {
        maximumAvailable: number;
        currentlyAvailable: number;
        restoreRate: number;
      };
    };
  };
}

export class ShopifyGraphQLClient {
  private client: AxiosInstance;
  private queue: PQueue;
  private shopDomain: string;
  private accessToken: string;

  constructor(shopDomain?: string, accessToken?: string) {
    this.shopDomain = shopDomain || config.shopify.host;
    this.accessToken = accessToken || config.shopify.accessToken;

    this.client = axios.create({
      baseURL: `https://${this.shopDomain}/admin/api/${config.shopify.apiVersion}`,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': this.accessToken,
      },
      timeout: 30000,
    });

    // Rate limiting queue
    this.queue = new PQueue({
      concurrency: 1,
      interval: 1000,
      intervalCap: config.shopify.rateLimit,
    });

    logger.info(`Shopify GraphQL client initialized for ${this.shopDomain}`);
  }

  /**
   * Execute a GraphQL query with rate limiting and retry logic
   */
  async query<T = any>(query: string, variables?: Record<string, any>): Promise<ShopifyGraphQLResponse<T>> {
    return this.queue.add(() => this.executeQuery<T>(query, variables)) as Promise<ShopifyGraphQLResponse<T>>;
  }

  private async executeQuery<T>(query: string, variables?: Record<string, any>): Promise<ShopifyGraphQLResponse<T>> {
    return pRetry(
      async () => {
        try {
          const response = await this.client.post<ShopifyGraphQLResponse<T>>('/graphql.json', {
            query,
            variables,
          });

          // Log throttle status
          const throttleStatus = response.data.extensions?.cost?.throttleStatus;
          if (throttleStatus) {
            logger.debug('Shopify API throttle status', {
              available: throttleStatus.currentlyAvailable,
              maximum: throttleStatus.maximumAvailable,
              restoreRate: throttleStatus.restoreRate,
            });

            // If we're running low on credits, slow down
            if (throttleStatus.currentlyAvailable < throttleStatus.maximumAvailable * 0.2) {
              logger.warn('Shopify API rate limit approaching, throttling requests');
              await this.delay(2000);
            }
          }

          // Check for GraphQL errors
          if (response.data.errors && response.data.errors.length > 0) {
            const error = response.data.errors[0];
            logger.error('GraphQL query error', { error, query: query.substring(0, 100) });
            
            // Don't retry on access denied errors
            if (error.message.includes('ACCESS_DENIED') || error.message.includes('not approved')) {
              throw new pRetry.AbortError(error.message);
            }
          }

          return response.data;
        } catch (error: any) {
          if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            
            // Handle rate limiting (429)
            if (status === 429) {
              const retryAfter = error.response?.headers['retry-after'];
              const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : 5000;
              logger.warn(`Rate limited by Shopify, waiting ${delay}ms`);
              await this.delay(delay);
              throw error; // Retry
            }

            // Don't retry on client errors (4xx except 429)
            if (status && status >= 400 && status < 500 && status !== 429) {
              throw new pRetry.AbortError(`Client error: ${status}`);
            }

            logger.error('Shopify API request failed', {
              status,
              message: error.message,
              data: error.response?.data,
            });
          }

          throw error;
        }
      },
      {
        retries: 3,
        minTimeout: 1000,
        maxTimeout: 10000,
        onFailedAttempt: (error) => {
          logger.warn(`Query attempt ${error.attemptNumber} failed. ${error.retriesLeft} retries left.`, {
            message: error.message,
          });
        },
      }
    );
  }

  /**
   * Paginate through all results using cursor-based pagination
   */
  async *paginateQuery<T = any>(
    query: string,
    variables: Record<string, any> = {},
    pageSize: number = 50,
    dataPath: string[] = []
  ): AsyncGenerator<T[], void, unknown> {
    let hasNextPage = true;
    let cursor: string | null = null;

    while (hasNextPage) {
      const queryWithCursor = cursor
        ? query.replace(/first:\s*\d+/, `first: ${pageSize}, after: "${cursor}"`)
        : query.replace(/first:\s*\d+/, `first: ${pageSize}`);

      const response = await this.query(queryWithCursor, variables);

      if (response.errors && response.errors.length > 0) {
        logger.error('Pagination query failed', { errors: response.errors });
        break;
      }

      if (!response.data) {
        break;
      }

      // Navigate to the data using the path
      let data: any = response.data;
      for (const key of dataPath) {
        data = data?.[key];
      }

      const edges = data?.edges || [];
      const pageInfo = data?.pageInfo;

      if (edges.length > 0) {
        yield edges.map((edge: any) => edge.node);
      }

      hasNextPage = pageInfo?.hasNextPage || false;
      cursor = pageInfo?.endCursor || null;

      if (!hasNextPage) {
        break;
      }

      // Small delay between pages
      await this.delay(100);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get current queue status
   */
  getQueueStatus() {
    return {
      size: this.queue.size,
      pending: this.queue.pending,
    };
  }
}

// Singleton instance
let clientInstance: ShopifyGraphQLClient | null = null;

export function getShopifyClient(shopDomain?: string, accessToken?: string): ShopifyGraphQLClient {
  if (!clientInstance) {
    clientInstance = new ShopifyGraphQLClient(shopDomain, accessToken);
  }
  return clientInstance;
}

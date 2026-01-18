/**
 * Shopify GraphQL queries for data ingestion
 */

export const QUERY_PRODUCTS = `
  query GetProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          title
          handle
          status
          vendor
          productType
          tags
          createdAt
          updatedAt
          variants(first: 100) {
            edges {
              node {
                id
                title
                sku
                price
                compareAtPrice
                inventoryQuantity
                inventoryItem {
                  id
                }
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const QUERY_ORDERS = `
  query GetOrders($first: Int!, $after: String, $query: String) {
    orders(first: $first, after: $after, query: $query, sortKey: CREATED_AT) {
      edges {
        cursor
        node {
          id
          name
          email
          createdAt
          processedAt
          cancelledAt
          displayFinancialStatus
          displayFulfillmentStatus
          customer {
            id
            email
            firstName
            lastName
            ordersCount
            totalSpentV2 {
              amount
              currencyCode
            }
          }
          subtotalPriceSet {
            shopMoney {
              amount
            }
          }
          totalPriceSet {
            shopMoney {
              amount
            }
          }
          totalTaxSet {
            shopMoney {
              amount
            }
          }
          totalDiscountsSet {
            shopMoney {
              amount
            }
          }
          lineItems(first: 250) {
            edges {
              node {
                id
                title
                quantity
                variant {
                  id
                  sku
                }
                product {
                  id
                }
                originalUnitPriceSet {
                  shopMoney {
                    amount
                  }
                }
                discountedUnitPriceSet {
                  shopMoney {
                    amount
                  }
                }
                totalDiscountSet {
                  shopMoney {
                    amount
                  }
                }
              }
            }
          }
          refunds {
            id
            createdAt
            totalRefundedSet {
              shopMoney {
                amount
              }
            }
            refundLineItems(first: 250) {
              edges {
                node {
                  lineItem {
                    id
                    variant {
                      id
                    }
                  }
                  quantity
                  restockType
                  subtotalSet {
                    shopMoney {
                      amount
                    }
                  }
                }
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const QUERY_CUSTOMERS = `
  query GetCustomers($first: Int!, $after: String) {
    customers(first: $first, after: $after, sortKey: UPDATED_AT) {
      edges {
        cursor
        node {
          id
          email
          firstName
          lastName
          ordersCount
          tags
          createdAt
          updatedAt
          totalSpentV2 {
            amount
            currencyCode
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const QUERY_INVENTORY_LEVELS = `
  query GetInventoryLevels($first: Int!, $after: String) {
    inventoryItems(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          variant {
            id
            sku
            product {
              id
            }
          }
          inventoryLevels(first: 10) {
            edges {
              node {
                id
                available
                location {
                  id
                  name
                }
                updatedAt
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const MUTATION_UPDATE_VARIANT_PRICE = `
  mutation UpdateVariantPrice($input: ProductVariantInput!) {
    productVariantUpdate(input: $input) {
      productVariant {
        id
        price
        compareAtPrice
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const MUTATION_BULK_UPDATE_VARIANTS = `
  mutation BulkUpdateVariants($variants: [ProductVariantsBulkInput!]!) {
    productVariantsBulkUpdate(variants: $variants) {
      productVariants {
        id
        price
      }
      userErrors {
        field
        message
      }
    }
  }
`;

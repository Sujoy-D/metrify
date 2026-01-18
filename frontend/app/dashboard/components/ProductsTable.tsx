import { ArrowUp, ArrowDown, Minus, Package } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  currentPrice: number;
  recommendedPrice: number;
  inventory: number;
  abandonedCarts: number;
  userInterest: number;
  priorSales: number;
  lastUpdated: string;
  updatedAt?: Date;
}

const mockProducts: Product[] = [
  {
    id: 'prod_001',
    name: 'Wireless Headphones Pro',
    currentPrice: 79.99,
    recommendedPrice: 84.99,
    inventory: 145,
    abandonedCarts: 23,
    userInterest: 87,
    priorSales: 342,
    lastUpdated: '2 hours ago',
  },
  {
    id: 'prod_002',
    name: 'Smart Watch Series 5',
    currentPrice: 199.99,
    recommendedPrice: 189.99,
    inventory: 67,
    abandonedCarts: 41,
    userInterest: 92,
    priorSales: 189,
    lastUpdated: '1 hour ago',
  },
  {
    id: 'prod_003',
    name: 'Ergonomic Laptop Stand',
    currentPrice: 49.99,
    recommendedPrice: 49.99,
    inventory: 203,
    abandonedCarts: 12,
    userInterest: 64,
    priorSales: 567,
    lastUpdated: '3 hours ago',
  },
  {
    id: 'prod_004',
    name: 'USB-C Hub 7-in-1',
    currentPrice: 34.99,
    recommendedPrice: 39.99,
    inventory: 88,
    abandonedCarts: 18,
    userInterest: 78,
    priorSales: 423,
    lastUpdated: '30 minutes ago',
  },
  {
    id: 'prod_005',
    name: 'Mechanical Keyboard RGB',
    currentPrice: 129.99,
    recommendedPrice: 119.99,
    inventory: 34,
    abandonedCarts: 29,
    userInterest: 95,
    priorSales: 156,
    lastUpdated: '4 hours ago',
  },
  {
    id: 'prod_006',
    name: 'Wireless Mouse Precision',
    currentPrice: 59.99,
    recommendedPrice: 64.99,
    inventory: 178,
    abandonedCarts: 15,
    userInterest: 71,
    priorSales: 634,
    lastUpdated: '1 hour ago',
  },
];

interface ProductsTableProps {
  weights: {
    abandonedCart: number;
    userInterest: number;
    inventory: number;
    priorSales: number;
  };
  lastRefresh: Date | null;
}

export function ProductsTable({ weights, lastRefresh }: ProductsTableProps) {
  const [products, setProducts] = useState<Product[]>(mockProducts);

  useEffect(() => {
    if (lastRefresh) {
      // Update all products with new timestamp
      setProducts(prevProducts => 
        prevProducts.map(product => ({
          ...product,
          lastUpdated: '1 seconds ago',
          updatedAt: lastRefresh
        }))
      );
    }
  }, [lastRefresh]);

  // Update relative time display
  useEffect(() => {
    const interval = setInterval(() => {
      setProducts(prevProducts => 
        prevProducts.map(product => {
          if (product.updatedAt) {
            const secondsAgo = Math.floor((Date.now() - product.updatedAt.getTime()) / 1000);
            if (secondsAgo < 60) {
              return { ...product, lastUpdated: `${secondsAgo} seconds ago` };
            } else if (secondsAgo < 3600) {
              const minutes = Math.floor(secondsAgo / 60);
              return { ...product, lastUpdated: `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago` };
            } else {
              const hours = Math.floor(secondsAgo / 3600);
              return { ...product, lastUpdated: `${hours} ${hours === 1 ? 'hour' : 'hours'} ago` };
            }
          }
          return product;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getPriceDifference = (current: number, recommended: number) => {
    const diff = recommended - current;
    const percentage = ((diff / current) * 100).toFixed(1);
    return { diff, percentage };
  };

  const getInventoryStatus = (inventory: number) => {
    if (inventory < 50) return { label: 'Low', color: 'text-red-600 bg-red-50' };
    if (inventory < 100) return { label: 'Medium', color: 'text-orange-600 bg-orange-50' };
    return { label: 'High', color: 'text-green-600 bg-green-50' };
  };

  const getConfidenceScore = (product: Product) => {
    const normalizedInventory = Math.min(product.inventory / 200, 1) * 100;
    const normalizedCarts = Math.min(product.abandonedCarts / 50, 1) * 100;
    
    const score = (
      (normalizedCarts * weights.abandonedCart / 100) +
      (product.userInterest * weights.userInterest / 100) +
      (normalizedInventory * weights.inventory / 100) +
      (Math.min(product.priorSales / 500, 1) * 100 * weights.priorSales / 100)
    ) / (weights.abandonedCart + weights.userInterest + weights.inventory + weights.priorSales) * 100;
    
    return Math.round(score);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Package className="w-5 h-5 text-[#5f8e3e]" />
        <h2 className="text-xl font-bold text-[#5f8e3e]">Product Pricing Overview</h2>
        <span className="text-sm text-slate-500 ml-2">({mockProducts.length} products)</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 text-sm text-slate-700">Product</th>
              <th className="text-left py-3 px-4 text-sm text-slate-700">Previous Price</th>
              <th className="text-left py-3 px-4 text-sm text-slate-700">Current Price</th>
              <th className="text-left py-3 px-4 text-sm text-slate-700">Change</th>
              <th className="text-left py-3 px-4 text-sm text-slate-700">Inventory</th>
              <th className="text-left py-3 px-4 text-sm text-slate-700">Confidence</th>
              <th className="text-left py-3 px-4 text-sm text-slate-700">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => {
              const { diff, percentage } = getPriceDifference(product.currentPrice, product.recommendedPrice);
              const inventoryStatus = getInventoryStatus(product.inventory);
              const confidence = getConfidenceScore(product);

              return (
                <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-[#ffffff]">
                  <td className="py-4 px-4">
                    <div className="text-sm text-slate-900">{product.name}</div>
                    <div className="text-xs text-slate-500">{product.id}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-mono text-slate-900">${product.currentPrice.toFixed(2)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-mono text-slate-900">${product.recommendedPrice.toFixed(2)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      {diff > 0.5 && (
                        <>
                          <ArrowUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600">+${Math.abs(diff).toFixed(2)}</span>
                          <span className="text-xs text-green-600">({percentage}%)</span>
                        </>
                      )}
                      {diff < -0.5 && (
                        <>
                          <ArrowDown className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-red-600">-${Math.abs(diff).toFixed(2)}</span>
                          <span className="text-xs text-red-600">({percentage}%)</span>
                        </>
                      )}
                      {Math.abs(diff) <= 0.5 && (
                        <>
                          <Minus className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-500">No change</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${inventoryStatus.color}`}>
                        {inventoryStatus.label}
                      </span>
                      <span className="text-xs text-slate-500">{product.inventory}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#64943e] rounded-full"
                          style={{ width: `${confidence}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-700">{confidence}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs text-slate-500">{product.lastUpdated}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
        <p className="text-sm text-slate-700">
          💡 <span className="font-medium">Tip:</span> Confidence scores are calculated based on your current weight settings. 
          Adjust the sliders above to see how different factors affect pricing recommendations.
        </p>
      </div>
    </div>
  );
}
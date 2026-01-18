import { useState } from 'react';
import { AlgorithmControls } from './components/AlgorithmControls';
import { PriceTracker } from './components/PriceTracker';
import { ProductsTable } from './components/ProductsTable';
import { MetrifyLogo } from './components/MetrifyLogo';
import { MetricsOverview } from './components/MetricsOverview';
import { Settings, RefreshCw } from 'lucide-react';

export default function App() {
  const [weights, setWeights] = useState({
    abandonedCart: 25,
    userInterest: 30,
    inventory: 20,
    priorSales: 25,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefresh(new Date());
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#ffffff]">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <MetrifyLogo />
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-[#5f8e3e] text-white rounded-lg shadow-sm hover:bg-[#4a6e30] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm">Refresh Data</span>
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="w-2 h-2 bg-[#64943e] rounded-full animate-pulse" />
              <span className="text-sm text-slate-700">Shopify Connected</span>
            </div>
          </div>
        </div>

        {/* Metrics Overview */}
        <MetricsOverview />

        {/* Subtitle */}
        <div className="-mt-2 mb-2">
          <p className="text-slate-600 text-left ml-4">Adjust algorithm weights and track price recommendations for your Shopify store</p>
        </div>
        
        {/* Algorithm Controls and Price Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <AlgorithmControls weights={weights} setWeights={setWeights} />
          </div>
          <div className="lg:col-span-2">
            <PriceTracker />
          </div>
        </div>

        {/* Products Table */}
        <ProductsTable weights={weights} lastRefresh={lastRefresh} />
      </div>
    </div>
  );
}
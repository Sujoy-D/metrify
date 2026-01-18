import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, ChevronDown, ArrowUp, ArrowDown, Info } from 'lucide-react';

type TimePeriod = 'daily' | 'weekly' | 'monthly';

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const currentPrice = payload[0].value;
    const dataIndex = payload[0].payload.index;
    const previousPrice = payload[0].payload.previousPrice;
    
    let changeDisplay = null;
    if (dataIndex > 0 && previousPrice !== undefined) {
      const priceDiff = currentPrice - previousPrice;
      const percentChange = ((priceDiff / previousPrice) * 100).toFixed(1);
      const isIncrease = priceDiff > 0;
      
      changeDisplay = (
        <div className={`flex items-center gap-1 ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
          {isIncrease ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          <span className="font-medium">
            {isIncrease ? '+' : ''}{priceDiff.toFixed(2)} ({percentChange}%)
          </span>
        </div>
      );
    }
    
    return (
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
        <p className="text-sm text-purple-600 font-medium mb-1">{label}</p>
        <p className="text-sm text-slate-900 font-mono mb-1">
          Price: ${currentPrice.toFixed(2)}
        </p>
        {changeDisplay && (
          <div className="pt-1 border-t border-slate-100">
            {changeDisplay}
          </div>
        )}
      </div>
    );
  }
  return null;
};

// Mock data for price tracking over time
const generateMockData = (productName: string, basePrice: number, period: TimePeriod) => {
  const data = [];
  let points: number;
  let dateFormat: (i: number) => string;
  
  switch (period) {
    case 'daily':
      points = 7;
      dateFormat = (i: number) => new Date(2026, 0, i - 6).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      break;
    case 'weekly':
      points = 12;
      dateFormat = (i: number) => {
        const weekStart = new Date(2025, 11, 1 + i * 7);
        return `Week ${i + 1}`;
      };
      break;
    case 'monthly':
      points = 12;
      dateFormat = (i: number) => new Date(2025, i, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      break;
  }
  
  let currentPrice = basePrice;
  let previousPrice = basePrice;
  
  for (let i = 0; i < points; i++) {
    // Change price every day for daily view, every 3 points for weekly/monthly
    const changeInterval = period === 'daily' ? 1 : 3;
    if (i % changeInterval === 0 || i === 0) {
      const variance = basePrice * 0.12;
      const trend = Math.sin(i / 8) * variance;
      const noise = (Math.random() - 0.5) * 8;
      currentPrice = Math.max(basePrice * 0.75, basePrice + trend + noise);
    }
    
    data.push({
      date: dateFormat(i),
      price: currentPrice,
      previousPrice: i > 0 ? previousPrice : undefined,
      index: i,
    });
    
    previousPrice = currentPrice;
  }
  
  return data;
};

const products = [
  { name: 'Wireless Headphones', basePrice: 79.99 },
  { name: 'Smart Watch', basePrice: 199.99 },
  { name: 'Laptop Stand', basePrice: 49.99 },
  { name: 'USB-C Hub', basePrice: 34.99 },
  { name: 'Mechanical Keyboard', basePrice: 129.99 },
  { name: 'Wireless Mouse', basePrice: 59.99 },
];

export function PriceTracker() {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('daily');
  
  const data = generateMockData(selectedProduct.name, selectedProduct.basePrice, timePeriod);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#5f8e3e]" />
            <h2 className="font-bold text-[#5f8e3e]">Price Change History</h2>
            <div className="relative group">
              <Info className="w-5 h-5 text-slate-400 cursor-help" />
              <div className="absolute left-0 top-8 w-72 bg-slate-800 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <p>Metrify tracks your auto-adjusted price changes on a daily, weekly and monthly basis.</p>
                <div className="absolute -top-1.5 left-3 w-3 h-3 bg-slate-800 rotate-45"></div>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-1">Track pricing trends over time</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setTimePeriod('daily')}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                timePeriod === 'daily' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setTimePeriod('weekly')}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                timePeriod === 'weekly' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimePeriod('monthly')}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                timePeriod === 'monthly' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
          </div>
          <div className="relative">
            <select
              value={selectedProduct.name}
              onChange={(e) => setSelectedProduct(products.find(p => p.name === e.target.value) || products[0])}
              className="appearance-none bg-white border border-slate-300 rounded-lg px-4 py-2 pr-10 text-sm text-slate-700 cursor-pointer hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {products.map((product) => (
                <option key={product.name} value={product.name}>
                  {product.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#5b02b4' }} />
          <span className="text-sm text-slate-700">Price</span>
        </div>
        <div className="ml-auto text-xs text-slate-500 flex items-center gap-1">
          <span>
            {timePeriod === 'daily' && 'Last 7 days'}
            {timePeriod === 'weekly' && 'Last 12 weeks'}
            {timePeriod === 'monthly' && 'Last 12 months'}
          </span>
        </div>
      </div>

      <div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              stroke="#64748b" 
              style={{ fontSize: '12px' }}
              tick={{ fill: '#64748b' }}
            />
            <YAxis 
              stroke="#64748b" 
              style={{ fontSize: '12px' }}
              tick={{ fill: '#64748b' }}
              label={{ value: 'Price ($)', angle: -90, position: 'insideLeft', style: { fill: '#64748b' } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value: number) => `$${value.toFixed(2)}`}
              content={<CustomTooltip />}
            />
            
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#5b02b4" 
              strokeWidth={3}
              dot={{ fill: '#5b02b4', r: 3 }}
              name="Price"
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
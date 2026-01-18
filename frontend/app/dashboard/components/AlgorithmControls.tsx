import { ShoppingCart, MousePointer, Package, TrendingUp, Info } from 'lucide-react';

interface AlgorithmControlsProps {
  weights: {
    abandonedCart: number;
    userInterest: number;
    inventory: number;
    priorSales: number;
  };
  setWeights: (weights: any) => void;
}

export function AlgorithmControls({ weights, setWeights }: AlgorithmControlsProps) {
  const handleWeightChange = (metric: string, value: number) => {
    setWeights({ ...weights, [metric]: value });
  };

  const sliders = [
    {
      key: 'abandonedCart',
      label: 'Abandoned Cart Data',
      description: 'Weight based on cart abandonment rates',
      icon: ShoppingCart,
      iconBg: 'bg-orange-500',
      value: weights.abandonedCart,
    },
    {
      key: 'userInterest',
      label: 'User Interest',
      description: 'Tracking clicks on items',
      icon: MousePointer,
      iconBg: 'bg-blue-500',
      value: weights.userInterest,
    },
    {
      key: 'inventory',
      label: 'Inventory Data',
      description: 'Stock levels and turnover rates',
      icon: Package,
      iconBg: 'bg-green-500',
      value: weights.inventory,
    },
    {
      key: 'priorSales',
      label: 'Prior Sales',
      description: 'Historical sales performance',
      icon: TrendingUp,
      iconBg: 'bg-[#5b02b4]',
      value: weights.priorSales,
    },
  ];

  const totalWeight = Object.values(weights).reduce((sum, val) => sum + val, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #64943e;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #64943e;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-[#5f8e3e]">Algorithm Weights</h2>
          <div className="relative group">
            <Info className="w-5 h-5 text-slate-400 cursor-help" />
            <div className="absolute left-0 top-8 w-72 bg-slate-800 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <p>The Metrify algorithm automatically changes your product prices based on each metric below. Users may decide which metrics matter the most for price adjustments.</p>
              <div className="absolute -top-1.5 left-3 w-3 h-3 bg-slate-800 rotate-45"></div>
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-1">Adjust the significance of each metric in the pricing algorithm</p>
      </div>

      <div className="space-y-6">
        {sliders.map((slider) => {
          const Icon = slider.icon;
          const percentage = ((slider.value / totalWeight) * 100).toFixed(0);
          
          return (
            <div key={slider.key} className="space-y-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${slider.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <div className="text-sm text-[#000000] font-medium">{slider.label}</div>
                      <div className="text-xs text-slate-500">{slider.description}</div>
                    </div>
                    <span className="text-sm text-slate-900 ml-4">{percentage}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={slider.value}
                    onChange={(e) => handleWeightChange(slider.key, Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #5f8e3e 0%, #5f8e3e ${slider.value}%, #e2e8f0 ${slider.value}%, #e2e8f0 100%)`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
        <span className="text-sm text-slate-700">Total Weight</span>
        <span className="text-sm text-green-600">100%</span>
      </div>
    </div>
  );
}
import React from 'react';
import { CostingResult } from '../types';

interface CostingDisplayProps {
  data: CostingResult;
  onReset: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2
  }).format(amount);
};

export const CostingDisplay: React.FC<CostingDisplayProps> = ({ data, onReset }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-slide-down pb-10">
      
      {/* Header Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 z-0"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="text-sm font-bold text-orange-600 uppercase tracking-widest mb-1">Costing Report</div>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 font-serif">{data.recipeName}</h2>
            <p className="text-stone-500 mt-2 font-medium bg-stone-100 inline-block px-3 py-1 rounded-full">
              Estimated Yield: <span className="text-stone-900">{data.yieldEstimate} {data.yieldUnit}</span>
            </p>
          </div>
          <button 
            onClick={onReset}
            className="px-6 py-2.5 text-sm font-bold text-stone-600 bg-white border-2 border-stone-100 hover:border-orange-200 hover:text-orange-700 hover:bg-orange-50 rounded-xl transition-all shadow-sm"
          >
            ← Calculate Another
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Ingredients Table - Spans 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex items-center gap-2">
              <span className="text-xl">📋</span>
              <h3 className="font-bold text-lg text-amber-900 font-serif">Ingredients Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm md:text-base">
                <thead className="bg-white text-stone-400 font-bold border-b border-stone-100 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Ingredient</th>
                    <th className="px-6 py-4">Qty</th>
                    <th className="px-6 py-4 whitespace-nowrap">Est. Price</th>
                    <th className="px-6 py-4 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {data.ingredients.map((ing, index) => (
                    <tr key={index} className="hover:bg-amber-50/30 transition-colors">
                      <td className="px-6 py-3 font-medium text-stone-800">{ing.name}</td>
                      <td className="px-6 py-3 text-stone-600 bg-stone-50/50">{ing.quantity}</td>
                      <td className="px-6 py-3 text-stone-400 text-xs md:text-sm">{ing.unitPrice}</td>
                      <td className="px-6 py-3 text-right font-medium text-stone-800 font-mono">
                        {formatCurrency(ing.cost)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-stone-50 font-bold text-stone-800 border-t-2 border-dashed border-stone-200">
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-right text-stone-500 uppercase text-xs tracking-wider">Total Ingredients</td>
                    <td className="px-6 py-4 text-right text-orange-700 text-lg">
                      {formatCurrency(data.totalIngredientCost)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          {data.notes && (
            <div className="bg-blue-50 text-blue-900 p-5 rounded-2xl text-sm border border-blue-100 flex gap-3 shadow-sm">
              <span className="text-2xl">💡</span>
              <div>
                 <span className="font-bold block mb-1 font-serif text-blue-800">Baker's Note</span>
                {data.notes}
              </div>
            </div>
          )}
        </div>

        {/* Summary Card - Spans 1 col */}
        <div className="space-y-6">
          
          {/* Receipt/Summary Card */}
          <div className="bg-white rounded-2xl shadow-lg shadow-stone-200 border border-stone-200 overflow-hidden relative">
            
            <div className="p-6 pb-8 space-y-6 relative">
              <h3 className="font-serif font-bold text-xl text-stone-800 text-center border-b-2 border-stone-100 pb-4">
                Cost Summary
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-stone-600">
                  <span>Ingredients</span>
                  <span className="font-medium font-mono">{formatCurrency(data.totalIngredientCost)}</span>
                </div>
                <div className="flex justify-between items-center text-stone-600">
                  <span className="flex items-center gap-1" title={`Based on ${data.laborHours} hours`}>
                     Labor <span className="text-[10px] bg-stone-100 px-1 rounded text-stone-400">({data.laborHours}h)</span>
                  </span>
                  <span className="font-medium font-mono">{formatCurrency(data.laborCost)}</span>
                </div>
                <div className="flex justify-between items-center text-stone-600">
                  <span>Overhead</span>
                  <span className="font-medium font-mono">{formatCurrency(data.overheadCost)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-stone-200">
                <span className="font-bold text-stone-800">Total Production</span>
                <span className="font-bold text-xl text-stone-900 font-mono">{formatCurrency(data.totalProductionCost)}</span>
              </div>

              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 text-center">
                <div className="text-xs text-orange-800 uppercase tracking-widest font-bold mb-1">Production Cost Per Piece</div>
                <div className="text-3xl font-bold text-orange-600 font-serif">{formatCurrency(data.costPerPiece)}</div>
              </div>
            </div>
            
            {/* Bottom jagged edge visual trick */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[linear-gradient(45deg,transparent_75%,#E7E5E4_75%),linear-gradient(-45deg,transparent_75%,#E7E5E4_75%)] bg-[length:10px_10px]"></div>
          </div>

          {/* Pricing Suggestion */}
          <div className="bg-gradient-to-br from-green-700 to-green-800 rounded-2xl shadow-lg overflow-hidden text-white">
             <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
               <span className="text-xl">🏷️</span>
              <h3 className="font-bold text-lg font-serif">Suggested Prices</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="relative">
                <div className="text-[10px] font-bold text-green-200 uppercase tracking-wider mb-1">
                  Markup Method ({data.markupPercentage}%)
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-mono">{formatCurrency(data.suggestedSellingPriceMarkup)}</span>
                  <span className="text-green-200 text-sm">/ piece</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="text-[10px] font-bold text-green-200 uppercase tracking-wider mb-1">
                  Profit Margin ({data.profitMarginPercentage}%)
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-mono">{formatCurrency(data.suggestedSellingPriceMargin)}</span>
                  <span className="text-green-200 text-sm">/ piece</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
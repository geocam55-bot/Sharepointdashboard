import React from 'react';
import { DailyPerformance } from '@/app/services/mockSharePoint';
import { ArrowRight } from 'lucide-react';

interface StorePerformanceTableProps {
  data: DailyPerformance[];
  isLoading: boolean;
  onDayClick: (day: DailyPerformance) => void;
}

export const StorePerformanceTable: React.FC<StorePerformanceTableProps> = ({ data, isLoading, onDayClick }) => {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">Loading performance data...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center bg-white rounded-xl border border-slate-100 shadow-sm text-center p-6">
        <div className="bg-slate-50 p-3 rounded-full mb-3">
           <span className="text-2xl">📊</span>
        </div>
        <h3 className="text-slate-900 font-medium">No Data Available</h3>
        <p className="text-slate-500 text-sm mt-1 max-w-xs">Try adjusting your filters to see performance results.</p>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Mobile Scroll Hint */}
      <div className="md:hidden absolute top-0 right-0 bottom-0 w-6 bg-gradient-to-l from-white/10 to-transparent pointer-events-none z-20" />
      
      <div className="overflow-x-auto pb-2 custom-scrollbar">
        <table className="w-full text-right text-xs md:text-sm border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/80 backdrop-blur-sm">
              <th className="px-4 py-4 text-left font-semibold text-slate-600 sticky left-0 z-20 bg-slate-50 border-b border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] w-28 min-w-[100px]">
                Day
              </th>
              
              {/* Current Year Daily */}
              <th className="px-3 py-3 font-semibold text-blue-900 bg-blue-50/30 border-b border-blue-100 min-w-[100px]">Net Sales</th>
              <th className="px-3 py-3 font-semibold text-blue-900 bg-blue-50/30 border-b border-blue-100 min-w-[80px]">GP %</th>
              
              {/* Current Year YTD */}
              <th className="px-3 py-3 font-semibold text-indigo-900 bg-indigo-50/30 border-b border-indigo-100 border-l border-indigo-50 min-w-[100px]">YTD Sales</th>
              <th className="px-3 py-3 font-semibold text-indigo-900 bg-indigo-50/30 border-b border-indigo-100 min-w-[80px]">YTD GP %</th>
              
              {/* Last Year Daily */}
              <th className="px-3 py-3 font-medium text-slate-500 border-b border-slate-200 border-l border-slate-100 min-w-[100px]">LY Sales</th>
              <th className="px-3 py-3 font-medium text-slate-500 border-b border-slate-200 min-w-[80px]">LY GP %</th>
              
              {/* Last Year YTD */}
              <th className="px-3 py-3 font-medium text-slate-500 border-b border-slate-200 border-l border-slate-100 min-w-[100px]">LY YTD Sales</th>
              <th className="px-3 py-3 font-medium text-slate-500 border-b border-slate-200 min-w-[80px]">LY YTD GP %</th>
              
              {/* Variance & KPIs */}
              <th className="px-3 py-3 font-semibold text-emerald-900 bg-emerald-50/30 border-b border-emerald-100 border-l border-emerald-50 min-w-[90px]">YoY Growth</th>
              <th className="px-3 py-3 font-semibold text-amber-900 bg-amber-50/30 border-b border-amber-100 border-l border-amber-50 min-w-[100px]">Basket Size</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((row, idx) => {
              const isGrowthPositive = row.yoyNetSalesPercent >= 0;
              const isEven = idx % 2 === 0;
              return (
                <tr 
                  key={row.day} 
                  onClick={() => onDayClick(row)}
                  className={`group transition-all cursor-pointer ${isEven ? 'bg-white' : 'bg-slate-50/30'} hover:bg-indigo-50/50 hover:shadow-inner`}
                >
                  <td className={`px-4 py-4 text-left font-medium text-slate-900 sticky left-0 z-10 
                    ${isEven ? 'bg-white' : 'bg-slate-50/30'} group-hover:bg-indigo-50 
                    shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] border-r border-transparent transition-colors`}
                  >
                    <div className="flex items-center gap-2">
                       {row.day}
                       <ArrowRight className="w-3 h-3 text-indigo-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </div>
                  </td>
                  
                  {/* Current */}
                  <td className="px-3 py-3 font-bold text-slate-700">
                    ${row.netSales.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="px-3 py-3 text-slate-600">
                    {row.gpPercent.toFixed(1)}%
                  </td>
                  
                  {/* YTD */}
                  <td className="px-3 py-3 text-slate-600 font-medium border-l border-slate-100 group-hover:border-indigo-100">
                    ${(row.ytdNetSales / 1000).toFixed(1)}k
                  </td>
                  <td className="px-3 py-3 text-slate-600">
                    {row.ytdGpPercent.toFixed(1)}%
                  </td>
                  
                  {/* LY */}
                  <td className="px-3 py-3 text-slate-400 border-l border-slate-100 group-hover:border-indigo-100">
                    ${row.lyNetSales.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="px-3 py-3 text-slate-400">
                    {row.lyGpPercent.toFixed(1)}%
                  </td>
                  
                  {/* LY YTD */}
                  <td className="px-3 py-3 text-slate-400 border-l border-slate-100 group-hover:border-indigo-100">
                    ${(row.lyYtdNetSales / 1000).toFixed(1)}k
                  </td>
                  <td className="px-3 py-3 text-slate-400">
                    {row.lyYtdGpPercent.toFixed(1)}%
                  </td>
                  
                  {/* Growth */}
                  <td className={`px-3 py-3 font-bold border-l border-slate-100 group-hover:border-indigo-100 ${isGrowthPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                    <div className="flex justify-end items-center gap-1">
                       {isGrowthPositive ? '+' : ''}{row.yoyNetSalesPercent.toFixed(1)}%
                    </div>
                  </td>
                  
                  {/* KPI */}
                  <td className="px-3 py-3 text-slate-700 font-medium border-l border-slate-100 group-hover:border-indigo-100">
                    ${row.basketSize.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-50 font-bold text-slate-800 border-t border-slate-200">
            <tr>
              <td className="px-4 py-4 text-left sticky left-0 z-10 bg-slate-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Weekly Total</td>
              <td className="px-3 py-4 text-blue-900">
                ${data.reduce((acc, curr) => acc + curr.netSales, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </td>
              <td className="px-3 py-4 text-blue-900">-</td>
              <td className="px-3 py-4 text-indigo-900 border-l border-slate-200">
                ${(data[data.length - 1]?.ytdNetSales / 1000).toFixed(1)}k
              </td>
              <td className="px-3 py-4">-</td>
              <td className="px-3 py-4 text-slate-500 border-l border-slate-200">
                ${data.reduce((acc, curr) => acc + curr.lyNetSales, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </td>
              <td className="px-3 py-4">-</td>
              <td className="px-3 py-4 text-slate-500 border-l border-slate-200">
                ${(data[data.length - 1]?.lyYtdNetSales / 1000).toFixed(1)}k
              </td>
              <td className="px-3 py-4 text-slate-500">-</td>
              <td className="px-3 py-4 text-emerald-900 border-l border-slate-200">-</td>
              <td className="px-3 py-4 text-amber-900 border-l border-slate-200">-</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      {/* Mobile Footer Hint */}
      <div className="md:hidden p-2 text-center text-xs text-slate-400 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-1">
        <ArrowRight size={12} /> Scroll right to see full year-over-year data
      </div>
    </div>
  );
};

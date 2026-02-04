import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, TrendingUp, Users, ShoppingBag, Truck, BadgeDollarSign, Briefcase } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Line,
  ComposedChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { DailyPerformance, DaySummary, getDayDetails } from '@/app/services/excelSharePointService'; // Changed from mockSharePoint

interface DayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayData: DailyPerformance | null;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({ isOpen, onClose, dayData }) => {
  const [data, setData] = useState<DaySummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && dayData) {
      setLoading(true);
      getDayDetails(dayData.day).then(result => {
        setData(result);
        setLoading(false);
      });
    } else {
      setData(null);
    }
  }, [isOpen, dayData]);

  if (!dayData) return null;

  const salesMixData = data ? [
    { name: 'Retail', value: data.retailTotal, color: '#4f46e5' }, // Indigo
    { name: 'Pro', value: data.proTotal, color: '#0ea5e9' }       // Sky Blue
  ] : [];

  const getPercentageChange = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{dayData.day} Performance</h2>
                  <p className="text-slate-500 text-sm mt-1">Detailed hourly breakdown and metrics</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto custom-scrollbar">
                {loading || !data ? (
                   <div className="h-[400px] flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="text-slate-400 text-sm">Loading daily details...</p>
                      </div>
                   </div>
                ) : (
                  <>
                    {/* KPI Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                      {/* Retail Sales */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <ShoppingBag size={20} />
                          </div>
                          <span className="text-sm font-semibold text-slate-600">Retail Sales</span>
                        </div>
                        <div className="text-2xl font-bold text-slate-900">
                          ${data.retailTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                        <div className="flex flex-col gap-0.5 mt-2 text-xs">
                          <div className="flex items-center gap-2 font-medium">
                            <span className={getPercentageChange(data.retailTotal, data.lyRetailTotal) >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                              {getPercentageChange(data.retailTotal, data.lyRetailTotal) > 0 ? '+' : ''}
                              {getPercentageChange(data.retailTotal, data.lyRetailTotal).toFixed(1)}%
                            </span>
                            <span className="text-slate-400">vs LY (${data.lyRetailTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })})</span>
                          </div>
                          <span className="text-slate-400">
                            {((data.retailTotal / (data.retailTotal + data.proTotal)) * 100).toFixed(0)}% of total revenue
                          </span>
                        </div>
                      </div>

                      {/* Pro Sales */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-sky-300 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-sky-50 rounded-lg text-sky-600">
                            <Briefcase size={20} />
                          </div>
                          <span className="text-sm font-semibold text-slate-600">Pro Sales</span>
                        </div>
                        <div className="text-2xl font-bold text-slate-900">
                          ${data.proTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                        <div className="flex flex-col gap-0.5 mt-2 text-xs">
                           <div className="flex items-center gap-2 font-medium">
                            <span className={getPercentageChange(data.proTotal, data.lyProTotal) >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                              {getPercentageChange(data.proTotal, data.lyProTotal) > 0 ? '+' : ''}
                              {getPercentageChange(data.proTotal, data.lyProTotal).toFixed(1)}%
                            </span>
                            <span className="text-slate-400">vs LY (${data.lyProTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })})</span>
                          </div>
                          <span className="text-slate-400">
                            {((data.proTotal / (data.retailTotal + data.proTotal)) * 100).toFixed(0)}% of total revenue
                          </span>
                        </div>
                      </div>

                      {/* Returns */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-rose-300 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                            <BadgeDollarSign size={20} />
                          </div>
                          <span className="text-sm font-semibold text-slate-600">Returns</span>
                        </div>
                        <div className="text-2xl font-bold text-slate-900">
                          ${data.returnsTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                        <div className="flex flex-col gap-0.5 mt-2 text-xs">
                           <div className="flex items-center gap-2 font-medium">
                            <span className={getPercentageChange(data.returnsTotal, data.lyReturnsTotal) <= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                              {getPercentageChange(data.returnsTotal, data.lyReturnsTotal) > 0 ? '+' : ''}
                              {getPercentageChange(data.returnsTotal, data.lyReturnsTotal).toFixed(1)}%
                            </span>
                            <span className="text-slate-400">vs LY (${data.lyReturnsTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })})</span>
                          </div>
                          <span className="text-rose-600 font-medium">
                            {data.returnsPercent.toFixed(1)}% return rate
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Main Chart: Hourly Performance */}
                      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">Hourly Performance</h3>
                            <p className="text-slate-500 text-sm">Current Year vs Previous Year</p>
                          </div>
                          <div className="flex items-center gap-4 text-xs font-medium">
                            <div className="flex items-center gap-1.5">
                              <span className="w-3 h-3 rounded-full bg-indigo-600"></span> Current
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-3 h-3 rounded-full bg-slate-300"></span> Previous Year
                            </div>
                          </div>
                        </div>
                        
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart
                              data={data.hourlyData}
                              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                              <XAxis 
                                dataKey="hour" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                dy={10}
                              />
                              <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                tickFormatter={(value) => `$${value}`}
                              />
                              <Tooltip 
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ 
                                  backgroundColor: '#fff', 
                                  border: '1px solid #e2e8f0', 
                                  borderRadius: '8px',
                                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                                formatter={(value: number, name: string) => {
                                  if (name === 'sales') return [`$${value.toFixed(0)}`, 'Current Year'];
                                  if (name === 'lySales') return [`$${value.toFixed(0)}`, 'Previous Year'];
                                  return [value, name];
                                }}
                              />
                              <Bar 
                                dataKey="sales" 
                                fill="#4f46e5" 
                                radius={[4, 4, 0, 0]} 
                                barSize={20}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="lySales" 
                                stroke="#cbd5e1" 
                                strokeWidth={2}
                                dot={false}
                              />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Sales Mix Chart */}
                      <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col">
                         <div className="mb-4">
                            <h3 className="text-lg font-bold text-slate-900">Sales Mix</h3>
                            <p className="text-slate-500 text-sm">Retail vs Pro Breakdown</p>
                         </div>
                         
                         <div className="flex-1 flex flex-col items-center justify-center relative min-h-[200px]">
                            <ResponsiveContainer width="100%" height={200}>
                              <PieChart>
                                <Pie
                                  data={salesMixData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                  {salesMixData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip 
                                   formatter={(value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                               <div className="text-center">
                                  <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total</div>
                                  <div className="text-xl font-bold text-slate-900">${(data.retailTotal + data.proTotal).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                               </div>
                            </div>
                         </div>

                         <div className="mt-4 space-y-3">
                            {salesMixData.map((item) => (
                              <div key={item.name} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                  <span className="text-slate-600 font-medium">{item.name}</span>
                                </div>
                                <span className="font-bold text-slate-900">
                                  {((item.value / (data.retailTotal + data.proTotal)) * 100).toFixed(1)}%
                                </span>
                              </div>
                            ))}
                         </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
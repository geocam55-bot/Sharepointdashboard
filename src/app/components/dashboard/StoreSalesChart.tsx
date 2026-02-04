import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { StoreSale } from '@/app/services/mockSharePoint';

interface StoreSalesChartProps {
  data: StoreSale[];
}

export const StoreSalesChart: React.FC<StoreSalesChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Store Sales Performance</h3>
        <p className="text-sm text-slate-500">Current vs Previous Year Revenue</p>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="storeName" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e2e8f0', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }} 
            />
            <Bar 
              dataKey="currentYearSales" 
              name="Current Year" 
              fill="#4f46e5" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              dataKey="previousYearSales" 
              name="Previous Year" 
              fill="#a5b4fc" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

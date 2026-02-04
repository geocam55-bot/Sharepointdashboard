import React from 'react';
import { CustomerSale } from '@/app/services/mockSharePoint';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CustomerSalesListProps {
  data: CustomerSale[];
}

export const CustomerSalesList: React.FC<CustomerSalesListProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden h-full">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-900">Top Customer Accounts</h3>
        <p className="text-sm text-slate-500">Year-over-year growth</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4 text-right">Current Year</th>
              <th className="px-6 py-4 text-right">Prev Year</th>
              <th className="px-6 py-4 text-right">Trend</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((customer) => {
              const growth = ((customer.currentYearSales - customer.previousYearSales) / customer.previousYearSales) * 100;
              const isPositive = growth > 0;

              return (
                <tr key={customer.customerId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {customer.customerName}
                    <div className="text-xs text-slate-400 font-normal">{customer.customerId}</div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    ${customer.currentYearSales.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-500">
                    ${customer.previousYearSales.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={`flex items-center justify-end gap-1 ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {Math.abs(growth).toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${customer.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 
                        customer.status === 'Inactive' ? 'bg-slate-100 text-slate-800' : 
                        'bg-blue-100 text-blue-800'}`}>
                      {customer.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

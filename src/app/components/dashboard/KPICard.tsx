import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { KPI } from '@/app/services/mockSharePoint';

interface KPICardProps {
  kpi: KPI;
  index: number;
}

export const KPICard: React.FC<KPICardProps> = ({ kpi, index }) => {
  const isUp = kpi.trend === 'up';
  const isDown = kpi.trend === 'down';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-slate-100"
    >
      <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-slate-900">{kpi.value}</span>
        <span
          className={`flex items-center text-sm font-medium ${
            isUp ? 'text-emerald-600' : isDown ? 'text-rose-600' : 'text-slate-600'
          }`}
        >
          {isUp && <ArrowUpRight className="w-4 h-4 mr-1" />}
          {isDown && <ArrowDownRight className="w-4 h-4 mr-1" />}
          {!isUp && !isDown && <Minus className="w-4 h-4 mr-1" />}
          {kpi.percentage}
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-400">vs previous year</p>
    </motion.div>
  );
};


import React from 'react';

interface Props {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendUp?: boolean;
}

const DashboardCard: React.FC<Props> = ({ title, value, icon, trend, trendUp }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-2xl">
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  );
};

export default DashboardCard;

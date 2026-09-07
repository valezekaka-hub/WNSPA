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
import { Assessment, Criterion } from '../../types';

interface CriteriaComparisonChartProps {
  assessments: Assessment[];
  criteria: Criterion[];
  height?: number;
}

const PROTOCOL_COLORS: Record<string, string> = {
  wep: '#ef4444',   // Red
  wpa: '#f59e0b',   // Amber
  wpa2: '#0284c7',  // Sky blue
  wpa3: '#10b981',  // Emerald
};

const FALLBACK_PALETTE = ['#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export const CriteriaComparisonChart: React.FC<CriteriaComparisonChartProps> = ({
  assessments,
  criteria,
  height = 360,
}) => {
  // Structure data by criterion
  const chartData = criteria.map(criterion => {
    const row: Record<string, any> = {
      criterionCode: criterion.code,
      criterionName: criterion.name,
    };

    assessments.forEach(a => {
      const entry = a.scores[criterion.id] ?? a.scores[criterion.code.toLowerCase()] ?? a.scores[criterion.code];
      row[a.protocolAbbreviation] = entry ? entry.score : 0;
    });

    return row;
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const currentCriterion = criteria.find(c => c.code === label);
      return (
        <div className="bg-slate-900 border border-slate-700 text-slate-100 p-3 rounded-md shadow-xl text-xs space-y-1.5 max-w-xs">
          <p className="font-bold text-sky-400">
            {label} — {currentCriterion?.name}
          </p>
          {currentCriterion?.isInvertedMetric && (
            <p className="text-[10px] text-amber-300 italic">
              * Note: Higher score denotes lower vulnerability (greater security).
            </p>
          )}
          <div className="pt-1 border-t border-slate-800 space-y-1">
            {payload.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center space-x-3">
                <span className="flex items-center space-x-1.5" style={{ color: item.color }}>
                  <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: item.color }} />
                  <span className="font-medium">{item.name}:</span>
                </span>
                <span className="font-mono font-bold text-white">{item.value} / 5</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-slate-900/60 p-4 rounded-xl border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-2 border-b border-slate-800 text-xs">
        <div>
          <h3 className="font-semibold text-slate-200 text-sm">Seven-Criteria Comparative Evaluation</h3>
          <p className="text-slate-400 text-xs mt-0.5">
            Scores evaluated on 5-point scale across SS, VL, ER, AE, CAR, NPE, OA
          </p>
        </div>
        <span className="text-slate-400 font-mono mt-1 sm:mt-0">Equal Weight: 14.29% each</span>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis 
              dataKey="criterionCode" 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false} 
            />
            <YAxis 
              domain={[0, 5]} 
              ticks={[1, 2, 3, 4, 5]} 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '10px' }} 
              formatter={(value) => <span className="text-xs text-slate-300 font-medium">{value}</span>}
            />

            {assessments.map((a, idx) => {
              const color = PROTOCOL_COLORS[a.protocolId.toLowerCase()] || FALLBACK_PALETTE[idx % FALLBACK_PALETTE.length];
              return (
                <Bar
                  key={a.protocolAbbreviation}
                  dataKey={a.protocolAbbreviation}
                  fill={color}
                  radius={[3, 3, 0, 0]}
                  maxBarSize={28}
                />
              );
            })}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';
import { RankedProtocolItem } from '../../engine/scoringEngine';

interface OverallScoreBarChartProps {
  data: RankedProtocolItem[];
  height?: number;
}

export const OverallScoreBarChart: React.FC<OverallScoreBarChartProps> = ({ data, height = 320 }) => {
  const chartData = data.map(item => ({
    name: item.protocolAbbreviation,
    overallScore: item.overallScore,
    percentage: item.percentage,
    classification: item.classification,
    isDemonstration: item.isDemonstration,
  }));

  // Assign distinct academic color by classification
  const getBarColor = (classification: string) => {
    switch (classification) {
      case 'Excellent':
        return '#059669'; // Emerald-600
      case 'Very Good':
        return '#0284c7'; // Sky-600
      case 'Good':
        return '#2563eb'; // Blue-600
      case 'Moderate':
        return '#d97706'; // Amber-600
      case 'Poor':
      default:
        return '#e11d48'; // Rose-600
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 text-slate-100 p-3 rounded-md shadow-xl text-xs space-y-1">
          <p className="font-bold text-sm text-sky-400">{d.name} Protocol</p>
          <p className="text-slate-300">
            Overall Score: <span className="font-mono font-bold text-white">{d.overallScore.toFixed(2)}</span> / 5.00
          </p>
          <p className="text-slate-300">
            Percentage: <span className="font-mono font-bold text-white">{d.percentage.toFixed(2)}%</span>
          </p>
          <p className="text-slate-300">
            Classification: <span className="font-semibold text-white">{d.classification}</span>
          </p>
          {d.isDemonstration && (
            <p className="text-[10px] text-amber-400 italic pt-1 border-t border-slate-800">
              * Demonstration benchmark score
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-slate-900/60 p-4 rounded-xl border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-2 border-b border-slate-800 text-xs">
        <h3 className="font-semibold text-slate-200 text-sm">Protocol Overall Score Comparison (Scale 1.0 – 5.0)</h3>
        <span className="text-slate-400 mt-1 sm:mt-0 font-mono">Dotted lines indicate proposed system classification tiers</span>
      </div>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis 
              dataKey="name" 
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
            
            {/* Reference Threshold Lines for Proposed System Classification */}
            <ReferenceLine y={4.0} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Excellent (80%)', fill: '#10b981', fontSize: 10, position: 'right' }} />
            <ReferenceLine y={3.5} stroke="#38bdf8" strokeDasharray="4 4" label={{ value: 'Very Good (70%)', fill: '#38bdf8', fontSize: 10, position: 'right' }} />
            <ReferenceLine y={3.0} stroke="#60a5fa" strokeDasharray="4 4" label={{ value: 'Good (60%)', fill: '#60a5fa', fontSize: 10, position: 'right' }} />
            <ReferenceLine y={2.5} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Moderate (50%)', fill: '#f59e0b', fontSize: 10, position: 'right' }} />

            <Bar dataKey="overallScore" radius={[4, 4, 0, 0]} maxBarSize={56}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.classification)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

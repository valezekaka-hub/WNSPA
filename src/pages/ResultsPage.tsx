import React from 'react';
import { 
  BarChart3, 
  Trophy, 
  ArrowRight, 
  FileText, 
  HelpCircle, 
  AlertCircle,
  Download,
  ClipboardCheck
} from 'lucide-react';
import { Protocol, Criterion, Assessment } from '../types';
import { 
  rankAssessments, 
  getClassificationMeta, 
  ACADEMIC_DISCLAIMER 
} from '../engine/scoringEngine';
import { OverallScoreBarChart } from '../components/charts/OverallScoreBarChart';
import { CriteriaComparisonChart } from '../components/charts/CriteriaComparisonChart';

interface ResultsPageProps {
  protocols: Protocol[];
  criteria: Criterion[];
  assessments: Assessment[];
  onNavigateToReports: () => void;
  onNavigateToAssessment: (protocolId?: string) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  protocols,
  criteria,
  assessments,
  onNavigateToReports,
  onNavigateToAssessment,
}) => {
  // Compute rankings
  const rankedItems = rankAssessments(assessments, criteria);

  // Group latest assessment per protocol for chart views
  const uniqueProtocolAssessments: Assessment[] = [];
  const seenProtocols = new Set<string>();

  // Prioritize empirical over demonstration
  const sortedAssessments = [...assessments].sort((a, b) => (a.isDemonstration ? 1 : -1));
  sortedAssessments.forEach(a => {
    if (!seenProtocols.has(a.protocolId)) {
      seenProtocols.add(a.protocolId);
      uniqueProtocolAssessments.push(a);
    }
  });

  return (
    <div className="space-y-8 py-6" id="results-page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Empirical Leaderboard & Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Evaluation Results & Protocol Rankings
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Protocols ranked from highest to lowest overall score based on the standardized 7-criteria equal-weighted evaluation formula.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => onNavigateToAssessment()}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors inline-flex items-center space-x-1.5"
            id="results-add-assessment-btn"
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Score New Assessment</span>
          </button>

          <button
            onClick={onNavigateToReports}
            className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow transition-colors inline-flex items-center space-x-1.5"
            id="results-view-reports-btn"
          >
            <FileText className="w-4 h-4" />
            <span>View Full Report</span>
          </button>
        </div>
      </div>

      {/* Main Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OverallScoreBarChart data={rankedItems} height={320} />
        <CriteriaComparisonChart 
          assessments={uniqueProtocolAssessments} 
          criteria={criteria} 
          height={320} 
        />
      </div>

      {/* Rankings Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-slate-100">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-base">Comprehensive Protocol Ranking Table</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Sorted descending: Overall Score (1.00 – 5.00)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
                <th className="p-3.5 text-center w-16">Rank</th>
                <th className="p-3.5">Protocol</th>
                <th className="p-3.5 text-center">Type</th>
                {criteria.map(c => (
                  <th key={c.id} className="p-3.5 text-center font-mono" title={`${c.name} (${c.code})`}>
                    {c.code}
                  </th>
                ))}
                <th className="p-3.5 text-right">Overall Score</th>
                <th className="p-3.5 text-right">Percentage</th>
                <th className="p-3.5 text-center">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {rankedItems.map((item, idx) => {
                const proto = protocols.find(p => p.id === item.protocolId);
                const meta = getClassificationMeta(item.classification);

                return (
                  <tr 
                    key={`${item.assessmentId}-${idx}`} 
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Rank Badge */}
                    <td className="p-3.5 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-mono font-bold text-xs ${
                        item.rank === 1
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                          : item.rank === 2
                          ? 'bg-slate-400/20 text-slate-200 border border-slate-400/50'
                          : item.rank === 3
                          ? 'bg-amber-700/20 text-amber-400 border border-amber-700/50'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        #{item.rank}
                      </span>
                    </td>

                    {/* Protocol Name */}
                    <td className="p-3.5 font-medium">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-sm text-sky-400">
                          {item.protocolAbbreviation}
                        </span>
                        <span className="text-slate-300 hidden sm:inline text-xs">
                          {proto?.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {proto?.standard}
                      </span>
                    </td>

                    {/* Type Badge */}
                    <td className="p-3.5 text-center">
                      {item.isDemonstration ? (
                        <span className="text-[10px] uppercase font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                          Demo
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                          Empirical
                        </span>
                      )}
                    </td>

                    {/* Criteria Scores */}
                    {criteria.map(c => {
                      const score = item.scores[c.id] || 0;
                      return (
                        <td key={c.id} className="p-3.5 text-center font-mono">
                          <span className={`inline-block px-1.5 py-0.5 rounded font-bold ${
                            score >= 4 ? 'text-emerald-400' : score === 3 ? 'text-sky-400' : score === 2 ? 'text-amber-400' : 'text-rose-400'
                          }`}>
                            {score}
                          </span>
                        </td>
                      );
                    })}

                    {/* Overall Score */}
                    <td className="p-3.5 text-right font-mono font-bold text-sm text-white">
                      {item.overallScore.toFixed(2)}
                      <span className="text-[10px] text-slate-400 font-normal"> / 5.0</span>
                    </td>

                    {/* Percentage */}
                    <td className="p-3.5 text-right font-mono font-bold text-sm text-sky-400">
                      {item.percentage.toFixed(2)}%
                    </td>

                    {/* Classification */}
                    <td className="p-3.5 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${meta.badgeClass}`}>
                        {item.classification}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-400 italic">
          {ACADEMIC_DISCLAIMER}
        </div>
      </div>
    </div>
  );
};

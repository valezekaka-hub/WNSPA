import React, { useState } from 'react';
import { 
  GitCompare, 
  CheckSquare, 
  Square, 
  ArrowRight, 
  HelpCircle, 
  AlertCircle, 
  BarChart3,
  Layers
} from 'lucide-react';
import { Protocol, Criterion, Assessment } from '../types';
import { CriteriaComparisonChart } from '../components/charts/CriteriaComparisonChart';
import { getClassificationMeta } from '../engine/scoringEngine';

interface ComparePageProps {
  protocols: Protocol[];
  criteria: Criterion[];
  assessments: Assessment[];
  onNavigateToReports: (selectedProtocolIds: string[]) => void;
  onNavigateToAssessment: (protocolId: string) => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({
  protocols,
  criteria,
  assessments,
  onNavigateToReports,
  onNavigateToAssessment,
}) => {
  // Default selected: all protocols or at least WEP, WPA2, WPA3
  const [selectedIds, setSelectedIds] = useState<string[]>(
    protocols.map(p => p.id)
  );

  const toggleProtocol = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length <= 2) {
        return; // maintain minimum 2 for comparative analysis
      }
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectAll = () => setSelectedIds(protocols.map(p => p.id));
  const selectModernOnly = () => setSelectedIds(['wpa2', 'wpa3']);

  // Get active assessment per protocol (prefer empirical research over demo)
  const activeAssessments: Assessment[] = selectedIds.map(id => {
    const empirical = assessments.find(a => a.protocolId === id && !a.isDemonstration);
    if (empirical) return empirical;
    return assessments.find(a => a.protocolId === id) || {
      id: `placeholder-${id}`,
      protocolId: id,
      protocolAbbreviation: id.toUpperCase(),
      researcherName: 'N/A',
      assessmentDate: new Date().toISOString().split('T')[0],
      isDemonstration: true,
      scores: {},
      overallScore: 0,
      percentage: 0,
      classification: 'Poor'
    };
  });

  return (
    <div className="space-y-8 py-6" id="compare-page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <GitCompare className="w-4 h-4" />
            <span>Multi-Protocol Evaluation Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Compare Wireless Security Protocols
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Select two or more protocols to analyze side-by-side performance across all seven criteria, encryption ciphers, and key exchange effectiveness.
          </p>
        </div>

        <button
          onClick={() => onNavigateToReports(selectedIds)}
          className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow transition-colors inline-flex items-center space-x-1.5"
          id="compare-export-report-btn"
        >
          <span>Generate Research Report</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Protocol Selection Chips */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Select Protocols to Compare (Minimum 2 required):
          </span>
          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={selectAll}
              className="text-sky-400 hover:text-sky-300 font-medium px-2 py-1 rounded bg-slate-800 border border-slate-700"
            >
              Select All (4)
            </button>
            <button
              onClick={selectModernOnly}
              className="text-slate-400 hover:text-slate-200 font-medium px-2 py-1 rounded bg-slate-800 border border-slate-700"
            >
              Modern Only (WPA2 vs WPA3)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {protocols.map(p => {
            const isSelected = selectedIds.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggleProtocol(p.id)}
                className={`p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-sky-950/40 border-sky-500 text-white shadow-sm ring-1 ring-sky-500/50'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
                id={`compare-toggle-${p.id}`}
              >
                <div>
                  <span className="font-mono font-bold text-base block">{p.abbreviation}</span>
                  <span className="text-[11px] text-slate-400 block truncate">{p.standard}</span>
                </div>
                {isSelected ? (
                  <CheckSquare className="w-5 h-5 text-sky-400 shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-slate-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Chart Comparison */}
      <div className="space-y-4">
        <CriteriaComparisonChart 
          assessments={activeAssessments} 
          criteria={criteria} 
          height={380} 
        />
      </div>

      {/* Side-by-Side Comparison Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">
              Direct Side-by-Side Evaluation Matrix
            </h2>
            <p className="text-xs text-slate-400">
              Comparing scores (1–5 scale) and technical characteristics across {selectedIds.length} protocols
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">7 Predefined Criteria</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900">
                <th className="p-4 font-semibold text-slate-300 w-1/4 uppercase tracking-wider text-[11px]">
                  Evaluation Criteria / Dimension
                </th>
                {selectedIds.map(id => {
                  const proto = protocols.find(p => p.id === id);
                  const assessment = activeAssessments.find(a => a.protocolId === id);
                  const meta = assessment ? getClassificationMeta(assessment.classification) : null;
                  return (
                    <th key={id} className="p-4 font-semibold text-slate-200 border-l border-slate-800/80">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-base font-bold text-sky-400">
                          {proto?.abbreviation}
                        </span>
                        {assessment?.isDemonstration ? (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                            DEMO
                          </span>
                        ) : (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                            RESEARCH
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 block font-normal mt-0.5">
                        {proto?.standard} ({proto?.releaseYear})
                      </span>
                      {assessment && (
                        <div className="mt-2 pt-1 border-t border-slate-800 flex items-center justify-between">
                          <span className="font-mono font-bold text-white">
                            {assessment.overallScore.toFixed(2)} / 5.0
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${meta?.badgeClass}`}>
                            {assessment.classification}
                          </span>
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {/* Seven Criteria Rows */}
              {criteria.map((criterion, idx) => {
                return (
                  <tr key={criterion.id} className={idx % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-950/40'}>
                    <td className="p-4 font-medium text-slate-200">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-sky-400 text-xs bg-slate-800 px-1.5 py-0.5 rounded">
                          {criterion.code}
                        </span>
                        <span className="font-semibold text-slate-100">{criterion.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-1 leading-snug">
                        {criterion.description}
                      </span>
                    </td>

                    {selectedIds.map(id => {
                      const assessment = activeAssessments.find(a => a.protocolId === id);
                      const scoreDetail = assessment?.scores[criterion.id] 
                        ?? assessment?.scores[criterion.code.toLowerCase()] 
                        ?? assessment?.scores[criterion.code];
                      const val = scoreDetail ? scoreDetail.score : 0;

                      // Visual badge based on score
                      const getScoreBadge = (score: number) => {
                        if (score >= 4) return 'bg-emerald-950 text-emerald-300 border-emerald-800';
                        if (score === 3) return 'bg-sky-950 text-sky-300 border-sky-800';
                        if (score === 2) return 'bg-amber-950 text-amber-300 border-amber-800';
                        return 'bg-rose-950 text-rose-300 border-rose-800';
                      };

                      return (
                        <td key={id} className="p-4 border-l border-slate-800/80 align-top">
                          <div className="flex items-center space-x-2 mb-1.5">
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded font-mono font-bold text-xs border ${getScoreBadge(val)}`}>
                              {val}
                            </span>
                            <span className="font-semibold text-slate-200">
                              {val === 5 ? 'Very High' : val === 4 ? 'High' : val === 3 ? 'Moderate' : val === 2 ? 'Low' : 'Very Low'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed italic bg-slate-900/60 p-2 rounded border border-slate-800/60">
                            "{scoreDetail?.justification || 'No justification entered.'}"
                          </p>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* Cryptographic Architecture Technical Details Row */}
              <tr className="bg-slate-950 font-semibold border-t-2 border-slate-800">
                <td className="p-4 text-slate-300 uppercase tracking-wider text-[11px]">
                  Encryption Method
                </td>
                {selectedIds.map(id => {
                  const proto = protocols.find(p => p.id === id);
                  return (
                    <td key={id} className="p-4 border-l border-slate-800 text-slate-300 font-mono text-[11px] align-top leading-relaxed">
                      {proto?.encryptionMethod}
                    </td>
                  );
                })}
              </tr>

              <tr className="bg-slate-950 font-semibold border-t border-slate-800">
                <td className="p-4 text-slate-300 uppercase tracking-wider text-[11px]">
                  Authentication Method
                </td>
                {selectedIds.map(id => {
                  const proto = protocols.find(p => p.id === id);
                  return (
                    <td key={id} className="p-4 border-l border-slate-800 text-slate-300 font-mono text-[11px] align-top leading-relaxed">
                      {proto?.authenticationMethod}
                    </td>
                  );
                })}
              </tr>

              {/* Primary Strengths */}
              <tr className="bg-slate-900/40 border-t border-slate-800">
                <td className="p-4 text-emerald-400 font-semibold uppercase tracking-wider text-[11px]">
                  Identified Strengths
                </td>
                {selectedIds.map(id => {
                  const proto = protocols.find(p => p.id === id);
                  return (
                    <td key={id} className="p-4 border-l border-slate-800 text-slate-300 text-[11px] align-top">
                      <ul className="space-y-1">
                        {proto?.strengths.map((s, idx) => (
                          <li key={idx} className="flex items-start space-x-1.5">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  );
                })}
              </tr>

              {/* Primary Weaknesses */}
              <tr className="bg-slate-900/40 border-t border-slate-800">
                <td className="p-4 text-rose-400 font-semibold uppercase tracking-wider text-[11px]">
                  Structural Weaknesses
                </td>
                {selectedIds.map(id => {
                  const proto = protocols.find(p => p.id === id);
                  return (
                    <td key={id} className="p-4 border-l border-slate-800 text-slate-300 text-[11px] align-top">
                      <ul className="space-y-1">
                        {proto?.weaknesses.map((w, idx) => (
                          <li key={idx} className="flex items-start space-x-1.5">
                            <span className="text-rose-400 font-bold">•</span>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Sliders, HelpCircle, AlertCircle, Scale, ShieldCheck } from 'lucide-react';
import { Criterion } from '../types';

interface CriteriaPageProps {
  criteria: Criterion[];
  onNavigateToAssessment: () => void;
}

export const CriteriaPage: React.FC<CriteriaPageProps> = ({ criteria, onNavigateToAssessment }) => {
  return (
    <div className="space-y-8 py-6" id="criteria-page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4" />
            <span>Evaluation Framework</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Seven Evaluation Criteria
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Formal multidimensional criteria engineered for structured comparative evaluation. Each criterion is weighted equally at 14.29% across a standardized 5-point scale.
          </p>
        </div>

        <button
          onClick={onNavigateToAssessment}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors"
          id="criteria-start-assessment-btn"
        >
          Score Criteria in Assessment →
        </button>
      </div>

      {/* Special Notice on Vulnerability Inversion */}
      <div className="bg-amber-950/30 border border-amber-500/40 p-4 rounded-xl flex items-start space-x-3 text-amber-200">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <p className="font-bold text-amber-300 mb-1">
            Critical Methodological Clarification: Vulnerability Level (VL) Scale Direction
          </p>
          <p className="text-amber-200/90">
            Unlike standard vulnerability metrics where higher numbers indicate worse danger, the WNSPA evaluation model preserves unified mathematical directionality (where higher score always means greater security performance):
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2 font-mono text-[11px]">
            <span className="bg-amber-900/40 px-2 py-1 rounded border border-amber-700/50">1 = Very High Vuln.</span>
            <span className="bg-amber-900/40 px-2 py-1 rounded border border-amber-700/50">2 = High Vuln.</span>
            <span className="bg-amber-900/40 px-2 py-1 rounded border border-amber-700/50">3 = Moderate Vuln.</span>
            <span className="bg-amber-900/40 px-2 py-1 rounded border border-amber-700/50">4 = Low Vuln.</span>
            <span className="bg-amber-900/40 px-2 py-1 rounded border border-amber-700/50 font-bold text-emerald-300">5 = Very Low Vuln.</span>
          </div>
        </div>
      </div>

      {/* Seven Criteria List */}
      <div className="space-y-4" id="criteria-items-list">
        {criteria.map((criterion, idx) => {
          return (
            <div
              key={criterion.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors shadow-sm"
              id={`criterion-card-${criterion.code.toLowerCase()}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 rounded-lg bg-sky-600/20 border border-sky-500/40 text-sky-400 flex items-center justify-center font-mono font-bold text-sm">
                    {criterion.displayOrder}
                  </span>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                      <span>{criterion.name}</span>
                      <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/60">
                        Code: {criterion.code}
                      </span>
                    </h2>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                    <Scale className="w-3.5 h-3.5 mr-1 text-sky-400" />
                    Weight: 14.29%
                  </span>
                  {criterion.isInvertedMetric && (
                    <span className="px-2 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800 font-mono text-[11px]">
                      Inverted Interpretation
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
                {criterion.description}
              </p>

              {/* 5-Point Scale Rubric */}
              <div className="pt-3 border-t border-slate-800/80">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Standardized 5-Point Scoring Rubric:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                  {[1, 2, 3, 4, 5].map(score => (
                    <div 
                      key={score}
                      className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-sky-400">Score {score}</span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {score === 1 ? 'Minimum' : score === 5 ? 'Maximum' : ''}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">
                        {criterion.scaleInterpretation[score as 1 | 2 | 3 | 4 | 5]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

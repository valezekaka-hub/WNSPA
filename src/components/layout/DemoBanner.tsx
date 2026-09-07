import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DemoBannerProps {
  onDismiss?: () => void;
  onGoToAssessment?: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onGoToAssessment }) => {
  return (
    <div 
      className="bg-amber-950/40 border-b border-amber-600/30 text-amber-200 px-4 py-2.5 text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-between gap-2"
      id="demonstration-data-warning-banner"
    >
      <div className="flex items-center space-x-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
          <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-400" />
          DEMONSTRATION DATA
        </span>
        <span>
          Baseline benchmark scores are currently displayed for system demonstration and do not represent published field research findings.
        </span>
      </div>
      {onGoToAssessment && (
        <button
          onClick={onGoToAssessment}
          className="whitespace-nowrap text-xs font-semibold text-amber-300 underline hover:text-amber-100 transition-colors"
          id="banner-add-assessment-btn"
        >
          Enter Empirical Scores →
        </button>
      )}
    </div>
  );
};

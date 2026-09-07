import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  Calculator, 
  Layers, 
  User, 
  RotateCcw,
  Sparkles,
  Trash2
} from 'lucide-react';
import { Protocol, Criterion, Assessment, ScoreDetail } from '../types';
import { 
  calculateOverallScore, 
  calculatePercentage, 
  getClassificationTier, 
  getClassificationMeta,
  ACADEMIC_DISCLAIMER 
} from '../engine/scoringEngine';

interface AssessmentPageProps {
  protocols: Protocol[];
  criteria: Criterion[];
  assessments: Assessment[];
  initialProtocolId?: string;
  onSaveAssessment: (assessment: Assessment) => Promise<boolean>;
  onDeleteAssessment: (assessmentId: string) => Promise<boolean>;
  onViewResults: () => void;
}

export const AssessmentPage: React.FC<AssessmentPageProps> = ({
  protocols,
  criteria,
  assessments,
  initialProtocolId,
  onSaveAssessment,
  onDeleteAssessment,
  onViewResults,
}) => {
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>(
    initialProtocolId || (protocols[0]?.id ?? 'wep')
  );
  const [researcherName, setResearcherName] = useState<string>('Academic Researcher');
  const [assessmentDate, setAssessmentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [scores, setScores] = useState<Record<string, ScoreDetail>>({});
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync initial protocol if passed via props
  useEffect(() => {
    if (initialProtocolId) {
      setSelectedProtocolId(initialProtocolId);
    }
  }, [initialProtocolId]);

  // When protocol changes, check if there is an existing assessment to populate as starting point
  useEffect(() => {
    const existing = assessments.find(a => a.protocolId === selectedProtocolId && !a.isDemonstration)
      || assessments.find(a => a.protocolId === selectedProtocolId);

    const initialScores: Record<string, ScoreDetail> = {};
    criteria.forEach(c => {
      const existingEntry = existing?.scores[c.id] ?? existing?.scores[c.code.toLowerCase()] ?? existing?.scores[c.code];
      initialScores[c.id] = {
        score: existingEntry ? existingEntry.score : 3,
        justification: existingEntry ? existingEntry.justification : `Standard evaluation for ${c.name} on ${selectedProtocolId.toUpperCase()}.`
      };
    });
    setScores(initialScores);
  }, [selectedProtocolId, criteria, assessments]);

  const selectedProtocol = protocols.find(p => p.id === selectedProtocolId);

  // Real-time calculation
  const numericScores: Record<string, number> = {};
  criteria.forEach(c => {
    numericScores[c.id] = scores[c.id]?.score || 0;
  });

  const overallScore = calculateOverallScore(numericScores, criteria);
  const percentage = calculatePercentage(overallScore);
  const classification = getClassificationTier(percentage);
  const classMeta = getClassificationMeta(classification);

  const handleScoreChange = (criterionId: string, value: number) => {
    setScores(prev => ({
      ...prev,
      [criterionId]: {
        score: value,
        justification: prev[criterionId]?.justification || ''
      }
    }));
  };

  const handleJustificationChange = (criterionId: string, text: string) => {
    setScores(prev => ({
      ...prev,
      [criterionId]: {
        score: prev[criterionId]?.score || 3,
        justification: text
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    // Validation: check that all criteria have scores between 1 and 5
    for (const c of criteria) {
      const s = scores[c.id]?.score;
      if (!s || s < 1 || s > 5) {
        setStatusMessage({
          type: 'error',
          text: `Validation failed: Score for ${c.name} (${c.code}) must be an integer between 1 and 5.`
        });
        return;
      }
      if (!scores[c.id]?.justification || scores[c.id].justification.trim().length < 3) {
        setStatusMessage({
          type: 'error',
          text: `Please enter a short research justification for criterion ${c.name} (${c.code}).`
        });
        return;
      }
    }

    setIsSubmitting(true);

    const newAssessment: Assessment = {
      id: `assessment-${selectedProtocolId}-${Date.now()}`,
      protocolId: selectedProtocolId,
      protocolAbbreviation: selectedProtocol?.abbreviation || selectedProtocolId.toUpperCase(),
      researcherName: researcherName.trim() || 'Anonymous Researcher',
      assessmentDate,
      isDemonstration: false, // User submitted -> empirical research
      scores,
      overallScore,
      percentage,
      classification,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const success = await onSaveAssessment(newAssessment);
      if (success) {
        setStatusMessage({
          type: 'success',
          text: `Assessment for ${newAssessment.protocolAbbreviation} successfully saved to Firestore!`
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: 'Failed to record assessment. Please check Firestore connection.'
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Error saving assessment: ${err.message || 'Unknown error'}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 py-6" id="assessment-page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <ClipboardCheck className="w-4 h-4" />
            <span>Empirical Evaluation Workbench</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Protocol Security Assessment
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Input empirical scores (1 to 5) across all seven evaluation criteria with formal academic justifications. Overall scores and classifications are automatically calculated.
          </p>
        </div>

        <button
          onClick={onViewResults}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          id="assessment-view-results-btn"
        >
          View Results Leaderboard →
        </button>
      </div>

      {/* Status Notice */}
      {statusMessage && (
        <div 
          className={`p-4 rounded-xl border text-xs sm:text-sm flex items-center justify-between ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/50 border-rose-500/50 text-rose-200'
          }`}
          id="assessment-status-message"
        >
          <div className="flex items-center space-x-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button 
            onClick={() => setStatusMessage(null)}
            className="text-xs font-bold underline ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Live Scoring Metric Ribbon */}
      <div className="bg-slate-900/90 border border-sky-500/30 rounded-2xl p-5 shadow-lg grid grid-cols-1 sm:grid-cols-4 gap-4 sticky top-18 z-30 backdrop-blur-md">
        <div>
          <span className="text-xs text-slate-400 font-medium block mb-1">Target Protocol</span>
          <span className="font-mono text-xl font-bold text-sky-400">
            {selectedProtocol?.abbreviation}
          </span>
          <span className="text-xs text-slate-400 block truncate">{selectedProtocol?.name}</span>
        </div>

        <div>
          <span className="text-xs text-slate-400 font-medium block mb-1">Overall Score (Scale 1–5)</span>
          <div className="flex items-baseline space-x-1">
            <span className="font-mono text-2xl font-black text-white">
              {overallScore.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400">/ 5.00</span>
          </div>
          <span className="text-[11px] text-slate-500">Arithmetic mean of 7 criteria</span>
        </div>

        <div>
          <span className="text-xs text-slate-400 font-medium block mb-1">Percentage Score</span>
          <div className="flex items-baseline space-x-1">
            <span className="font-mono text-2xl font-black text-white">
              {percentage.toFixed(2)}%
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">(Score / 5) × 100</span>
        </div>

        <div>
          <span className="text-xs text-slate-400 font-medium block mb-1">Proposed Classification</span>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${classMeta.badgeClass}`}>
            {classification}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">Proposed system threshold</span>
        </div>
      </div>

      {/* Assessment Form */}
      <form onSubmit={handleSubmit} className="space-y-8" id="assessment-main-form">
        {/* Metadata Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Protocol to Evaluate:
            </label>
            <select
              value={selectedProtocolId}
              onChange={(e) => setSelectedProtocolId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              id="assessment-protocol-select"
            >
              {protocols.map(p => (
                <option key={p.id} value={p.id}>
                  {p.abbreviation} — {p.name} ({p.releaseYear})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Researcher Name / Identifier:
            </label>
            <input
              type="text"
              value={researcherName}
              onChange={(e) => setResearcherName(e.target.value)}
              placeholder="e.g. Student / Principal Investigator"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              id="assessment-researcher-input"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Assessment Date:
            </label>
            <input
              type="date"
              value={assessmentDate}
              onChange={(e) => setAssessmentDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
              id="assessment-date-input"
              required
            />
          </div>
        </div>

        {/* Seven Evaluation Criteria Fields */}
        <div className="space-y-6" id="criteria-scoring-fields">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-200">
              Evaluation Criteria Scoring (1 = Very Low, 5 = Very High)
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              7 Criteria × 14.29% = 100%
            </span>
          </div>

          {criteria.map((criterion) => {
            const currentScore = scores[criterion.id]?.score || 3;
            const currentJustification = scores[criterion.id]?.justification || '';

            return (
              <div
                key={criterion.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 hover:border-slate-700 transition-colors shadow-sm"
                id={`criterion-input-${criterion.id}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-md bg-sky-950 text-sky-400 border border-sky-800 flex items-center justify-center font-mono font-bold text-xs">
                      {criterion.code}
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-slate-100">
                        {criterion.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
                        {criterion.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {criterion.isInvertedMetric && (
                      <span className="text-[11px] font-mono text-amber-300 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                        Inverted: 5 = Very Low Vuln.
                      </span>
                    )}
                    <span className="text-xs font-mono text-slate-400">
                      Score: <strong className="text-sky-400 text-sm">{currentScore}</strong> / 5
                    </span>
                  </div>
                </div>

                {/* Score Selector Radio Bar */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Assign Score:
                  </label>
                  <div className="grid grid-cols-5 gap-2 sm:gap-3">
                    {[1, 2, 3, 4, 5].map((val) => {
                      const isSelected = currentScore === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleScoreChange(criterion.id, val)}
                          className={`p-2.5 sm:p-3 rounded-lg border text-center transition-all flex flex-col items-center justify-center ${
                            isSelected
                              ? 'bg-sky-600 text-white border-sky-400 shadow-md ring-2 ring-sky-400/30 font-bold'
                              : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                          }`}
                          id={`score-btn-${criterion.id}-${val}`}
                        >
                          <span className="font-mono text-base sm:text-lg font-bold">
                            {val}
                          </span>
                          <span className="text-[10px] hidden sm:block truncate mt-0.5">
                            {val === 1 ? 'Very Low' : val === 2 ? 'Low' : val === 3 ? 'Moderate' : val === 4 ? 'High' : 'Very High'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Rubric Definition for Current Selected Score */}
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 text-xs">
                  <span className="text-slate-400 font-semibold block mb-0.5">
                    Scale Interpretation for Score {currentScore}:
                  </span>
                  <span className="text-slate-200">
                    {criterion.scaleInterpretation[currentScore as 1 | 2 | 3 | 4 | 5]}
                  </span>
                </div>

                {/* Academic Justification Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Empirical Justification / Academic Rationale:
                  </label>
                  <textarea
                    rows={2}
                    value={currentJustification}
                    onChange={(e) => handleJustificationChange(criterion.id, e.target.value)}
                    placeholder={`Provide researcher justification for assigning score ${currentScore} to ${selectedProtocol?.abbreviation} on ${criterion.name}...`}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed font-sans"
                    id={`justification-input-${criterion.id}`}
                    required
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* General Field Notes */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            General Evaluation Notes & Research Comments (Optional):
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add general lab remarks, testbed environment details, or empirical observations..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
            id="assessment-notes-input"
          />
        </div>

        {/* Academic Disclaimer Notice */}
        <p className="text-xs text-slate-400 italic">
          {ACADEMIC_DISCLAIMER}
        </p>

        {/* Submission Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            Records are persisted directly to Firebase Firestore.
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg transition-colors disabled:opacity-50"
              id="save-assessment-submit-btn"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving to Firestore...' : 'Save Assessment to Firestore'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Existing Saved Assessments List */}
      <div className="mt-12 pt-8 border-t border-slate-800">
        <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center space-x-2">
          <span>Persisted Assessments Repository</span>
          <span className="text-xs font-mono font-normal text-slate-400">
            ({assessments.length} total records)
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="persisted-assessments-grid">
          {assessments.map((a) => {
            const isSelected = a.protocolId === selectedProtocolId;
            return (
              <div 
                key={a.id}
                className={`p-4 rounded-xl border transition-all ${
                  isSelected 
                    ? 'bg-slate-900/90 border-sky-500/60 shadow-md' 
                    : 'bg-slate-900/50 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-lg text-sky-400">
                        {a.protocolAbbreviation}
                      </span>
                      {a.isDemonstration ? (
                        <span className="text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                          Demo Data
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                          Empirical
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Researcher: {a.researcherName} • {a.assessmentDate}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-base text-white">
                      {a.overallScore.toFixed(2)} <span className="text-xs text-slate-400">/ 5</span>
                    </div>
                    <span className="text-xs font-mono text-emerald-400">
                      {a.percentage.toFixed(1)}% ({a.classification})
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedProtocolId(a.protocolId)}
                    className="text-sky-400 hover:text-sky-300 font-semibold"
                  >
                    Load into Editor →
                  </button>

                  {!a.isDemonstration && (
                    <button
                      type="button"
                      onClick={() => onDeleteAssessment(a.id)}
                      className="text-rose-400 hover:text-rose-300 inline-flex items-center space-x-1"
                      title="Delete assessment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Calculator, 
  Scale, 
  Shield, 
  AlertTriangle, 
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { Protocol, Criterion } from '../types';
import { PROPOSED_CLASSIFICATIONS, ACADEMIC_DISCLAIMER } from '../engine/scoringEngine';

interface MethodologyPageProps {
  protocols: Protocol[];
  criteria: Criterion[];
}

export const MethodologyPage: React.FC<MethodologyPageProps> = ({ protocols, criteria }) => {
  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto" id="methodology-page-container">
      {/* Page Title */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-2 text-sky-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Research Methodology & Theoretical Framework</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
          System Evaluation Methodology
        </h1>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          Comprehensive academic documentation detailing the mathematical models, criteria definitions, reversed vulnerability scoring logic, equal weighting justification, and qualitative classification boundaries of WNSPA.
        </p>
      </div>

      {/* 1. Purpose of the System */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center space-x-2 text-sky-400">
          <Shield className="w-5 h-5" />
          <h2 className="text-lg font-bold text-white">1. Purpose of the System</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
          The <strong>Wireless Network Security Protocol Analyzer (WNSPA)</strong> is an academic research artefact developed to conduct a structured, reproducible comparative analysis of standard wireless security protocols. Wireless local area networks (WLANs) represent critical communications infrastructure yet remain fundamentally vulnerable to physical interception, packet injection, and cryptanalytic exploitation. WNSPA eliminates ad-hoc subjective evaluations by providing a deterministic, multi-attribute evaluation framework that assesses technical cryptographic posture, attack resistance, and real-world operational viability.
        </p>
      </section>

      {/* 2. Protocols Evaluated */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2 text-sky-400">
          <Shield className="w-5 h-5" />
          <h2 className="text-lg font-bold text-white">2. Protocols Evaluated</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          The framework targets the four canonical iterations of IEEE 802.11 security specifications:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {protocols.map(p => (
            <div key={p.id} className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sky-400 text-sm">{p.abbreviation}</span>
                <span className="text-slate-400 font-mono">{p.standard} ({p.releaseYear})</span>
              </div>
              <p className="font-semibold text-slate-200">{p.name}</p>
              <p className="text-slate-400 line-clamp-2 mt-1">{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Seven Evaluation Criteria */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2 text-sky-400">
          <Scale className="w-5 h-5" />
          <h2 className="text-lg font-bold text-white">3. Seven Evaluation Criteria</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          The evaluation employs seven independent technical and operational dimensions:
        </p>
        <div className="space-y-2.5">
          {criteria.map((c, idx) => (
            <div key={c.id} className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-mono font-bold text-sky-400 mr-2">{idx + 1}. {c.code}</span>
                <span className="font-semibold text-slate-200">{c.name}</span>
                <p className="text-slate-400 text-[11px] mt-0.5 max-w-xl">{c.description}</p>
              </div>
              <span className="font-mono text-slate-400 text-[11px] shrink-0 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                Weight: 14.29%
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Five-Point Scoring Scale & Vulnerability Scoring */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2 text-sky-400">
          <Calculator className="w-5 h-5" />
          <h2 className="text-lg font-bold text-white">4. Five-Point Scale & Vulnerability Interpretation</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Standard criteria are evaluated on a 5-point Likert scale:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-mono">
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300">1 = Very Low</div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300">2 = Low</div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300">3 = Moderate</div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300">4 = High</div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-emerald-400 font-bold">5 = Very High</div>
        </div>

        {/* Vulnerability Level Specific Inversion */}
        <div className="bg-amber-950/40 border border-amber-500/40 p-5 rounded-lg text-xs space-y-2 mt-4">
          <h3 className="font-bold text-amber-300 text-sm flex items-center space-x-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Vulnerability Level (VL) Directional Mapping:</span>
          </h3>
          <p className="text-amber-200/90 leading-relaxed">
            In standard security reporting, "high vulnerability" is negative, but in additive scoring models, higher values must signify better overall performance. To maintain mathematical consistency, the Vulnerability Level criterion is scored inversely:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 font-mono text-[11px] text-center pt-1">
            <div className="p-2 rounded bg-amber-900/40 border border-amber-700/60 text-amber-200">
              <strong>Score 1:</strong> Very High Vulnerability
            </div>
            <div className="p-2 rounded bg-amber-900/40 border border-amber-700/60 text-amber-200">
              <strong>Score 2:</strong> High Vulnerability
            </div>
            <div className="p-2 rounded bg-amber-900/40 border border-amber-700/60 text-amber-200">
              <strong>Score 3:</strong> Moderate Vulnerability
            </div>
            <div className="p-2 rounded bg-amber-900/40 border border-amber-700/60 text-amber-200">
              <strong>Score 4:</strong> Low Vulnerability
            </div>
            <div className="p-2 rounded bg-amber-900/40 border border-amber-700/60 text-emerald-300 font-bold">
              <strong>Score 5:</strong> Very Low Vulnerability
            </div>
          </div>
        </div>
      </section>

      {/* 5. Mathematical Formulae */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2 text-sky-400">
          <Calculator className="w-5 h-5" />
          <h2 className="text-lg font-bold text-white">5. Mathematical Formulation</h2>
        </div>

        {/* Equal Weighting */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            A. Equal Weighting Distribution:
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Each criterion is allocated an identical weight of approximately 14.2857%:
          </p>
          <div className="p-3 bg-slate-900 rounded font-mono text-xs sm:text-sm text-sky-400 text-center">
            w<sub>i</sub> = 1 / N = 1 / 7 ≈ 14.29%
          </div>
        </div>

        {/* Overall Score */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            B. Overall Score Formula:
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Calculated as the arithmetic mean across all seven evaluation criteria:
          </p>
          <div className="p-3 bg-slate-900 rounded font-mono text-xs sm:text-sm text-sky-400 text-center">
            Overall Score = (SS + VL + ER + AE + CAR + NPE + OA) / 7
          </div>
          <p className="text-[11px] text-slate-400">
            Yields a normalized composite score on the continuous interval [1.00, 5.00].
          </p>
        </div>

        {/* Percentage Calculation */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            C. Percentage Conversion:
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Normalizes the 5-point composite score into a percentage index [0.00%, 100.00%]:
          </p>
          <div className="p-3 bg-slate-900 rounded font-mono text-xs sm:text-sm text-sky-400 text-center">
            Percentage = (Overall Score / 5) × 100
          </div>
        </div>
      </section>

      {/* 6. Proposed System Classification */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2 text-sky-400">
          <FileCheck className="w-5 h-5" />
          <h2 className="text-lg font-bold text-white">6. Proposed Qualitative Classification System</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          To provide qualitative meaning to numerical percentages, the system proposes a 5-tier classification framework:
        </p>

        <div className="space-y-2.5">
          {PROPOSED_CLASSIFICATIONS.map(rule => (
            <div 
              key={rule.tier}
              className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full font-bold border ${rule.badgeClass}`}>
                  {rule.label}
                </span>
                <span className="font-mono font-bold text-slate-300">
                  {rule.minPercentage.toFixed(0)}% – {rule.maxPercentage === 100 ? '100%' : `${rule.maxPercentage.toFixed(0)}%`}
                </span>
              </div>
              <p className="text-slate-400 text-xs sm:text-right max-w-md">
                {rule.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80 text-xs text-slate-400 italic">
          {ACADEMIC_DISCLAIMER}
        </div>
      </section>
    </div>
  );
};

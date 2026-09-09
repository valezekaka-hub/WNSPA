import React from 'react';
import { 
  Shield, 
  Layers, 
  ClipboardCheck, 
  GitCompare, 
  BarChart3, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  Lock,
  Cpu,
  Globe2
} from 'lucide-react';
import { PageId } from '../components/layout/Navbar';
import { Protocol, Criterion } from '../types';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  protocols: Protocol[];
  criteria: Criterion[];
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, protocols, criteria }) => {
  return (
    <div className="space-y-10 py-6" id="home-page-container">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Shield className="w-3.5 h-3.5" />
            <span>Academic ICT Research Artefact</span>
          </div>
          
          <div className="mt-6 text-center">
  <h2 className="text-lg font-semibold text-white">
    EZEKAKA, OBIORA VALENTINE
  </h2>

  <p className="mt-1 text-sm text-slate-300">
    Matric No.: NOU254276406
  </p>

  <p className="mt-3 text-sm text-slate-300">
    Department of Information Technology
  </p>

  <p className="text-sm text-slate-300">
    Faculty of Computer Science
  </p>

  <p className="text-sm text-slate-300">
    National Open University
  </p>

  <p className="text-sm text-slate-300">
    Lagos Study Center
  </p>

  <p className="mt-3 text-sm text-slate-300">
    Supervisor: Dr (Mrs) Raji-Lawal H. Y
  </p>
</div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-2 font-mono">
            WNSPA
          </h1>
          <h2 className="text-lg sm:text-2xl font-semibold text-sky-400 mb-4">
            Wireless Network Security Protocol Analyzer
          </h2>

          <div className="bg-slate-800/60 border-l-4 border-sky-500 p-4 rounded-r-lg mb-6">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Project Title:
            </p>
            <p className="text-sm sm:text-base font-serif font-bold text-slate-100 italic">
              DESIGN AND IMPLEMENTATION OF A SYSTEM FOR COMPARATIVE ANALYSIS OF WIRELESS NETWORK SECURITY PROTOCOLS
            </p>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-3xl">
            WNSPA is an empirical evaluation and comparative analysis system engineered to benchmark wireless network security standards across seven rigorous, equal-weighted dimensions. Developed as a formal academic research artefact, the system systematically analyses vulnerabilities, cipher suites, authentication handshakes, and operational efficiency across IEEE 802.11 protocols.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap gap-3" id="home-action-buttons">
            <button
              onClick={() => onNavigate('protocols')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-md transition-colors"
              id="home-btn-protocols"
            >
              <Layers className="w-4 h-4" />
              <span>View Protocols</span>
            </button>

            <button
              onClick={() => onNavigate('assessment')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-md transition-colors"
              id="home-btn-assessment"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Start Assessment</span>
            </button>

            <button
              onClick={() => onNavigate('compare')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-sm font-semibold transition-colors"
              id="home-btn-compare"
            >
              <GitCompare className="w-4 h-4" />
              <span>Compare Protocols</span>
            </button>

            <button
              onClick={() => onNavigate('results')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-sm font-semibold transition-colors"
              id="home-btn-results"
            >
              <BarChart3 className="w-4 h-4" />
              <span>View Results</span>
            </button>

            <button
              onClick={() => onNavigate('methodology')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-sm font-semibold transition-colors"
              id="home-btn-methodology"
            >
              <BookOpen className="w-4 h-4" />
              <span>Methodology</span>
            </button>
          </div>
        </div>
      </section>

      {/* Core Research Framework Dimensions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="flex items-center space-x-3 text-sky-400 mb-3">
            <Lock className="w-6 h-6" />
            <h3 className="text-base font-bold text-slate-100">4 Target Protocols</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Evaluates the historical and contemporary evolution of wireless encryption from legacy specifications to high-assurance modern standards.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {protocols.map(p => (
              <div 
                key={p.id}
                onClick={() => onNavigate('protocols')}
                className="p-2 rounded bg-slate-800/80 border border-slate-700/60 cursor-pointer hover:border-sky-500/50 transition-colors"
              >
                <span className="font-mono font-bold text-sm text-sky-400">{p.abbreviation}</span>
                <p className="text-[10px] text-slate-400 truncate">{p.standard}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="flex items-center space-x-3 text-emerald-400 mb-3">
            <Cpu className="w-6 h-6" />
            <h3 className="text-base font-bold text-slate-100">7 Evaluation Criteria</h3>
          </div>
          <p className="text-xs text-slate-400 mb-3 leading-relaxed">
            Standardized multi-criteria evaluation matrix covering technical cryptography, attack resistance, and ecosystem viability.
          </p>
          <ul className="text-xs text-slate-300 space-y-1.5">
            {criteria.map(c => (
              <li key={c.id} className="flex items-center justify-between border-b border-slate-800/50 pb-1">
                <span className="font-medium">
                  <span className="font-mono text-sky-400 font-bold mr-1.5">{c.code}</span>
                  {c.name}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">14.29%</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="flex items-center space-x-3 text-amber-400 mb-3">
            <Globe2 className="w-6 h-6" />
            <h3 className="text-base font-bold text-slate-100">Standardized Scoring</h3>
          </div>
          <p className="text-xs text-slate-400 mb-3 leading-relaxed">
            Rigorous 5-point mathematical scoring scale with equal weighting, inverted vulnerability handling, and proposed academic classification.
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-2 rounded bg-slate-800/60 border border-slate-700/50 flex justify-between items-center">
              <span className="text-slate-300">5-Point Likert Scale</span>
              <span className="font-mono text-slate-400">1 (Low) to 5 (High)</span>
            </div>
            <div className="p-2 rounded bg-slate-800/60 border border-slate-700/50 flex justify-between items-center">
              <span className="text-slate-300">Vulnerability Inversion</span>
              <span className="font-mono text-amber-400">5 = Very Low Vuln.</span>
            </div>
            <div className="p-2 rounded bg-slate-800/60 border border-slate-700/50 flex justify-between items-center">
              <span className="text-slate-300">Equal Weighting</span>
              <span className="font-mono text-sky-400">14.29% per criterion</span>
            </div>
            <div className="p-2 rounded bg-slate-800/60 border border-slate-700/50 flex justify-between items-center">
              <span className="text-slate-300">Proposed Tiers</span>
              <span className="font-mono text-emerald-400">80–100% = Excellent</span>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Modules Overview */}
      <section className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-slate-100 mb-4">
          Key Research Capabilities & Deliverables
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => onNavigate('assessment')}
            className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-sky-500 cursor-pointer transition-all"
          >
            <div className="text-sky-400 mb-2">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-sm text-slate-200 mb-1">Empirical Assessment</h4>
            <p className="text-xs text-slate-400">
              Interactive forms with live validation to score protocols and document academic justifications.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('compare')}
            className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-sky-500 cursor-pointer transition-all"
          >
            <div className="text-sky-400 mb-2">
              <GitCompare className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-sm text-slate-200 mb-1">Side-by-Side Matrix</h4>
            <p className="text-xs text-slate-400">
              Multi-protocol comparison tables detailing cryptographic deltas across all 7 criteria.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('results')}
            className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-sky-500 cursor-pointer transition-all"
          >
            <div className="text-sky-400 mb-2">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-sm text-slate-200 mb-1">Rankings & Charts</h4>
            <p className="text-xs text-slate-400">
              Leaderboard and Recharts overall score & grouped criteria visualizations.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('reports')}
            className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-sky-500 cursor-pointer transition-all"
          >
            <div className="text-sky-400 mb-2">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-sm text-slate-200 mb-1">Reports & Export</h4>
            <p className="text-xs text-slate-400">
              Printable academic document layout with direct CSV RFC-compliant data export.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

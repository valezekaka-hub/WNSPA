import React from 'react';
import { 
  ArrowLeft, 
  Shield, 
  Lock, 
  Key, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Calendar, 
  ClipboardCheck,
  ChevronRight
} from 'lucide-react';
import { Protocol } from '../types';

interface ProtocolDetailsPageProps {
  protocol: Protocol;
  allProtocols: Protocol[];
  onBack: () => void;
  onSelectProtocol: (id: string) => void;
  onNavigateToAssessment: (protocolId: string) => void;
}

export const ProtocolDetailsPage: React.FC<ProtocolDetailsPageProps> = ({
  protocol,
  allProtocols,
  onBack,
  onSelectProtocol,
  onNavigateToAssessment,
}) => {
  return (
    <div className="space-y-8 py-6" id="protocol-details-page-container">
      {/* Navigation Breadcrumb & Quick Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          id="protocol-details-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Protocols Catalog</span>
        </button>

        {/* Quick Protocol Switcher Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-500 mr-1 hidden sm:inline">Switch:</span>
          {allProtocols.map(p => (
            <button
              key={p.id}
              onClick={() => onSelectProtocol(p.id)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                p.id === protocol.id
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {p.abbreviation}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center space-x-3">
              <span className="font-mono text-3xl sm:text-4xl font-black text-sky-400">
                {protocol.abbreviation}
              </span>
              <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                {protocol.standard}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {protocol.name}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>Release Year: <strong>{protocol.releaseYear}</strong></span>
            </div>
            <button
              onClick={() => onNavigateToAssessment(protocol.id)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors"
              id="details-score-now-btn"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Score this Protocol</span>
            </button>
          </div>
        </div>

        {/* Academic Description */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Technical Specification & Protocol Description
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            {protocol.description}
          </p>
        </div>
      </div>

      {/* Cryptographic Architecture Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 text-sky-400 mb-3">
            <Lock className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-100">Encryption Method</h2>
          </div>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed">
            {protocol.encryptionMethod}
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Defines the symmetric cipher suite, key length, initialization vector dynamics, and payload confidentiality guarantees.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 text-emerald-400 mb-3">
            <Key className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-100">Authentication Method</h2>
          </div>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed">
            {protocol.authenticationMethod}
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Specifies the mutual verification handshake, key derivation function, credential verification, and management frame validation.
          </p>
        </div>
      </div>

      {/* Strengths and Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 text-emerald-400 mb-4 pb-2 border-b border-slate-800">
            <CheckCircle2 className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-100">Identified Strengths</h2>
          </div>
          <ul className="space-y-3">
            {protocol.strengths.map((strength, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 text-rose-400 mb-4 pb-2 border-b border-slate-800">
            <XCircle className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-100">Structural Weaknesses</h2>
          </div>
          <ul className="space-y-3">
            {protocol.weaknesses.map((weakness, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Security Concerns & Documented Attack Vectors */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-2 text-amber-400 mb-4 pb-2 border-b border-slate-800">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="text-base font-bold text-slate-100">Security Concerns & Exploit Vectors</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {protocol.securityConcerns.map((concern, idx) => (
            <div 
              key={idx}
              className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2.5"
            >
              <span className="font-mono text-amber-400 font-bold mt-0.5">{idx + 1}.</span>
              <span className="leading-relaxed">{concern}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

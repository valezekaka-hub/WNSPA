import React from 'react';
import { Shield, ArrowRight, Lock, Key, Calendar, FileCode, CheckCircle, AlertOctagon } from 'lucide-react';
import { Protocol } from '../types';

interface ProtocolsPageProps {
  protocols: Protocol[];
  onSelectProtocol: (protocolId: string) => void;
  onNavigateToAssessment: (protocolId?: string) => void;
  onNavigateToCompare: () => void;
}

export const ProtocolsPage: React.FC<ProtocolsPageProps> = ({
  protocols,
  onSelectProtocol,
  onNavigateToAssessment,
  onNavigateToCompare
}) => {
  return (
    <div className="space-y-8 py-6" id="protocols-page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>Target Security Standards</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Wireless Network Security Protocols
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Four primary IEEE 802.11 security specifications evaluated within the WNSPA comparative framework, tracing cryptographic advances from 1997 to the present.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onNavigateToCompare}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            id="protocols-compare-shortcut-btn"
          >
            Compare Side-by-Side →
          </button>
        </div>
      </div>

      {/* 4 Protocol Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="protocols-cards-grid">
        {protocols.map(protocol => {
          return (
            <div
              key={protocol.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all flex flex-col justify-between shadow-sm relative overflow-hidden"
              id={`protocol-card-${protocol.id}`}
            >
              <div>
                {/* Top Badge & Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-mono text-2xl sm:text-3xl font-extrabold text-sky-400">
                      {protocol.abbreviation}
                    </span>
                    <h2 className="text-base font-semibold text-slate-100 mt-0.5">
                      {protocol.name}
                    </h2>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                    <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                    {protocol.releaseYear}
                  </span>
                </div>

                <div className="inline-block text-xs font-mono text-slate-400 bg-slate-800/40 px-2 py-0.5 rounded mb-4">
                  {protocol.standard}
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 mb-5 leading-relaxed">
                  {protocol.description}
                </p>

                {/* Cryptographic Specifications */}
                <div className="space-y-2.5 mb-6 text-xs bg-slate-950/50 p-3.5 rounded-lg border border-slate-800/80">
                  <div>
                    <span className="text-slate-400 font-semibold block mb-0.5 flex items-center">
                      <Lock className="w-3.5 h-3.5 mr-1 text-sky-400" />
                      Encryption Method:
                    </span>
                    <span className="text-slate-200 font-mono text-[11px] block leading-snug">
                      {protocol.encryptionMethod}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60">
                    <span className="text-slate-400 font-semibold block mb-0.5 flex items-center">
                      <Key className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                      Authentication Method:
                    </span>
                    <span className="text-slate-200 font-mono text-[11px] block leading-snug">
                      {protocol.authenticationMethod}
                    </span>
                  </div>
                </div>

                {/* Quick Highlights: 1 Strength, 1 Concern */}
                <div className="space-y-1.5 text-xs mb-6">
                  {protocol.strengths[0] && (
                    <div className="flex items-start space-x-2 text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span className="text-slate-300 text-[11px] line-clamp-1">{protocol.strengths[0]}</span>
                    </div>
                  )}
                  {protocol.securityConcerns[0] && (
                    <div className="flex items-start space-x-2 text-rose-400">
                      <AlertOctagon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span className="text-slate-400 text-[11px] line-clamp-1">{protocol.securityConcerns[0]}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => onSelectProtocol(protocol.id)}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow transition-colors"
                  id={`view-details-${protocol.id}-btn`}
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onNavigateToAssessment(protocol.id)}
                  className="inline-flex items-center space-x-1 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
                  id={`assess-${protocol.id}-btn`}
                >
                  <span>Score in Assessment</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

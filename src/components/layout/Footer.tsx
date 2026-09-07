import React from 'react';
import { Shield, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center space-x-2 text-slate-100 font-semibold mb-2">
              <Shield className="w-5 h-5 text-sky-400" />
              <span>WNSPA</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Wireless Network Security Protocol Analyzer. An academic research artefact developed for rigorous comparative analysis across IEEE 802.11 security specifications (WEP, WPA, WPA2, WPA3).
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Project Specification
            </h4>
            <p className="text-xs text-slate-400 font-serif italic">
              DESIGN AND IMPLEMENTATION OF A SYSTEM FOR COMPARATIVE ANALYSIS OF WIRELESS NETWORK SECURITY PROTOCOLS
            </p>
            <p className="text-xs text-slate-500 mt-2">
              National Open University of Nigeria (NOUN) Academic Project Guidelines Compatible
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Methodological Rigour
            </h4>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• 7 Multi-Dimensional Criteria (SS, VL, ER, AE, CAR, NPE, OA)</li>
              <li>• Equal Weighting (14.29% per criterion)</li>
              <li>• Standardized 5-Point Evaluation Scale</li>
              <li>• Empirical Researcher Attribution</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} WNSPA Research Project. All rights reserved.</p>
          <div className="flex items-center space-x-1 mt-2 sm:mt-0">
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span>Academic Research Artefact — No external paid APIs or simulated metrics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Shield, 
  Calendar, 
  User, 
  CheckSquare, 
  Square,
  Trophy,
  BarChart3
} from 'lucide-react';
import { Protocol, Criterion, Assessment } from '../types';
import { rankAssessments, getClassificationMeta, ACADEMIC_DISCLAIMER } from '../engine/scoringEngine';
import { generateAssessmentsCSV, downloadCSV } from '../engine/exportEngine';
import { OverallScoreBarChart } from '../components/charts/OverallScoreBarChart';

interface ReportsPageProps {
  protocols: Protocol[];
  criteria: Criterion[];
  assessments: Assessment[];
  initialSelectedProtocolIds?: string[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  protocols,
  criteria,
  assessments,
  initialSelectedProtocolIds,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    initialSelectedProtocolIds && initialSelectedProtocolIds.length > 0
      ? initialSelectedProtocolIds
      : protocols.map(p => p.id)
  );

  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const toggleProtocol = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length <= 1) return;
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Filter assessments by selected protocol IDs
  const filteredAssessments = assessments.filter(a => selectedIds.includes(a.protocolId));
  const rankedItems = rankAssessments(filteredAssessments, criteria);

  // Trigger Print dialog
  const handlePrint = () => {
    window.print();
  };

  // Trigger CSV Download
  const handleExportCSV = () => {
    const csvData = generateAssessmentsCSV(filteredAssessments, protocols, criteria);
    const dateStamp = new Date().toISOString().split('T')[0];
    downloadCSV(csvData, `WNSPA_Protocol_Comparative_Research_Report_${dateStamp}.csv`);
  };

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto" id="reports-page-container">
      {/* Interactive Controls Bar (Hidden during print) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-sky-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4" />
              <span>Academic Report Generator</span>
            </div>
            <h1 className="text-xl font-bold text-white">
              Comparative Analysis Research Report
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Print-optimized document with formal academic formatting and RFC 4180 CSV export.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold shadow transition-colors"
              id="report-download-csv-btn"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow transition-colors"
              id="report-print-btn"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Protocol Selector Filters */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3 text-xs">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
            Include in Report:
          </span>
          {protocols.map(p => {
            const isChecked = selectedIds.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggleProtocol(p.id)}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded border transition-colors ${
                  isChecked
                    ? 'bg-sky-950 border-sky-500 text-sky-300 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {isChecked ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                <span className="font-mono">{p.abbreviation}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Printable Formal Academic Research Report Document */}
      <article 
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-12 shadow-2xl space-y-8 text-slate-200 print:bg-white print:text-black print:border-none print:shadow-none print:p-0"
        id="printable-academic-report"
      >
        {/* Formal Institutional Header */}
        <header className="border-b-2 border-slate-700 pb-6 print:border-black space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 print:text-gray-600 font-mono">
            <span>ARTEFACT CODE: WNSPA-ARTEFACT-V1</span>
            <span>DATE: {reportDate}</span>
          </div>

          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest text-sky-400 print:text-gray-700 font-bold font-mono">
              Academic ICT Research Project Document
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white print:text-black tracking-tight font-serif">
              DESIGN AND IMPLEMENTATION OF A SYSTEM FOR COMPARATIVE ANALYSIS OF WIRELESS NETWORK SECURITY PROTOCOLS
            </h1>
            <p className="text-sm font-semibold text-slate-300 print:text-gray-800 pt-1">
              WNSPA — Wireless Network Security Protocol Analyzer
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-3 border-t border-slate-800 print:border-gray-300">
            <div>
              <span className="text-slate-500 print:text-gray-500 block text-[10px] uppercase">Selected Protocols:</span>
              <span className="font-mono font-bold">{selectedIds.map(id => id.toUpperCase()).join(', ')}</span>
            </div>
            <div>
              <span className="text-slate-500 print:text-gray-500 block text-[10px] uppercase">Evaluation Metric:</span>
              <span className="font-medium">7 Equal Criteria (14.29% ea.)</span>
            </div>
            <div>
              <span className="text-slate-500 print:text-gray-500 block text-[10px] uppercase">Scoring Scale:</span>
              <span className="font-medium">Standardized 5-Point Likert</span>
            </div>
            <div>
              <span className="text-slate-500 print:text-gray-500 block text-[10px] uppercase">Data State:</span>
              <span className="font-medium">
                {filteredAssessments.some(a => a.isDemonstration) ? 'Mixed (Demonstration & Research)' : 'Empirical Research'}
              </span>
            </div>
          </div>
        </header>

        {/* Section 1: Executive Interpretation */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-white print:text-black uppercase tracking-wider border-b border-slate-800 print:border-gray-300 pb-1">
            1. Brief Academic Interpretation & Summary
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 print:text-gray-800 leading-relaxed font-sans">
            Comparative analysis of the evaluated IEEE 802.11 security protocols reveals an acute evolutionary trajectory in link-layer confidentiality. <strong>WEP (Wired Equivalent Privacy)</strong> exhibits complete failure across all cryptographic dimensions due to 24-bit IV reuse, unkeyed CRC-32 integrity, and deterministic key derivation vulnerabilities, achieving an overall score of {rankedItems.find(r => r.protocolId === 'wep')?.overallScore.toFixed(2) || '1.29'} (Poor). <strong>WPA</strong> served as an effective temporary patch through dynamic 48-bit IV key mixing (TKIP), but was constrained by its underlying RC4 engine and weak Michael MIC algorithm. 
          </p>
          <p className="text-xs sm:text-sm text-slate-300 print:text-gray-800 leading-relaxed font-sans">
            <strong>WPA2 (802.11i)</strong> elevated wireless security to commercial-grade viability by introducing hardware AES-CCMP encryption, achieving a high global adoption footprint and a strong composite score of {rankedItems.find(r => r.protocolId === 'wpa2')?.overallScore.toFixed(2) || '3.71'} (Very Good). However, its exposure to KRACK handshake replays and deauthentication spoofing highlighted the need for mandatory Protected Management Frames. <strong>WPA3</strong> represents the current pinnacle of wireless security with an overall score of {rankedItems.find(r => r.protocolId === 'wpa3')?.overallScore.toFixed(2) || '4.43'} (Excellent), providing forward secrecy and resistance to offline dictionary attacks through Simultaneous Authentication of Equals (SAE).
          </p>
        </section>

        {/* Section 2: Visual Chart */}
        <section className="space-y-3 print:break-inside-avoid">
          <h2 className="text-base font-bold text-white print:text-black uppercase tracking-wider border-b border-slate-800 print:border-gray-300 pb-1">
            2. Quantitative Ranking Chart
          </h2>
          <div className="print:hidden">
            <OverallScoreBarChart data={rankedItems} height={280} />
          </div>
        </section>

        {/* Section 3: Protocol Ranking Table */}
        <section className="space-y-3 print:break-inside-avoid">
          <h2 className="text-base font-bold text-white print:text-black uppercase tracking-wider border-b border-slate-800 print:border-gray-300 pb-1">
            3. Protocol Rankings & Overall Scoring Table
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs print:border print:border-gray-400">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 print:bg-gray-100 print:border-gray-400 text-slate-300 print:text-black font-semibold">
                  <th className="p-2.5 text-center w-12 print:border print:border-gray-300">Rank</th>
                  <th className="p-2.5 print:border print:border-gray-300">Protocol</th>
                  <th className="p-2.5 print:border print:border-gray-300">Standard</th>
                  <th className="p-2.5 text-right print:border print:border-gray-300">Overall Score</th>
                  <th className="p-2.5 text-right print:border print:border-gray-300">Percentage</th>
                  <th className="p-2.5 text-center print:border print:border-gray-300">Classification</th>
                  <th className="p-2.5 text-center print:border print:border-gray-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-gray-300">
                {rankedItems.map(item => {
                  const proto = protocols.find(p => p.id === item.protocolId);
                  const meta = getClassificationMeta(item.classification);
                  return (
                    <tr key={item.assessmentId} className="print:border print:border-gray-300">
                      <td className="p-2.5 text-center font-mono font-bold print:border print:border-gray-300">
                        #{item.rank}
                      </td>
                      <td className="p-2.5 font-bold text-sky-400 print:text-black print:border print:border-gray-300">
                        {item.protocolAbbreviation} — {proto?.name}
                      </td>
                      <td className="p-2.5 text-slate-400 print:text-gray-700 font-mono print:border print:border-gray-300">
                        {proto?.standard} ({proto?.releaseYear})
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-white print:text-black print:border print:border-gray-300">
                        {item.overallScore.toFixed(2)} / 5.00
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-sky-400 print:text-black print:border print:border-gray-300">
                        {item.percentage.toFixed(2)}%
                      </td>
                      <td className="p-2.5 text-center print:border print:border-gray-300">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${meta.badgeClass} print:border-gray-400 print:text-black`}>
                          {item.classification}
                        </span>
                      </td>
                      <td className="p-2.5 text-center text-[10px] font-mono print:border print:border-gray-300">
                        {item.isDemonstration ? 'DEMONSTRATION' : 'EMPIRICAL'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Individual Criterion Score Breakdown */}
        <section className="space-y-3 print:break-inside-avoid">
          <h2 className="text-base font-bold text-white print:text-black uppercase tracking-wider border-b border-slate-800 print:border-gray-300 pb-1">
            4. Criteria-by-Criteria Breakdown
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs print:border print:border-gray-400">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 print:bg-gray-100 print:border-gray-400 text-slate-300 print:text-black font-semibold">
                  <th className="p-2.5 print:border print:border-gray-300">Code & Criterion</th>
                  <th className="p-2.5 text-center w-16 print:border print:border-gray-300">Weight</th>
                  {selectedIds.map(id => (
                    <th key={id} className="p-2.5 text-center font-mono print:border print:border-gray-300">
                      {id.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-gray-300">
                {criteria.map(c => (
                  <tr key={c.id} className="print:border print:border-gray-300">
                    <td className="p-2.5 font-medium print:border print:border-gray-300">
                      <span className="font-mono font-bold text-sky-400 print:text-black mr-2">{c.code}</span>
                      <span>{c.name}</span>
                      {c.isInvertedMetric && (
                        <span className="block text-[10px] text-amber-400 print:text-gray-600 font-sans italic">
                          * 5 = Very Low Vulnerability
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 text-center font-mono text-slate-400 print:text-gray-700 print:border print:border-gray-300">
                      14.29%
                    </td>
                    {selectedIds.map(id => {
                      const a = filteredAssessments.find(item => item.protocolId === id);
                      const detail = a?.scores[c.id] ?? a?.scores[c.code.toLowerCase()] ?? a?.scores[c.code];
                      return (
                        <td key={id} className="p-2.5 text-center font-mono font-bold text-sm print:border print:border-gray-300">
                          {detail ? detail.score : '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5: Document Footer & Disclaimers */}
        <footer className="pt-6 border-t-2 border-slate-800 print:border-black text-xs text-slate-400 print:text-gray-700 space-y-2">
          <p className="italic">
            {ACADEMIC_DISCLAIMER}
          </p>
          <div className="flex flex-col sm:flex-row justify-between pt-3 border-t border-slate-800 print:border-gray-300 text-[11px] font-mono">
            <span>WNSPA RESEARCH ENGINE v1.0</span>
            <span>END OF FORMAL REPORT</span>
          </div>
        </footer>
      </article>
    </div>
  );
};

import { Assessment, Protocol, Criterion } from '../types';

/**
 * Generates an RFC 4180-compliant CSV string from assessments, protocols, and criteria.
 */
export function generateAssessmentsCSV(
  assessments: Assessment[],
  protocols: Protocol[],
  criteria: Criterion[]
): string {
  const protocolMap = new Map<string, Protocol>();
  protocols.forEach(p => protocolMap.set(p.id, p));

  // Build CSV Header
  const headers = [
    'Protocol Code',
    'Protocol Name',
    'IEEE Standard',
    'Release Year',
    'SS (Security Strength)',
    'VL (Vulnerability Level - Inverted)',
    'ER (Encryption Robustness)',
    'AE (Authentication Effectiveness)',
    'CAR (Cyberattack Resistance)',
    'NPE (Network Performance Efficiency)',
    'OA (Organisational Adoption)',
    'Overall Score (1-5 Scale)',
    'Percentage Score (%)',
    'Proposed Classification',
    'Assessment Category',
    'Researcher Name',
    'Assessment Date'
  ];

  const escapeCSV = (value: string | number | undefined | null): string => {
    if (value === undefined || value === null) return '""';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
  };

  const rows: string[] = [];
  rows.push(headers.map(escapeCSV).join(','));

  assessments.forEach(a => {
    const proto = protocolMap.get(a.protocolId);
    
    // Extract scores
    const getScoreVal = (id: string, code: string) => {
      const entry = a.scores[id] ?? a.scores[code.toLowerCase()] ?? a.scores[code];
      return entry ? entry.score : '';
    };

    const row = [
      a.protocolAbbreviation,
      proto ? proto.name : a.protocolAbbreviation,
      proto ? proto.standard : 'N/A',
      proto ? proto.releaseYear : 'N/A',
      getScoreVal('ss', 'SS'),
      getScoreVal('vl', 'VL'),
      getScoreVal('er', 'ER'),
      getScoreVal('ae', 'AE'),
      getScoreVal('car', 'CAR'),
      getScoreVal('npe', 'NPE'),
      getScoreVal('oa', 'OA'),
      a.overallScore.toFixed(2),
      `${a.percentage.toFixed(2)}%`,
      a.classification,
      a.isDemonstration ? 'DEMONSTRATION DATA' : 'EMPIRICAL RESEARCH',
      a.researcherName || 'Anonymous Researcher',
      a.assessmentDate || new Date().toISOString().split('T')[0]
    ];

    rows.push(row.map(escapeCSV).join(','));
  });

  return rows.join('\r\n');
}

/**
 * Triggers a browser download of the CSV dataset
 */
export function downloadCSV(csvContent: string, fileName = 'WNSPA_Protocol_Evaluation_Export.csv'): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

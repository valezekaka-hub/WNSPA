export type ClassificationTier = 'Excellent' | 'Very Good' | 'Good' | 'Moderate' | 'Poor';

export interface Protocol {
  id: string;
  name: string;
  abbreviation: string;
  standard: string;
  releaseYear: number;
  encryptionMethod: string;
  authenticationMethod: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  securityConcerns: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Criterion {
  id: string;
  code: string; // 'SS' | 'VL' | 'ER' | 'AE' | 'CAR' | 'NPE' | 'OA'
  name: string;
  description: string;
  weight: number; // 14.2857 (100 / 7)
  displayOrder: number;
  scaleInterpretation: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  };
  isInvertedMetric: boolean; // true for VL
  createdAt?: string;
  updatedAt?: string;
}

export interface ScoreDetail {
  score: number; // 1 - 5
  justification: string;
}

export interface Assessment {
  id: string;
  protocolId: string;
  protocolAbbreviation: string;
  researcherName: string;
  assessmentDate: string;
  isDemonstration: boolean;
  scores: Record<string, ScoreDetail>; // keyed by criterion id or code
  overallScore: number; // 1.0 - 5.0
  percentage: number; // 0.0 - 100.0
  classification: ClassificationTier;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ComparisonSession {
  id: string;
  title: string;
  protocolIds: string[];
  comparisonDate: string;
  isDemonstration: boolean;
  summaryNotes?: string;
  createdAt?: string;
}

export interface ClassificationRule {
  tier: ClassificationTier;
  minPercentage: number;
  maxPercentage: number;
  label: string;
  colorClass: string;
  badgeClass: string;
  description: string;
}

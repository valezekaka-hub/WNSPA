import { Criterion, ClassificationTier, ClassificationRule, Assessment } from '../types';

export const PROPOSED_CLASSIFICATIONS: ClassificationRule[] = [
  {
    tier: 'Excellent',
    minPercentage: 80.0,
    maxPercentage: 100.0,
    label: 'Excellent',
    colorClass: 'text-emerald-700 dark:text-emerald-400',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
    description: 'Protocol demonstrates state-of-the-art cryptographic defenses, modern key exchange, and high cyberattack resilience.'
  },
  {
    tier: 'Very Good',
    minPercentage: 70.0,
    maxPercentage: 79.99,
    label: 'Very Good',
    colorClass: 'text-sky-700 dark:text-sky-400',
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800',
    description: 'Protocol provides robust commercial encryption and reliable integrity, with known manageable edge vulnerabilities.'
  },
  {
    tier: 'Good',
    minPercentage: 60.0,
    maxPercentage: 69.99,
    label: 'Good',
    colorClass: 'text-blue-700 dark:text-blue-400',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
    description: 'Protocol achieves acceptable standard performance but lacks modern cryptographic enhancements or forward secrecy.'
  },
  {
    tier: 'Moderate',
    minPercentage: 50.0,
    maxPercentage: 59.99,
    label: 'Moderate',
    colorClass: 'text-amber-700 dark:text-amber-400',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
    description: 'Protocol presents significant operational flaws or vulnerability risks requiring immediate administrative mitigation.'
  },
  {
    tier: 'Poor',
    minPercentage: 0.0,
    maxPercentage: 49.99,
    label: 'Poor',
    colorClass: 'text-rose-700 dark:text-rose-400',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
    description: 'Protocol is cryptographically broken or severely defective; completely unsuitable for secure communications.'
  }
];

export const ACADEMIC_DISCLAIMER = 
  "Classification Notice: The classifications (Excellent, Very Good, Good, Moderate, Poor) represent proposed project-specific evaluation thresholds designed for academic comparison and are not universal or officially ratified cybersecurity industry standards.";

/**
 * Calculates overall score dynamically from scores and criteria definitions.
 * When all criteria are equal-weighted (14.29%), it computes the arithmetic mean.
 */
export function calculateOverallScore(
  scores: Record<string, number>,
  criteria: Criterion[]
): number {
  if (!criteria || criteria.length === 0) return 0;

  // Use dynamic criteria lookup
  let sum = 0;
  let count = 0;

  for (const criterion of criteria) {
    const s = scores[criterion.id] ?? scores[criterion.code.toLowerCase()] ?? scores[criterion.code];
    if (typeof s === 'number' && !isNaN(s)) {
      sum += s;
      count += 1;
    }
  }

  if (count === 0) return 0;
  const rawScore = sum / count;
  return Math.round(rawScore * 100) / 100;
}

/**
 * Calculates percentage: (Overall Score / 5) * 100
 */
export function calculatePercentage(overallScore: number): number {
  if (overallScore <= 0) return 0;
  const pct = (overallScore / 5) * 100;
  return Math.round(pct * 100) / 100;
}

/**
 * Determines qualitative classification tier from percentage score
 */
export function getClassificationTier(percentage: number): ClassificationTier {
  if (percentage >= 80.0) return 'Excellent';
  if (percentage >= 70.0) return 'Very Good';
  if (percentage >= 60.0) return 'Good';
  if (percentage >= 50.0) return 'Moderate';
  return 'Poor';
}

/**
 * Retrieves styling and metadata for a classification tier
 */
export function getClassificationMeta(tier: ClassificationTier): ClassificationRule {
  const found = PROPOSED_CLASSIFICATIONS.find(c => c.tier === tier);
  return found || PROPOSED_CLASSIFICATIONS[PROPOSED_CLASSIFICATIONS.length - 1];
}

export interface RankedProtocolItem {
  rank: number;
  protocolId: string;
  protocolAbbreviation: string;
  overallScore: number;
  percentage: number;
  classification: ClassificationTier;
  assessmentId: string;
  isDemonstration: boolean;
  scores: Record<string, number>;
}

/**
 * Sorts and ranks assessments from highest to lowest overall score
 */
export function rankAssessments(
  assessments: Assessment[],
  criteria: Criterion[]
): RankedProtocolItem[] {
  const items: RankedProtocolItem[] = assessments.map(a => {
    // Extract raw numerical scores
    const numScores: Record<string, number> = {};
    for (const c of criteria) {
      const entry = a.scores[c.id] ?? a.scores[c.code.toLowerCase()] ?? a.scores[c.code];
      numScores[c.id] = entry ? entry.score : 0;
    }

    const calculatedOverall = a.overallScore > 0 ? a.overallScore : calculateOverallScore(numScores, criteria);
    const calculatedPercentage = a.percentage > 0 ? a.percentage : calculatePercentage(calculatedOverall);
    const classification = a.classification || getClassificationTier(calculatedPercentage);

    return {
      rank: 0,
      protocolId: a.protocolId,
      protocolAbbreviation: a.protocolAbbreviation,
      overallScore: calculatedOverall,
      percentage: calculatedPercentage,
      classification,
      assessmentId: a.id,
      isDemonstration: a.isDemonstration,
      scores: numScores,
    };
  });

  // Sort descending by overallScore, then by percentage
  items.sort((a, b) => b.overallScore - a.overallScore || b.percentage - a.percentage);

  // Assign 1-indexed ranks (handling ties properly)
  let currentRank = 1;
  for (let i = 0; i < items.length; i++) {
    if (i > 0 && items[i].overallScore === items[i - 1].overallScore) {
      items[i].rank = items[i - 1].rank;
    } else {
      items[i].rank = currentRank;
    }
    currentRank++;
  }

  return items;
}

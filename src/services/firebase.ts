import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Protocol, Criterion, Assessment, ComparisonSession } from '../types';
import { DEFAULT_PROTOCOLS, DEFAULT_CRITERIA, DEMO_ASSESSMENTS } from '../data/preloadedData';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database with explicit database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.warn('Firestore Operation Notice: ', JSON.stringify(errInfo));
  return errInfo;
}

// Local cache storage keys for resilience/offline capability
const STORAGE_KEYS = {
  PROTOCOLS: 'wnspa_protocols_cache',
  CRITERIA: 'wnspa_criteria_cache',
  ASSESSMENTS: 'wnspa_assessments_cache',
  COMPARISONS: 'wnspa_comparisons_cache',
};

// ----------------- PROTOCOLS API -----------------

export async function getProtocols(): Promise<Protocol[]> {
  try {
    const colRef = collection(db, 'protocols');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const protocols: Protocol[] = [];
      snapshot.forEach(docSnap => {
        protocols.push(docSnap.data() as Protocol);
      });
      localStorage.setItem(STORAGE_KEYS.PROTOCOLS, JSON.stringify(protocols));
      return protocols;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'protocols');
  }

  // Check local cache
  const cached = localStorage.getItem(STORAGE_KEYS.PROTOCOLS);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }

  // Fallback to default protocols
  return DEFAULT_PROTOCOLS;
}

export async function getProtocolById(id: string): Promise<Protocol | null> {
  try {
    const docRef = doc(db, 'protocols', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as Protocol;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `protocols/${id}`);
  }

  const protocols = await getProtocols();
  return protocols.find(p => p.id === id || p.abbreviation.toLowerCase() === id.toLowerCase()) || null;
}

// ----------------- CRITERIA API -----------------

export async function getCriteria(): Promise<Criterion[]> {
  try {
    const colRef = collection(db, 'criteria');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const list: Criterion[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as Criterion);
      });
      list.sort((a, b) => a.displayOrder - b.displayOrder);
      localStorage.setItem(STORAGE_KEYS.CRITERIA, JSON.stringify(list));
      return list;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'criteria');
  }

  const cached = localStorage.getItem(STORAGE_KEYS.CRITERIA);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }

  return DEFAULT_CRITERIA;
}

// ----------------- ASSESSMENTS API -----------------

export async function getAssessments(): Promise<Assessment[]> {
  try {
    const colRef = collection(db, 'assessments');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const list: Assessment[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as Assessment);
      });
      localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(list));
      return list;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'assessments');
  }

  const cached = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
  if (cached) {
    try {
      const parsed: Assessment[] = JSON.parse(cached);
      if (parsed && parsed.length > 0) return parsed;
    } catch {
      // ignore
    }
  }

  return DEMO_ASSESSMENTS;
}

export async function saveAssessment(assessment: Assessment): Promise<boolean> {
  let firestoreSuccess = false;
  try {
    const docRef = doc(db, 'assessments', assessment.id);
    await setDoc(docRef, assessment);
    firestoreSuccess = true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `assessments/${assessment.id}`);
  }

  // Always update local cache
  try {
    const current = await getAssessments();
    const existingIndex = current.findIndex(a => a.id === assessment.id);
    let updated: Assessment[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = assessment;
    } else {
      updated = [assessment, ...current];
    }
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Local storage update failed', e);
  }

  return true;
}

export async function deleteAssessment(assessmentId: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'assessments', assessmentId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `assessments/${assessmentId}`);
  }

  try {
    const current = await getAssessments();
    const updated = current.filter(a => a.id !== assessmentId);
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(updated));
  } catch {
    // ignore
  }

  return true;
}

// ----------------- COMPARISONS API -----------------

export async function getComparisons(): Promise<ComparisonSession[]> {
  try {
    const colRef = collection(db, 'comparisons');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const list: ComparisonSession[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as ComparisonSession);
      });
      return list;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'comparisons');
  }

  const cached = localStorage.getItem(STORAGE_KEYS.COMPARISONS);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }

  return [];
}

export async function saveComparison(comparison: ComparisonSession): Promise<boolean> {
  try {
    const docRef = doc(db, 'comparisons', comparison.id);
    await setDoc(docRef, comparison);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `comparisons/${comparison.id}`);
  }

  try {
    const current = await getComparisons();
    const updated = [comparison, ...current.filter(c => c.id !== comparison.id)];
    localStorage.setItem(STORAGE_KEYS.COMPARISONS, JSON.stringify(updated));
  } catch {
    // ignore
  }

  return true;
}

// ----------------- SEEDING SERVICE -----------------

export async function seedDatabaseIfEmpty(): Promise<void> {
  try {
    // Seed protocols
    for (const protocol of DEFAULT_PROTOCOLS) {
      const pRef = doc(db, 'protocols', protocol.id);
      await setDoc(pRef, protocol, { merge: true });
    }

    // Seed criteria
    for (const criterion of DEFAULT_CRITERIA) {
      const cRef = doc(db, 'criteria', criterion.id);
      await setDoc(cRef, criterion, { merge: true });
    }

    // Seed initial demo assessments
    for (const demo of DEMO_ASSESSMENTS) {
      const aRef = doc(db, 'assessments', demo.id);
      await setDoc(aRef, demo, { merge: true });
    }
    console.log('WNSPA: Database initialized successfully with default records.');
  } catch (error) {
    console.warn('WNSPA: Initial seed notice (using local cache fallback):', error);
  }
}

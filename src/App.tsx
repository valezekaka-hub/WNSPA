import React, { useState, useEffect } from 'react';
import { Navbar, PageId } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DemoBanner } from './components/layout/DemoBanner';
import { HomePage } from './pages/HomePage';
import { ProtocolsPage } from './pages/ProtocolsPage';
import { ProtocolDetailsPage } from './pages/ProtocolDetailsPage';
import { CriteriaPage } from './pages/CriteriaPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { ComparePage } from './pages/ComparePage';
import { ResultsPage } from './pages/ResultsPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { ReportsPage } from './pages/ReportsPage';
import { Protocol, Criterion, Assessment } from './types';
import { 
  seedDatabaseIfEmpty, 
  getProtocols, 
  getCriteria, 
  getAssessments, 
  saveAssessment, 
  deleteAssessment 
} from './services/firebase';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>('wep');
  const [selectedReportProtocolIds, setSelectedReportProtocolIds] = useState<string[]>([]);
  
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize and load data on mount
  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      try {
        await seedDatabaseIfEmpty();
        const [protos, crits, assmtList] = await Promise.all([
          getProtocols(),
          getCriteria(),
          getAssessments(),
        ]);

        if (isMounted) {
          setProtocols(protos);
          setCriteria(crits);
          setAssessments(assmtList);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error during WNSPA initialization:', err);
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handler to persist new or updated assessment
  const handleSaveAssessment = async (newAssessment: Assessment): Promise<boolean> => {
    try {
      const success = await saveAssessment(newAssessment);
      if (success) {
        // Refresh local assessments list
        const updated = await getAssessments();
        setAssessments(updated);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Save failed:', err);
      return false;
    }
  };

  // Handler to delete an assessment
  const handleDeleteAssessment = async (assessmentId: string): Promise<boolean> => {
    try {
      const success = await deleteAssessment(assessmentId);
      if (success) {
        const updated = await getAssessments();
        setAssessments(updated);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Delete failed:', err);
      return false;
    }
  };

  // Navigation handlers with parameter passing
  const navigateToProtocolDetails = (protoId: string) => {
    setSelectedProtocolId(protoId);
    setCurrentPage('protocol-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAssessment = (protoId?: string) => {
    if (protoId) {
      setSelectedProtocolId(protoId);
    }
    setCurrentPage('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToReports = (protocolIds?: string[]) => {
    if (protocolIds && protocolIds.length > 0) {
      setSelectedReportProtocolIds(protocolIds);
    }
    setCurrentPage('reports');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if current assessment dataset includes demonstration data
  const hasDemoData = assessments.some(a => a.isDemonstration);

  // Loading state screen
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
        <div className="text-center space-y-1">
          <p className="text-base font-bold font-mono tracking-wider text-sky-400">WNSPA</p>
          <p className="text-xs text-slate-400">Loading academic protocols & benchmark scoring matrix...</p>
        </div>
      </div>
    );
  }

  // Selected protocol object
  const activeProtocol = protocols.find(p => p.id === selectedProtocolId) || protocols[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Demonstration Data Alert Banner */}
      {hasDemoData && (currentPage === 'results' || currentPage === 'compare' || currentPage === 'reports') && (
        <DemoBanner onGoToAssessment={() => navigateToAssessment()} />
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {currentPage === 'home' && (
          <HomePage 
            onNavigate={handleNavigate}
            protocols={protocols}
            criteria={criteria}
          />
        )}

        {currentPage === 'protocols' && (
          <ProtocolsPage
            protocols={protocols}
            onSelectProtocol={navigateToProtocolDetails}
            onNavigateToAssessment={navigateToAssessment}
            onNavigateToCompare={() => handleNavigate('compare')}
          />
        )}

        {currentPage === 'protocol-details' && (
          <ProtocolDetailsPage
            protocol={activeProtocol}
            allProtocols={protocols}
            onBack={() => handleNavigate('protocols')}
            onSelectProtocol={(id) => setSelectedProtocolId(id)}
            onNavigateToAssessment={navigateToAssessment}
          />
        )}

        {currentPage === 'criteria' && (
          <CriteriaPage
            criteria={criteria}
            onNavigateToAssessment={() => handleNavigate('assessment')}
          />
        )}

        {currentPage === 'assessment' && (
          <AssessmentPage
            protocols={protocols}
            criteria={criteria}
            assessments={assessments}
            initialProtocolId={selectedProtocolId}
            onSaveAssessment={handleSaveAssessment}
            onDeleteAssessment={handleDeleteAssessment}
            onViewResults={() => handleNavigate('results')}
          />
        )}

        {currentPage === 'compare' && (
          <ComparePage
            protocols={protocols}
            criteria={criteria}
            assessments={assessments}
            onNavigateToReports={navigateToReports}
            onNavigateToAssessment={navigateToAssessment}
          />
        )}

        {currentPage === 'results' && (
          <ResultsPage
            protocols={protocols}
            criteria={criteria}
            assessments={assessments}
            onNavigateToReports={() => handleNavigate('reports')}
            onNavigateToAssessment={navigateToAssessment}
          />
        )}

        {currentPage === 'methodology' && (
          <MethodologyPage
            protocols={protocols}
            criteria={criteria}
          />
        )}

        {currentPage === 'reports' && (
          <ReportsPage
            protocols={protocols}
            criteria={criteria}
            assessments={assessments}
            initialSelectedProtocolIds={selectedReportProtocolIds}
          />
        )}
      </main>

      {/* Academic Footer */}
      <Footer />
    </div>
  );
}

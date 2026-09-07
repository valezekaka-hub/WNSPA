import React, { useState } from 'react';
import { 
  Shield, 
  Layers, 
  Sliders, 
  ClipboardCheck, 
  GitCompare, 
  BarChart3, 
  BookOpen, 
  FileText, 
  Menu, 
  X,
  Radio
} from 'lucide-react';

export type PageId = 
  | 'home'
  | 'protocols'
  | 'protocol-details'
  | 'criteria'
  | 'assessment'
  | 'compare'
  | 'results'
  | 'methodology'
  | 'reports';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageId; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Radio },
    { id: 'protocols', label: 'Protocols', icon: Layers },
    { id: 'criteria', label: 'Criteria', icon: Sliders },
    { id: 'assessment', label: 'Assessment', icon: ClipboardCheck },
    { id: 'compare', label: 'Compare', icon: GitCompare },
    { id: 'results', label: 'Results', icon: BarChart3 },
    { id: 'methodology', label: 'Methodology', icon: BookOpen },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  const handleNav = (id: PageId) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNav('home')}
            id="nav-logo-button"
          >
            <div className="w-10 h-10 rounded-lg bg-sky-600/20 border border-sky-500/40 flex items-center justify-center text-sky-400 group-hover:bg-sky-600/30 transition-colors">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-lg tracking-wider text-sky-400">WNSPA</span>
                <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Research Artefact
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden md:block">
                Wireless Network Security Protocol Analyzer
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id || (item.id === 'protocols' && currentPage === 'protocol-details');
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-sky-600/20 text-sky-400 border border-sky-500/30 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              id="mobile-menu-toggle-btn"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id || (item.id === 'protocols' && currentPage === 'protocol-details');
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-sky-600/20 text-sky-400 border border-sky-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import WorkspaceLayout from './components/WorkspaceLayout';

function App() {
  const [activeView, setActiveView] = useState('write');
  const [currentPage, setCurrentPage] = useState<'landing' | 'workspace'>('landing');
  const [selectedRepo, setSelectedRepo] = useState<string>();

  const handleNavigateToWorkspace = (view: string, repoId?: string) => {
    setActiveView(view);
    setSelectedRepo(repoId);
    setCurrentPage('workspace');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
    setSelectedRepo(undefined);
  };

  if (currentPage === 'landing') {
    return <LandingPage onNavigateToWorkspace={handleNavigateToWorkspace} />;
  }

  return (
    <WorkspaceLayout
      activeView={activeView}
      onViewChange={setActiveView}
      onBackToLanding={handleBackToLanding}
      selectedRepo={selectedRepo}
    />
  );
}

export default App;
import React from 'react';
import { ArrowLeft, GitBranch } from 'lucide-react';
import Sidebar from './Sidebar';
import WriteView from './WriteView';
import GenerateView from './GenerateView';
import ReadView from './ReadView';
import VisualizeView from './VisualizeView';

interface WorkspaceLayoutProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onBackToLanding: () => void;
  selectedRepo?: string;
}

export default function WorkspaceLayout({ 
  activeView, 
  onViewChange, 
  onBackToLanding, 
  selectedRepo 
}: WorkspaceLayoutProps) {
  const renderActiveView = () => {
    switch (activeView) {
      case 'write':
        return <WriteView />;
      case 'generate':
        return <GenerateView />;
      case 'read':
        return <ReadView />;
      case 'visualize':
        return <VisualizeView />;
      default:
        return <WriteView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
        {/* Back to Dashboard */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={onBackToLanding}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Dashboard</span>
          </button>
        </div>

        {/* Current Repository */}
        {selectedRepo && (
          <div className="p-4 border-b border-gray-200 bg-indigo-50">
            <div className="flex items-center space-x-2">
              <GitBranch className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-900">{selectedRepo}</span>
            </div>
          </div>
        )}

        <Sidebar activeView={activeView} onViewChange={onViewChange} />
      </div>
      {renderActiveView()}
    </div>
  );
}
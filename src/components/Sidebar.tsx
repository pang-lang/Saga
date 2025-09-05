import React from 'react';
import { FileText, Zap, Search, BarChart3, Plus, Folder, Settings, History, Users } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: 'write', label: 'Write', icon: FileText, description: 'Create and edit docs' },
    { id: 'generate', label: 'Auto-Generate', icon: Zap, description: 'AI-powered generation' },
    { id: 'read', label: 'Read & Search', icon: Search, description: 'Smart Q&A and search' },
    { id: 'visualize', label: 'Visualize', icon: BarChart3, description: 'Charts and diagrams' },
  ];

  const recentDocs = [
    { name: 'API Reference', type: 'api', lastModified: '2 hours ago' },
    { name: 'User Guide', type: 'guide', lastModified: '1 day ago' },
    { name: 'Getting Started', type: 'tutorial', lastModified: '3 days ago' },
    { name: 'Changelog', type: 'changelog', lastModified: '1 week ago' },
  ];

  const getDocIcon = (type: string) => {
    switch (type) {
      case 'api': return '🔧';
      case 'guide': return '📖';
      case 'tutorial': return '🚀';
      case 'changelog': return '📝';
      default: return '📄';
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Workspace</h1>
            <p className="text-xs text-gray-500">Documentation Hub</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                  activeView === item.id
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                }`}
              >
                <Icon className={`w-5 h-5 transition-colors ${
                  activeView === item.id ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-700'
                }`} />
                <div className="flex-1 text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500 group-hover:text-gray-600">{item.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Recent Documents */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Recent Docs
          </h3>
          <div className="space-y-2">
            {recentDocs.map((doc, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200 group"
              >
                <span className="text-base">{getDocIcon(doc.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                    {doc.name}
                  </div>
                  <div className="text-xs text-gray-500">{doc.lastModified}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Quick Stats
          </h3>
          <div className="sticky grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-indigo-700">3</div>
              <div className="text-xs text-indigo-600">Documents</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-emerald-700">3</div>
              <div className="text-xs text-emerald-600">Contributors</div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
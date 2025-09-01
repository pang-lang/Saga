import React from 'react';
import { FileText, Zap, Search, BarChart3, Plus, Folder } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: 'write', label: 'Write', icon: FileText },
    { id: 'generate', label: 'Auto-Generate', icon: Zap },
    { id: 'read', label: 'Read & Search', icon: Search },
    { id: 'visualize', label: 'Visualize', icon: BarChart3 },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-900">Workspace</h1>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  activeView === item.id
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Recent Docs
          </h3>
          <div className="space-y-1">
            {['API Reference', 'User Guide', 'Getting Started'].map((doc) => (
              <div
                key={doc}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <Folder className="w-4 h-4" />
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center space-x-3 px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
          <Plus className="w-5 h-5" />
          <span className="font-medium">New Document</span>
        </button>
      </div>
    </div>
  );
}
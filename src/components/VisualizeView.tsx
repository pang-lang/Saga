import React, { useState } from 'react';
import { GitBranch, Activity, Layers, Download, Filter } from 'lucide-react';

export default function VisualizeView() {
  const [activeTab, setActiveTab] = useState('flow');

  const tabs = [
    { id: 'flow', label: 'Flow Diagrams', icon: GitBranch },
    { id: 'api', label: 'API Graphs', icon: Activity },
    { id: 'changelog', label: 'Changelogs', icon: Layers },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Documentation Visualizations</h2>
            <p className="text-gray-600">Interactive diagrams and visual representations of your documentation</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        <div className="flex space-x-1 mt-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 p-6">
        {activeTab === 'flow' && (
          <div className="h-full bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-full max-w-2xl mx-auto">
                  <svg viewBox="0 0 400 300" className="w-full h-64 mb-4">
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                              refX="0" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#6366F1" />
                      </marker>
                    </defs>
                    
                    <rect x="50" y="50" width="80" height="40" rx="8" fill="#EEF2FF" stroke="#6366F1" strokeWidth="2" />
                    <text x="90" y="75" textAnchor="middle" className="fill-indigo-700 text-sm font-medium">Start</text>
                    
                    <rect x="160" y="50" width="80" height="40" rx="8" fill="#F0FDF4" stroke="#10B981" strokeWidth="2" />
                    <text x="200" y="75" textAnchor="middle" className="fill-emerald-700 text-sm font-medium">Process</text>
                    
                    <rect x="270" y="50" width="80" height="40" rx="8" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
                    <text x="310" y="75" textAnchor="middle" className="fill-amber-700 text-sm font-medium">Output</text>
                    
                    <line x1="130" y1="70" x2="160" y2="70" stroke="#6366F1" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <line x1="240" y1="70" x2="270" y2="70" stroke="#6366F1" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    
                    <rect x="160" y="150" width="80" height="40" rx="8" fill="#FDF2F8" stroke="#EC4899" strokeWidth="2" />
                    <text x="200" y="175" textAnchor="middle" className="fill-pink-700 text-sm font-medium">Decision</text>
                    
                    <line x1="200" y1="90" x2="200" y2="150" stroke="#6366F1" strokeWidth="2" markerEnd="url(#arrowhead)" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Documentation Flow Diagram</h3>
                <p className="text-gray-600">Visual representation of your documentation structure and user journey</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="h-full bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">API Call Graph</h3>
                <div className="space-y-3">
                  {[
                    { endpoint: '/api/auth/login', calls: 1250, status: 'healthy' },
                    { endpoint: '/api/users', calls: 890, status: 'healthy' },
                    { endpoint: '/api/posts', calls: 2340, status: 'warning' },
                    { endpoint: '/api/files/upload', calls: 567, status: 'error' },
                  ].map((api, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          api.status === 'healthy' ? 'bg-emerald-500' :
                          api.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                        <span className="font-mono text-sm">{api.endpoint}</span>
                      </div>
                      <span className="text-sm text-gray-600">{api.calls} calls</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Times</h3>
                <div className="space-y-4">
                  {[
                    { time: '125ms', label: 'Average', color: 'bg-emerald-500' },
                    { time: '89ms', label: 'P50', color: 'bg-blue-500' },
                    { time: '234ms', label: 'P95', color: 'bg-amber-500' },
                    { time: '456ms', label: 'P99', color: 'bg-red-500' },
                  ].map((metric, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{metric.label}</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-16 h-2 rounded-full ${metric.color}`} />
                        <span className="text-sm font-semibold">{metric.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'changelog' && (
          <div className="h-full bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Visual Changelog</h3>
            <div className="space-y-4">
              {[
                { version: 'v2.1.0', date: '2025-01-10', type: 'feature', changes: ['Added new authentication system', 'Improved error handling'] },
                { version: 'v2.0.5', date: '2025-01-08', type: 'fix', changes: ['Fixed memory leak in cache', 'Updated dependencies'] },
                { version: 'v2.0.0', date: '2025-01-05', type: 'major', changes: ['Complete API redesign', 'Breaking changes to auth'] },
              ].map((release, index) => (
                <div key={index} className="flex space-x-4 p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    release.type === 'feature' ? 'bg-emerald-100 text-emerald-600' :
                    release.type === 'fix' ? 'bg-amber-100 text-amber-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    <Layers className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{release.version}</h4>
                      <span className="text-sm text-gray-500">{release.date}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        release.type === 'feature' ? 'bg-emerald-100 text-emerald-700' :
                        release.type === 'fix' ? 'bg-amber-100 text-amber-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {release.type}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {release.changes.map((change, i) => (
                        <li key={i} className="text-sm text-gray-600">• {change}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
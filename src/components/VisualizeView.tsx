import React, { useEffect, useState, useRef } from 'react';
import { GitBranch, Activity, Layers, Download, Filter } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function VisualizeView() {
  const [activeTab, setActiveTab] = useState('flow');
  const exportRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: 'flow', label: 'Flow Diagrams', icon: GitBranch },
    { id: 'api', label: 'API Graphs', icon: Activity },
    { id: 'changelog', label: 'Changelogs', icon: Layers },
  ];

  const handleExport = async () => {
    if(!exportRef.current) return;

    const canvas = await html2canvas(exportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    
    const pdf = new jsPDF({
      orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
      unit: 'px',
      format: [imgWidth, imgHeight],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`visualization-${activeTab}.pdf`);
  };
  
  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Documentation Visualizations</h2>
            <p className="text-gray-600">Interactive diagrams and visual representations of your documentation</p>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={handleExport} className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
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
        <div ref={exportRef}>
        {activeTab === 'flow' && (
          <div className="h-full bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-full max-w-2xl mx-auto">
                  <svg viewBox="0 0 700 500" className="w-full h-auto mb-4">
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#6366F1" />
                    </marker>
                  </defs>

                  {/* Terminal: Start */}
                  <rect x="280" y="20" width="140" height="40" rx="20" ry="20" fill="#EEF2FF" stroke="#6366F1" strokeWidth="2" />
                  <text x="350" y="45" textAnchor="middle" fill="#4F46E5" fontSize="14">Start</text>

                  {/* Process: Click Login */}
                  <rect x="280" y="90" width="140" height="40" rx="5" fill="#F0FDF4" stroke="#10B981" strokeWidth="2" />
                  <text x="350" y="115" textAnchor="middle" fill="#065F46" fontSize="14">Click Login</text>

                  {/* Process: Enter Credentials */}
                  <rect x="280" y="160" width="140" height="40" rx="5" fill="#F0FDF4" stroke="#10B981" strokeWidth="2" />
                  <text x="350" y="185" textAnchor="middle" fill="#065F46" fontSize="14">Enter Credentials</text>

                  {/* Decision: Valid? */}
                  <polygon points="350,240 390,280 350,320 310,280" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
                  <text x="350" y="285" textAnchor="middle" fill="#92400E" fontSize="13">Valid?</text>

                  {/* Label for Yes */}
                  <text x="400" y="270" fontSize="12" fill="#4B5563">Yes</text>
                  {/* Label for No */}
                  <text x="280" y="270" fontSize="12" fill="#4B5563">No</text>

                  {/* Process: Redirect to Dashboard */}
                  <rect x="510" y="260" width="160" height="40" rx="5" fill="#E0F2FE" stroke="#3B82F6" strokeWidth="2" />
                  <text x="590" y="285" textAnchor="middle" fill="#1D4ED8" fontSize="13">Redirect to Dashboard</text>

                  {/* Process: Show Error Message */}
                  <rect x="30" y="260" width="160" height="40" rx="5" fill="#FDF2F8" stroke="#EC4899" strokeWidth="2" />
                  <text x="110" y="285" textAnchor="middle" fill="#BE185D" fontSize="13">Show Error Message</text>

                  {/* Terminal: End */}
                  <rect x="280" y="420" width="140" height="40" rx="20" ry="20" fill="#EEF2FF" stroke="#6366F1" strokeWidth="2" />
                  <text x="350" y="445" textAnchor="middle" fill="#4F46E5" fontSize="14">End</text>

                  {/* Flowlines */}
                  <line x1="350" y1="60" x2="350" y2="90" stroke="#6366F1" strokeWidth="2" markerEnd="url(#arrowhead)" />
                  <line x1="350" y1="130" x2="350" y2="160" stroke="#6366F1" strokeWidth="2" markerEnd="url(#arrowhead)" />
                  <line x1="350" y1="200" x2="350" y2="240" stroke="#6366F1" strokeWidth="2" markerEnd="url(#arrowhead)" />

                  {/* From Decision to Dashboard (Yes) */}
                  <line x1="390" y1="280" x2="510" y2="280" stroke="#6366F1" strokeWidth="2" markerEnd="url(#arrowhead)" />

                  {/* From Decision to Error (No) */}
                  <line x1="310" y1="280" x2="190" y2="280" stroke="#6366F1" strokeWidth="2" markerEnd="url(#arrowhead)" />

                  {/* Folded Arrow from Dashboard to End */}
                  <path d="M590,300 L590,360 L350,360 L350,420" stroke="#6366F1" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />

                  {/* Folded Arrow from Error to End */}
                  <path d="M110,300 L110,360 L350,360 L350,420" stroke="#6366F1" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
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
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full"> */}
              <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">API Call Graph</h3>
                <div className="space-y-3">
                  {[
                    {
                      endpoint: '/api/auth/login',
                      function: 'Authenticates user credentials and returns a session token.',
                      impact: 'Login page, user dashboard access, session initialization',
                    },
                    {
                      endpoint: '/api/users',
                      function: 'Fetches user profile data and user list for admin view.',
                      impact: 'Profile page, admin user management',
                    },
                    {
                      endpoint: '/api/posts',
                      function: 'Retrieves and posts blog content to the system.',
                      impact: 'Blog feed, post editor',
                    },
                    {
                      endpoint: '/api/files/upload',
                      function: 'Handles file uploads to the server (images/docs).',
                      impact: 'Editor attachments, media library',
                    },
                  ]
                  .map((api, index) => (
                    <div key={index} className="p-4 border border-ray-200 rounded-lg shadow-sm">
                      <h4 className='font-semibold text-indigo-700'>{api.endpoint}</h4>
                      <p className='text-sm text-gray-800 mt-1'>
                        <span className='font-medium text-gray-600'>Function: </span>{api.function}
                      </p>
                      <p className="text-sm text-gray-800 mt-1">
                        <span className="font-medium text-gray-600">Impacted Areas: </span>{api.impact}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-6">
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
              </div> */}
            </div>
          // </div>
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
    </div>
  );
}
import React, { useState } from 'react';
import { Search, FileText, Clock, TrendingUp, MessageCircle, Layers } from 'lucide-react';
import type { QAResult } from '../types';

export default function ReadView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [qaResults, setQaResults] = useState<QAResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setQaResults([
        {
          question: searchQuery,
          answer: 'To authenticate users in the API, use the `/auth/login` endpoint with POST method. Include email and password in the request body. The response will contain a JWT token for subsequent requests.',
          sourceDocuments: ['API Reference', 'Authentication Guide'],
          confidence: 0.95
        },
        {
          question: searchQuery,
          answer: 'For client-side authentication, store the JWT token in localStorage and include it in the Authorization header for all API requests.',
          sourceDocuments: ['Frontend Integration Guide'],
          confidence: 0.87
        }
      ]);
      setIsSearching(false);
    }, 1000);
  };

  const documents = [
    { title: 'API Reference', summary: 'Complete API documentation with all endpoints...', readTime: '12 min', type: 'api' },
    { title: 'User Guide', summary: 'Step-by-step guide for new users...', readTime: '8 min', type: 'guide' },
    { title: 'Installation Guide', summary: 'How to set up and configure the application...', readTime: '5 min', type: 'tutorial' },
    { title: 'Troubleshooting', summary: 'Common issues and their solutions...', readTime: '15 min', type: 'reference' },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Smart Reading & Search</h2>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Ask a question about the documentation..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isSearching ? 'Searching...' : 'Ask'}
          </button>
        </div>

        {qaResults.length > 0 && (
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-indigo-600" />
              Q&A Results
            </h3>
            {qaResults.map((result, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-gray-900">{result.question}</p>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                    {Math.round(result.confidence * 100)}% confidence
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{result.answer}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Layers className="w-3 h-3" />
                  <span>Sources: {result.sourceDocuments.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Documents</h3>
          <div className="grid gap-4">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      doc.type === 'api' ? 'bg-blue-100 text-blue-600' :
                      doc.type === 'guide' ? 'bg-emerald-100 text-emerald-600' :
                      doc.type === 'tutorial' ? 'bg-amber-100 text-amber-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {doc.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{doc.readTime} read</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-indigo-100 hover:text-indigo-700 transition-colors">
                    Summarize
                  </button>
                </div>
                <p className="text-gray-600 text-sm">{doc.summary}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
            Smart Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">45</div>
              <div className="text-sm text-gray-600">Documents analyzed</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">92%</div>
              <div className="text-sm text-gray-600">Coverage score</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">6</div>
              <div className="text-sm text-gray-600">Missing docs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
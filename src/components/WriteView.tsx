import React, { useState } from 'react';
import { Save, Eye, AlertCircle, CheckCircle, FileText, Lightbulb } from 'lucide-react';

export default function WriteView() {
  const [content, setContent] = useState('# Getting Started\n\nWrite your documentation here...');
  const [isPreview, setIsPreview] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'valid' | 'warning' | 'error'>('valid');

  const suggestions = [
    'Add a table of contents for better navigation',
    'Consider adding code examples to illustrate concepts',
    'Include troubleshooting section for common issues',
  ];

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">Documentation Editor</h2>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                validationStatus === 'valid' ? 'bg-emerald-500' :
                validationStatus === 'warning' ? 'bg-amber-500' : 'bg-red-500'
              }`} />
              <span className="text-sm text-gray-600">
                {validationStatus === 'valid' ? 'Valid markdown' : 
                 validationStatus === 'warning' ? 'Minor issues' : 'Syntax errors'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                isPreview ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-2" />
              {isPreview ? 'Edit' : 'Preview'}
            </button>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              <Save className="w-4 h-4 inline mr-2" />
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          {isPreview ? (
            <div className="flex-1 p-6 overflow-auto">
              <div className="max-w-4xl mx-auto prose prose-lg">
                <h1>Getting Started</h1>
                <p>Write your documentation here...</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 p-6 font-mono text-sm resize-none border-none focus:outline-none"
                placeholder="Start writing your documentation..."
              />
            </div>
          )}
        </div>

        <div className="w-80 border-l border-gray-200 bg-gray-50">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <Lightbulb className="w-4 h-4 mr-2 text-amber-500" />
              Writing Assistant
            </h3>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 bg-white rounded-lg border border-gray-200 text-sm text-gray-700 hover:border-indigo-300 transition-colors cursor-pointer"
                >
                  {suggestion}
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white hover:shadow-sm rounded-lg transition-all">
                  Insert code block
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white hover:shadow-sm rounded-lg transition-all">
                  Add table of contents
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white hover:shadow-sm rounded-lg transition-all">
                  Insert API reference
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
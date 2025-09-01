import React, { useState } from 'react';
import { GitCommit, Code, MessageSquare, Sparkles, Download, RefreshCw } from 'lucide-react';
import type { GenerationOptions } from '../types';

export default function GenerateView() {
  const [options, setOptions] = useState<GenerationOptions>({
    source: 'code',
    style: 'technical',
    length: 'detailed'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setGeneratedContent(`# API Documentation

## Overview
This module provides authentication functionality for the application.

## Functions

### \`authenticateUser(credentials)\`
Authenticates a user with the provided credentials.

**Parameters:**
- \`credentials\` (object): User login credentials
  - \`email\` (string): User's email address
  - \`password\` (string): User's password

**Returns:**
- \`Promise<AuthResult>\`: Authentication result

**Example:**
\`\`\`javascript
const result = await authenticateUser({
  email: 'user@example.com',
  password: 'securePassword123'
});
\`\`\`

## Error Handling
The function throws an error if credentials are invalid.`);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Auto-Generate Documentation</h2>
        <p className="text-gray-600">Create starter documentation from your codebase, git history, or comments</p>
      </div>

      <div className="flex-1 flex">
        <div className="w-96 border-r border-gray-200 p-6 bg-gray-50">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Source</label>
              <div className="space-y-2">
                {[
                  { id: 'code', label: 'Code Analysis', icon: Code, desc: 'Generate docs from function signatures and comments' },
                  { id: 'commits', label: 'Git Commits', icon: GitCommit, desc: 'Create changelog from commit history' },
                  { id: 'comments', label: 'Code Comments', icon: MessageSquare, desc: 'Extract documentation from inline comments' }
                ].map((source) => {
                  const Icon = source.icon;
                  return (
                    <label
                      key={source.id}
                      className={`flex items-start space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        options.source === source.id
                          ? 'border-indigo-300 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="source"
                        value={source.id}
                        checked={options.source === source.id}
                        onChange={(e) => setOptions({ ...options, source: e.target.value as any })}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Icon className="w-4 h-4 text-gray-600" />
                          <span className="font-medium text-gray-900">{source.label}</span>
                        </div>
                        <p className="text-xs text-gray-600">{source.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Writing Style</label>
              <select
                value={options.style}
                onChange={(e) => setOptions({ ...options, style: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="technical">Technical (for developers)</option>
                <option value="user-friendly">User-friendly (for end users)</option>
                <option value="api-reference">API Reference (structured)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Length</label>
              <select
                value={options.length}
                onChange={(e) => setOptions({ ...options, length: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="brief">Brief overview</option>
                <option value="detailed">Detailed documentation</option>
                <option value="comprehensive">Comprehensive guide</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              <span>{isGenerating ? 'Generating...' : 'Generate Documentation'}</span>
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {generatedContent ? (
            <>
              <div className="border-b border-gray-200 p-4 bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Generated Documentation</h3>
                  <button className="flex items-center space-x-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
              <div className="flex-1 p-6 overflow-auto">
                <div className="max-w-4xl mx-auto">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed">
                    {generatedContent}
                  </pre>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Generate</h3>
                <p className="text-gray-600">Configure your options and click generate to create documentation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
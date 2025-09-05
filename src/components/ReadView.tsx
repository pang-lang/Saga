import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Search, FileText, Clock, TrendingUp, MessageCircle, Layers, X, Edit3, Check, RotateCcw, Copy, GripVertical } from 'lucide-react';

// Define QAResult type locally
interface QAResult {
  question: string;
  answer: string;
  sourceDocuments: string[];
  confidence: number;
}

// Define Document type
interface Document {
  id: number;
  title: string;
  summary: string;
  readTime: string;
  type: 'api' | 'guide' | 'tutorial' | 'reference';
  content: string;
}

export default function ReadView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [qaResults, setQaResults] = useState<QAResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documentContent, setDocumentContent] = useState('');
  const [summary, setSummary] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [editedSummary, setEditedSummary] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [summaryPanelWidth, setSummaryPanelWidth] = useState(320); // 320px default width
  const [isResizing, setIsResizing] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

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

  const documents: Document[] = [
    { 
      id: 1,
      title: 'API Reference', 
      summary: 'Complete API documentation with all endpoints...', 
      readTime: '12 min', 
      type: 'api',
      content: `# API Reference

## Authentication
The API uses JWT tokens for authentication. Send a POST request to \`/auth/login\` with your credentials.

### Login Endpoint
- **URL**: \`/auth/login\`
- **Method**: POST
- **Body**: 
  \`\`\`json
  {
    "email": "user@example.com",
    "password": "your-password"
  }
  \`\`\`

### Response
\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
\`\`\`

## Protected Routes
Include the JWT token in the Authorization header for all protected routes:
\`Authorization: Bearer <token>\`

## Endpoints

### Users
- **GET** \`/api/users\` - Get all users
- **POST** \`/api/users\` - Create new user
- **GET** \`/api/users/:id\` - Get user by ID
- **PUT** \`/api/users/:id\` - Update user
- **DELETE** \`/api/users/:id\` - Delete user`
    },
    { 
      id: 2,
      title: 'User Guide', 
      summary: 'Step-by-step guide for new users...', 
      readTime: '8 min', 
      type: 'guide',
      content: `# User Guide

## Getting Started

Welcome to our application! This guide will help you get up and running quickly.

### First Steps
1. Create an account or log in
2. Complete your profile
3. Explore the dashboard
4. Start using the features

### Navigation
The main navigation includes:
- **Dashboard** - Overview of your account
- **Documents** - Manage your files
- **Settings** - Configure your preferences
- **Help** - Get support

### Key Features
Our platform offers several powerful features to help you manage your workflow effectively.

#### Document Management
Upload, organize, and share documents with your team. Support for multiple file formats including PDF, Word, and Excel.

#### Collaboration Tools
Work together with real-time editing, comments, and version control.

#### Analytics
Track your progress with detailed reports and insights.`
    },
    { 
      id: 3,
      title: 'Installation Guide', 
      summary: 'How to set up and configure the application...', 
      readTime: '5 min', 
      type: 'tutorial',
      content: `# Installation Guide

## Prerequisites
Before installing, make sure you have:
- Node.js 16+ installed
- npm or yarn package manager
- Git for version control

## Installation Steps

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/yourcompany/app.git
cd app
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Environment Setup
Create a \`.env\` file in the root directory:
\`\`\`
NODE_ENV=development
PORT=3000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
\`\`\`

### 4. Database Setup
\`\`\`bash
npm run db:migrate
npm run db:seed
\`\`\`

### 5. Start the Application
\`\`\`bash
npm run dev
\`\`\`

The application will be available at \`http://localhost:3000\``
    },
    { 
      id: 4,
      title: 'Troubleshooting', 
      summary: 'Common issues and their solutions...', 
      readTime: '15 min', 
      type: 'reference',
      content: `# Troubleshooting

## Common Issues

### Authentication Problems
**Issue**: Can't log in to the application
**Solutions**:
1. Check your email and password
2. Clear browser cache and cookies
3. Reset your password
4. Contact support if issues persist

### Performance Issues
**Issue**: Application runs slowly
**Solutions**:
1. Check your internet connection
2. Close unnecessary browser tabs
3. Clear browser cache
4. Disable browser extensions
5. Try using a different browser

### File Upload Problems
**Issue**: Cannot upload files
**Solutions**:
1. Check file size (max 10MB)
2. Verify file format is supported
3. Check your internet connection
4. Try uploading a different file

### Database Connection Errors
**Issue**: "Database connection failed"
**Solutions**:
1. Verify database server is running
2. Check connection string in .env file
3. Ensure database credentials are correct
4. Check firewall settings

## Getting Help
If you need additional assistance:
- Check our FAQ section
- Contact technical support
- Join our community forum
- Schedule a support call`
    }
  ];

  const handleDocumentClick = (doc: Document) => {
    setSelectedDocument(doc);
    setDocumentContent(doc.content);
    setSummary('');
    setIsEditingSummary(false);
    setEditedSummary('');
    setCopySuccess(false);
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = summary;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleGenerateSummary = async () => {
    if (!selectedDocument) return;
    
    setIsGeneratingSummary(true);
    // Simulate API call for summary generation
    setTimeout(() => {
      const summaryText = `This document covers ${selectedDocument.title.toLowerCase()} with key information about ${
        selectedDocument.type === 'api' ? 'endpoints, authentication, and API usage' :
        selectedDocument.type === 'guide' ? 'user onboarding, navigation, and core features' :
        selectedDocument.type === 'tutorial' ? 'installation steps, prerequisites, and configuration' :
        'common problems, solutions, and troubleshooting steps'
      }. The document provides comprehensive coverage of the topic with practical examples and clear instructions.`;
      
      setSummary(summaryText);
      setEditedSummary(summaryText);
      setIsGeneratingSummary(false);
    }, 2000);
  };

  const handleEditSummary = () => {
    setIsEditingSummary(true);
  };

  const handleSaveSummary = () => {
    setSummary(editedSummary);
    setIsEditingSummary(false);
  };

  const handleCancelEdit = () => {
    setEditedSummary(summary);
    setIsEditingSummary(false);
  };

  const closeDocumentViewer = () => {
    setSelectedDocument(null);
    setDocumentContent('');
    setSummary('');
    setIsEditingSummary(false);
    setEditedSummary('');
    setCopySuccess(false);
    setSummaryPanelWidth(320); // Reset to default width
  };

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = containerRect.right - e.clientX;
    
    // Set minimum and maximum widths
    const minWidth = 250;
    const maxWidth = containerRect.width - 300;
    
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setSummaryPanelWidth(newWidth);
    }
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

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
                onClick={() => handleDocumentClick(doc)}
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDocumentClick(doc);
                      setTimeout(() => handleGenerateSummary(), 100);
                    }}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                  >
                    Summarize
                  </button>
                </div>
                <p className="text-gray-600 text-sm">{doc.summary}</p>
              </div>
            ))}
          </div>
        </div>

        
      </div>

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selectedDocument.type === 'api' ? 'bg-blue-100 text-blue-600' :
                  selectedDocument.type === 'guide' ? 'bg-emerald-100 text-emerald-600' :
                  selectedDocument.type === 'tutorial' ? 'bg-amber-100 text-amber-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedDocument.title}</h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{selectedDocument.readTime} read</span>
                  </div>
                </div>
              </div>
              <button
                onClick={closeDocumentViewer}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
              {/* Document Content */}
              <div className="flex-1 p-6 overflow-y-auto" style={{ marginRight: summaryPanelWidth }}>
                <div className="prose prose-indigo max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                    {documentContent}
                  </pre>
                </div>
              </div>

              {/* Resizer */}
              <div
                className={`absolute top-0 bottom-0 w-1 bg-gray-200 hover:bg-gray-300 cursor-col-resize flex items-center justify-center ${
                  isResizing ? 'bg-indigo-400' : ''
                }`}
                onMouseDown={handleMouseDown}
                style={{ right: summaryPanelWidth - 1, zIndex: 10 }}
              >
                <div className="w-4 h-8 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors">
                  <GripVertical className="w-3 h-3 text-gray-600" />
                </div>
              </div>

              {/* Summary Panel */}
              <div 
                className="absolute top-0 bottom-0 right-0 border-l border-gray-200 p-6 overflow-y-auto bg-gray-50"
                style={{ width: summaryPanelWidth }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
                  {!summary && (
                    <button
                      onClick={handleGenerateSummary}
                      disabled={isGeneratingSummary}
                      className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                      {isGeneratingSummary ? 'Generating...' : 'Generate'}
                    </button>
                  )}
                </div>

                {isGeneratingSummary && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    <span className="ml-2 text-sm text-gray-600">Generating summary...</span>
                  </div>
                )}

                {summary && !isGeneratingSummary && (
                  <div className="space-y-4">
                    {isEditingSummary ? (
                      <div className="space-y-3">
                        <textarea
                          value={editedSummary}
                          onChange={(e) => setEditedSummary(e.target.value)}
                          className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
                          placeholder="Edit your summary..."
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSaveSummary}
                            className="flex items-center px-3 py-1 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 transition-colors"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition-colors"
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="p-3 bg-white rounded-lg text-sm text-gray-700 leading-relaxed border border-gray-200">
                          {summary}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={handleEditSummary}
                            className="flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-md hover:bg-indigo-200 transition-colors"
                          >
                            <Edit3 className="w-3 h-3 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={handleCopySummary}
                            className={`flex items-center px-3 py-1 text-sm rounded-md transition-colors ${
                              copySuccess 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            {copySuccess ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
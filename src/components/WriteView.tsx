import React, { useState, useEffect, useMemo } from 'react';
import { 
  Save, 
  Eye, 
  Edit3, 
  Code, 
  List, 
  Table, 
  Layout,
  Github,
  X,
  Plus,
  FileText,
  Zap,
  MessageCircle,
  Bot,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Hash,
  RefreshCw,
  AlertCircle,
  Info,
  XCircle
} from 'lucide-react';

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "github-markdown-css";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // use GitHub theme
import remarkEmoji from "remark-emoji";

interface WriteViewProps {
  repositoryId?: string;
}

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  content: string;
}

interface ValidationIssue {
  id: string;
  type: 'broken-link' | 'heading' | 'syntax' | 'formatting' | 'structure' | 'accessibility';
  line: number;
  column?: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  context?: string;
  suggestion?: string;
}

interface Suggestion {
  id: string;
  type: 'grammar' | 'style' | 'clarity' | 'technical';
  line: number;
  text: string;
  suggestion: string;
  severity: 'low' | 'medium' | 'high';
}

export default function WriteView({ repositoryId = 'current-repo' }: WriteViewProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showValidationPanel, setShowValidationPanel] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const templates: Template[] = [
    {
      id: 'api-reference',
      name: 'API Reference',
      category: 'API',
      description: 'Complete API documentation with endpoints, parameters, and examples',
      content: `# API Reference

## Overview
Brief description of your API and its purpose.

## Authentication
Describe authentication methods and requirements.

## Endpoints

### GET /api/users
Retrieve a list of users.

**Parameters:**
- \`limit\` (optional): Number of users to return (default: 10)
- \`offset\` (optional): Number of users to skip (default: 0)

**Response:**
\`\`\`json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ],
  "total": 100
}
\`\`\`

### POST /api/users
Create a new user.

**Request Body:**
\`\`\`json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": 2,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "created_at": "2024-01-15T10:30:00Z"
}
\`\`\`

## Error Handling
Description of error responses and status codes.
`
    },
    {
      id: 'user-guide',
      name: 'User Guide',
      category: 'Guide',
      description: 'Step-by-step guide for end users',
      content: `# User Guide

## Introduction
Welcome to [Product Name]. This guide will help you get started and make the most of our platform.

## Getting Started

### Step 1: Account Setup
1. Visit our website and click "Sign Up"
2. Fill in your details
3. Verify your email address
4. Complete your profile

### Step 2: First Login
1. Go to the login page
2. Enter your credentials
3. Explore the dashboard

## Key Features

### Feature 1: Dashboard
The dashboard provides an overview of your account and recent activity.

### Feature 2: Settings
Customize your experience through the settings panel.

## Troubleshooting

### Common Issues
- **Can't log in**: Check your email and password
- **Forgot password**: Use the password reset link
- **Account locked**: Contact support

## Support
Need help? Contact us at support@example.com
`
    },
    {
      id: 'tutorial',
      name: 'Tutorial',
      category: 'Tutorial',
      description: 'Interactive tutorial with code examples',
      content: `# Tutorial: Building Your First App

## Prerequisites
- Node.js 18 or higher
- Basic JavaScript knowledge
- Text editor or IDE

## Step 1: Project Setup

Create a new project directory:
\`\`\`bash
mkdir my-app
cd my-app
npm init -y
\`\`\`

## Step 2: Install Dependencies

Install the required packages:
\`\`\`bash
npm install express
npm install --save-dev nodemon
\`\`\`

## Step 3: Create Your First Server

Create \`server.js\`:
\`\`\`javascript
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
\`\`\`

## Step 4: Run Your App

Start the development server:
\`\`\`bash
npx nodemon server.js
\`\`\`

## Next Steps
- Add more routes
- Implement middleware
- Connect to a database
`
    },
    {
      id: 'changelog',
      name: 'Changelog',
      category: 'Reference',
      description: 'Version history and release notes',
      content: `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New feature descriptions

### Changed
- Updates to existing features

### Deprecated
- Features that will be removed

### Removed
- Features that have been removed

### Fixed
- Bug fixes

### Security
- Security improvements

## [2.1.0] - 2024-01-15

### Added
- User authentication system
- Dashboard analytics
- Export functionality

### Changed
- Improved performance by 40%
- Updated UI components
- Enhanced error handling

### Fixed
- Fixed memory leak in data processing
- Resolved login redirect issue
- Fixed mobile responsive layout

## [2.0.0] - 2023-12-01

### Added
- Complete UI redesign
- API v2 with breaking changes
- Real-time notifications

### Changed
- **BREAKING**: Updated API endpoints
- Migrated to new database schema

### Removed
- Legacy API v1 support
- Deprecated user roles

## [1.5.2] - 2023-11-15

### Fixed
- Critical security vulnerability
- Data validation issues
`
    },
    {
      id: 'readme',
      name: 'README',
      category: 'Reference',
      description: 'Project overview and setup instructions',
      content: `# Project Name

Brief description of what this project does and who it's for.

## Features

- ✨ Feature 1
- 🚀 Feature 2
- 🔒 Feature 3
- 📱 Feature 4

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Quick Start

1. Clone the repository:
\`\`\`bash
git clone https://github.com/username/project-name.git
cd project-name
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

## API Reference

### Methods

#### \`doSomething(options)\`
Description of what this method does.

**Parameters:**
- \`options\` (Object): Configuration options

**Returns:**
- Promise that resolves to result

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: support@example.com
- 💬 Discord: [Join our server](https://discord.gg/example)
- 🐛 Issues: [GitHub Issues](https://github.com/username/project-name/issues)
`
    }
  ];

  const defaultTemplate = templates.find(t => t.id === "readme")?.content || "";
  const [content, setContent] = useState<string>(defaultTemplate);
  // Enhanced markdown validator
  const validateMarkdown = useMemo(() => {
    return (markdown: string): ValidationIssue[] => {
      const lines = markdown.split('\n');
      const issues: ValidationIssue[] = [];
      const headingStructure: number[] = [];
      const linkRefs: Set<string> = new Set();
      const linkDefs: Set<string> = new Set();

      lines.forEach((line, index) => {
        const lineNum = index + 1;

        // 1. Check for broken/malformed links
        const linkRegex = /\[([^\]]*)\]\(([^)]*)\)/g;
        let linkMatch;
        while ((linkMatch = linkRegex.exec(line)) !== null) {
          const linkText = linkMatch[1];
          const url = linkMatch[2];
          
          if (!linkText.trim()) {
            issues.push({
              id: `empty-link-text-${lineNum}`,
              type: 'accessibility',
              line: lineNum,
              message: 'Link has empty text',
              severity: 'error',
              context: linkMatch[0],
              suggestion: 'Provide descriptive link text for accessibility'
            });
          }

          if (!url.trim()) {
            issues.push({
              id: `empty-link-url-${lineNum}`,
              type: 'broken-link',
              line: lineNum,
              message: 'Link has empty URL',
              severity: 'error',
              context: linkMatch[0]
            });
          }

          // Check for internal links
          if (url.startsWith('#')) {
            linkRefs.add(url.slice(1));
          }

          // Check for suspicious external links
          if (url.startsWith('http') && !url.includes('example.com') && !url.includes('github.com')) {
            const suspiciousDomains = ['thisdoesnotexist', 'fakeurlhere', 'invalidurl'];
            if (suspiciousDomains.some(domain => url.includes(domain))) {
              issues.push({
                id: `suspicious-link-${lineNum}`,
                type: 'broken-link',
                line: lineNum,
                message: 'Potentially broken external link detected',
                severity: 'warning',
                context: url,
                suggestion: 'Verify this URL is accessible'
              });
            }
          }
        }

        // 2. Check heading structure and hierarchy
        const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const text = headingMatch[2].trim();
          
          // Generate anchor for internal link checking
          const anchor = text.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
          linkDefs.add(anchor);

          if (text.length < 3) {
            issues.push({
              id: `short-heading-${lineNum}`,
              type: 'heading',
              line: lineNum,
              message: 'Heading text is very short',
              severity: 'info',
              context: text,
              suggestion: 'Consider using more descriptive heading text'
            });
          }

          if (text.length > 60) {
            issues.push({
              id: `long-heading-${lineNum}`,
              type: 'heading',
              line: lineNum,
              message: 'Heading text is quite long',
              severity: 'info',
              context: text,
              suggestion: 'Consider shortening heading text for better readability'
            });
          }

          // Check heading hierarchy
          if (headingStructure.length > 0) {
            const lastLevel = headingStructure[headingStructure.length - 1];
            if (level > lastLevel + 1) {
              issues.push({
                id: `heading-skip-${lineNum}`,
                type: 'structure',
                line: lineNum,
                message: `Heading level ${level} follows level ${lastLevel} (skipped levels)`,
                severity: 'warning',
                context: text,
                suggestion: 'Use consecutive heading levels for better document structure'
              });
            }
          }

          headingStructure.push(level);

          // Check for duplicate headings
          const duplicateHeading = lines.slice(0, index).find((prevLine, prevIndex) => {
            const prevMatch = prevLine.match(/^#{1,6}\s+(.+)/);
            return prevMatch && prevMatch[1].trim().toLowerCase() === text.toLowerCase();
          });

          if (duplicateHeading) {
            issues.push({
              id: `duplicate-heading-${lineNum}`,
              type: 'structure',
              line: lineNum,
              message: 'Duplicate heading found',
              severity: 'warning',
              context: text,
              suggestion: 'Use unique headings or add distinguishing context'
            });
          }
        }

        // 3. Check code block syntax
        if (line.trim().startsWith('```')) {
          const codeBlockMatch = line.match(/^(\s*)```(\w*)/);
          if (codeBlockMatch) {
            const language = codeBlockMatch[2];
            
            // Find closing code block
            let found = false;
            for (let i = index + 1; i < lines.length; i++) {
              if (lines[i].trim() === '```' || lines[i].match(/^(\s*)```\s*$/)) {
                found = true;
                break;
              }
            }
            
            if (!found) {
              issues.push({
                id: `unclosed-code-block-${lineNum}`,
                type: 'syntax',
                line: lineNum,
                message: 'Code block is not properly closed',
                severity: 'error',
                context: line.trim(),
                suggestion: 'Add closing ``` to complete the code block'
              });
            }

            // Suggest language specification for better syntax highlighting
            if (!language && index < lines.length - 1) {
              const nextLine = lines[index + 1];
              if (nextLine && (
                nextLine.includes('function') || 
                nextLine.includes('const') || 
                nextLine.includes('import') ||
                nextLine.includes('export')
              )) {
                issues.push({
                  id: `missing-language-${lineNum}`,
                  type: 'formatting',
                  line: lineNum,
                  message: 'Consider specifying language for syntax highlighting',
                  severity: 'info',
                  context: line.trim(),
                  suggestion: 'Add language identifier (e.g., ```javascript)'
                });
              }
            }
          }
        }

        // 4. Check list formatting
        const listMatch = line.match(/^(\s*)([-*+]|\d+\.)\s*(.*)/);
        if (listMatch) {
          const indent = listMatch[1];
          const marker = listMatch[2];
          const content = listMatch[3];

          if (content.length === 0) {
            issues.push({
              id: `empty-list-item-${lineNum}`,
              type: 'formatting',
              line: lineNum,
              message: 'Empty list item',
              severity: 'warning',
              context: line,
              suggestion: 'Add content to list item or remove it'
            });
          }

          // Check for inconsistent list markers
          if (index > 0) {
            const prevLine = lines[index - 1];
            const prevListMatch = prevLine.match(/^(\s*)([-*+]|\d+\.)\s*(.*)/);
            if (prevListMatch && prevListMatch[1] === indent) {
              const prevMarker = prevListMatch[2];
              if (marker.match(/[-*+]/) && prevMarker.match(/[-*+]/) && marker !== prevMarker) {
                issues.push({
                  id: `inconsistent-list-marker-${lineNum}`,
                  type: 'formatting',
                  line: lineNum,
                  message: 'Inconsistent list marker style',
                  severity: 'info',
                  context: `${prevMarker} vs ${marker}`,
                  suggestion: 'Use consistent list markers throughout the document'
                });
              }
            }
          }
        }

        // 5. Check for common markdown issues
        if (line.includes('](') && !line.match(/\[[^\]]*\]\([^)]*\)/)) {
          issues.push({
            id: `malformed-link-${lineNum}`,
            type: 'syntax',
            line: lineNum,
            message: 'Possibly malformed link syntax',
            severity: 'error',
            context: line.substring(line.indexOf('](')),
            suggestion: 'Check link syntax: [text](url)'
          });
        }

        // 6. Check for accessibility issues
        if (line.match(/!\[[^\]]*\]\([^)]*\)/) && !line.match(/!\[.+\]/)) {
          issues.push({
            id: `missing-alt-text-${lineNum}`,
            type: 'accessibility',
            line: lineNum,
            message: 'Image missing alt text',
            severity: 'warning',
            context: line.match(/!\[[^\]]*\]\([^)]*\)/)?.[0] || '',
            suggestion: 'Add descriptive alt text for accessibility: ![description](url)'
          });
        }

        // 7. Check for table formatting
        if (line.includes('|')) {
          const pipes = (line.match(/\|/g) || []).length;
          if (pipes >= 2) {
            // This looks like a table row
            const cells = line.split('|').map(cell => cell.trim());
            
            // Check for empty cells
            const emptyCells = cells.filter(cell => cell === '').length;
            if (emptyCells > 2) { // Allow for leading/trailing empty cells
              issues.push({
                id: `table-empty-cells-${lineNum}`,
                type: 'formatting',
                line: lineNum,
                message: 'Table row has multiple empty cells',
                severity: 'info',
                context: line,
                suggestion: 'Fill in table cells or use proper table syntax'
              });
            }
          }
        }
      });

      // Check for broken internal links
      linkRefs.forEach(ref => {
        if (!linkDefs.has(ref)) {
          issues.push({
            id: `broken-internal-link-${ref}`,
            type: 'broken-link',
            line: 0,
            message: `Internal link references non-existent heading: #${ref}`,
            severity: 'error',
            context: `#${ref}`,
            suggestion: 'Ensure the referenced heading exists or fix the link'
          });
        }
      });

      return issues;
    };
  }, []);

  const handleAddNewDocument = () => {
    setContent('');
    setSuccessMessage('🆕 New document created!');
    setTimeout(() => setSuccessMessage(null), 3000);
    };

  // Auto-validate on content change with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsValidating(true);
      const issues = validateMarkdown(content);
      setValidationIssues(issues);
      setIsValidating(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [content, validateMarkdown]);

  // Manual validation function
  const runFullValidation = async () => {
    setIsValidating(true);
    // Simulate more thorough validation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const issues = validateMarkdown(content);
    setValidationIssues(issues);
    setShowValidationPanel(true);
    setIsValidating(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  
    // ✅ Show toast
    setSuccessMessage("✅ Saved successfully!");
    setTimeout(() => setSuccessMessage(null), 3000); // hide after 3s
  };
  
  const handlePushToGitHub = async () => {
    setIsPushing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsPushing(false);
  
    // ✅ Show toast
    setSuccessMessage("🚀 Changes pushed to GitHub!");
    setTimeout(() => setSuccessMessage(null), 3000); // hide after 3s
  };
  
  const analyzeContent = async () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setSuggestions([
        {
          id: '1',
          type: 'clarity',
          line: 3,
          text: 'Start writing your documentation here.',
          suggestion: 'Consider being more specific about what type of documentation this is for.',
          severity: 'medium'
        },
        {
          id: '2',
          type: 'technical',
          line: 8,
          text: 'Real-time markdown preview',
          suggestion: 'Add a brief explanation of what real-time preview means for new users.',
          severity: 'low'
        },
        {
          id: '3',
          type: 'style',
          line: 12,
          text: 'Quick Start',
          suggestion: 'Consider using "Getting Started" for better SEO and user familiarity.',
          severity: 'low'
        }
      ]);
      setIsAnalyzing(false);
    }, 2000);
  };

  const insertCodeBlock = () => {
    const codeBlock = '\n```javascript\n// Your code here\nconsole.log("Hello, World!");\n```\n';
    setContent(prev => prev + codeBlock);
  };

  const insertTableOfContents = () => {
    const toc = '\n## Table of Contents\n\n- [Introduction](#introduction)\n- [Getting Started](#getting-started)\n- [API Reference](#api-reference)\n- [Examples](#examples)\n- [Contributing](#contributing)\n\n';
    setContent(prev => prev + toc);
  };

  const insertTable = () => {
    const table = '\n| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Row 1    | Data     | Data     |\n| Row 2    | Data     | Data     |\n\n';
    setContent(prev => prev + table);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'API': 'bg-blue-100 text-blue-800',
      'Guide': 'bg-green-100 text-green-800',
      'Tutorial': 'bg-purple-100 text-purple-800',
      'Reference': 'bg-orange-100 text-orange-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getIssueIcon = (severity: 'error' | 'warning' | 'info') => {
    switch (severity) {
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getIssueColor = (severity: 'error' | 'warning' | 'info') => {
    switch (severity) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const selectTemplate = (template: Template) => {
    setContent(template.content);
    setShowTemplates(false);
  };

  const errorCount = validationIssues.filter(issue => issue.severity === 'error').length;
  const warningCount = validationIssues.filter(issue => issue.severity === 'warning').length;

  return (
    <div className="flex h-full w-screen">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            {/* Left side: Title only */}
            <h2 className="text-lg font-semibold text-gray-900">
              Documentation Editor
            </h2>

            {/* Right side: Validation + Buttons */}
            <div className="flex items-center space-x-4">
              
              {/* Validation Status */}
              <div className="flex items-center space-x-2 text-sm">
                {isValidating ? (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Validating...</span>
                  </div>
                ) : (
                  <>
                    {errorCount > 0 && (
                      <div className="flex items-center space-x-1 text-red-600">
                        <XCircle className="w-4 h-4" />
                        <span>{errorCount}</span>
                      </div>
                    )}
                    {warningCount > 0 && (
                      <div className="flex items-center space-x-1 text-amber-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{warningCount}</span>
                      </div>
                    )}
                    {errorCount === 0 && warningCount === 0 && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Valid</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <button
                onClick={runFullValidation}
                disabled={isValidating}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Validate</span>
              </button>
              <button
                onClick={() => setIsPreview(!isPreview)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isPreview
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{isPreview ? 'Edit' : 'Preview'}</span>
              </button>
              {/* New Add Button */}
              <button
                onClick={handleAddNewDocument}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Doc</span>
              </button>
            </div>
          </div>
        </div>

        {/* Editor/Preview Area */}
        <div className="flex-1 p-6">
          {isPreview ? (
            <div className="markdown-body bg-white text-gray-900 p-6 rounded-lg">
            <ReactMarkdown
              remarkPlugins={[remarkGfm,remarkEmoji]}
              rehypePlugins={[rehypeRaw, rehypeHighlight]}
              components={{
                a: ({ node, ...props }) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" />
                ),
                code: ({ inline, className, children, ...props }: any) => {
                  return inline ? (
                    <code {...props} className={className}>
                      {children}
                    </code>
                  ) : (
                    <pre className={className}>
                      <code {...props}>{children}</code>
                    </pre>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
              placeholder="Start writing your documentation..."
            />
          )}
        </div>

        <div className="sticky bottom-0 flex justify-end items-center gap-3 p-4 border-t border-gray-200 bg-white">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
          <button
            onClick={handlePushToGitHub}
            disabled={isPushing}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <Github className="w-4 h-4" />
            <span>{isPushing ? 'Pushing...' : 'Push to GitHub'}</span>
          </button>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l border-gray-200 bg-gray-50 h-screen sticky top-0 overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Tools</h3>
          
          {/* Quick Actions */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button
                onClick={insertCodeBlock}
                className="w-full flex items-center space-x-3 p-3 text-left bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
              >
                <Code className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium">Insert Code Block</span>
              </button>
              <button
                onClick={insertTableOfContents}
                className="w-full flex items-center space-x-3 p-3 text-left bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
              >
                <List className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium">Add Table of Contents</span>
              </button>
              <button
                onClick={insertTable}
                className="w-full flex items-center space-x-3 p-3 text-left bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
              >
                <Table className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium">Insert Table</span>
              </button>
            </div>
          </div>

          {/* Templates */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Templates</h4>
            <button
              onClick={() => setShowTemplates(true)}
              className="w-full flex items-center space-x-3 p-3 text-left bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
            >
              <Layout className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium">Browse Templates</span>
            </button>
          </div>

          {/* Writing Assistant */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Writing Assistant</h4>
            
            <div className="mb-4">
              <button
                onClick={analyzeContent}
                disabled={isAnalyzing}
                className="w-full flex items-center space-x-3 p-3 text-left bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <RefreshCw className="w-4 h-4 text-purple-600 animate-spin" />
                ) : (
                  <Bot className="w-4 h-4 text-purple-600" />
                )}
                <div>
                  <div className="text-sm font-medium">AI Editor</div>
                  <div className="text-xs text-gray-500">Refine your writing</div>
                </div>
              </button>
              
              {suggestions.length > 0 && (
                <div className="mt-3 space-y-2">
                  {suggestions.slice(0, 3).map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className={`p-3 rounded-lg border text-xs ${
                        suggestion.severity === 'high' ? 'bg-red-50 border-red-200' :
                        suggestion.severity === 'medium' ? 'bg-amber-50 border-amber-200' :
                        'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className={`font-medium ${
                          suggestion.severity === 'high' ? 'text-red-700' :
                          suggestion.severity === 'medium' ? 'text-amber-700' :
                          'text-blue-700'
                        }`}>
                          Line {suggestion.line}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-xs ${
                          suggestion.type === 'grammar' ? 'bg-red-100 text-red-700' :
                          suggestion.type === 'style' ? 'bg-purple-100 text-purple-700' :
                          suggestion.type === 'clarity' ? 'bg-blue-100 text-blue-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {suggestion.type}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1">"{suggestion.text}"</p>
                      <p className="text-gray-700">{suggestion.suggestion}</p>
                    </div>
                  ))}
                  {suggestions.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{suggestions.length - 3} more suggestions
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Validation Panel */}
          {validationIssues.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Validation Issues</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {validationIssues.slice(0, 5).map((issue) => (
                  <div
                    key={issue.id}
                    className={`p-3 rounded-lg border text-xs ${getIssueColor(issue.severity)}`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center space-x-1">
                        {getIssueIcon(issue.severity)}
                        <span className="font-medium">
                          {issue.line > 0 ? `Line ${issue.line}` : 'Document'}
                        </span>
                      </div>
                      <span className="px-1.5 py-0.5 bg-white bg-opacity-50 rounded text-xs">
                        {issue.type}
                      </span>
                    </div>
                    <p className="mb-1">{issue.message}</p>
                    {issue.context && (
                      <p className="text-gray-600 mb-1 font-mono">"{issue.context}"</p>
                    )}
                    {issue.suggestion && (
                      <p className="text-sm opacity-75">{issue.suggestion}</p>
                    )}
                  </div>
                ))}
                {validationIssues.length > 5 && (
                  <button
                    onClick={() => setShowValidationPanel(true)}
                    className="w-full text-xs text-blue-600 hover:text-blue-800 text-center py-2"
                  >
                    View all {validationIssues.length} issues
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Template Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Documentation Templates</h3>
              <button
                onClick={() => setShowTemplates(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => selectTemplate(template)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 group-hover:text-indigo-700">
                        {template.name}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(template.category)}`}>
                        {template.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Validation Panel Modal */}
      {showValidationPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <h3 className="text-xl font-semibold text-gray-900">Validation Results</h3>
                <div className="flex items-center space-x-4 text-sm">
                  {errorCount > 0 && (
                    <div className="flex items-center space-x-1 text-red-600">
                      <XCircle className="w-4 h-4" />
                      <span>{errorCount} errors</span>
                    </div>
                  )}
                  {warningCount > 0 && (
                    <div className="flex items-center space-x-1 text-amber-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{warningCount} warnings</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1 text-blue-600">
                    <Info className="w-4 h-4" />
                    <span>{validationIssues.filter(i => i.severity === 'info').length} info</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowValidationPanel(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {validationIssues.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Issues Found</h4>
                  <p className="text-gray-600">Your markdown is well-formatted and valid!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {validationIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className={`p-4 rounded-lg border ${getIssueColor(issue.severity)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getIssueIcon(issue.severity)}
                          <span className="font-medium">
                            {issue.line > 0 ? `Line ${issue.line}` : 'Document'}
                          </span>
                          <span className="px-2 py-1 bg-white bg-opacity-50 rounded text-xs">
                            {issue.type}
                          </span>
                        </div>
                        <span className="text-xs opacity-75 capitalize">{issue.severity}</span>
                      </div>
                      <p className="mb-2 font-medium">{issue.message}</p>
                      {issue.context && (
                        <p className="text-sm mb-2 font-mono bg-white bg-opacity-50 p-2 rounded">
                          "{issue.context}"
                        </p>
                      )}
                      {issue.suggestion && (
                        <p className="text-sm opacity-75">{issue.suggestion}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {successMessage && (
      <div className="fixed top-6 right-6 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50">
        <CheckCircle className="w-5 h-5" />
        <span>{successMessage}</span>
      </div>
    )}
    </div>
  );
}
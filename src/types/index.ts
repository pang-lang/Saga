export interface Document {
  id: string;
  title: string;
  content: string;
  type: 'markdown' | 'api' | 'guide' | 'changelog';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  summary?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  category: 'api' | 'guide' | 'tutorial' | 'reference';
}

export interface QAResult {
  question: string;
  answer: string;
  sourceDocuments: string[];
  confidence: number;
}

export interface GenerationOptions {
  source: 'code' | 'commits' | 'comments';
  style: 'technical' | 'user-friendly' | 'api-reference';
  length: 'brief' | 'detailed' | 'comprehensive';
}
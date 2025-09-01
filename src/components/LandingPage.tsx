import React, { useEffect, useState } from 'react';
import { GitBranch, FileText, MessageCircle, BarChart3, Zap, Clock, Star, Users, ArrowRight, Github, Sparkles, BookOpen, Target, Layers, Menu, X, ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react';
import { motion } from "framer-motion"

interface Repository {
  id: string;
  name: string;
  description: string;
  language: string;
  lastUpdated: string;
  stars: number;
  contributors: number;
}

interface LandingPageProps {
  onNavigateToWorkspace: (view: string, repoId?: string) => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function LandingPage({ onNavigateToWorkspace }: LandingPageProps) {
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const repositories: Repository[] = [
    {
      id: 'auth-service',
      name: 'auth-service',
      description: 'Authentication microservice with JWT and OAuth2 support',
      language: 'TypeScript',
      lastUpdated: '2 hours ago',
      stars: 124,
      contributors: 8
    },
    {
      id: 'user-dashboard',
      name: 'user-dashboard',
      description: 'React-based user interface for customer management',
      language: 'JavaScript',
      lastUpdated: '1 day ago',
      stars: 89,
      contributors: 5
    },
    {
      id: 'payment-api',
      name: 'payment-api',
      description: 'Stripe integration for handling payments and subscriptions',
      language: 'Python',
      lastUpdated: '3 days ago',
      stars: 67,
      contributors: 3
    },
    {
      id: 'notification-worker',
      name: 'notification-worker',
      description: 'Background service for email and push notifications',
      language: 'Go',
      lastUpdated: '1 week ago',
      stars: 45,
      contributors: 4
    }
  ];

  const faqItems: FAQItem[] = [
    {
      question: "How does Saga generate documentation from my code?",
      answer: "Saga uses advanced AI to analyze your codebase, including source code, comments, commit messages, and repository structure. It understands the context and relationships between different parts of your project to generate comprehensive, accurate documentation automatically."
    },
    {
      question: "Which programming languages and frameworks does Saga support?",
      answer: "Saga supports all major programming languages including JavaScript, TypeScript, Python, Go, Java, C#, Ruby, PHP, and more. It also understands popular frameworks like React, Vue, Django, Express, Spring, and many others."
    },
    {
      question: "Can I customize the generated documentation?",
      answer: "Absolutely! While Saga generates intelligent documentation automatically, you can customize templates, add your own sections, modify the structure, and include custom branding. The AI learns from your preferences to improve future generations."
    },
    {
      question: "Is my code and data secure with Saga?",
      answer: "Yes, security is our top priority. We use enterprise-grade encryption for all data in transit and at rest. Your code never leaves our secure infrastructure, and we offer on-premise deployment options for enterprise customers with strict security requirements."
    },
  ];

  const getLanguageColor = (language: string) => {
    const colors = {
      TypeScript: 'bg-blue-500',
      JavaScript: 'bg-yellow-500',
      Python: 'bg-green-500',
      Go: 'bg-cyan-500',
    };
    return colors[language as keyof typeof colors] || 'bg-gray-500';
  };

  const features = [
    {
      icon: Zap,
      title: 'Auto-Generate',
      description: 'Create documentation from your code, commits, and comments automatically'
    },
    {
      icon: MessageCircle,
      title: 'Smart Q&A',
      description: 'Ask questions and get instant answers from your documentation'
    },
    {
      icon: BarChart3,
      title: 'Visualizations',
      description: 'Interactive diagrams, API graphs, and visual changelogs'
    }
  ];

  // Calculate opacity based on scroll position
  const heroOpacity = Math.max(0, 1 - scrollY / 400);
  const heroTransform = `translateY(${scrollY * 0.5}px)`;

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Saga</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                FAQ
              </a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Contact Us
              </a>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Sign In
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg">
                Get Started Free
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden py-4 border-t border-gray-200"
            >
              <nav className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium py-2">
                  Features
                </a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium py-2">
                  Pricing
                </a>
                <a href="#faq" className="text-gray-600 hover:text-gray-900 font-medium py-2">
                  FAQ
                </a>
                <a href="#contact" className="text-gray-600 hover:text-gray-900 font-medium py-2">
                  Contact Us
                </a>
                <div className="flex flex-col space-y-2 pt-4">
                  <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium text-left">
                    Sign In
                  </button>
                  <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg">
                    Get Started Free
                  </button>
                </div>
              </nav>
            </motion.div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16">
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url(/assets/developer.gif)",
            opacity: heroOpacity,
            transform: heroTransform
          }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: heroOpacity, scale: 1 }}
          transition={{ duration: 1.2 }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/70 to-emerald-900/80"
          style={{ 
            opacity: heroOpacity,
            transform: heroTransform
          }}
        />
        <div 
          className="relative max-w-7xl mx-auto px-6 py-20"
          style={{ 
            opacity: heroOpacity,
            transform: heroTransform
          }}
        >
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent">
                Saga
              </span>
            </h1>
            <p className="text-5xl md:text-3xl text-white font-bold mb-8 max-w-3xl mx-auto leading-relaxed">
              The Next Chapter in Documentation
            </p>
            <p className="text-lg text-gray-200 mb-12 max-w-2xl mx-auto">
              Transform your codebase into beautiful, intelligent documentation with AI-powered tools that understand your project
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="flex items-center space-x-3 px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold text-lg hover:border-white hover:bg-white/10 transition-all duration-200">
                Try for Free
              </button>
              <button className="flex items-center space-x-3 px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold text-lg hover:border-white hover:bg-white/10 transition-all duration-200">
                <Github className="w-5 h-5" />
                <span>Connect GitHub Repo</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#92A6C8] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Repositories Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Repositories</h2>
              <p className="text-lg text-gray-600">
                Connect your repositories and start generating intelligent documentation
              </p>
            </div>
            <button className="px-6 py-3 bg-[#92A6C8] text-white rounded-xl hover:bg-[#374A6D] transition-colors flex items-center space-x-2 shadow-lg">
              <Github className="w-5 h-5" />
              <span>Connect Repository</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {repositories.map((repo) => (
              <div
                key={repo.id}
                onClick={() => onNavigateToWorkspace('write', repo.id)}
                className="bg-white rounded-2xl border border-gray-200 hover:border-[#92A6C8] hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-1"
              >
                {/* Repository Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:from-indigo-100 group-hover:to-indigo-200 transition-all duration-300">
                        <GitBranch className="w-6 h-6 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                          {repo.name}
                        </h3>
                        <p className="text-gray-600 mt-1">{repo.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`} />
                      <span>{repo.language}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>{repo.stars}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{repo.contributors}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{repo.lastUpdated}</span>
                    </div>
                  </div>

                  {/* Hover indicator */}
                  <div className="mt-4 flex items-center text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-medium">Click to open workspace</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { action: 'Generated API docs', repo: 'auth-service', time: '2 hours ago', type: 'generate' },
                { action: 'Asked about authentication', repo: 'user-dashboard', time: '4 hours ago', type: 'question' },
                { action: 'Summarized changelog', repo: 'payment-api', time: '1 day ago', type: 'summarize' },
                { action: 'Created flow diagram', repo: 'notification-worker', time: '2 days ago', type: 'visualize' },
              ].map((activity, index) => (
                <div key={index} className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${
                    activity.type === 'generate' ? 'bg-indigo-100 text-indigo-600' :
                    activity.type === 'question' ? 'bg-emerald-100 text-emerald-600' :
                    activity.type === 'summarize' ? 'bg-amber-100 text-amber-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {activity.type === 'generate' && <Zap className="w-4 h-4" />}
                    {activity.type === 'question' && <MessageCircle className="w-4 h-4" />}
                    {activity.type === 'summarize' && <FileText className="w-4 h-4" />}
                    {activity.type === 'visualize' && <BarChart3 className="w-4 h-4" />}
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">{activity.action}</p>
                  <p className="text-xs text-gray-600 mb-2">in {activity.repo}</p>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about Saga and how it can transform your documentation workflow
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900 pr-4">
                    {item.question}
                  </span>
                  {openFAQ === index ? (
                    <Minus className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: openFAQ === index ? 'auto' : 0,
                    opacity: openFAQ === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Still have questions? We're here to help!
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg">
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Product Footer */}
      <footer id="contact" className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Saga</span>
              </div>
              <p className="text-gray-400 mb-6">
                The next chapter in documentation. Transform your codebase into intelligent, beautiful docs.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2025 Saga. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
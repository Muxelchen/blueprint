import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Search, MessageCircle, Mail, Phone, Book, ChevronDown, ChevronRight } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const HelpPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const categories = [
    { id: 'all', name: 'All Topics', count: 24 },
    { id: 'getting-started', name: 'Getting Started', count: 8 },
    { id: 'account', name: 'Account & Billing', count: 6 },
    { id: 'technical', name: 'Technical Issues', count: 7 },
    { id: 'features', name: 'Features', count: 3 },
  ];

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I get started with the platform?',
      answer: 'Getting started is easy! First, create your account and verify your email. Then follow our guided setup wizard to configure your workspace. You can also check out our Quick Start guide for step-by-step instructions.',
    },
    {
      id: 2,
      category: 'account',
      question: 'How can I update my billing information?',
      answer: 'You can update your billing information by going to Settings > Billing. Click on "Payment Methods" to add, edit, or remove payment methods. Changes take effect immediately.',
    },
    {
      id: 3,
      category: 'technical',
      question: 'Why am I experiencing slow loading times?',
      answer: 'Slow loading can be caused by several factors: poor internet connection, browser cache issues, or server load. Try clearing your browser cache, disabling browser extensions, or switching to a different network.',
    },
    {
      id: 4,
      category: 'features',
      question: 'Can I customize the dashboard layout?',
      answer: 'Yes! You can fully customize your dashboard by dragging and dropping widgets, resizing panels, and choosing from different layout templates. Access these options from the Dashboard Settings menu.',
    },
    {
      id: 5,
      category: 'account',
      question: 'How do I change my password?',
      answer: 'Go to Settings > Security and click "Change Password". Enter your current password and your new password. For security, you\'ll need to confirm the change via email.',
    },
    {
      id: 6,
      category: 'technical',
      question: 'What browsers are supported?',
      answer: 'We support all modern browsers including Chrome (latest 2 versions), Firefox (latest 2 versions), Safari (latest 2 versions), and Edge (latest 2 versions). Internet Explorer is not supported.',
    },
  ];

  const contactOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      action: 'Start Chat',
      available: 'Available 24/7',
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us a detailed message about your issue',
      action: 'Send Email',
      available: 'Response within 2 hours',
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our support specialists',
      action: 'Call Now',
      available: 'Mon-Fri 9AM-6PM',
    },
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen"
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Help & Support
        </h1>
        <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Find answers to your questions and get the help you need
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="max-w-2xl mx-auto relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search for help articles, FAQs, or guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:ring-2 focus:ring-primary-500 text-lg`}
          />
        </div>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {contactOptions.map((option, index) => (
          <motion.div
            key={option.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } shadow-sm hover:shadow-md transition-all text-center`}
          >
            <option.icon className={`w-8 h-8 mx-auto mb-4 ${
              option.title === 'Live Chat' ? 'text-green-500' :
              option.title === 'Email Support' ? 'text-blue-500' : 'text-purple-500'
            }`} />
            <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {option.title}
            </h3>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {option.description}
            </p>
            <p className={`text-xs mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {option.available}
            </p>
            <button className="btn-primary w-full">
              {option.action}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className={`p-4 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } shadow-sm`}>
            <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Categories
            </h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span>{category.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="lg:col-span-3">
          <div className={`rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } shadow-sm overflow-hidden`}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Frequently Asked Questions
              </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredFAQs.map((faq) => (
                <div key={faq.id} className="p-6">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    className={`w-full flex items-center justify-between text-left ${
                      isDarkMode ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'
                    }`}
                  >
                    <h4 className="font-medium pr-4">{faq.question}</h4>
                    {expandedFAQ === faq.id ? (
                      <ChevronDown className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-5 h-5 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFAQ === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4"
                    >
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {filteredFAQs.length === 0 && (
            <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No help articles found</p>
              <p className="text-sm">Try adjusting your search or browse different categories</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Resources */}
      <div className="mt-12">
        <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Additional Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="#"
            className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'
            } shadow-sm transition-colors group`}
          >
            <Book className="w-6 h-6 text-blue-500 mb-3" />
            <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              User Guide
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Complete documentation and tutorials
            </p>
          </a>
          <a
            href="#"
            className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'
            } shadow-sm transition-colors group`}
          >
            <MessageCircle className="w-6 h-6 text-green-500 mb-3" />
            <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Community Forum
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Connect with other users and experts
            </p>
          </a>
          <a
            href="#"
            className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'
            } shadow-sm transition-colors group`}
          >
            <HelpCircle className="w-6 h-6 text-purple-500 mb-3" />
            <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Video Tutorials
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Step-by-step video guides
            </p>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default HelpPage; 
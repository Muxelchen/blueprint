import React, { useState, useEffect } from 'react';
import { Languages, ChevronDown } from 'lucide-react';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface LanguageSwitchProps {
  className?: string;
  languages?: Language[];
  onLanguageChange?: (language: Language) => void;
}

const defaultLanguages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

const LanguageSwitch: React.FC<LanguageSwitchProps> = ({
  className = '',
  languages = defaultLanguages,
  onLanguageChange,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    // Initialize from localStorage or default to English
    const saved = localStorage.getItem('language');
    if (saved) {
      const savedLang = languages.find(lang => lang.code === saved);
      if (savedLang) return savedLang;
    }
    return languages[0]; // Default to first language (English)
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('language', currentLanguage.code);

    // Set document language attribute
    document.documentElement.lang = currentLanguage.code;

    // Trigger callback
    onLanguageChange?.(currentLanguage);
  }, [currentLanguage, onLanguageChange]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.language-switch')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLanguageSelect = (language: Language) => {
    setCurrentLanguage(language);
    setIsOpen(false);
  };

  return (
    <div className={`relative language-switch ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <Languages className="w-4 h-4 text-gray-600" />
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {currentLanguage.name}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {languages.map(language => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language)}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-150 ${
                currentLanguage.code === language.code
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <div className="flex-1">
                <div className="font-medium">{language.name}</div>
                <div className="text-xs text-gray-500 uppercase">{language.code}</div>
              </div>
              {currentLanguage.code === language.code && (
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitch;

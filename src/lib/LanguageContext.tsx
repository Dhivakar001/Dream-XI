import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, SupportedLanguage } from './translations';

interface LanguageContextProps {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, defaultValue?: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem('dreamxi_language') as SupportedLanguage) || 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    localStorage.setItem('dreamxi_language', lang);
    setLanguageState(lang);
  };

  // Heavy robust dynamic translating helper
  const t = (key: string, defaultValue?: string): string => {
    if (!key) return '';
    const cleanKey = key.trim();
    
    // 1. Direct dictionary match (for any language, including English)
    const dict = translations[language];
    if (dict && dict[cleanKey]) {
      return dict[cleanKey];
    }

    // 2. Case-insensitive dictionary match
    const lowerKey = cleanKey.toLowerCase();
    if (dict) {
      const match = Object.keys(dict).find(k => k.toLowerCase() === lowerKey);
      if (match) {
        return dict[match];
      }
    }

    // 3. If English and no match found, fallback to key
    if (language === 'en') {
      return defaultValue || key;
    }

    // Let's also handle dynamic fragments or prefixes/suffixes (like numbers)
    // For example: "4 active" -> "4 " + t("active")
    const numMatch = cleanKey.match(/^(\d+)\s+(.+)$/);
    if (numMatch && dict) {
      const num = numMatch[1];
      const word = numMatch[2].trim();
      const translatedWord = dict[word] || dict[word.toLowerCase()];
      if (translatedWord) {
        return `${num} ${translatedWord}`;
      }
    }

    // Fallback
    return defaultValue || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import bn from './locales/bn.json';
import en from './locales/en.json';
import hi from './locales/hi.json';
import mr from './locales/mr.json';
import te from './locales/te.json';

export const LANGUAGE_STORAGE_KEY = 'mamvatam.language';

export const SUPPORTED_LANGUAGES = ['en', 'hi', 'mr', 'bn', 'te'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: mr },
  bn: { translation: bn },
  te: { translation: te },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
});

export const isSupportedLanguage = (language: string): language is SupportedLanguage =>
  SUPPORTED_LANGUAGES.includes(language as SupportedLanguage);

export const changeAppLanguage = async (language: string): Promise<void> => {
  const nextLanguage = isSupportedLanguage(language) ? language : 'en';
  await i18n.changeLanguage(nextLanguage);
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
};

export const loadSavedLanguage = async (): Promise<void> => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage && isSupportedLanguage(savedLanguage)) {
      await i18n.changeLanguage(savedLanguage);
    }
  } catch {
    // Keep default English when storage read fails.
  }
};

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en.json';
import thTranslation from './locales/th.json';

const resources = {
  en: {
    translation: enTranslation
  },
  th: {
    translation: thTranslation
  }
};

const savedLanguage = localStorage.getItem('language') || 'th';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

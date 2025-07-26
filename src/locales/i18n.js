import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import hi from './hi.json';
import kn from './kn.json';

i18next.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: en,
    },
    hi: {
      translation: hi,
    },
    kn: {
      translation: kn,
    },
  },
  react: {
    useSuspense: false,
  },
});

export default i18next;
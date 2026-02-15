import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import fr from "./locales/fr.json";
import en from "./locales/en.json";

const STORAGE_KEY = "APP_LANG";

const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: async (cb) => {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    cb(saved || "fr");
  },
  init: () => {},
  cacheUserLanguage: async (lng) => {
    await AsyncStorage.setItem(STORAGE_KEY, lng);
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v3",
    fallbackLng: "fr",
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
export { STORAGE_KEY };

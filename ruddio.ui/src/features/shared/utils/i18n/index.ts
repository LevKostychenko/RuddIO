import { CONFIG } from "@/config";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { TLocale } from "@shared/types";

export const init = () => {
  return i18next.use(initReactI18next).init({
    fallbackLng: CONFIG.DEFAULT_LANG,
    resources: {},
    react: {
      useSuspense: true,
    },
    interpolation: {
      escapeValue: false,
    },
  });
};

export const addResource = (localization: TLocale, translations: Object[]) => {
  translations.forEach((nsBundle) => {
    Object.entries(nsBundle).forEach(([ns, bundle]) => {
      i18next.addResourceBundle(localization, ns, bundle);
    });
  });
};

export default {
  init,
  addResource,
};

import { TLocale } from "@/features/shared/types";
import i18n from "@/features/shared/utils/i18n";

export const lazyLoadTranslations = async (
  translationPaths: string[],
  localization: TLocale
) => {
  const locales = import.meta.glob(`@/**/translations/*.json`);
  const promises: Promise<void>[] = [];

  for (const path in locales) {
    if (
      translationPaths.find((p) => path.endsWith(`${p}/${localization}.json`))
    ) {
      const promise = locales[path]().then((module: any) => {
        i18n.addResource(localization, [module]);
      });
      promises.push(promise);
    }
  }

  return Promise.all(promises);
};

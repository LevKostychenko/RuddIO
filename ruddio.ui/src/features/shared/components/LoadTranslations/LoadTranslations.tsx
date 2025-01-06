import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import i18next from "i18next";
import { lazyLoadTranslations } from "./utils/lazy-load-translations";
import { CONFIG } from "@/config";
import { TLocale } from "@shared/types";
import { alwaysLoadTranslations } from "./constants/translation-paths";
import { useSelector } from "react-redux";
import { getUser } from "@/features/shared/store/auth/selectors";

type TProps = {
  onLoaded?: () => void;
};

// TODO: Lazy loading of translations does not work with vite for some reason
export const LoadTranslations = ({
  children,
  onLoaded,
}: PropsWithChildren<TProps>) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLocalizationLoaded, setIsFirstLocalizationLoaded] =
    useState(false);
  const user = useSelector(getUser);

  const localization = useMemo(
    () => user?.locale ?? CONFIG.DEFAULT_LANG,
    [user]
  );

  useEffect(() => {
    setIsLoading(true);
    const translationsToLoad = [...alwaysLoadTranslations];

    (async () => {
      if (localization !== CONFIG.DEFAULT_LANG && !isFirstLocalizationLoaded) {
        await lazyLoadTranslations(
          translationsToLoad,
          CONFIG.DEFAULT_LANG as TLocale
        );
      }
      await lazyLoadTranslations(translationsToLoad, localization as TLocale);
      await i18next.changeLanguage(localization);
      setIsLoading(false);
      setIsFirstLocalizationLoaded(true);
      onLoaded && onLoaded();
    })();
    // This hook don't should call after isFirstLocalizationLoaded changes.
    // It loads new translations only on locale or app swithces.
    // This hook look on variable 'isFirstLocalizationLoaded' to preload default language
    // To fallback all missed translations to default lang
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localization]);

  return (
    <>
      {/* {isLoading && <Spinner />} */}
      {(!isLoading || isFirstLocalizationLoaded) && children}
    </>
  );
};

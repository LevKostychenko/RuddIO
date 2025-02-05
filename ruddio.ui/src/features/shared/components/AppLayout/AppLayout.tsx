import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { LoadTranslations } from "../LoadTranslations";
import { AppRoutes } from "../AppRoutes/AppRoutes";
import { DetectAuth } from "../DetectAuth";

export const AppLayout = () => {
  const { t } = useTranslation(["shared"]);

  const translationLoadCallback = useCallback(() => {
    document.title = t("document.title");
  }, [t]);

  return (
    <LoadTranslations onLoaded={translationLoadCallback}>
      <DetectAuth>
        <AppRoutes />
      </DetectAuth>
    </LoadTranslations>
  );
};

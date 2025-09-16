import { useEffect, useState } from "react";
import i18n from "../utils/i18n";

export function useI18nInit() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (i18n.isInitialized) {
      setIsReady(true);
    } else {
      i18n.on("initialized", () => {
        setIsReady(true);
      });
    }
  }, []);

  return isReady;
}

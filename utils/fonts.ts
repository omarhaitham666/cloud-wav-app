// fonts.js
import {
  useFonts,
  NotoSansArabic_400Regular,
  NotoSansArabic_500Medium,
  NotoSansArabic_600SemiBold,
  NotoSansArabic_700Bold,
} from "@expo-google-fonts/noto-sans-arabic";

export function useAppFonts() {
  const [loaded] = useFonts({
    NotoSansArabic_400Regular,
    NotoSansArabic_500Medium,
    NotoSansArabic_600SemiBold,
    NotoSansArabic_700Bold,
  });
  return loaded;
}

export const AppFonts = {
  regular: "NotoSansArabic_400Regular",
  medium: "NotoSansArabic_500Medium",
  semibold: "NotoSansArabic_600SemiBold",
  bold: "NotoSansArabic_700Bold",
};

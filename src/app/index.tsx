import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Index() {
  const { t } = useTranslation();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="text-2xl font-quicksand-bold text-primary">
        Edit app/index.tsx to edit this screen.
        {t("welcome")}
      </Text>

      <LanguageSwitcher />
    </View>
  );
}

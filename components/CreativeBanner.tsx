import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AppFonts } from "@/utils/fonts";


interface CreativeBannerProps {
  titleKey: string;
  subtitleKey: string;
  iconKey: string;
  colors: string[];
  namespace: string;
}

const CreativeBanner: React.FC<CreativeBannerProps> = ({
  titleKey,
  subtitleKey,
  iconKey,
  colors,
  namespace,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <LinearGradient
      colors={colors as [string, string, ...string[]]}
      style={{
        borderRadius: 18,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
      }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View className={`flex-row items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
        <View className={`w-16 h-16 rounded-2xl bg-white/20 items-center justify-center ${isRTL ? 'ml-4' : 'mr-4'}`}>
          <Ionicons 
            name={t(`${namespace}.banner.${iconKey}`) as any} 
            size={32} 
            color="#fff" 
          />
        </View>
        <View className="flex-1">
          <Text 
            className="text-white text-2xl mb-1"
            style={{ textAlign: isRTL ? 'right' : 'left',
              fontFamily: AppFonts.semibold,
             }}
          >
            {t(`${namespace}.banner.${titleKey}`)}
          </Text>
          <Text 
            className="text-white/90 text-sm leading-5"
            style={{ textAlign: isRTL ? 'right' : 'left',
              fontFamily: AppFonts.semibold,
             }}
          >
            {t(`${namespace}.banner.${subtitleKey}`)}
          </Text>
        </View>
      </View>
      
      {/* Decorative elements */}
      <View className="absolute top-2 right-2 opacity-20">
        <View className="w-8 h-8 rounded-full bg-white/30" />
      </View>
      <View className="absolute bottom-2 left-2 opacity-20">
        <View className="w-6 h-6 rounded-full bg-white/30" />
      </View>
    </LinearGradient>
  );
};

export default CreativeBanner;

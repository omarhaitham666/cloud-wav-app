import { AppFonts } from "@/utils/fonts";
import { Facebook, Instagram, Video } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Linking, Modal, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  setModalVisible: (visible: boolean) => void;
  onClose: () => void;
};

const SocialServiesModal = ({ visible, setModalVisible, onClose }: Props) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const openApp = async (url: string, fallbackUrl: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(fallbackUrl);
      }
    } catch (err) {
      console.error("Error opening app:", err);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 bg-black/50 items-center justify-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
          <Text
            className="text-lg font-bold text-gray-900 mb-4 text-center"
            style={{
              textAlign: isRTL ? "right" : "left",
              fontFamily: AppFonts.semibold,
            }}
          >
            {t("services.clothesStore.modal.title")}
          </Text>
          <View className="flex-row justify-around mb-6">
            <TouchableOpacity
              className="items-center"
              onPress={() =>
                openApp(
                  "fb://profile/61573739062609",
                  "https://www.facebook.com/profile.php?id=61573739062609"
                )
              }
            >
              <Facebook size={36} color="#1877F2" />
              <Text
                className="text-xs text-gray-700 mt-2"
                style={{
                  fontFamily: AppFonts.semibold,
                }}
              >
                Facebook
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center"
              onPress={() =>
                openApp(
                  "instagram://user?username=black_8_bear",
                  "https://www.instagram.com/black_8_bear"
                )
              }
            >
              <Instagram size={36} color="#E4405F" />
              <Text
                className="text-xs text-gray-700 mt-2"
                style={{
                  fontFamily: AppFonts.semibold,
                }}
              >
                Instagram
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center"
              onPress={() =>
                openApp(
                  "snssdk1128://user/profile/___blackbear",
                  "https://www.tiktok.com/@___blackbear"
                )
              }
            >
              <Video size={36} color="#000000" />
              <Text
                className="text-xs text-gray-700 mt-2"
                style={{
                  fontFamily: AppFonts.semibold,
                }}
              >
                TikTok
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            className="bg-purple-600 py-3 rounded-xl"
          >
            <Text
              className="text-white text-center font-semibold"
              style={{
                fontFamily: AppFonts.semibold,
              }}
            >
              {t("services.clothesStore.modal.close")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SocialServiesModal;

import { AppFonts } from "@/utils/fonts";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import AlbumUploadForm from "../AlbumUploadForm";
import SongUploadForm from "../SongUploadForm";

type UploadType = "choose" | "song" | "album";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const UploadModal: React.FC<Props> = ({ visible, onClose }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [uploadType, setUploadType] = useState<UploadType>("choose");

  const handleBack = () => setUploadType("choose");

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/90">
        <LinearGradient
          colors={["#1A1A2E", "#16213E", "#0F3460"]}
          className="flex-1"
        >
          <View className="pt-12 pb-4 px-6 flex-row justify-between items-center">
            <View
              className={
                isRTL
                  ? "flex-row-reverse items-center"
                  : "flex-row items-center"
              }
            >
              {uploadType !== "choose" && (
                <TouchableOpacity
                  onPress={handleBack}
                  className={isRTL ? "ml-2" : "mr-2"}
                >
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
              )}
              <Text
                className="text-white text-xl"
                style={{
                  fontFamily: AppFonts.bold,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {uploadType === "song"
                  ? t("upload.song") || "Upload Song"
                  : uploadType === "album"
                  ? t("upload.album") || "Create Album"
                  : t("upload.title") || "Upload Content"}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View className="flex-1 px-6 pb-6">
            {uploadType === "choose" && (
              <View className="gap-6 justify-center flex-1">
                {/* Song */}
                <TouchableOpacity onPress={() => setUploadType("song")}>
                  <LinearGradient
                    colors={["#3B82F6", "#1D4ED8"]}
                    className="flex-row items-center p-6 rounded-xl"
                  >
                    <Ionicons name="musical-notes" size={28} color="white" />
                    <Text
                      className="text-white text-lg ml-4"
                      style={{ fontFamily: AppFonts.bold }}
                    >
                      {t("upload.song") || "Upload Song"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setUploadType("album")}>
                  <LinearGradient
                    colors={["#10B981", "#059669"]}
                    className="flex-row items-center p-6 rounded-xl"
                  >
                    <Ionicons name="albums" size={28} color="white" />
                    <Text
                      className="text-white text-lg ml-4"
                      style={{ fontFamily: AppFonts.bold }}
                    >
                      {t("upload.album") || "Create Album"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {uploadType === "song" && <SongUploadForm onSuccess={onClose} />}
            {uploadType === "album" && <AlbumUploadForm onSuccess={onClose} />}
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

export default UploadModal;

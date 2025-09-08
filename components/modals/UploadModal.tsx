import { AppFonts } from "@/utils/fonts";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import AlbumUploadForm from "../AlbumUploadForm";
import SongUploadForm from "../SongUploadForm";

type UploadType = "choose" | "song" | "album";

type Props = {
  visible: boolean;
  artist_id?: number;
  onClose: () => void;
};

const UploadModal: React.FC<Props> = ({ visible, onClose }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [uploadType, setUploadType] = useState<UploadType>("choose");

  const handleClose = () => {
    setUploadType("choose");
    onClose();
  };

  const renderChooseType = () => (
    <View className="flex-1 gap-4 justify-center">
      <Text
        className="text-2xl text-white mx-auto text-center mb-8"
        style={{
          fontFamily: AppFonts.bold,
          textAlign: isRTL ? "right" : "left",
        }}
      >
        {t("upload.chooseType") || "What would you like to upload?"}
      </Text>

      <View className="space-y-4 gap-6">
        <TouchableOpacity
          onPress={() => setUploadType("song")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#3B82F6", "#1D4ED8"]}
            className="flex-row items-center p-6 rounded-xl"
            style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
          >
            <View className="bg-white/20 p-3 rounded-full">
              <Ionicons name="musical-notes" size={28} color="white" />
            </View>
            <View className={isRTL ? "mr-4 flex-1" : "ml-4 flex-1"}>
              <Text
                className="text-white text-lg"
                style={{
                  fontFamily: AppFonts.bold,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("upload.song") || "Upload Song"}
              </Text>
              <Text
                className="text-white/70 text-sm mt-1"
                style={{
                  fontFamily: AppFonts.medium,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                Upload individual music tracks
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setUploadType("album")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#10B981", "#059669"]}
            className="flex-row items-center p-6 rounded-xl"
            style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
          >
            <View className="bg-white/20 p-3 rounded-full">
              <Ionicons name="albums" size={28} color="white" />
            </View>
            <View className={isRTL ? "mr-4 flex-1" : "ml-4 flex-1"}>
              <Text
                className="text-white text-lg"
                style={{
                  fontFamily: AppFonts.bold,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("upload.album") || "Create Album"}
              </Text>
              <Text
                className="text-white/70 text-sm mt-1"
                style={{
                  fontFamily: AppFonts.medium,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                Create a new music album
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (uploadType) {
      case "song":
        return <SongUploadForm isRTL={isRTL} />;
      case "album":
        return <AlbumUploadForm isRTL={isRTL} />;
      default:
        return renderChooseType();
    }
  };

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
          <View className="pt-12 pb-4 px-6">
            <View
            
              className="flex-row justify-between items-center"
              style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
            >
              <View
                className={
                  isRTL
                    ? "flex-row-reverse items-center"
                    : "flex-row items-center"
                }
              >
                {uploadType !== "choose" && (
                  <TouchableOpacity
                    onPress={() => setUploadType("choose")}
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
                    ? "Upload Song"
                    : uploadType === "album"
                    ? "Create Album"
                    : t("upload.title") || "Upload Content"}
                </Text>
              </View>
              <TouchableOpacity onPress={handleClose} className="p-2">
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-1 px-6 pb-6">{renderContent()}</View>
        </LinearGradient>
      </View>
      <Toast />
    </Modal>
  );
};

export default UploadModal;

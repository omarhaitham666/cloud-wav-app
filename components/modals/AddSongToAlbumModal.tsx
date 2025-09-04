import { AppFonts } from "@/utils/fonts";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    Image,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  visible: boolean;
  isLoading: boolean;
  onClose: () => void;
  onAddSongToAlbum: (albumId: string, file: any) => void;
  onDeleteAlbum: (albumId: string) => void;
  existingAlbums: Array<{ id: string; title: string; coverImage?: string }>;
};

function AddSongToAlbumModal({
  visible,
  isLoading,
  onClose,
  onAddSongToAlbum,
  onDeleteAlbum,
  existingAlbums,
}: Props) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>("");

  const pickFile = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking file:", error);
    }
  };

  const handleAddSongToAlbum = () => {
    if (selectedFile && selectedAlbumId) {
      onAddSongToAlbum(selectedAlbumId, selectedFile);
      setSelectedFile(null);
      setSelectedAlbumId("");
    }
  };

  const handleDeleteAlbum = (albumId: string) => {
    onDeleteAlbum(albumId);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setSelectedAlbumId("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 bg-black/40 justify-center items-center px-4">
        <View className="bg-white rounded-2xl w-full max-h-[90%]">
          <View
            className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200"
            style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
          >
            <Text
              className="text-lg text-gray-800"
              style={{
                textAlign: isRTL ? "right" : "left",
                fontFamily: AppFonts.semibold,
              }}
            >
              {t("upload.addSongToAlbumTitle")}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Text
                className="text-xl text-gray-600"
                style={{
                  fontFamily: AppFonts.semibold,
                }}
              >
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            <View className="space-y-4">
              <View>
                <Text
                  className="text-gray-700 mb-2"
                  style={{
                    textAlign: isRTL ? "right" : "left",
                    fontFamily: AppFonts.semibold,
                  }}
                >
                  {t("upload.selectAlbum")}
                </Text>
                
                {existingAlbums.length === 0 ? (
                  <View className="border-2 border-dashed border-gray-300 rounded-lg p-6 items-center">
                    <Ionicons name="albums" size={32} color="#6B7280" />
                    <Text
                      className="text-sm text-gray-600 mt-2 text-center"
                      style={{
                        fontFamily: AppFonts.semibold,
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      {t("upload.noAlbumsAvailable")}
                    </Text>
                  </View>
                ) : (
                  existingAlbums.map((album) => (
                    <TouchableOpacity
                      key={album.id}
                      onPress={() => setSelectedAlbumId(album.id)}
                      className={`flex-row items-center p-3 border rounded-lg mb-2 ${
                        selectedAlbumId === album.id ? "border-purple-500 bg-purple-50" : "border-gray-300"
                      } ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      {album.coverImage ? (
                        <Image
                          source={{ uri: album.coverImage }}
                          className="w-12 h-12 rounded-lg"
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="w-12 h-12 rounded-lg bg-gray-200 items-center justify-center">
                          <Ionicons name="albums" size={24} color="#6B7280" />
                        </View>
                      )}
                      <View className={`flex-1 ${isRTL ? "mr-3" : "ml-3"}`}>
                        <Text
                          className="text-base font-semibold"
                          style={{
                            fontFamily: AppFonts.semibold,
                            textAlign: isRTL ? "right" : "left",
                          }}
                        >
                          {album.title}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDeleteAlbum(album.id)}
                        className="p-2"
                      >
                        <Ionicons name="trash" size={20} color="#EF4444" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))
                )}
              </View>

              <View>
                <Text
                  className="text-gray-700 mb-2"
                  style={{
                    textAlign: isRTL ? "right" : "left",
                    fontFamily: AppFonts.semibold,
                  }}
                >
                  {t("upload.selectSong")}
                </Text>
                
                <TouchableOpacity
                  onPress={pickFile}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 items-center"
                >
                  <Ionicons name="musical-notes" size={32} color="#6B7280" />
                  <Text
                    className="text-sm text-gray-600 mt-2"
                    style={{
                      fontFamily: AppFonts.semibold,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {selectedFile ? selectedFile.fileName : t("upload.chooseSongFile")}
                  </Text>
                  {selectedFile && (
                    <Text
                      className="text-xs text-green-600 mt-1"
                      style={{
                        fontFamily: AppFonts.semibold,
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      {t("upload.fileSelected")}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleAddSongToAlbum}
                disabled={!selectedFile || !selectedAlbumId || isLoading}
                className={`py-4 rounded-full ${
                  selectedFile && selectedAlbumId && !isLoading ? "bg-purple-600" : "bg-gray-300"
                }`}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text
                    className="text-white text-center text-base"
                    style={{
                      fontFamily: AppFonts.semibold,
                    }}
                  >
                    {t("upload.addSongToAlbum")}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default AddSongToAlbumModal;

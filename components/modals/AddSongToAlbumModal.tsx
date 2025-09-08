import { AppFonts } from "@/utils/fonts";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
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
  album: { id: string; title: string; coverImage?: string };
};

function AddSongToAlbumModal({
  visible,
  isLoading,
  onClose,
  onAddSongToAlbum,
  onDeleteAlbum,
  album,
}: Props) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [selectedCoverImage, setSelectedCoverImage] = useState<any>(null);

  const pickAudioFile = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking audio file:", error);
    }
  };

  const pickCoverImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedCoverImage(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking cover image:", error);
    }
  };

  const handleAddSongToAlbum = () => {
    if (selectedFile && album.id) {
      onAddSongToAlbum(album.id, selectedFile);
      setSelectedFile(null);
      setSelectedCoverImage(null);
    }
  };

  const handleDeleteAlbum = () => {
    Alert.alert(
      "Delete Album",
      "Are you sure you want to delete this album? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            onDeleteAlbum(album.id);
            onClose();
          },
        },
      ]
    );
  };

  const handleClose = () => {
    setSelectedFile(null);
    setSelectedCoverImage(null);
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
              Add Song to "{album.title}"
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
              {/* Album Info */}
              <View>
                <Text
                  className="text-gray-700 mb-2"
                  style={{
                    textAlign: isRTL ? "right" : "left",
                    fontFamily: AppFonts.semibold,
                  }}
                >
                  Album
                </Text>
                
                <View className="flex-row items-center p-3 border border-gray-300 rounded-lg mb-2">
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
                    onPress={handleDeleteAlbum}
                    className="p-2"
                  >
                    <Ionicons name="trash" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Audio File Selection */}
              <View>
                <Text
                  className="text-gray-700 mb-2"
                  style={{
                    textAlign: isRTL ? "right" : "left",
                    fontFamily: AppFonts.semibold,
                  }}
                >
                  Select Audio File
                </Text>
                
                <TouchableOpacity
                  onPress={pickAudioFile}
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
                    {selectedFile ? selectedFile.fileName || "Audio file selected" : "Choose Audio File"}
                  </Text>
                  {selectedFile && (
                    <Text
                      className="text-xs text-green-600 mt-1"
                      style={{
                        fontFamily: AppFonts.semibold,
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      File Selected
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* Cover Image Selection */}
              <View>
                <Text
                  className="text-gray-700 mb-2"
                  style={{
                    textAlign: isRTL ? "right" : "left",
                    fontFamily: AppFonts.semibold,
                  }}
                >
                  Select Cover Image (Optional)
                </Text>
                
                <TouchableOpacity
                  onPress={pickCoverImage}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 items-center"
                >
                  {selectedCoverImage ? (
                    <Image
                      source={{ uri: selectedCoverImage.uri }}
                      className="w-16 h-16 rounded-lg"
                      resizeMode="cover"
                    />
                  ) : (
                    <Ionicons name="image" size={32} color="#6B7280" />
                  )}
                  <Text
                    className="text-sm text-gray-600 mt-2"
                    style={{
                      fontFamily: AppFonts.semibold,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {selectedCoverImage ? "Cover image selected" : "Choose Cover Image"}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleAddSongToAlbum}
                disabled={!selectedFile || isLoading}
                className={`py-4 rounded-full ${
                  selectedFile && !isLoading ? "bg-blue-600" : "bg-gray-300"
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
                    Add Song to Album
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

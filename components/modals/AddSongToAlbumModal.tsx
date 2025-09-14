import { AppFonts } from "@/utils/fonts";
import { getToken } from "@/utils/secureStore";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const GENRES = [
  "Rap",
  "Pop",
  "Blues",
  "Rock",
  "Mahraganat",
  "Jazz",
  "Metal & Heavy Metal",
  "Sonata",
  "Symphony",
  "Orchestra",
  "Concerto",
];

type Props = {
  visible: boolean;
  isLoading: boolean;
  onClose: () => void;
  onDeleteAlbum: (albumId: string) => void;
  album: { id: string; title: string; coverImage?: string };
  onSongAdded?: () => void;
};

function AddSongToAlbumModal({
  visible,
  isLoading,
  onClose,
  onDeleteAlbum,
  album,
  onSongAdded,
}: Props) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [selectedCoverImage, setSelectedCoverImage] = useState<any>(null);
  const [songTitle, setSongTitle] = useState<string>("");
  const [division, setDivision] = useState<string>("");
  const [isAddingSong, setIsAddingSong] = useState<boolean>(false);

  const pickAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["audio/*"],
        copyToCacheDirectory: true,
      });

      if (result.canceled === false) {
        const asset = result.assets[0];
        const fileName = asset.name || "song.mp3";

        let mimeType = "audio/mpeg";
        if (fileName.toLowerCase().endsWith(".wav")) {
          mimeType = "audio/wav";
        } else if (fileName.toLowerCase().endsWith(".ogg")) {
          mimeType = "audio/ogg";
        } else if (fileName.toLowerCase().endsWith(".mp3")) {
          mimeType = "audio/mpeg";
        }

        const audioFile = {
          uri: asset.uri,
          name: fileName,
          type: mimeType,
        };

        setSelectedFile(audioFile);
        Toast.show({
          type: "success",
          text1: "File Selected",
          text2: fileName,
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Selection Failed",
        text2: "Unable to select audio file. Please try again.",
      });
    }
  };

  const pickCoverImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const asset = result.assets[0];
        const fileName = asset.fileName || `image_${Date.now()}.jpg`;
        const mimeType = asset.mimeType || "image/jpeg";

        const imageFile = {
          uri: asset.uri,
          name: fileName,
          type: mimeType,
          base64: asset.base64,
        };

        setSelectedCoverImage(imageFile);
        Toast.show({
          type: "success",
          text1: "Cover Image Selected",
          text2: "Cover image uploaded successfully",
        });
      }
    } catch (error) {
      console.error("Error picking cover image:", error);
      Toast.show({
        type: "error",
        text1: "Selection Failed",
        text2: "Unable to select cover image. Please try again.",
      });
    }
  };

  const handleAddSongToAlbum = async () => {
    if (!selectedFile || !album.id) {
      Toast.show({
        type: "error",
        text1: "Missing Information",
        text2: "Please select an audio file",
      });
      return;
    }

    if (!songTitle.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Information",
        text2: "Please enter a song title",
      });
      return;
    }

    if (!division) {
      Toast.show({
        type: "error",
        text1: "Missing Information",
        text2: "Please select a genre/division",
      });
      return;
    }

    try {
      setIsAddingSong(true);
      const formData = new FormData();

      // Add cover image if provided
      if (selectedCoverImage) {
        if (selectedCoverImage.base64) {
          const base64File = {
            uri: `data:${selectedCoverImage.type};base64,${selectedCoverImage.base64}`,
            type: selectedCoverImage.type,
            name: selectedCoverImage.name,
          };
          formData.append("cover_image", base64File as any);
        } else {
          const regularFile = {
            uri: selectedCoverImage.uri,
            type: selectedCoverImage.type || "image/jpeg",
            name: selectedCoverImage.name || `cover_image_${Date.now()}.jpg`,
          };
          formData.append("cover_image", regularFile as any);
        }
      }

      formData.append("file", selectedFile as any);

      formData.append("title", songTitle.trim());
      formData.append("division", division);

      const token = await getToken("access_token");
      const response = await fetch(
        `https://api.cloudwavproduction.com/api/albums/${album.id}/songs`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          const errorText = await response.text();
          errorData = { message: errorText || "Unknown error occurred" };
        }
        throw new Error(JSON.stringify(errorData));
      }

      const contentType = response.headers.get("content-type");

      let result;
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const textResponse = await response.text();
        result = { success: true, message: "Song added successfully" };
      }

      Toast.show({
        type: "success",
        text1: "Song Added Successfully",
        text2: `${songTitle.trim()} has been added to the album`,
      });

      // Reset form
      setSelectedFile(null);
      setSelectedCoverImage(null);
      setSongTitle("");
      setDivision("");

      // Call callback if provided
      if (onSongAdded) {
        onSongAdded();
      }

      onClose();
    } catch (error: any) {
      console.error("Error type:", typeof error);
      console.error("Error message:", error?.message);

      let errorMessage = "Failed to add song to album. Please try again.";

      if (error?.message) {
        try {
          const errorData = JSON.parse(error.message);
          errorMessage = errorData.message || errorData.error || error.message;
        } catch {
          errorMessage = error.message;
        }
      }

      Toast.show({
        type: "error",
        text1: "Upload Failed",
        text2: errorMessage,
      });
    } finally {
      setIsAddingSong(false);
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
    if (isLoading || isAddingSong) {
      Toast.show({
        type: "info",
        text1: "Upload in Progress",
        text2: "Please wait for the upload to complete",
      });
      return;
    }

    setSelectedFile(null);
    setSelectedCoverImage(null);
    setSongTitle("");
    setDivision("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/40 justify-center items-center px-4">
        <View className="bg-white rounded-2xl w-full h-[90%] overflow-y-auto">
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
              Add Song to &quot;{album.title}&quot;
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
                  <TouchableOpacity onPress={handleDeleteAlbum} className="p-2">
                    <Ionicons name="trash" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Audio File Selection */}
              <View>
                <Text
                  style={{
                    color: "#374151",
                    fontSize: 16,
                    marginBottom: 12,
                    textAlign: isRTL ? "right" : "left",
                    fontFamily: AppFonts.semibold,
                  }}
                >
                  Audio File *
                </Text>

                <TouchableOpacity
                  onPress={pickAudioFile}
                  style={{
                    borderWidth: 2,
                    borderStyle: "dashed",
                    borderColor: "#8B5CF6",
                    borderRadius: 12,
                    padding: 24,
                    alignItems: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  }}
                >
                  {selectedFile ? (
                    <View style={{ alignItems: "center" }}>
                      <View
                        style={{
                          backgroundColor: "rgba(16, 185, 129, 0.2)",
                          padding: 12,
                          borderRadius: 50,
                          marginBottom: 12,
                        }}
                      >
                        <Ionicons
                          name="musical-notes"
                          size={32}
                          color="#10B981"
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#10B981",
                          fontFamily: AppFonts.semibold,
                          textAlign: isRTL ? "right" : "left",
                        }}
                      >
                        {selectedFile.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#6B7280",
                          marginTop: 4,
                          fontFamily: AppFonts.medium,
                        }}
                      >
                        Tap to change file
                      </Text>
                    </View>
                  ) : (
                    <View style={{ alignItems: "center" }}>
                      <Ionicons
                        name="cloud-upload-outline"
                        size={48}
                        color="#8B5CF6"
                      />
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#8B5CF6",
                          marginTop: 12,
                          fontFamily: AppFonts.semibold,
                          textAlign: isRTL ? "right" : "left",
                        }}
                      >
                        Tap to select audio file
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#6B7280",
                          marginTop: 8,
                          fontFamily: AppFonts.medium,
                          textAlign: isRTL ? "right" : "left",
                        }}
                      >
                        Supported: MP3, WAV, OGG
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* Song Title */}
              <View>
                <Text
                  style={{
                    color: "#374151",
                    fontSize: 16,
                    marginBottom: 8,
                    textAlign: isRTL ? "right" : "left",
                    fontFamily: AppFonts.semibold,
                  }}
                >
                  Song Title *
                </Text>
                <TextInput
                  placeholder="Enter song title"
                  value={songTitle}
                  onChangeText={setSongTitle}
                  style={{
                    backgroundColor: "#F9FAFB",
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    fontSize: 16,
                    color: "#1F2937",
                    textAlign: isRTL ? "right" : "left",
                    fontFamily: AppFonts.medium,
                  }}
                  placeholderTextColor="#6B7280"
                />
              </View>

              {/* Division/Genre */}
              <View>
                <Text
                  style={{
                    color: "#374151",
                    fontSize: 16,
                    marginBottom: 8,
                    textAlign: isRTL ? "right" : "left",
                    fontFamily: AppFonts.semibold,
                  }}
                >
                  Genre/Division *
                </Text>
                <View
                  style={{
                    backgroundColor: "#F9FAFB",
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    borderRadius: 8,
                  }}
                >
                  <Picker
                    selectedValue={division}
                    onValueChange={setDivision}
                    style={{
                      color: "#1F2937",
                      fontFamily: AppFonts.medium,
                    }}
                  >
                    <Picker.Item label="Select Genre" value="" />
                    {GENRES.map((genre) => (
                      <Picker.Item key={genre} label={genre} value={genre} />
                    ))}
                  </Picker>
                </View>
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
                    {selectedCoverImage
                      ? "Cover image selected"
                      : "Choose Cover Image"}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleAddSongToAlbum}
                disabled={
                  !selectedFile ||
                  !songTitle.trim() ||
                  !division ||
                  isLoading ||
                  isAddingSong
                }
                style={{
                  paddingVertical: 16,
                  borderRadius: 25,
                  backgroundColor:
                    selectedFile &&
                    songTitle.trim() &&
                    division &&
                    !isLoading &&
                    !isAddingSong
                      ? "#2563EB"
                      : "#D1D5DB",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 16,
                  marginBottom: 22,
                }}
              >
                {isLoading || isAddingSong ? (
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

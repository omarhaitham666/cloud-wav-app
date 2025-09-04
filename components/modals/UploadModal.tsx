import { AppFonts } from "@/utils/fonts";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

const { width, height } = Dimensions.get("window");

const songSchema = z.object({
  title: z.string().min(1, "Song title is required"),
  artist: z.string().min(1, "Artist name is required"),
  genre: z.string().optional(),
  duration: z.string().optional(),
});

const albumSchema = z.object({
  title: z.string().min(1, "Album title is required"),
  artist: z.string().min(1, "Artist name is required"),
  genre: z.string().optional(),
  releaseYear: z.string().optional(),
});

export type SongFormData = z.infer<typeof songSchema>;
export type AlbumFormData = z.infer<typeof albumSchema>;

type UploadType = "choose" | "song" | "album";

type Props = {
  visible: boolean;
  artist_id?: number;
  onClose: () => void;
  onSongUpload?: (
    data: SongFormData,
    file: any,
    artwork?: any
  ) => Promise<void>;
  onAlbumUpload?: (data: AlbumFormData, coverImage: any) => Promise<void>;
};

const UploadModal: React.FC<Props> = ({
  visible,
  onClose,
  artist_id,
  onSongUpload,
  onAlbumUpload,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [uploadType, setUploadType] = useState<UploadType>("choose");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [coverImage, setCoverImage] = useState<any>(null);
  const [songArtwork, setSongArtwork] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control: songControl,
    handleSubmit: handleSongSubmit,
    formState: { errors: songErrors },
    reset: resetSongForm,
  } = useForm<SongFormData>({
    resolver: zodResolver(songSchema),
    defaultValues: {
      title: "",
      artist: "",
      genre: "",
      duration: "",
    },
  });

  const {
    control: albumControl,
    handleSubmit: handleAlbumSubmit,
    formState: { errors: albumErrors },
    reset: resetAlbumForm,
  } = useForm<AlbumFormData>({
    resolver: zodResolver(albumSchema),
    defaultValues: {
      title: "",
      artist: "",
      genre: "",
      releaseYear: "",
    },
  });

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "We need access to your media library to upload files."
        );
      }
    }
  };

  const pickAudioFile = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        const isAudio = /\.(mp3|wav|aac|m4a|flac)$/i.test(asset.fileName || "");
        if (!isAudio) {
          Toast.show({
            type: "error",
            text1: "Invalid File Type",
            text2: "Please select an audio file (mp3, wav, aac, m4a, flac)",
          });
          return;
        }
        setSelectedFile(asset);
        Toast.show({
          type: "success",
          text1: "File Selected",
          text2: asset.fileName || "Audio file selected successfully",
        });
      }
    } catch (error) {
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
      });

      if (!result.canceled && result.assets?.[0]) {
        setCoverImage(result.assets[0]);
        Toast.show({
          type: "success",
          text1: "Cover Image Selected",
          text2: "Album cover uploaded successfully",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Selection Failed",
        text2: "Unable to select cover image. Please try again.",
      });
    }
  };

  const pickSongArtwork = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]) {
        setSongArtwork(result.assets[0]);
        Toast.show({
          type: "success",
          text1: "Artwork Selected",
          text2: "Song artwork uploaded successfully",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Selection Failed",
        text2: "Unable to select artwork. Please try again.",
      });
    }
  };

  const handleSongUpload = async (data: SongFormData) => {
    if (!selectedFile) {
      Toast.show({
        type: "error",
        text1: "No File Selected",
        text2: "Please select an audio file first",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (onSongUpload) {
        await onSongUpload(data, selectedFile, songArtwork);
        Toast.show({
          type: "success",
          text1: "Song Uploaded",
          text2: "Your song has been uploaded successfully",
        });
        handleClose();
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Upload Failed",
        text2: error?.message || "Failed to upload song. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlbumSubmitForm = async (data: AlbumFormData) => {
    if (!coverImage) {
      Toast.show({
        type: "error",
        text1: "No Cover Image",
        text2: "Please select a cover image for the album",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (onAlbumUpload) {
        await onAlbumUpload(data, coverImage);
        Toast.show({
          type: "success",
          text1: "Album Created",
          text2: "Your album has been created successfully",
        });
        handleClose();
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Upload Failed",
        text2: error?.message || "Failed to create album. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setUploadType("choose");
    setSelectedFile(null);
    setCoverImage(null);
    setSongArtwork(null);
    setIsLoading(false);
    resetSongForm();
    resetAlbumForm();
    onClose();
  };

  const renderChooseType = () => (
    <View className="flex-1 gap-4  justify-center">
      <Text
        className="text-2xl text-white  mx-auto text-center mb-8"
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

  const renderSongUpload = () => (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View className="space-y-6">
        <Text
          className="text-xl text-white text-center"
          style={{
            fontFamily: AppFonts.bold,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {t("upload.songUpload.title") || "Upload Your Song"}
        </Text>

        <View>
          <Text
            className="text-gray-300 mb-3"
            style={{
              fontFamily: AppFonts.medium,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            Song Artwork (Optional)
          </Text>
          <TouchableOpacity
            onPress={pickSongArtwork}
            className="border-2 border-dashed border-purple-400/50 rounded-xl p-6 items-center bg-white/5"
          >
            {songArtwork ? (
              <View className="items-center">
                <Image
                  source={{ uri: songArtwork.uri }}
                  className="w-24 h-24 rounded-xl mb-3"
                  resizeMode="cover"
                />
                <Text
                  className="text-purple-400 text-sm"
                  style={{
                    fontFamily: AppFonts.medium,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  Artwork selected
                </Text>
                <Text className="text-gray-400 text-xs mt-1">
                  Tap to change artwork
                </Text>
              </View>
            ) : (
              <View className="items-center">
                <Ionicons name="image-outline" size={40} color="#8B5CF6" />
                <Text
                  className="text-purple-400 text-base mt-3"
                  style={{
                    fontFamily: AppFonts.medium,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  Select Song Artwork
                </Text>
                <Text
                  className="text-gray-400 text-xs mt-2 text-center"
                  style={{
                    fontFamily: AppFonts.medium,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  Optional: 1:1 aspect ratio recommended
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View>
          <Text
            className="text-gray-300 mb-3"
            style={{
              fontFamily: AppFonts.medium,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            Audio File *
          </Text>
          <TouchableOpacity
            onPress={pickAudioFile}
            className="border-2 border-dashed border-purple-400/50 rounded-xl p-6 items-center bg-white/5"
          >
            {selectedFile ? (
              <View className="items-center">
                <View className="bg-green-500/20 p-3 rounded-full mb-3">
                  <Ionicons name="musical-notes" size={32} color="#10B981" />
                </View>
                <Text
                  className="text-green-400 text-sm text-center"
                  style={{
                    fontFamily: AppFonts.medium,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {selectedFile.fileName || "Audio file selected"}
                </Text>
                <Text className="text-gray-400 text-xs mt-1">
                  Tap to change file
                </Text>
              </View>
            ) : (
              <View className="items-center">
                <Ionicons
                  name="cloud-upload-outline"
                  size={48}
                  color="#8B5CF6"
                />
                <Text
                  className="text-purple-400 text-base mt-3 text-center"
                  style={{
                    fontFamily: AppFonts.medium,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("upload.songUpload.browseText") ||
                    "Tap to select audio file"}
                </Text>
                <Text
                  className="text-gray-400 text-xs mt-2 text-center"
                  style={{
                    fontFamily: AppFonts.medium,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  Supported: MP3, WAV, AAC, M4A, FLAC
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View>
          <Text
            className="text-gray-300 mb-2"
            style={{
              fontFamily: AppFonts.medium,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            Song Title *
          </Text>
          <Controller
            control={songControl}
            name="title"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Enter song title"
                value={value}
                onChangeText={onChange}
                className="bg-white/5 text-white rounded-xl px-4 py-4 text-base border border-white/10"
                placeholderTextColor="#6B7280"
                style={{
                  textAlign: isRTL ? "right" : "left",
                  fontFamily: AppFonts.medium,
                }}
              />
            )}
          />
          {songErrors.title && (
            <Text
              className="text-red-400 text-sm mt-1"
              style={{
                textAlign: isRTL ? "right" : "left",
                fontFamily: AppFonts.medium,
              }}
            >
              {songErrors.title?.message}
            </Text>
          )}
        </View>

        <View>
          <Text
            className="text-gray-300 mb-2"
            style={{
              fontFamily: AppFonts.medium,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            Artist Name *
          </Text>
          <Controller
            control={songControl}
            name="artist"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Enter artist name"
                value={value}
                onChangeText={onChange}
                className="bg-white/5 text-white rounded-xl px-4 py-4 text-base border border-white/10"
                placeholderTextColor="#6B7280"
                style={{
                  textAlign: isRTL ? "right" : "left",
                  fontFamily: AppFonts.medium,
                }}
              />
            )}
          />
          {songErrors.artist && (
            <Text
              className="text-red-400 text-sm mt-1"
              style={{
                textAlign: isRTL ? "right" : "left",
                fontFamily: AppFonts.medium,
              }}
            >
              {songErrors.artist?.message}
            </Text>
          )}
        </View>

        <View>
          <Text
            className="text-gray-300 mb-2"
            style={{
              fontFamily: AppFonts.medium,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            Genre (Optional)
          </Text>
          <Controller
            control={songControl}
            name="genre"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="e.g., Pop, Rock, Jazz"
                value={value}
                onChangeText={onChange}
                className="bg-white/5 text-white rounded-xl px-4 py-4 text-base border border-white/10"
                placeholderTextColor="#6B7280"
                style={{
                  textAlign: isRTL ? "right" : "left",
                  fontFamily: AppFonts.medium,
                }}
              />
            )}
          />
        </View>

        <TouchableOpacity
          onPress={handleSongSubmit(handleSongUpload)}
          disabled={!selectedFile || isLoading}
          activeOpacity={0.8}
          className="mt-6 mb-10"
        >
          <LinearGradient
            colors={
              selectedFile && !isLoading
                ? ["#3B82F6", "#1D4ED8"]
                : ["#6B7280", "#4B5563"]
            }
            className="py-4 rounded-xl items-center"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <View className="flex-row items-center">
                <Ionicons name="cloud-upload" size={20} color="white" />
                <Text
                  className="text-white text-lg ml-2"
                  style={{ fontFamily: AppFonts.bold }}
                >
                  {t("upload.songUpload.uploadButton") || "Upload Song"}
                </Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderAlbumUpload = () => (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View className="space-y-6">
        <Text
          className="text-xl text-white text-center"
          style={{
            fontFamily: AppFonts.bold,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {t("upload.albumUpload.title") || "Create New Album"}
        </Text>

        <View>
          <Text
            className="text-gray-300 mb-3"
            style={{
              fontFamily: AppFonts.medium,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            Album Cover *
          </Text>
          <TouchableOpacity
            onPress={pickCoverImage}
            className="border-2 border-dashed border-green-400/50 rounded-xl p-6 items-center bg-white/5"
          >
            {coverImage ? (
              <View className="items-center">
                <Image
                  source={{ uri: coverImage.uri }}
                  className="w-24 h-24 rounded-xl mb-3"
                  resizeMode="cover"
                />
                <Text
                  className="text-green-400 text-sm"
                  style={{
                    fontFamily: AppFonts.medium,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  Cover image selected
                </Text>
                <Text className="text-gray-400 text-xs mt-1">
                  Tap to change image
                </Text>
              </View>
            ) : (
              <View className="items-center">
                <Ionicons name="image-outline" size={48} color="#10B981" />
                <Text
                  className="text-green-400 text-base mt-3"
                  style={{
                    fontFamily: AppFonts.medium,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("upload.albumUpload.chooseFile") || "Select Album Cover"}
                </Text>
                <Text
                  className="text-gray-400 text-xs mt-2"
                  style={{
                    fontFamily: AppFonts.medium,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  Recommended: 1:1 aspect ratio, min 500x500px
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View>
          <Text
            className="text-gray-300 mb-2"
            style={{
              fontFamily: AppFonts.medium,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            Album Title *
          </Text>
          <Controller
            control={albumControl}
            name="title"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder={
                  t("upload.albumUpload.albumTitlePlaceholder") ||
                  "Enter album title"
                }
                value={value}
                onChangeText={onChange}
                className="bg-white/5 text-white rounded-xl px-4 py-4 text-base border border-white/10"
                placeholderTextColor="#6B7280"
                style={{
                  textAlign: isRTL ? "right" : "left",
                  fontFamily: AppFonts.medium,
                }}
              />
            )}
          />
          {albumErrors.title && (
            <Text
              className="text-red-400 text-sm mt-1"
              style={{
                textAlign: isRTL ? "right" : "left",
                fontFamily: AppFonts.medium,
              }}
            >
              {albumErrors.title?.message}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleAlbumSubmit(handleAlbumSubmitForm)}
          disabled={!coverImage || isLoading}
          activeOpacity={0.8}
          className="mt-6 mb-10"
        >
          <LinearGradient
            colors={
              coverImage && !isLoading
                ? ["#10B981", "#059669"]
                : ["#6B7280", "#4B5563"]
            }
            className="py-4 rounded-xl items-center"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <View className="flex-row items-center">
                <Ionicons name="albums" size={20} color="white" />
                <Text
                  className="text-white text-lg ml-2"
                  style={{ fontFamily: AppFonts.bold }}
                >
                  {t("upload.submit") || "Create Album"}
                </Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderContent = () => {
    switch (uploadType) {
      case "song":
        return renderSongUpload();
      case "album":
        return renderAlbumUpload();
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

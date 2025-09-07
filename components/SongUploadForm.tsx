import { useUploadSongMutation } from "@/store/api/global/song";
import { AppFonts } from "@/utils/fonts";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

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

const songSchema = z.object({
  title: z.string().min(1, "Song title is required"),
  artist: z.string().min(1, "Artist name is required"),
  genre: z.string().optional(),
  duration: z.string().optional(),
  caption: z.string().optional(),
});

export type SongFormData = z.infer<typeof songSchema>;

type Props = {
  isRTL: boolean;
};

const SongUploadForm: React.FC<Props> = ({ isRTL }) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [songArtwork, setSongArtwork] = useState<any>(null);
  const [uploadSong, { isLoading: isUploadSong }] = useUploadSongMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SongFormData>({
    resolver: zodResolver(songSchema),
    defaultValues: {
      title: "",
      artist: "",
      genre: "",
      duration: "",
      caption: "",
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
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "audio/mpeg",
          "audio/wav",
          "audio/aac",
          "audio/mp4",
          "audio/x-flac",
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled === false) {
        const asset = {
          uri: result.assets[0].uri,
          fileName: result.assets[0].name,
          mimeType: result.assets[0].mimeType || "audio/mpeg",
        };
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

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("artist", data.artist);
      formData.append("genre", data.genre || "");
      formData.append("caption", data.caption || "");
      formData.append("duration", data.duration || "");

      formData.append("song_path", {
        uri: selectedFile.uri,
        type: selectedFile.mimeType,
        name: selectedFile.fileName || "song.mp3",
      } as any);

      if (songArtwork) {
        formData.append("cover_path", {
          uri: songArtwork.uri,
          type: songArtwork.mimeType || "image/jpeg",
          name: songArtwork.fileName || "cover.jpg",
        } as any);
      }

      await uploadSong(formData as any).unwrap();

      Toast.show({
        type: "success",
        text1: "Song Uploaded",
        text2: "Your song has been uploaded successfully",
      });

      reset();
      setSelectedFile(null);
      setSongArtwork(null);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Upload Failed",
        text2:
          error?.data?.message ||
          error?.message ||
          "Failed to upload song. Please try again.",
      });
    }
  };

  return (
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
            control={control}
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
          {errors.title && (
            <Text
              className="text-red-400 text-sm mt-1"
              style={{
                textAlign: isRTL ? "right" : "left",
                fontFamily: AppFonts.medium,
              }}
            >
              {errors.title.message}
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
            control={control}
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
          {errors.artist && (
            <Text
              className="text-red-400 text-sm mt-1"
              style={{
                textAlign: isRTL ? "right" : "left",
                fontFamily: AppFonts.medium,
              }}
            >
              {errors.artist.message}
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
            control={control}
            name="genre"
            render={({ field: { onChange, value } }) => (
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={{
                  color: "white",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.1)",
                  borderRadius: 12,
                }}
              >
                <Picker.Item label="Select Genre" value="" />
                {GENRES.map((genre) => (
                  <Picker.Item key={genre} label={genre} value={genre} />
                ))}
              </Picker>
            )}
          />
        </View>

        <View>
          <Text
            className="text-gray-300 mb-2"
            style={{
              fontFamily: AppFonts.medium,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            Caption (Optional)
          </Text>
          <Controller
            control={control}
            name="caption"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Enter song caption"
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
          onPress={handleSubmit(handleSongUpload)}
          disabled={!selectedFile || isUploadSong}
          activeOpacity={0.8}
          className="mt-6 mb-10"
        >
          <LinearGradient
            colors={
              selectedFile && !isUploadSong
                ? ["#3B82F6", "#1D4ED8"]
                : ["#6B7280", "#4B5563"]
            }
            className="py-4 rounded-xl items-center"
          >
            {isUploadSong ? (
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
};

export default SongUploadForm;

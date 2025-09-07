import { useUploadSongMutation } from "@/store/api/global/song";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, "Song title is required"),
  artist: z.string().min(1, "Artist name is required"),
  genre: z.string().optional(),
});

type SongFormData = z.infer<typeof schema>;

const SongUploadForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [file, setFile] = useState<any>(null);
  const [artwork, setArtwork] = useState<any>(null);
  const [uploadSong, { isLoading }] = useUploadSongMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SongFormData>({
    resolver: zodResolver(schema),
  });

  const pickFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: "audio/*" });
    if (!res.canceled) setFile(res.assets[0]);
  };

  const pickArtwork = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!res.canceled) setArtwork(res.assets[0]);
  };

  const onSubmit = async (data: SongFormData) => {
    if (!file) {
      Toast.show({ type: "error", text1: "No file selected" });
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("song_path", {
      uri: file.uri,
      name: file.name,
      type: file.mimeType,
    } as any);
    if (artwork) {
      formData.append("cover_path", {
        uri: artwork.uri,
        name: "cover.jpg",
        type: "image/jpeg",
      } as any);
    }

    try {
      await uploadSong(formData as any).unwrap();
      Toast.show({ type: "success", text1: "Song uploaded!" });
      reset();
      setFile(null);
      setArtwork(null);
      onSuccess();
    } catch (e: any) {
      Toast.show({ type: "error", text1: "Upload failed", text2: e.message });
    }
  };

  return (
    <ScrollView>
      <TouchableOpacity onPress={pickArtwork} className="mb-4 items-center">
        {artwork ? (
          <Image
            source={{ uri: artwork.uri }}
            className="w-24 h-24 rounded-xl"
          />
        ) : (
          <Ionicons name="image-outline" size={40} color="white" />
        )}
        <Text className="text-white mt-2">Select Artwork</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={pickFile} className="mb-4 items-center">
        {file ? (
          <Text className="text-green-400">{file.name}</Text>
        ) : (
          <Ionicons name="musical-notes" size={40} color="white" />
        )}
        <Text className="text-white mt-2">Select Audio File</Text>
      </TouchableOpacity>

      <Controller
        control={control}
        name="title"
        render={({ field: { value, onChange } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Song Title"
            className="bg-white/10 text-white px-4 py-2 rounded-xl mb-2"
          />
        )}
      />
      {errors.title && (
        <Text className="text-red-400">{errors.title.message}</Text>
      )}

      <Controller
        control={control}
        name="artist"
        render={({ field: { value, onChange } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Artist"
            className="bg-white/10 text-white px-4 py-2 rounded-xl mb-2"
          />
        )}
      />
      {errors.artist && (
        <Text className="text-red-400">{errors.artist.message}</Text>
      )}

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
        className="mt-6"
      >
        <LinearGradient
          colors={["#3B82F6", "#1D4ED8"]}
          className="py-3 rounded-xl items-center"
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white">Upload Song</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SongUploadForm;

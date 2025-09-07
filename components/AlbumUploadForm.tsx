import { useAddAlbumMutation } from "@/store/api/global/albums";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
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
import GenreSelect from "./GenreSelect";

const schema = z.object({
  title: z.string().min(1, "Album title is required"),
  genre: z.string().optional(),
});

type AlbumFormData = z.infer<typeof schema>;

const AlbumUploadForm: React.FC<{ onSuccess: () => void }> = ({
  onSuccess,
}) => {
  const [cover, setCover] = useState<any>(null);
  const [addAlbum, { isLoading }] = useAddAlbumMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AlbumFormData>({
    resolver: zodResolver(schema),
  });

  const pickCover = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!res.canceled) setCover(res.assets[0]);
  };

  const onSubmit = async (data: AlbumFormData) => {
    if (!cover) {
      Toast.show({ type: "error", text1: "Cover image required" });
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    if (data.genre) formData.append("genre", data.genre);
    formData.append("album_cover", {
      uri: cover.uri,
      name: "cover.jpg",
      type: "image/jpeg",
    } as any);

    try {
      await addAlbum(formData as any).unwrap();
      Toast.show({ type: "success", text1: "Album created!" });
      reset();
      setCover(null);
      onSuccess();
    } catch (e: any) {
      Toast.show({ type: "error", text1: "Creation failed", text2: e.message });
    }
  };

  return (
    <ScrollView>
      <TouchableOpacity onPress={pickCover} className="mb-4 items-center">
        {cover ? (
          <Image source={{ uri: cover.uri }} className="w-28 h-28 rounded-xl" />
        ) : (
          <Ionicons name="image-outline" size={40} color="white" />
        )}
        <Text className="text-white mt-2">Select Album Cover</Text>
      </TouchableOpacity>

      <Controller
        control={control}
        name="title"
        render={({ field: { value, onChange } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Album Title"
            className="bg-white/10 text-white px-4 py-2 rounded-xl mb-2"
          />
        )}
      />
      {errors.title && (
        <Text className="text-red-400">{errors.title.message}</Text>
      )}

      <Controller
        control={control}
        name="genre"
        render={({ field: { value, onChange } }) => (
          <GenreSelect value={value} onChange={onChange} />
        )}
      />

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
        className="mt-6"
      >
        <LinearGradient
          colors={["#10B981", "#059669"]}
          className="py-3 rounded-xl items-center"
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white">Create Album</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AlbumUploadForm;

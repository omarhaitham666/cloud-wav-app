import { Songs } from "@/store/api/global/song";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export const SongCard = ({
  id,
  title,
  artist,
  cover_url,
  audio_url,
}: Songs) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      className="bg-white p-4 rounded-lg flex-row mb-6"
      onPress={() => {
        router.push({ pathname: "/(drawer)/song/[id]", params: { id } });
      }}
    >
      <Image
        source={{ uri: cover_url }}
        className="w-20 h-20 rounded-md mr-4"
      />
      <View className="flex-1 mt-3">
        <Text className="font-semibold text-lg">{title}</Text>
        <Text className="text-sm text-gray-600">{artist}</Text>
      </View>
    </TouchableOpacity>
  );
};

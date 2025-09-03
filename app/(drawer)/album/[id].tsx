import { SongCard } from "@/components/cards/SongCard";
import { useGetalbumQuery } from "@/store/api/global/albums";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AlbumDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useGetalbumQuery(id);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#374151" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        ListHeaderComponent={
          <View className="items-center w-full mb-7 px-6 pt-12 pb-8 bg-white">
            <View className="flex-row w-full justify-between items-center mb-8">
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-10 h-10 rounded-full bg-black/30 justify-center items-center"
              >
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity className="w-10 h-10 rounded-full bg-black/30 justify-center items-center">
                <Ionicons name="ellipsis-horizontal" size={22} color="#fff" />
              </TouchableOpacity>
            </View>

            <Image
              source={{ uri: data?.album.album_cover }}
              className="w-48 h-48 rounded-2xl mb-6 shadow-sm"
            />
            <Text className="text-gray-900 text-3xl font-semibold mb-2 text-center">
              {data?.album.title}
            </Text>
            <Text className="text-gray-600 text-lg">
              {data?.album.artist.name}
            </Text>
          </View>
        }
        data={data?.songs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="mx-4 mb-2">
            <SongCard
              id={item.id}
              key={item.id}
              title={item.title}
              artist={item.artist}
              audio_url={item.song_url || ""}
              cover_url={item.cover_image || ""}
              debug_path={item.debug_path}
            />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

import { SongCard } from "@/components/SongCard";
import { useGetArtistQuery } from "@/store/api/global/artists";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";

import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ArtistProfile = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: artistData, isLoading: isFetching } = useGetArtistQuery(id);

  const openEmail = () => Linking.openURL(`mailto:${artistData?.email}`);
  const openCall = () => Linking.openURL(`tel:${artistData?.number}`);
  const openWhatsApp = () =>
    Linking.openURL(
      `whatsapp://send?phone=${artistData?.whatsapp_number}`
    ).catch(() =>
      Linking.openURL(`https://wa.me/${artistData?.whatsapp_number}`)
    );

  if (isFetching) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#f9a826" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={["#4f46e5", "#6d28d9"]}
        className="pt-12 pb-10 px-5"
      >
        <StatusBar barStyle="light-content" />

        <View className="flex-row justify-between items-center mb-8">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 justify-center items-center"
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-white/20 justify-center items-center">
            <Ionicons name="ellipsis-horizontal" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View className="items-center mb-6">
          <View className="relative mb-4">
            <Image
              source={{ uri: artistData?.profile_image }}
              className="w-36 h-36 rounded-full border-4 border-white"
              style={{ resizeMode: "cover" }}
            />
            <View className="absolute bottom-2 right-1 w-8 h-8 rounded-full bg-green-500 justify-center items-center border-2 border-white shadow-lg">
              <Ionicons name="checkmark" size={18} color="#fff" />
            </View>
          </View>

          <Text className="text-2xl font-bold text-white mb-1 text-center">
            {artistData?.name}
          </Text>
          <Text className="text-sm text-white/90">{artistData?.division}</Text>
        </View>
      </LinearGradient>

      <View className="px-5  ">
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">All Songs</Text>
            <TouchableOpacity>
              <Text className="text-sm text-indigo-600 font-semibold">
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={artistData?.songs}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <SongCard
                id={item.id}
                key={item.id}
                title={item.title}
                artist={item.title}
                audio_url={item.song_path}
                cover_url={item.cover_path}
              />
            )}
          />
        </View>
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">All Albums</Text>
            <TouchableOpacity>
              <Text className="text-sm text-indigo-600 font-semibold">
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={artistData?.albums}
            // keyExtractor={(item) => item.id.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) =>
              //   <SongCard
              //     id={item.id}
              //     key={item.id}
              //     title={item.title}
              //     artist={item.title}
              //     audio_url={item.song_path}
              //     cover_url={item.cover_path}
              //   />
              null
            }
          />
        </View>
        <View className="h-20" />
      </View>
    </ScrollView>
  );
};

export default ArtistProfile;

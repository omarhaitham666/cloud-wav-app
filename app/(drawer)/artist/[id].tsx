import AlbumCard from "@/components/cards/AlbumCard";
import { SongCard } from "@/components/cards/SongCard";
import UploadModal from "@/components/modals/UploadModal";
import { Albums } from "@/store/api/global/albums";
import { useGetArtistQuery } from "@/store/api/global/artists";
import { AppFonts } from "@/utils/fonts";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useGetUserQuery } from "@/store/api/user/user";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ArtistProfile = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: artistData, isLoading: isFetching } = useGetArtistQuery(id);
  const { data: user } = useGetUserQuery();
  const [UploadSong, setUploadSong] = useState(false);

  // Check if the current user is the owner of this artist profile
  const isOwner = user && user.artist_id === Number(id);

  if (isFetching) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#f9a826" />
      </View>
    );
  }

  const renderSong = ({ item }: any) => (
    <View className="flex-1 m-2">
      <SongCard
        id={item.id}
        title={item.title}
        artist={(artistData?.name as string) || ""}
        audio_url={item.song_path}
        cover_url={item.cover_path}
        isOwner={isOwner || false}
      />
    </View>
  );

  return (
    <FlatList
      data={
        artistData?.songs && artistData.songs.length > 0 ? artistData.songs : []
      }
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      contentContainerStyle={{ paddingBottom: 40 }}
      renderItem={renderSong}
      ListHeaderComponent={
        <>
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
              <Text className="text-sm text-white/90">
                {artistData?.division}
              </Text>
            </View>
            {isOwner && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setUploadSong(true)}
                className="border border-white/20 h-12 rounded-xl justify-center items-center"
              >
                <View className="flex-row items-center">
                  <Ionicons name="add-circle" size={18} color="white" />
                  <Text
                    className="text-white text-base ml-2"
                    style={{ fontFamily: AppFonts.medium }}
                  >
                    Upload Song
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </LinearGradient>

          <View className="px-5 mt-6 mb-4">
            <Text className="text-xl font-bold text-gray-800">All Songs</Text>
            {(!artistData?.songs || artistData.songs.length === 0) && (
              <View className="flex items-center justify-center py-12">
                <Ionicons
                  name="musical-notes-outline"
                  size={64}
                  color="#9CA3AF"
                />
                <Text className="text-gray-500 text-lg mt-4 font-semibold">
                  No Songs Yet
                </Text>
                <Text className="text-gray-400 text-sm mt-2 text-center">
                  {isOwner
                    ? "Upload your first song to get started"
                    : "This artist hasn't uploaded any songs yet"}
                </Text>
              </View>
            )}
          </View>
        </>
      }
      ListFooterComponent={
        <>
          <View className="px-5 mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">
                All Albums
              </Text>
            </View>

            {!artistData?.albums || artistData.albums.length === 0 ? (
              <View className="flex items-center justify-center py-12">
                <Ionicons name="albums-outline" size={64} color="#9CA3AF" />
                <Text className="text-gray-500 text-lg mt-4 font-semibold">
                  No Albums Yet
                </Text>
                <Text className="text-gray-400 text-sm mt-2 text-center">
                  {isOwner
                    ? "Create your first album to organize your music"
                    : "This artist hasn't created any albums yet"}
                </Text>
              </View>
            ) : (
              <FlatList
                data={(artistData?.albums as Albums[]) || []}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: 10,
                }}
                renderItem={({ item }) => (
                  <AlbumCard
                    id={item.id}
                    title={(artistData?.name as string) || ""}
                    imageUrl={item.album_cover}
                  />
                )}
              />
            )}
          </View>
          <UploadModal
            visible={UploadSong}
            onClose={() => setUploadSong(false)}
            artist_id={Number(id)}
          />
        </>
      }
    />
  );
};

export default ArtistProfile;

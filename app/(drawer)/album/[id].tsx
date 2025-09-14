import { SongCard } from "@/components/cards/SongCard";
import AddSongToAlbumModal from "@/components/modals/AddSongToAlbumModal";
import {
  useDelteAlbumMutation,
  useGetalbumQuery,
} from "@/store/api/global/albums";
import { useGetUserQuery } from "@/store/api/user/user";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function AlbumDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, refetch } = useGetalbumQuery(id);
  const { data: user } = useGetUserQuery();
  const [deleteAlbum, { isLoading: isDeleting }] = useDelteAlbumMutation();
  const [isAddingSong] = useState(false);
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isOwner = user && user.artist_id === data?.album.artist.id;

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
          onPress: async () => {
            try {
              await deleteAlbum(id).unwrap();
              Toast.show({
                type: "success",
                text1: "Album Deleted",
                text2: "The album has been deleted successfully",
              });
              router.back();
            } catch {
              Toast.show({
                type: "error",
                text1: "Delete Failed",
                text2: "Failed to delete the album. Please try again.",
              });
            }
          },
        },
      ]
    );
  };

  const handleDeleteAlbumFromModal = async (albumId: string) => {
    try {
      await deleteAlbum(albumId).unwrap();
      Toast.show({
        type: "success",
        text1: "Album Deleted",
        text2: "The album has been deleted successfully",
      });
      router.back();
    } catch {
      Toast.show({
        type: "error",
        text1: "Delete Failed",
        text2: "Failed to delete the album. Please try again.",
      });
    }
  };

  const handleSongAdded = async () => {
    await refetch();
    Toast.show({
      type: "success",
      text1: "Song Added",
      text2: "The song has been added to the album successfully",
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

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
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#374151"
            colors={["#374151"]}
          />
        }
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
            <Text className="text-gray-600 text-lg mb-6">
              {data?.album.artist.name}
            </Text>

            {isOwner && (
              <View className="flex-row gap-4 w-full justify-center">
                <TouchableOpacity
                  onPress={() => setShowAddSongModal(true)}
                  className="flex-row items-center bg-blue-500 px-6 py-3 rounded-lg"
                >
                  <Ionicons name="add" size={20} color="#fff" />
                  <Text className="text-white font-semibold ml-2">
                    Add Songs
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDeleteAlbum}
                  disabled={isDeleting}
                  className="flex-row items-center bg-red-500 px-6 py-3 rounded-lg"
                >
                  <Ionicons
                    name={isDeleting ? "hourglass" : "trash"}
                    size={18}
                    color="#fff"
                  />
                  <Text className="text-white font-semibold ml-2">
                    {isDeleting ? "Deleting..." : "Delete Album"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        }
        data={data?.songs && data.songs.length > 0 ? data.songs : []}
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
              isOwner={isOwner || false}
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="flex items-center justify-center py-16 px-6">
            <Ionicons name="musical-notes-outline" size={64} color="#9CA3AF" />
            <Text className="text-gray-500 text-lg mt-4 font-semibold">
              No Songs in This Album
            </Text>
            <Text className="text-gray-400 text-sm mt-2 text-center">
              {isOwner
                ? "Add songs to this album to get started"
                : "This album doesn't have any songs yet"}
            </Text>
            {isOwner && (
              <TouchableOpacity className="mt-6 bg-blue-500 px-6 py-3 rounded-lg">
                <Text className="text-white font-semibold">Add Songs</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      />

      <AddSongToAlbumModal
        visible={showAddSongModal}
        isLoading={isAddingSong}
        onClose={() => setShowAddSongModal(false)}
        onDeleteAlbum={handleDeleteAlbumFromModal}
        onSongAdded={handleSongAdded}
        album={
          data?.album
            ? {
                id: data.album.id.toString(),
                title: data.album.title,
                coverImage: data.album.album_cover,
              }
            : { id: "", title: "", coverImage: "" }
        }
      />
    </View>
  );
}

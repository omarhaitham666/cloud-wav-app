import { SongCard } from "@/components/cards/SongCard";
import AddSongToAlbumModal from "@/components/modals/AddSongToAlbumModal";
import { useDelteAlbumMutation, useGetalbumQuery } from "@/store/api/global/albums";
import { useGetUserQuery } from "@/store/api/user/user";
import { getToken } from "@/utils/secureStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function AlbumDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useGetalbumQuery(id);
  const { data: user } = useGetUserQuery();
  const [deleteAlbum, { isLoading: isDeleting }] = useDelteAlbumMutation();
  const [isAddingSong, setIsAddingSong] = useState(false);
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  
  // Check if the current user is the owner of this album
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
          onPress: () => {
            deleteAlbum(id);
            router.back();
          },
        },
      ]
    );
  };

  const handleAddSongToAlbum = async (albumId: string, songData: { title: string; division: string; file: any; coverImage?: any }) => {
    try {
      console.log('=== DEBUG: Starting song upload ===');
      console.log('Album ID:', albumId);
      console.log('Song Data:', {
        title: songData.title,
        division: songData.division,
        file: {
          uri: songData.file.uri,
          name: songData.file.name,
          type: songData.file.type,
        },
        coverImage: songData.coverImage ? {
          uri: songData.coverImage.uri,
          fileName: songData.coverImage.fileName,
          type: songData.coverImage.type,
        } : null
      });

      setIsAddingSong(true);
      const formData = new FormData();
      
      // Add the audio file - use song_path like in SongUploadForm
      formData.append('song_path', songData.file as any);
      console.log('Added audio file to FormData as song_path:', songData.file);
      
      // Add the cover image if provided - use cover_path like in SongUploadForm
      if (songData.coverImage) {
        formData.append('cover_path', songData.coverImage as any);
        console.log('Added cover image to FormData as cover_path:', songData.coverImage);
      }
      
      // Add text fields
      formData.append('title', songData.title);
      formData.append('division', songData.division);
      formData.append('album_id', albumId);
      console.log('Added text fields - title:', songData.title, 'division:', songData.division, 'album_id:', albumId);
      
      console.log('=== DEBUG: Making direct fetch call ===');
      const token = await getToken("access_token");
      console.log('=== DEBUG: Token ===', token ? 'Token exists' : 'No token');
      console.log('=== DEBUG: URL ===', `https://api.cloudwavproduction.com/api/songs/upload`);
      
      // Try using the same endpoint as SongUploadForm but add album_id to associate with album
      const response = await fetch(
        `https://api.cloudwavproduction.com/api/songs/upload`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log('=== DEBUG: Response status ===', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log('=== DEBUG: Error response ===', errorData);
        throw new Error(JSON.stringify(errorData));
      }
      
      const result = await response.json();
      console.log('=== DEBUG: Success response ===', result);
      
      Toast.show({
        type: "success",
        text1: "Song Added Successfully",
        text2: `${songData.title} has been added to the album`,
      });
      setShowAddSongModal(false);
    } catch (error: any) {
      console.error("=== DEBUG: Error adding song to album ===", error);
      console.error("Error type:", typeof error);
      console.error("Error message:", error?.message);
      console.error("Error stack:", error?.stack);
      console.error("Full error object:", JSON.stringify(error, null, 2));
      
      let errorMessage = "Failed to add song to album. Please try again.";
      
      if (error?.message === "Network request failed") {
        errorMessage = "Network error. Please check your internet connection and try again.";
      } else if (error?.message) {
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
      // Don't close modal on error, let user try again
    } finally {
      setIsAddingSong(false);
    }
  };

  const handleDeleteAlbumFromModal = (albumId: string) => {
    deleteAlbum(albumId);
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
                  <Text className="text-white font-semibold ml-2">Add Songs</Text>
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
              {isOwner ? "Add songs to this album to get started" : "This album doesn't have any songs yet"}
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
        onAddSongToAlbum={handleAddSongToAlbum}
        onDeleteAlbum={handleDeleteAlbumFromModal}
        album={data?.album ? { 
          id: data.album.id.toString(), 
          title: data.album.title, 
          coverImage: data.album.album_cover 
        } : { id: "", title: "", coverImage: "" }}
      />
      <Toast />
    </View>
  );
}

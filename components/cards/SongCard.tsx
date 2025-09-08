import { Songs, useDeleteSongMutation } from "@/store/api/global/song";
import { AppFonts } from "@/utils/fonts";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

export const SongCard = ({ id, title, artist, cover_url, isOwner }: Songs) => {
  const router = useRouter();
  const [deleteSong, { isLoading: isDeleting }] = useDeleteSongMutation();

  const handleDelete = () => {
    Alert.alert(
      "Delete Song",
      "Are you sure you want to delete this song?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteSong(id.toString());
          },
        },
      ]
    );
  };

  return (
    <View
      style={{
        width: 140,
        marginRight: 15,
        alignItems: "center",
        position: "relative",
      }}
    >
      <TouchableOpacity
        onPress={() =>
          router.push({ pathname: "/(drawer)/song/[id]", params: { id } })
        }
        style={{
          width: 120,
          height: 120,
          borderRadius: 10,
          marginBottom: 6,
        }}
      >
        <Image
          source={{ uri: cover_url }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 10,
          }}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {isOwner && (
        <TouchableOpacity
          onPress={handleDelete}
          disabled={isDeleting}
          style={{
            position: "absolute",
            top: 5,
            right: 5,
            backgroundColor: "rgba(0,0,0,0.7)",
            borderRadius: 15,
            width: 30,
            height: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons 
            name={isDeleting ? "hourglass" : "trash"} 
            size={16} 
            color="white" 
          />
        </TouchableOpacity>
      )}

      <Text
        numberOfLines={1}
        style={{
          fontSize: 14,
          fontWeight: "600",
          textAlign: "center",
          fontFamily: AppFonts.semibold,
        }}
      >
        {title}
      </Text>

      <Text
        numberOfLines={1}
        style={{
          fontSize: 12,
          color: "#666",
          textAlign: "center",
          fontFamily: AppFonts.semibold,
        }}
      >
        {artist ?? "Unknown Artist"}
      </Text>
    </View>
  );
};

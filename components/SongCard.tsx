import { Songs } from "@/store/api/global/song";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";

export const SongCard = ({ id, title, artist, cover_url }: Songs) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({ pathname: "/(drawer)/song/[id]", params: { id } })
      }
      style={{
        width: 140,
        marginRight: 15,
        alignItems: "center",
      }}
    >
      <Image
        source={{ uri: cover_url }}
        style={{
          width: 120,
          height: 120,
          borderRadius: 10,
          marginBottom: 6,
        }}
        resizeMode="cover"
      />

      <Text
        numberOfLines={1}
        style={{
          fontSize: 14,
          fontWeight: "600",
          textAlign: "center",
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
        }}
      >
        {artist ?? "Unknown Artist"}
      </Text>
    </TouchableOpacity>
  );
};

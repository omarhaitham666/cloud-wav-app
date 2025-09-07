import EnhancedAudioPlayer from "@/components/EnhancedAudioPlayer";
import { useGetSongQuery } from "@/store/api/global/song";
import { AppFonts } from "@/utils/fonts";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert, Image,
  ImageBackground,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

const SongDetail = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [playsCount, setPlaysCount] = useState(0);
  const [audioError, setAudioError] = useState(false);

  const { data, isLoading: isFetching } = useGetSongQuery(id, {
    skip: !id,
  });

  useEffect(() => {
    if (data) {
      setIsLiked(data.isLiked || false);
      setLikesCount(data.likes_count || 0);
      setPlaysCount(data.plays || 0);
    }
  }, [data]);

  const handlePlaybackStateChange = (playing: boolean) => {
    setIsPlaying(playing);
    if (playing && playsCount === 0) {
      setPlaysCount((prev) => prev + 1);
    }
  };

  const handleAudioError = (error: string) => {
    setAudioError(true);
    Alert.alert(t('song.playbackError'), error);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  if (isFetching) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#2f00ac" />
        <Text 
          className="text-white mt-4"
          style={{ 
            fontFamily: AppFonts.semibold,
            textAlign: 'center',
            writingDirection: isRTL ? 'rtl' : 'ltr'
          }}
        >
          {t('song.loading')}
        </Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Ionicons name="musical-notes-outline" size={64} color="#666" />
        <Text 
          className="text-white text-lg mt-4"
          style={{ 
            fontFamily: AppFonts.semibold,
            textAlign: 'center',
            writingDirection: isRTL ? 'rtl' : 'ltr'
          }}
        >
          {t('song.songNotFound')}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-orange-500 px-6 py-3 rounded-full"
        >
          <Text 
            className="text-white"
            style={{ 
              fontFamily: AppFonts.semibold,
              writingDirection: isRTL ? 'rtl' : 'ltr'
            }}
          >
            {t('song.goBack')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <StatusBar barStyle="light-content" backgroundColor="black" />

      {/* cover background */}
      <View className="absolute top-0 left-0 right-0 h-1/2">
        <ImageBackground
          source={{ uri: data.cover_url }}
          style={{ flex: 1, opacity: 0.4 }}
          blurRadius={8}
        />
        <View className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70" />
      </View>

      {/* header */}
      <View className={`flex-row justify-between items-center pt-12 pb-4 px-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-black/20 rounded-full p-2"
        >
          <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={24} color="white" />
        </TouchableOpacity>

        <View className={`flex-row items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <TouchableOpacity className={`bg-black/20 rounded-full p-2 ${isRTL ? 'ml-3' : 'mr-3'}`}>
            <Ionicons name="share-outline" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-black/20 rounded-full p-2">
            <Ionicons name="ellipsis-vertical" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* content */}
      <View className="flex-1 justify-end px-6 pb-8">
        {/* song info */}
        <View className="items-center mb-8">
          <View className="relative">
            <Image
              source={{ uri: data.cover_url }}
              className="w-72 h-72 rounded-3xl shadow-2xl"
            />
            {audioError && (
              <View className="absolute inset-0 bg-black/50 rounded-3xl justify-center items-center">
                <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
              </View>
            )}
          </View>

          <Text 
            className="text-2xl text-white mt-6 text-center"
            style={{ 
              fontFamily: AppFonts.semibold,
              textAlign: 'center',
              writingDirection: isRTL ? 'rtl' : 'ltr'
            }}
          >
            {data.title}
          </Text>
          <Text 
            className="text-orange-400 text-lg mt-1 text-center"
            style={{ 
              fontFamily: AppFonts.semibold,
              textAlign: 'center',
              writingDirection: isRTL ? 'rtl' : 'ltr'
            }}
          >
            {data.artist_name}
          </Text>
          {data.division && (
            <Text 
              className="text-gray-400 text-sm mt-1 text-center"
              style={{ 
                fontFamily: AppFonts.semibold,
                textAlign: 'center',
                writingDirection: isRTL ? 'rtl' : 'ltr'
              }}
            >
              {data.division}
            </Text>
          )}

          <View className={`flex-row gap-3 items-center mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <View className={`flex-row items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Ionicons name="play-outline" size={16} color="#9CA3AF" />
              <Text 
                className={`text-gray-400 text-sm ${isRTL ? 'mr-1' : 'ml-1'}`}
                style={{ 
                  fontFamily: AppFonts.semibold,
                  writingDirection: isRTL ? 'rtl' : 'ltr'
                }}
              >
                {formatNumber(playsCount)} {t('song.plays')}
              </Text>
            </View>
            <View className={`flex-row items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Ionicons name="heart-outline" size={16} color="#9CA3AF" />
              <Text 
                className={`text-gray-400 text-sm ${isRTL ? 'mr-1' : 'ml-1'}`}
                style={{ 
                  fontFamily: AppFonts.semibold,
                  writingDirection: isRTL ? 'rtl' : 'ltr'
                }}
              >
                {formatNumber(likesCount)} {t('song.likes')}
              </Text>
            </View>
            
            {/* Action Buttons */}
            <TouchableOpacity
              onPress={handleLike}
              className="bg-white/10 rounded-full p-2"
            >
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={20}
                color={isLiked ? "#f9a826" : "white"}
              />
            </TouchableOpacity>

            <TouchableOpacity className="bg-white/10 rounded-full p-2">
              <Ionicons name="repeat" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Audio Player */}
        {data?.song_url && (
          <EnhancedAudioPlayer
            songUrl={data.song_url}
            songTitle={data.title}
            artistName={data.artist_name || data.artist}
            coverUrl={data.cover_url}
            onPlaybackStateChange={handlePlaybackStateChange}
            onError={handleAudioError}
            className="mb-8"
          />
        )}

      </View>
    </View>
  );
};

export default SongDetail;

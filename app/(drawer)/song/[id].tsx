import EnhancedAudioPlayer from "@/components/EnhancedAudioPlayer";
import { useGetSongQuery, useLikeSongMutation } from "@/store/api/global/song";
import { AppFonts } from "@/utils/fonts";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const { width: screenWidth } = Dimensions.get("window");
const isSmallDevice = screenWidth < 375;
const isLargeDevice = screenWidth > 414;

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
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [playsCount, setPlaysCount] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [playCountIncremented, setPlayCountIncremented] = useState(false);
  const [likeSong, { isLoading: isLiking }] = useLikeSongMutation();
  const {
    data,
    isLoading: isFetching,
    refetch,
    error,
  } = useGetSongQuery(id, {
    skip: !id,
  });

  useEffect(() => {
    if (data) {
      setIsLiked(data.isLiked || false);
      setLikesCount(data.likes_count || 0);
      setPlaysCount(data.plays || 0);
      setAudioError(null);
      setPlayCountIncremented(false);
    }
  }, [data]);

  useEffect(() => {
    if (id) {
      setAudioError(null);
      setPlayCountIncremented(false);
    }
  }, [id]);

  const handlePlaybackStateChange = useCallback(
    (playing: boolean) => {
      if (playing && !playCountIncremented && data) {
        setPlaysCount((prev) => prev + 1);
        setPlayCountIncremented(true);
      }
    },
    [playCountIncremented, data]
  );

  const handleAudioError = useCallback(
    (error: string) => {
      console.error("Audio playback error:", error);
      setAudioError(error);

      Alert.alert(
        t("song.playbackError") || "Playback Error",
        error || "An error occurred while playing the audio",
        [
          {
            text: t("common.ok") || "OK",
            onPress: () => setAudioError(null),
          },
        ]
      );
    },
    [t]
  );

  const handleLike = useCallback(async () => {
    if (!id || isLiking) return;

    try {
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

      await likeSong(id).unwrap();
    } catch (err: any) {
      // Revert on error
      setIsLiked(isLiked);
      setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
      if ((err.status as unknown as number) === 401) {
        Toast.show({
          type: "error",
          text1: t("song.likeError") || "Error Toggling Like",
          text2: t("song.likeErrorMessage") || "Please Login and try again.",
        });
      }
    }
  }, [id, isLiked, isLiking, likeSong]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      setAudioError(null);
    } catch (err) {
      console.error("Error refreshing song data:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch, t]);

  const handleGoBack = useCallback(() => {
    router.back();
  }, []);

  if (isFetching && !data) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#2f00ac" />
        <Text
          className="text-white mt-4"
          style={{
            fontFamily: AppFonts.semibold,
            textAlign: "center",
            writingDirection: isRTL ? "rtl" : "ltr",
          }}
        >
          {t("song.loading") || "Loading..."}
        </Text>
      </View>
    );
  }

  if (error || (!data && !isFetching)) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Ionicons name="musical-notes-outline" size={64} color="#666" />
        <Text
          className="text-white text-lg mt-4"
          style={{
            fontFamily: AppFonts.semibold,
            textAlign: "center",
            writingDirection: isRTL ? "rtl" : "ltr",
          }}
        >
          {t("song.songNotFound") || "Song not found"}
        </Text>
        <TouchableOpacity
          onPress={handleGoBack}
          className="mt-4 bg-orange-500 px-6 py-3 rounded-full"
        >
          <Text
            className="text-white"
            style={{
              fontFamily: AppFonts.semibold,
              writingDirection: isRTL ? "rtl" : "ltr",
            }}
          >
            {t("song.goBack") || "Go Back"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <View
      className="flex-1 bg-black"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      <StatusBar barStyle="light-content" backgroundColor="black" />

      <View className="absolute top-0 left-0 right-0 h-1/2">
        <ImageBackground
          source={{ uri: data.cover_url }}
          style={{ flex: 1, opacity: 0.4 }}
          blurRadius={8}
        />
        <View className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70" />
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#2f00ac"
            colors={["#2f00ac"]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View
          className={`flex-row justify-between items-center ${
            isRTL ? "flex-row-reverse" : ""
          }`}
          style={{
            paddingTop: Platform.OS === "ios" ? 50 : 40,
            paddingBottom: 16,
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity
            onPress={handleGoBack}
            className="bg-black/20 rounded-full"
            style={{
              padding: isSmallDevice ? 8 : 10,
            }}
          >
            <Ionicons
              name={isRTL ? "chevron-forward" : "chevron-back"}
              size={isSmallDevice ? 20 : 24}
              color="white"
            />
          </TouchableOpacity>

          <View
            className={`flex-row items-center ${
              isRTL ? "flex-row-reverse" : ""
            }`}
            style={{
              gap: 8,
            }}
          >
            <TouchableOpacity
              className="bg-black/20 rounded-full"
              style={{
                padding: isSmallDevice ? 8 : 10,
              }}
            >
              <Ionicons
                name="share-outline"
                size={isSmallDevice ? 18 : 20}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-black/20 rounded-full"
              style={{
                padding: isSmallDevice ? 8 : 10,
              }}
            >
              <Ionicons
                name="ellipsis-vertical"
                size={isSmallDevice ? 18 : 20}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View
          className="flex-1 justify-end"
          style={{
            paddingHorizontal: isSmallDevice ? 16 : 20,
            paddingBottom: isSmallDevice ? 20 : 32,
          }}
        >
          <View
            className="items-center"
            style={{
              direction: "ltr",
              marginBottom: isSmallDevice ? 20 : 32,
            }}
          >
            <View className="relative">
              <Image
                source={{
                  uri: data.cover_url,
                  cache: "force-cache",
                }}
                style={{
                  width: isSmallDevice
                    ? screenWidth * 0.65
                    : isLargeDevice
                    ? 320
                    : screenWidth * 0.7,
                  height: isSmallDevice
                    ? screenWidth * 0.65
                    : isLargeDevice
                    ? 320
                    : screenWidth * 0.7,
                  borderRadius: 24,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 8,
                  },
                  shadowOpacity: 0.44,
                  shadowRadius: 10.32,
                }}
                onError={() => console.log("Cover image failed to load")}
              />
              {audioError && (
                <View className="absolute inset-0 bg-black/50 rounded-3xl justify-center items-center">
                  <Ionicons
                    name="alert-circle-outline"
                    size={48}
                    color="#ef4444"
                  />
                  <Text className="text-red-400 text-xs mt-2 text-center px-4">
                    {audioError}
                  </Text>
                </View>
              )}
            </View>

            <Text
              className="text-white mt-6 text-center px-4"
              style={{
                fontSize: isSmallDevice ? 20 : isLargeDevice ? 28 : 24,
                fontFamily: AppFonts.semibold,
                textAlign: "center",
                writingDirection: isRTL ? "rtl" : "ltr",
                lineHeight: isSmallDevice ? 26 : isLargeDevice ? 36 : 32,
              }}
              numberOfLines={2}
            >
              {data.title}
            </Text>
            <Text
              className="text-orange-400 mt-1 text-center px-4"
              style={{
                fontSize: isSmallDevice ? 16 : isLargeDevice ? 20 : 18,
                fontFamily: AppFonts.semibold,
                textAlign: "center",
                writingDirection: isRTL ? "rtl" : "ltr",
                lineHeight: isSmallDevice ? 22 : isLargeDevice ? 28 : 24,
              }}
              numberOfLines={1}
            >
              {data.artist_name || data.artist || "Unknown Artist"}
            </Text>
            {data.division && (
              <Text
                className="text-gray-400 text-sm mt-1 text-center px-4"
                style={{
                  fontFamily: AppFonts.semibold,
                  textAlign: "center",
                  writingDirection: isRTL ? "rtl" : "ltr",
                }}
                numberOfLines={1}
              >
                {data.division}
              </Text>
            )}

            <View
              className={`flex-row items-center mt-4 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
              style={{
                gap: isSmallDevice ? 12 : 16,
                justifyContent: "center",
              }}
            >
              <View
                className={`flex-row items-center ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
                style={{
                  gap: 4,
                }}
              >
                <Ionicons
                  name="play-outline"
                  size={isSmallDevice ? 14 : 16}
                  color="#9CA3AF"
                />
                <Text
                  className="text-gray-400"
                  style={{
                    fontSize: isSmallDevice ? 12 : 14,
                    fontFamily: AppFonts.semibold,
                    writingDirection: isRTL ? "rtl" : "ltr",
                    marginLeft: isRTL ? 0 : 2,
                    marginRight: isRTL ? 2 : 0,
                  }}
                >
                  {formatNumber(playsCount)} {t("song.plays") || "plays"}
                </Text>
              </View>
              <View
                className={`flex-row items-center ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
                style={{
                  gap: 4,
                }}
              >
                <Ionicons
                  name="heart-outline"
                  size={isSmallDevice ? 14 : 16}
                  color="#9CA3AF"
                />
                <Text
                  className="text-gray-400"
                  style={{
                    fontSize: isSmallDevice ? 12 : 14,
                    fontFamily: AppFonts.semibold,
                    writingDirection: isRTL ? "rtl" : "ltr",
                    marginLeft: isRTL ? 0 : 2,
                    marginRight: isRTL ? 2 : 0,
                  }}
                >
                  {formatNumber(likesCount)} {t("song.likes") || "likes"}
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleLike}
                disabled={isLiking}
                className="bg-white/10 rounded-full"
                style={{
                  padding: isSmallDevice ? 8 : 10,
                  marginLeft: isRTL ? 0 : 8,
                  marginRight: isRTL ? 8 : 0,
                }}
                activeOpacity={0.7}
              >
                {isLiking ? (
                  <ActivityIndicator size="small" color="#f9a826" />
                ) : (
                  <Ionicons
                    name={isLiked ? "heart" : "heart-outline"}
                    size={isSmallDevice ? 18 : 20}
                    color={isLiked ? "#f9a826" : "white"}
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-white/10 rounded-full"
                style={{
                  padding: isSmallDevice ? 8 : 10,
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="repeat"
                  size={isSmallDevice ? 18 : 20}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>

          {data?.song_url && !audioError ? (
            <EnhancedAudioPlayer
              key={`${id}-${data.song_url}`}
              songUrl={data.song_url}
              songTitle={data.title}
              artistName={data.artist_name || data.artist || "Unknown Artist"}
              coverUrl={data.cover_url}
              onPlaybackStateChange={handlePlaybackStateChange}
              onError={handleAudioError}
              className="mb-8"
              isRTL={isRTL}
            />
          ) : data?.song_url && audioError ? (
            <View className="mb-8 bg-red-900/20 rounded-2xl p-4 border border-red-500/20">
              <View className="flex-row items-center justify-center gap-2">
                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color="#ef4444"
                />
                <Text className="text-red-400 text-center flex-1">
                  {audioError}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setAudioError(null)}
                className="mt-3 bg-red-500 py-2 px-4 rounded-lg self-center"
              >
                <Text className="text-white text-sm">
                  {t("common.retry") || "Retry"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="mb-8 bg-gray-800/50 rounded-2xl p-4">
              <Text className="text-gray-400 text-center">
                {t("song.noAudioAvailable") || "No audio available"}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default SongDetail;

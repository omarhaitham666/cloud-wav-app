import { useGetSongQuery } from "@/store/api/global/song";
import Ionicons from "@expo/vector-icons/Ionicons";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const formatTime = (seconds: number) => {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? `0${sec}` : sec}`;
};

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
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [playsCount, setPlaysCount] = useState(0);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isSliding, setIsSliding] = useState(false);

  const soundRef = useRef<Audio.Sound | null>(null);

  const { data, isLoading: isFetching } = useGetSongQuery(id, {
    skip: !id,
  });

  useEffect(() => {
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.log("Error configuring audio:", error);
      }
    };

    configureAudio();

    return () => {
      cleanupAudio();
    };
  }, []);

  useEffect(() => {
    if (data) {
      setIsLiked(data.isLiked || false);
      setLikesCount(data.likes_count || 0);
      setPlaysCount(data.plays || 0);
      loadAudio();
    }
  }, [data]);

  const cleanupAudio = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch (error) {
      console.log("Error cleaning up audio:", error);
    }
  };

  const loadAudio = async () => {
    if (!data?.song_url) {
      console.log("No song URL available");
      setAudioError(true);
      return;
    }

    try {
      setIsAudioLoading(true);
      setAudioError(false);
      setDuration(0);

      await cleanupAudio();

      console.log("Loading audio from:", data.song_url);

      const { sound, status } = await Audio.Sound.createAsync(
        { uri: data.song_url },
        {
          shouldPlay: false,
          isLooping: false,
          volume: 1.0,
          progressUpdateIntervalMillis: 500,
        }
      );

      soundRef.current = sound;

      if (status.isLoaded) {
        if (status.durationMillis) {
          setDuration(status.durationMillis / 1000);
        }

        sound.setOnPlaybackStatusUpdate((playbackStatus) => {
          if (playbackStatus.isLoaded) {
            if (
              playbackStatus.durationMillis &&
              duration !== playbackStatus.durationMillis / 1000
            ) {
              setDuration(playbackStatus.durationMillis / 1000);
            }

            if (!isSliding) {
              setCurrentTime((playbackStatus.positionMillis || 0) / 1000);
            }

            setIsPlaying(playbackStatus.isPlaying);

            if (playbackStatus.didJustFinish) {
              setIsPlaying(false);
              setCurrentTime(0);
              sound.setPositionAsync(0);
            }
          } else {
            console.log("Playback error:", playbackStatus.error);
            setAudioError(true);
            Alert.alert(
              "Playback Error",
              "There was an issue playing the audio"
            );
          }
        });

        if (!status.durationMillis) {
          (async () => {
            try {
              await sound.playAsync();
              await new Promise((resolve) => setTimeout(resolve, 100));
              const finalStatus = await sound.getStatusAsync();
              await sound.pauseAsync();
              await sound.setPositionAsync(0);

              if (finalStatus.isLoaded && finalStatus.durationMillis) {
                setDuration(finalStatus.durationMillis / 1000);
              }
            } catch (err) {
              console.error("Failed to preload duration", err);
            }
          })();
        }
      } else {
        console.log("Audio failed to load:", status.error);
        setAudioError(true);
        Alert.alert("Error", "Failed to load audio file");
      }
    } catch (error) {
      console.log("Error loading audio:", error);
      setAudioError(true);
      Alert.alert("Error", "Could not load the audio file");
    } finally {
      setIsAudioLoading(false);
    }
  };

  const togglePlayback = async () => {
    if (!soundRef.current) return;

    try {
      const status = await soundRef.current.getStatusAsync();

      if (status.isLoaded) {
        if (isPlaying) {
          await soundRef.current.pauseAsync();
        } else {
          await soundRef.current.playAsync();
          if (currentTime === 0) {
            setPlaysCount((prev) => prev + 1);
          }
        }
      } else {
        console.log("Audio not loaded, retrying...");
        await loadAudio();
      }
    } catch (error) {
      console.log("Error toggling playback:", error);
      Alert.alert("Playback Error", "Could not play/pause the audio");
    }
  };

  const handleSliderStart = () => {
    setIsSliding(true);
  };

  const handleSliderChange = (value: number) => {
    setCurrentTime(value);
  };

  const handleSliderComplete = async (value: number) => {
    if (!soundRef.current) {
      setIsSliding(false);
      return;
    }

    try {
      await soundRef.current.setPositionAsync(value * 1000);
      console.log("Seeked to:", value);
    } catch (error) {
      console.log("Error seeking:", error);
    } finally {
      setIsSliding(false);
    }
  };

  const handlePrevious = async () => {
    if (!soundRef.current) return;

    try {
      await soundRef.current.setPositionAsync(0);
      setCurrentTime(0);
    } catch (error) {
      console.log("Error going to start:", error);
    }
  };

  const handleNext = () => {
    console.log("Next song");
    // Implement next song logic
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    // TODO: API call to update like status
  };

  const retryLoadAudio = () => {
    if (data) {
      loadAudio();
    }
  };

  if (isFetching) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#2f00ac" />
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Ionicons name="musical-notes-outline" size={64} color="#666" />
        <Text className="text-white text-lg mt-4">Song not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-orange-500 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="black" />

      <View className="absolute top-0 left-0 right-0 h-1/2">
        <ImageBackground
          source={{ uri: data.cover_url }}
          style={{ flex: 1, opacity: 0.4 }}
          blurRadius={8}
        />
        <View className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70" />
      </View>

      <View className="flex-row justify-between items-center pt-12 pb-4 px-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-black/20 rounded-full p-2"
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>

        <View className="flex-row items-center">
          <TouchableOpacity className="bg-black/20 rounded-full p-2 mr-3">
            <Ionicons name="share-outline" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-black/20 rounded-full p-2">
            <Ionicons name="ellipsis-vertical" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1 justify-end px-6 pb-8">
        <View className="items-center mb-8">
          <View className="relative">
            <Image
              source={{ uri: data.cover_url }}
              className="w-72 h-72 rounded-3xl shadow-2xl"
              style={{
                shadowColor: "#f9a826",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
              }}
            />
            {isAudioLoading && (
              <View className="absolute inset-0 bg-black/50 rounded-3xl justify-center items-center">
                <ActivityIndicator size="large" color="#f9a826" />
              </View>
            )}
          </View>

          <Text className="text-2xl text-white font-bold mt-6 text-center">
            {data.title}
          </Text>
          <Text className="text-orange-400 text-lg mt-1 text-center">
            {data.artist_name}
          </Text>
          {data.division && (
            <Text className="text-gray-400 text-sm mt-1 text-center">
              {data.division}
            </Text>
          )}

          <View className="flex-row gap-3 items-center mt-4 space-x-6">
            <View className="flex-row items-center">
              <Ionicons name="play-outline" size={16} color="#9CA3AF" />
              <Text className="text-gray-400 text-sm ml-1">
                {formatNumber(playsCount)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="heart-outline" size={16} color="#9CA3AF" />
              <Text className="text-gray-400 text-sm ml-1">
                {formatNumber(likesCount)}
              </Text>
            </View>
          </View>

          {audioError && (
            <View className="mt-4 bg-red-500/20 px-4 py-2 rounded-lg">
              <Text className="text-red-400 text-sm text-center">
                Audio failed to load
              </Text>
              <TouchableOpacity onPress={retryLoadAudio} className="mt-2">
                <Text className="text-orange-400 text-xs text-center">
                  Tap to retry
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View className="mb-8">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-300 text-sm">
              {formatTime(currentTime)}
            </Text>
            <Text className="text-gray-300 text-sm">
              {duration > 0 ? formatTime(duration) : "0:00"}
            </Text>
          </View>
          <Slider
            style={{ height: 40 }}
            minimumValue={0}
            maximumValue={duration || 1}
            value={currentTime}
            onSlidingStart={handleSliderStart}
            onValueChange={handleSliderChange}
            onSlidingComplete={handleSliderComplete}
            thumbTintColor="#f9a826"
            minimumTrackTintColor="#f9a826"
            maximumTrackTintColor="rgba(255,255,255,0.3)"
            disabled={!soundRef.current || audioError}
          />
        </View>

        <View className="flex-row gap-3 justify-center items-center space-x-8">
          <TouchableOpacity
            onPress={handleLike}
            className="bg-white/10 rounded-full p-3"
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? "#f9a826" : "white"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePrevious}
            className="bg-white/10 rounded-full p-3"
            disabled={!soundRef.current || audioError}
          >
            <Ionicons
              name="play-skip-back"
              size={28}
              color={!soundRef.current || audioError ? "#666" : "white"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={togglePlayback}
            className="bg-orange-500 rounded-full p-4 shadow-lg"
            disabled={isAudioLoading || audioError}
            style={{
              shadowColor: "#f9a826",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              opacity: isAudioLoading || audioError ? 0.6 : 1,
            }}
          >
            {isAudioLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={32}
                color="white"
                style={{ marginLeft: isPlaying ? 0 : 2 }}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            className="bg-white/10 rounded-full p-3"
          >
            <Ionicons name="play-skip-forward" size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-white/10 rounded-full p-3">
            <Ionicons name="repeat" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SongDetail;

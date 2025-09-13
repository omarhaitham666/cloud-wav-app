import { AppFonts } from "@/utils/fonts";
import Ionicons from "@expo/vector-icons/Ionicons";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface EnhancedAudioPlayerProps {
  songUrl: string;
  songTitle: string;
  artistName: string;
  coverUrl: string;
  onPlaybackStateChange?: (isPlaying: boolean) => void;
  onError?: (error: string) => void;
  className?: string;
  isRTL?: boolean;
}

const formatTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const EnhancedAudioPlayer: React.FC<EnhancedAudioPlayerProps> = ({
  songUrl,
  songTitle,
  artistName,
  coverUrl,
  onPlaybackStateChange,
  onError,
  className = "",
  isRTL = false,
}) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [playbackSpeed] = useState(1.0);
  const [error, setError] = useState<string | null>(null);

  const soundRef = useRef<Audio.Sound | null>(null);
  const positionUpdateTimeoutRef = useRef<number | null>(null);
  const statusRef = useRef<any>(null);

  const onPlaybackStatusUpdate = useCallback((status: any) => {
    statusRef.current = status;
  }, []);

  useEffect(() => {
    const processStatus = () => {
      const status = statusRef.current;
      if (!status) return;

      if (status.isLoaded) {
        if (status.durationMillis) {
          setDuration((prevDuration) => {
            if (prevDuration !== status.durationMillis) {
              return status.durationMillis;
            }
            return prevDuration;
          });
        }

        if (status.positionMillis !== undefined) {
          setPosition((prevPosition) => {
            if (!isSliding && prevPosition !== status.positionMillis) {
              return status.positionMillis;
            }
            return prevPosition;
          });
        }

        if (status.isPlaying !== undefined) {
          setIsPlaying((prevIsPlaying) => {
            if (prevIsPlaying !== status.isPlaying) {
              onPlaybackStateChange?.(status.isPlaying);
              return status.isPlaying;
            }
            return prevIsPlaying;
          });
        }

        if (status.error) {
          const errorMessage = `Playback error: ${status.error}`;
          setError(errorMessage);
          onError?.(errorMessage);
        }
      } else if (status.error) {
        const errorMessage = `Audio error: ${status.error}`;
        setError(errorMessage);
        onError?.(errorMessage);
      }
    };

    const interval = setInterval(processStatus, 50);
    return () => clearInterval(interval);
  }, [isSliding, onPlaybackStateChange, onError]);

  const unloadAudio = useCallback(async () => {
    try {
      if (positionUpdateTimeoutRef.current) {
        clearTimeout(positionUpdateTimeoutRef.current);
        positionUpdateTimeoutRef.current = null;
      }

      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      statusRef.current = null;

      setSound(null);
      setIsPlaying(false);
      setPosition(0);
      setDuration(0);
      setError(null);
      setIsLoading(false);
    } catch (err) {
      console.error("Error unloading audio:", err);
    }
  }, []);

  const loadAudio = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      if (!songUrl || !songUrl.trim()) {
        throw new Error("Invalid audio URL");
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: songUrl.trim() },
        {
          shouldPlay: false,
          isLooping: false,
          volume: 1.0,
          rate: playbackSpeed,
          shouldCorrectPitch: true,
        },
        onPlaybackStatusUpdate
      );

      soundRef.current = newSound;
      setSound(newSound);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load audio";
      console.error("Audio loading error:", err);
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [songUrl, playbackSpeed, onError, onPlaybackStatusUpdate]);

  const handleStop = useCallback(async () => {
    if (!sound) return;

    try {
      await sound.stopAsync();
      setPosition(0);
    } catch (err) {
      console.error("Stop error:", err);
    }
  }, [sound]);

  useEffect(() => {
    const initAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (err) {
        console.error("Error setting audio mode:", err);
      }
    };

    initAudio();
  }, []);

  useEffect(() => {
    if (songUrl) {
      loadAudio();
    }

    return () => {
      unloadAudio();
    };
  }, [songUrl, loadAudio, unloadAudio]);

  useEffect(() => {
    return () => {
      unloadAudio();
    };
  }, [unloadAudio]);

  useEffect(() => {
    if (isPlaying && !isSliding && sound) {
      const updatePosition = async () => {
        try {
          const status = await sound.getStatusAsync();
          if (status.isLoaded && !status.isBuffering) {
            setPosition(status.positionMillis || 0);

            if (status.positionMillis >= (status.durationMillis || 0) - 100) {
              handleStop();
            }
          }
        } catch (err) {
          console.error("Error getting position:", err);
        }
      };

      updatePosition();

      const interval = setInterval(updatePosition, 50);

      return () => {
        clearInterval(interval);
      };
    }

    const currentTimeout = positionUpdateTimeoutRef.current;
    return () => {
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
    };
  }, [isPlaying, isSliding, sound, handleStop]);

  const handlePlayPause = async () => {
    if (!sound) return;

    try {
      setError(null);

      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Playback failed";
      console.error("Play/Pause error:", err);
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  const handleSeek = async (value: number) => {
    if (!sound || !duration) return;

    try {
      const seekPosition = Math.max(0, Math.min(value, duration));
      await sound.setPositionAsync(seekPosition);
      setPosition(seekPosition);

      setTimeout(async () => {
        try {
          const status = await sound.getStatusAsync();
          if (status.isLoaded && status.positionMillis !== undefined) {
            setPosition(status.positionMillis);
          }
        } catch (err) {
          console.error("Error updating position after seek:", err);
        }
      }, 25);
    } catch (err) {
      console.error("Seek error:", err);
    }
  };

  const handleSliderStart = () => {
    setIsSliding(true);
  };

  const handleSliderComplete = (value: number) => {
    setIsSliding(false);
    handleSeek(value);
  };

  const handleSliderChange = (value: number) => {
    if (isSliding) {
      setPosition(value);
    }
  };

  const skipForward = () => {
    const newPosition = Math.min(position + 15000, duration);
    handleSeek(newPosition);
  };

  const skipBackward = () => {
    const newPosition = Math.max(position - 15000, 0);
    handleSeek(newPosition);
  };

  if (error) {
    return (
      <View
        className={`bg-red-900/20 rounded-2xl p-4 border border-red-500/20 ${className}`}
        style={{
          direction: "ltr",
        }}
      >
        <View className="flex-row items-center justify-center gap-2">
          <Ionicons name="alert-circle-outline" size={20} color="#ef4444" />
          <Text
            className="text-red-400 text-center flex-1"
            style={{ fontFamily: AppFonts.medium }}
          >
            {error}
          </Text>
        </View>
        <TouchableOpacity
          onPress={loadAudio}
          className="mt-3 bg-red-500 py-2 px-4 rounded-lg self-center"
        >
          <Text
            className="text-white text-sm"
            style={{ fontFamily: AppFonts.semibold }}
          >
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      className={`bg-gray-800/50 rounded-2xl p-4 ${className}`}
      style={{
        direction: "ltr",
      }}
    >
      <View className="mb-4">
        <Slider
          style={{ height: 40 }}
          minimumValue={0}
          maximumValue={duration || 1}
          value={position}
          onSlidingStart={handleSliderStart}
          onSlidingComplete={handleSliderComplete}
          onValueChange={handleSliderChange}
          minimumTrackTintColor="#f9a826"
          maximumTrackTintColor="#374151"
          thumbTintColor="#f9a826"
          disabled={!sound || isLoading || duration === 0}
        />

        <View
          className={`flex-row justify-between mt-1 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <Text
            className="text-gray-400 text-xs"
            style={{
              fontFamily: AppFonts.medium,
              writingDirection: isRTL ? "rtl" : "ltr",
            }}
          >
            {formatTime(position)}
          </Text>
          <Text
            className="text-gray-400 text-xs"
            style={{
              fontFamily: AppFonts.medium,
              writingDirection: isRTL ? "rtl" : "ltr",
            }}
          >
            {formatTime(duration)}
          </Text>
        </View>
      </View>

      <View
        className={`flex-row items-center justify-center gap-6 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <TouchableOpacity
          onPress={skipBackward}
          disabled={!sound || isLoading}
          className="p-2"
          activeOpacity={0.7}
        >
          <Ionicons
            name="play-back-outline"
            size={24}
            color={!sound || isLoading ? "#666" : "white"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePlayPause}
          disabled={!sound || isLoading}
          className="bg-orange-500 rounded-full p-4"
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={28}
              color="white"
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={skipForward}
          disabled={!sound || isLoading}
          className="p-2"
          activeOpacity={0.7}
        >
          <Ionicons
            name="play-forward-outline"
            size={24}
            color={!sound || isLoading ? "#666" : "white"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EnhancedAudioPlayer;

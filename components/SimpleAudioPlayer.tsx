import { AppFonts } from '@/utils/fonts';
import Ionicons from '@expo/vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface SimpleAudioPlayerProps {
  songUrl: string;
  songTitle: string;
  artistName: string;
  coverUrl?: string;
  onPlaybackStateChange?: (isPlaying: boolean) => void;
  onError?: (error: string) => void;
  className?: string;
}

const SimpleAudioPlayer: React.FC<SimpleAudioPlayerProps> = ({
  songUrl,
  songTitle,
  artistName,
  coverUrl,
  onPlaybackStateChange,
  onError,
  className = '',
}) => {
  // State management
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Refs
  const soundRef = useRef<Audio.Sound | null>(null);
  const isMountedRef = useRef(true);

  // Format time helper function
  const formatTime = useCallback((seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? `0${sec}` : sec}`;
  }, []);

  // Configure audio mode
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
        console.log('Error configuring audio:', error);
      }
    };
    configureAudio();
  }, []);

  // Load audio when component mounts or song changes
  const loadAudio = useCallback(async () => {
    if (!songUrl) {
      setHasError(true);
      onError?.('No song URL provided');
      return;
    }

    try {
      setIsLoading(true);
      setHasError(false);
      setDuration(0);
      setCurrentTime(0);

      // Clean up previous audio
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      // Create new sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: songUrl },
        { shouldPlay: false }
      );

      soundRef.current = sound;

      // Set up status update listener
      sound.setOnPlaybackStatusUpdate((status: any) => {
        if (!isMountedRef.current) return;

        if (!status.isLoaded) {
          if (status.error) {
            console.log('Playback error:', status.error);
            setHasError(true);
            onError?.('Playback error occurred');
          }
          return;
        }

        // Update duration
        if (status.durationMillis) {
          setDuration(status.durationMillis / 1000);
        }

        // Update playing state
        const playing = status.isPlaying;
        setIsPlaying(playing);
        onPlaybackStateChange?.(playing);

        // Handle track end
        if (status.didJustFinish) {
          setIsPlaying(false);
          setCurrentTime(0);
          onPlaybackStateChange?.(false);
          sound.setPositionAsync(0);
        }
      });

      // Get initial duration
      const firstStatus = await sound.getStatusAsync();
      if (firstStatus.isLoaded && firstStatus.durationMillis) {
        setDuration(firstStatus.durationMillis / 1000);
      }

      console.log('Audio loaded successfully');
    } catch (error) {
      console.error('Error loading audio:', error);
      setHasError(true);
      onError?.('Failed to load audio. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  }, [songUrl, onError, onPlaybackStateChange]);

  // Load audio when component mounts or song changes
  useEffect(() => {
    if (songUrl) {
      loadAudio();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [songUrl, loadAudio]);

  // Progress tracking effect - updates progress every second when playing
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isPlaying && !isSliding && soundRef.current) {
      intervalId = setInterval(async () => {
        if (!isMountedRef.current || !soundRef.current) return;

        try {
          const status = await soundRef.current.getStatusAsync();
          if (status.isLoaded && status.positionMillis !== undefined) {
            setCurrentTime(status.positionMillis / 1000);
          }
        } catch (error) {
          console.error('Error updating progress:', error);
        }
      }, 1000); // Update every second
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, isSliding]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // Handle play/pause toggle
  const togglePlayback = useCallback(async () => {
    if (isLoading || hasError || !soundRef.current) return;

    try {
      const status = await soundRef.current.getStatusAsync();

      if (status.isLoaded) {
        if (isPlaying) {
          await soundRef.current.pauseAsync();
        } else {
          await soundRef.current.playAsync();
        }
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
      onError?.('Failed to control playback');
    }
  }, [isLoading, hasError, isPlaying, onError]);

  // Handle seeking (slider drag)
  const handleSliderChange = useCallback((value: number) => {
    setCurrentTime(value);
  }, []);

  const handleSliderComplete = useCallback(async (value: number) => {
    if (!soundRef.current) {
      setIsSliding(false);
      return;
    }

    try {
      await soundRef.current.setPositionAsync(value * 1000);
      setCurrentTime(value);
    } catch (error) {
      console.error('Error seeking:', error);
      onError?.('Failed to seek to position');
    } finally {
      setIsSliding(false);
    }
  }, [onError]);

  // Handle slider start
  const handleSliderStart = useCallback(() => {
    setIsSliding(true);
  }, []);

  // Handle previous track (restart current track)
  const handlePrevious = useCallback(async () => {
    if (!soundRef.current) return;

    try {
      await soundRef.current.setPositionAsync(0);
      setCurrentTime(0);
    } catch (error) {
      console.error('Error restarting track:', error);
    }
  }, []);

  // Handle next track (placeholder)
  const handleNext = useCallback(() => {
    console.log('Next track - implement your logic here');
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <View className={`flex-row items-center justify-center p-4 ${className}`}>
        <ActivityIndicator size="small" color="#f9a826" />
        <Text 
          className="text-white ml-2"
          style={{ fontFamily: AppFonts.medium }}
        >
          Loading audio...
        </Text>
      </View>
    );
  }

  // Render error state
  if (hasError) {
    return (
      <View className={`flex-col items-center justify-center p-4 ${className}`}>
        <Ionicons name="alert-circle-outline" size={24} color="#ef4444" />
        <Text 
          className="text-red-400 text-center mt-2"
          style={{ fontFamily: AppFonts.medium }}
        >
          Failed to load audio
        </Text>
        <TouchableOpacity
          onPress={loadAudio}
          className="bg-orange-500 px-4 py-2 rounded-full mt-2"
        >
          <Text 
            className="text-white"
            style={{ fontFamily: AppFonts.medium }}
          >
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className={`bg-black/20 rounded-2xl p-4 ${className}`}>
      {/* Song Info */}
      <View className="items-center mb-4">
        <Text 
          className="text-white text-lg text-center"
          style={{ fontFamily: AppFonts.semibold }}
          numberOfLines={1}
        >
          {songTitle}
        </Text>
        <Text 
          className="text-orange-400 text-sm text-center mt-1"
          style={{ fontFamily: AppFonts.medium }}
          numberOfLines={1}
        >
          {artistName}
        </Text>
      </View>

      {/* Progress Bar */}
      <View className="mb-4">
        {/* Time Labels */}
        <View className="flex-row justify-between mb-2">
          <Text 
            className="text-gray-300 text-sm"
            style={{ fontFamily: AppFonts.medium }}
          >
            {formatTime(currentTime)}
          </Text>
          <Text 
            className="text-gray-300 text-sm"
            style={{ fontFamily: AppFonts.medium }}
          >
            {formatTime(duration)}
          </Text>
        </View>

        {/* Slider */}
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
          disabled={hasError}
        />
      </View>

      {/* Controls */}
      <View className="flex-row justify-center items-center gap-4">
        {/* Previous Button */}
        <TouchableOpacity
          onPress={handlePrevious}
          className="bg-white/10 rounded-full p-3"
          disabled={hasError}
        >
          <Ionicons
            name="play-skip-back"
            size={24}
            color={hasError ? "#666" : "white"}
          />
        </TouchableOpacity>

        {/* Play/Pause Button */}
        <TouchableOpacity
          onPress={togglePlayback}
          className="bg-orange-500 rounded-full p-4 shadow-lg"
          disabled={hasError}
          style={{ opacity: hasError ? 0.6 : 1 }}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={28}
            color="white"
            style={{ marginLeft: isPlaying ? 0 : 2 }}
          />
        </TouchableOpacity>

        {/* Next Button */}
        <TouchableOpacity
          onPress={handleNext}
          className="bg-white/10 rounded-full p-3"
          disabled={hasError}
        >
          <Ionicons
            name="play-skip-forward"
            size={24}
            color={hasError ? "#666" : "white"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SimpleAudioPlayer;

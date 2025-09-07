import { PlayerService } from '@/services/playerService';
import { AppFonts } from '@/utils/fonts';
import Ionicons from '@expo/vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface AudioPlayerProps {
  songUrl: string;
  songTitle: string;
  artistName: string;
  coverUrl?: string;
  onPlaybackStateChange?: (isPlaying: boolean) => void;
  onError?: (error: string) => void;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
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
  const [isInitialized, setIsInitialized] = useState(false);

  // Refs for cleanup and intervals
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);

  // Format time helper function
  const formatTime = useCallback((seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? `0${sec}` : sec}`;
  }, []);

  // Initialize the player
  const initializePlayer = useCallback(async () => {
    try {
      setIsLoading(true);
      setHasError(false);

      // Initialize the track player if not already done
      if (!isInitialized) {
        await PlayerService.initialize();
        setIsInitialized(true);
      }

      // Clear any existing tracks
      await PlayerService.clearQueue();

      // Add the new track
      const track = {
        id: songUrl, // Use URL as unique ID
        url: songUrl,
        title: songTitle,
        artist: artistName,
        artwork: coverUrl,
        // Additional metadata for better streaming
        headers: {
          'User-Agent': 'CloudWavApp/1.0',
        },
      };

      await PlayerService.addTrack(track);

      // Get initial duration
      const trackDuration = await PlayerService.getDuration();
      setDuration(trackDuration);

      console.log('Audio player initialized successfully');
    } catch (error) {
      console.error('Failed to initialize audio player:', error);
      setHasError(true);
      onError?.('Failed to load audio. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  }, [songUrl, songTitle, artistName, coverUrl, isInitialized, onError]);

  // Update progress periodically
  const updateProgress = useCallback(async () => {
    if (!isMountedRef.current || isSliding) return;

    try {
      const position = await PlayerService.getPosition();
      setCurrentTime(position);
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  }, [isSliding]);

  // Start progress updates
  const startProgressUpdates = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(updateProgress, 1000); // Update every second
  }, [updateProgress]);

  // Stop progress updates
  const stopProgressUpdates = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  // Handle play/pause toggle
  const togglePlayback = useCallback(async () => {
    if (isLoading || hasError) return;

    try {
      const state = await PlayerService.getState();
      
      if (state === 'playing') {
        await PlayerService.pause();
        stopProgressUpdates();
      } else {
        await PlayerService.play();
        startProgressUpdates();
      }
    } catch (error) {
      console.error('Failed to toggle playback:', error);
      onError?.('Failed to control playback');
    }
  }, [isLoading, hasError, startProgressUpdates, stopProgressUpdates, onError]);

  // Handle seeking (slider drag)
  const handleSliderChange = useCallback((value: number) => {
    setCurrentTime(value);
  }, []);

  const handleSliderComplete = useCallback(async (value: number) => {
    try {
      await PlayerService.seekTo(value);
      setCurrentTime(value);
    } catch (error) {
      console.error('Failed to seek:', error);
      onError?.('Failed to seek to position');
    } finally {
      setIsSliding(false);
    }
  }, [onError]);

  // Handle slider start
  const handleSliderStart = useCallback(() => {
    setIsSliding(true);
    stopProgressUpdates();
  }, [stopProgressUpdates]);

  // Handle previous track (restart current track)
  const handlePrevious = useCallback(async () => {
    try {
      await PlayerService.seekTo(0);
      setCurrentTime(0);
    } catch (error) {
      console.error('Failed to restart track:', error);
    }
  }, []);

  // Handle next track (placeholder)
  const handleNext = useCallback(() => {
    console.log('Next track - implement your logic here');
  }, []);

  // Set up event listeners
  useEffect(() => {
    const handlePlaybackStateChange = (playing: boolean) => {
      if (!isMountedRef.current) return;

      setIsPlaying(playing);
      onPlaybackStateChange?.(playing);

      if (playing) {
        startProgressUpdates();
      } else {
        stopProgressUpdates();
      }
    };

    const handlePlaybackError = (error: any) => {
      console.error('Playback error:', error);
      if (isMountedRef.current) {
        setHasError(true);
        onError?.('Playback error occurred');
      }
    };

    const handlePlaybackQueueEnded = () => {
      if (isMountedRef.current) {
        setIsPlaying(false);
        setCurrentTime(0);
        stopProgressUpdates();
        onPlaybackStateChange?.(false);
      }
    };

    // Set up event listeners
    PlayerService.setupEventListeners(
      handlePlaybackStateChange,
      () => {}, // Track changed - not needed for single track
      handlePlaybackQueueEnded,
      handlePlaybackError
    );

    return () => {
      PlayerService.removeEventListeners();
    };
  }, [startProgressUpdates, stopProgressUpdates, onPlaybackStateChange, onError]);

  // Initialize player when component mounts or song changes
  useEffect(() => {
    if (songUrl) {
      initializePlayer();
    }

    return () => {
      isMountedRef.current = false;
      stopProgressUpdates();
    };
  }, [songUrl, initializePlayer, stopProgressUpdates]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      stopProgressUpdates();
    };
  }, [stopProgressUpdates]);

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
          onPress={initializePlayer}
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

export default AudioPlayer;

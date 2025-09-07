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

interface EnhancedAudioPlayerProps {
    songUrl: string;
    songTitle: string;
    artistName: string;
    coverUrl?: string;
    onPlaybackStateChange?: (isPlaying: boolean) => void;
    onError?: (error: string) => void;
    className?: string;
}

const EnhancedAudioPlayer: React.FC<EnhancedAudioPlayerProps> = ({
    songUrl,
    songTitle,
    artistName,
    coverUrl,
    onPlaybackStateChange,
    onError,
    className = '',
}) => {

    const [isPlaying, setIsPlaying] = useState(false);
    const [isStopped, setIsStopped] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isSliding, setIsSliding] = useState(false);
    const [hasError, setHasError] = useState(false);


    const soundRef = useRef<Audio.Sound | null>(null);
    const isMountedRef = useRef(true);
    const progressIntervalRef = useRef<number | null>(null);


    const formatTime = useCallback((seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? `0${sec}` : sec}`;
    }, []);


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


    const startProgressTracking = useCallback(() => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
        }

        progressIntervalRef.current = setInterval(async () => {
            if (!isMountedRef.current || !soundRef.current || isSliding) return;

            try {
                const status = await soundRef.current.getStatusAsync();
                if (status.isLoaded && status.positionMillis !== undefined) {
                    setCurrentTime(status.positionMillis / 1000);
                }
            } catch (error) {
                console.error('Error updating progress:', error);
            }
        }, 500);
    }, [isSliding]);


    const stopProgressTracking = useCallback(() => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
    }, []);


    const loadAudio = useCallback(async () => {
        if (!songUrl) {
            setHasError(true);
            onError?.('No song URL provided');
            return;
        }

        try {
            setIsLoading(true);
            setHasError(false);
            setIsStopped(true);
            setDuration(0);
            setCurrentTime(0);
            stopProgressTracking();


            if (soundRef.current) {
                await soundRef.current.unloadAsync();
                soundRef.current = null;
            }


            const { sound } = await Audio.Sound.createAsync(
                { uri: songUrl },
                { shouldPlay: false }
            );

            soundRef.current = sound;


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


                if (status.durationMillis) {
                    setDuration(status.durationMillis / 1000);
                }


                const playing = status.isPlaying;
                setIsPlaying(playing);
                setIsStopped(!playing && status.positionMillis === 0);
                onPlaybackStateChange?.(playing);


                if (status.didJustFinish) {
                    setIsPlaying(false);
                    setIsStopped(true);
                    setCurrentTime(0);
                    onPlaybackStateChange?.(false);
                    stopProgressTracking();
                    sound.setPositionAsync(0);
                }
            });


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
    }, [songUrl, onError, onPlaybackStateChange, stopProgressTracking]);


    useEffect(() => {
        if (songUrl) {
            loadAudio();
        }

        return () => {
            isMountedRef.current = false;
            stopProgressTracking();
        };
    }, [songUrl, loadAudio, stopProgressTracking]);


    const togglePlayback = useCallback(async () => {
        if (isLoading || hasError || !soundRef.current) return;

        try {
            const status = await soundRef.current.getStatusAsync();

            if (status.isLoaded) {
                if (isStopped) {

                    await soundRef.current.playAsync();
                    setIsStopped(false);
                    startProgressTracking();
                } else if (isPlaying) {

                    await soundRef.current.pauseAsync();
                    stopProgressTracking();
                } else {

                    await soundRef.current.stopAsync();
                    setIsStopped(true);
                    setCurrentTime(0);
                    stopProgressTracking();
                }
            }
        } catch (error) {
            console.error('Error toggling playback:', error);
            onError?.('Failed to control playback');
        }
    }, [isLoading, hasError, isPlaying, isStopped, onError, startProgressTracking, stopProgressTracking]);


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


    const handleSliderStart = useCallback(() => {
        setIsSliding(true);
        stopProgressTracking();
    }, [stopProgressTracking]);


    const handlePrevious = useCallback(async () => {
        if (!soundRef.current) return;

        try {
            await soundRef.current.setPositionAsync(0);
            setCurrentTime(0);
        } catch (error) {
            console.error('Error restarting track:', error);
        }
    }, []);


    const handleNext = useCallback(() => {
        console.log('Next track - implement your logic here');
    }, []);


    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            stopProgressTracking();
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, [stopProgressTracking]);


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

                {/* Play/Pause/Stop Button */}
                <TouchableOpacity
                    onPress={togglePlayback}
                    className="bg-orange-500 rounded-full p-4 shadow-lg"
                    disabled={hasError}
                    style={{ opacity: hasError ? 0.6 : 1 }}
                >
                    <Ionicons
                        name={isStopped ? "play" : isPlaying ? "pause" : "stop"}
                        size={28}
                        color="white"
                        style={{ marginLeft: isStopped ? 2 : 0 }}
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

export default EnhancedAudioPlayer;

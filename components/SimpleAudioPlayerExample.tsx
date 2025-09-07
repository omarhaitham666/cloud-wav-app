import { AppFonts } from '@/utils/fonts';
import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import AudioPlayer from './AudioPlayer';

/**
 * Simple example component showing how to use the AudioPlayer
 * This demonstrates all the key features:
 * - Streaming from URL
 * - Real-time progress tracking
 * - Seeking functionality
 * - Play/pause controls
 */
const SimpleAudioPlayerExample: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Example audio URLs (you can replace these with your own)
  const exampleSongs = [
    {
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      title: 'Example Song 1',
      artist: 'Sample Artist',
      coverUrl: 'https://via.placeholder.com/300x300/2f00ac/ffffff?text=Song+1'
    },
    {
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      title: 'Example Song 2', 
      artist: 'Another Artist',
      coverUrl: 'https://via.placeholder.com/300x300/f9a826/ffffff?text=Song+2'
    }
  ];

  const [currentSong, setCurrentSong] = useState(exampleSongs[0]);

  const handlePlaybackStateChange = (playing: boolean) => {
    setIsPlaying(playing);
    console.log('Playback state changed:', playing ? 'Playing' : 'Paused');
  };

  const handleError = (error: string) => {
    Alert.alert('Audio Error', error);
  };

  const switchSong = (song: typeof exampleSongs[0]) => {
    setCurrentSong(song);
    setIsPlaying(false); // Reset playing state when switching songs
  };

  return (
    <View className="flex-1 bg-black p-4">
      <Text 
        className="text-white text-2xl text-center mb-8"
        style={{ fontFamily: AppFonts.bold }}
      >
        Audio Player Example
      </Text>

      {/* Song Selection */}
      <View className="mb-6">
        <Text 
          className="text-white text-lg mb-4"
          style={{ fontFamily: AppFonts.semibold }}
        >
          Select a song to play:
        </Text>
        {exampleSongs.map((song, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => switchSong(song)}
            className={`p-3 rounded-lg mb-2 ${
              currentSong.url === song.url 
                ? 'bg-orange-500' 
                : 'bg-white/10'
            }`}
          >
            <Text 
              className="text-white"
              style={{ fontFamily: AppFonts.medium }}
            >
              {song.title} - {song.artist}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Audio Player */}
      <AudioPlayer
        songUrl={currentSong.url}
        songTitle={currentSong.title}
        artistName={currentSong.artist}
        coverUrl={currentSong.coverUrl}
        onPlaybackStateChange={handlePlaybackStateChange}
        onError={handleError}
        className="mb-6"
      />

      {/* Status Display */}
      <View className="bg-white/10 rounded-lg p-4">
        <Text 
          className="text-white text-center"
          style={{ fontFamily: AppFonts.medium }}
        >
          Status: {isPlaying ? 'Playing' : 'Paused'}
        </Text>
        <Text 
          className="text-gray-400 text-center mt-2 text-sm"
          style={{ fontFamily: AppFonts.regular }}
        >
          Current Song: {currentSong.title}
        </Text>
      </View>

      {/* Instructions */}
      <View className="mt-6 bg-blue-900/20 rounded-lg p-4">
        <Text 
          className="text-blue-300 text-sm"
          style={{ fontFamily: AppFonts.medium }}
        >
          Instructions:
        </Text>
        <Text 
          className="text-gray-300 text-xs mt-2 leading-5"
          style={{ fontFamily: AppFonts.regular }}
        >
          • Tap play/pause to control playback{'\n'}
          • Drag the progress bar to seek to any position{'\n'}
          • Use previous/next buttons for navigation{'\n'}
          • Progress updates automatically while playing{'\n'}
          • Switch songs using the buttons above
        </Text>
      </View>
    </View>
  );
};

export default SimpleAudioPlayerExample;

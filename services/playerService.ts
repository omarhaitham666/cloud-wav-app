import AudioRecorderPlayer, {
    PlayBackType
} from 'react-native-audio-recorder-player';

// This service handles all audio player functionality using react-native-audio-recorder-player
export class PlayerService {
  private static audioRecorderPlayer: any;
  private static isInitialized = false;
  private static currentTrack: any = null;
  private static isPlaying = false;
  private static currentPosition = 0;
  private static duration = 0;
  private static eventListeners: {
    onPlaybackStateChange?: (isPlaying: boolean) => void;
    onPlaybackTrackChanged?: (track: any) => void;
    onPlaybackQueueEnded?: () => void;
    onPlaybackError?: (error: any) => void;
  } = {};

  // Initialize the audio player
  static async initialize() {
    if (this.isInitialized) {
      console.log('AudioRecorderPlayer already initialized');
      return;
    }

    try {
      this.audioRecorderPlayer = AudioRecorderPlayer;
      this.isInitialized = true;
      console.log('AudioRecorderPlayer initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AudioRecorderPlayer:', error);
      this.isInitialized = false;
    }
  }

  // Add a track to the queue
  static async addTrack(track: any) {
    try {
      this.currentTrack = track;
      console.log('Track added successfully');
    } catch (error) {
      console.error('Failed to add track:', error);
    }
  }

  // Play the current track
  static async play() {
    try {
      if (!this.currentTrack) {
        throw new Error('No track loaded');
      }

      const result = await this.audioRecorderPlayer.startPlayer(this.currentTrack.url);
      this.isPlaying = true;
      this.currentPosition = 0;
      
      // Start progress tracking
      this.startProgressTracking();
      
      this.eventListeners.onPlaybackStateChange?.(true);
      console.log('Playing track');
    } catch (error) {
      console.error('Failed to play track:', error);
      this.eventListeners.onPlaybackError?.(error);
    }
  }

  // Pause the current track
  static async pause() {
    try {
      await this.audioRecorderPlayer.pausePlayer();
      this.isPlaying = false;
      this.eventListeners.onPlaybackStateChange?.(false);
      console.log('Paused track');
    } catch (error) {
      console.error('Failed to pause track:', error);
    }
  }

  // Stop the current track
  static async stop() {
    try {
      await this.audioRecorderPlayer.stopPlayer();
      this.isPlaying = false;
      this.currentPosition = 0;
      this.eventListeners.onPlaybackStateChange?.(false);
      console.log('Stopped track');
    } catch (error) {
      console.error('Failed to stop track:', error);
    }
  }

  // Seek to a specific position (in seconds)
  static async seekTo(position: number) {
    try {
      await this.audioRecorderPlayer.seekToPlayer(position * 1000); // Convert to milliseconds
      this.currentPosition = position;
      console.log(`Seeked to position: ${position}s`);
    } catch (error) {
      console.error('Failed to seek:', error);
    }
  }

  // Get current position
  static async getPosition() {
    try {
      const position = await this.audioRecorderPlayer.getCurrentPosition();
      this.currentPosition = position / 1000; // Convert to seconds
      return this.currentPosition;
    } catch (error) {
      console.error('Failed to get position:', error);
      return this.currentPosition;
    }
  }

  // Get duration
  static async getDuration() {
    try {
      const duration = await this.audioRecorderPlayer.getDuration();
      this.duration = duration / 1000; // Convert to seconds
      return this.duration;
    } catch (error) {
      console.error('Failed to get duration:', error);
      return this.duration;
    }
  }

  // Get current state (simplified for audio-recorder-player)
  static async getState() {
    return this.isPlaying ? 'playing' : 'paused';
  }

  // Clear the queue
  static async clearQueue() {
    try {
      if (this.isPlaying) {
        await this.stop();
      }
      this.currentTrack = null;
      this.currentPosition = 0;
      this.duration = 0;
      console.log('Queue cleared');
    } catch (error) {
      console.error('Failed to clear queue:', error);
    }
  }

  // Start progress tracking
  private static startProgressTracking() {
    this.audioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
      this.currentPosition = e.currentPosition / 1000; // Convert to seconds
      
      if (e.currentPosition >= e.duration) {
        // Track finished
        this.isPlaying = false;
        this.currentPosition = 0;
        this.eventListeners.onPlaybackStateChange?.(false);
        this.eventListeners.onPlaybackQueueEnded?.();
      }
    });
  }

  // Set up event listeners
  static setupEventListeners(
    onPlaybackStateChange: (isPlaying: boolean) => void,
    onPlaybackTrackChanged: (track: any) => void,
    onPlaybackQueueEnded: () => void,
    onPlaybackError: (error: any) => void
  ) {
    this.eventListeners = {
      onPlaybackStateChange,
      onPlaybackTrackChanged,
      onPlaybackQueueEnded,
      onPlaybackError
    };
  }

  // Clean up event listeners
  static removeEventListeners() {
    this.eventListeners = {};
    console.log('Event listeners cleaned up');
  }
}

import { router } from 'expo-router';
import * as Updates from 'expo-updates';
import Toast from 'react-native-toast-message';

// Global drawer refresh trigger - will be set by the app
let globalDrawerRefreshTrigger: (() => void) | null = null;

export const setDrawerRefreshTrigger = (trigger: (() => void) | null) => {
  globalDrawerRefreshTrigger = trigger;
};

export interface AppRefreshOptions {
  showToast?: boolean;
  toastMessage?: string;
  toastDescription?: string;
  delay?: number;
  fallbackRoute?: string;
}

/**
 * Utility service for handling app refresh functionality using expo-updates
 */
export class AppRefreshService {
  /**
   * Reload the app using expo-updates (recommended for production)
   */
  static async reloadWithUpdates(): Promise<void> {
    try {
      if (Updates.isEnabled) {
        await Updates.reloadAsync();
      } else {
        throw new Error('Updates not enabled');
      }
    } catch (error) {
      console.log('Updates reload failed:', error);
      throw error;
    }
  }

  /**
   * Fallback method: Reset navigation stack
   */
  static resetNavigationStack(fallbackRoute: string = "/(drawer)/(tabs)"): void {
    try {
      router.dismissAll();
      router.replace(fallbackRoute as any);
    } catch (error) {
      console.error('Navigation reset failed:', error);
      // Last resort - try to navigate to home
      router.replace("/(drawer)/(tabs)" as any);
    }
  }

  /**
   * Main refresh method with fallback options
   */
  static async refreshApp(options: AppRefreshOptions = {}): Promise<void> {
    const {
      showToast = true,
      toastMessage = "Refreshing app...",
      toastDescription = "Please wait while we update your data",
      delay = 1000,
      fallbackRoute = "/(drawer)/(tabs)"
    } = options;

    // Show toast if requested
    if (showToast) {
      Toast.show({
        type: "info",
        text1: toastMessage,
        text2: toastDescription,
        autoHide: false,
      });
    }

    // Add delay to show the toast
    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      // Try to reload with expo-updates first
      await this.reloadWithUpdates();
    } catch (error) {
      console.log('Expo updates failed, using navigation reset fallback');
      
      // Fallback to navigation reset
      this.resetNavigationStack(fallbackRoute);
      
      // Show success toast for fallback
      if (showToast) {
        Toast.show({
          type: "success",
          text1: "App refreshed",
          text2: "Navigation reset completed",
        });
      }
    }
  }

  /**
   * Refresh app after successful login
   */
  static async refreshAfterLogin(): Promise<void> {
    await this.refreshApp({
      showToast: false,
      fallbackRoute: "/(drawer)/(tabs)"
    });
  }

  /**
   * Refresh app after logout
   */
  static async refreshAfterLogout(): Promise<void> {
    await this.refreshApp({
      showToast: false,
      fallbackRoute: "/(drawer)/(tabs)"
    });
  }

  /**
   * Refresh app after registration
   */
  static async refreshAfterRegister(): Promise<void> {
    await this.refreshApp({
      showToast: false,
      fallbackRoute: "/(drawer)/(tabs)"
    });
  }

  /**
   * Check if expo-updates is available and enabled
   */
  static isUpdatesEnabled(): boolean {
    return Updates.isEnabled;
  }

  /**
   * Get current update info
   */
  static async getUpdateInfo() {
    try {
      if (Updates.isEnabled) {
        return await Updates.checkForUpdateAsync();
      }
      return null;
    } catch (error) {
      console.log('Error checking for updates:', error);
      return null;
    }
  }

  /**
   * Debug method to log current app state
   */
  static logAppState() {
    console.log('App Refresh Service Debug Info:');
    console.log('- Updates enabled:', Updates.isEnabled);
    console.log('- Current update ID:', Updates.updateId);
    console.log('- Current channel:', Updates.channel);
    console.log('- Is embedded update:', Updates.isEmbeddedLaunch);
  }

  /**
   * Test method to verify refresh functionality
   */
  static async testRefresh() {
    console.log('Testing app refresh functionality...');
    this.logAppState();
    
    try {
      await this.refreshApp({
        showToast: false,
        delay: 500,
      });
    } catch (error) {
      console.error('Test refresh failed:', error);
    }
  }

  /**
   * Gentle page refresh - reloads current screen without full app restart
   * This is the preferred method for auth changes as it's less disruptive
   */
  static async gentlePageRefresh(): Promise<void> {
    try {
      // Trigger drawer refresh first
      if (globalDrawerRefreshTrigger) {
        globalDrawerRefreshTrigger();
      }

      if (Updates.isEnabled) {
        // Use expo-updates for gentle reload
        await Updates.reloadAsync();
      } else {
        // Fallback: navigate to current route to refresh
        const currentRoute = router.canGoBack() ? undefined : "/(drawer)/(tabs)";
        if (currentRoute) {
          router.replace(currentRoute as any);
        } else {
          router.back();
          setTimeout(() => {
            // Navigate forward by going to the current route
            router.replace("/(drawer)/(tabs)" as any);
          }, 100);
        }
      }
    } catch (error) {
      console.log('Gentle page refresh failed:', error);
      // Final fallback: navigate to home
      router.replace("/(drawer)/(tabs)" as any);
    }
  }

  /**
   * Refresh after authentication changes (login/register/logout)
   * Uses gentle refresh for better user experience
   */
  static async refreshAfterAuthChange(type: 'login' | 'register' | 'logout'): Promise<void> {
    // Perform gentle refresh without showing toast messages
    await this.gentlePageRefresh();
  }

  /**
   * Trigger drawer refresh only (without full page refresh)
   */
  static triggerDrawerRefresh(): void {
    if (globalDrawerRefreshTrigger) {
      globalDrawerRefreshTrigger();
    }
  }
}

export default AppRefreshService;

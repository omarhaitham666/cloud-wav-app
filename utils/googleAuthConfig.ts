import { makeRedirectUri } from "expo-auth-session";
import Constants from "expo-constants";
import { Platform } from "react-native";
export interface GoogleAuthConfig {
  clientId: string;
  redirectUri: string;
  environment: "development" | "production" | "expo" | "standalone";
}

/**
 * Get Google OAuth configuration based on the current environment
 * This function automatically detects whether the app is running in development or production
 * and returns the appropriate configuration
 */
export function getGoogleAuthConfig(): GoogleAuthConfig {
  const isExpoGo = Constants.appOwnership === "expo";

  return {
    clientId: isExpoGo
      ? process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
        "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com"
      : Platform.OS === "android"
      ? process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ||
        "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com"
      : process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ||
        "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
    redirectUri: isExpoGo
      ? process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URI ||
        "https://auth.expo.io/@omar666/cloud-wav"
      : makeRedirectUri({ scheme: "cloudwav", path: "auth" }),
    environment: isExpoGo ? "expo" : "standalone",
  };
}

/**
 * Google OAuth discovery document endpoints
 */
export const googleDiscovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

/**
 * Debug function to log current configuration
 */
export const logGoogleAuthConfig = (config: GoogleAuthConfig) => {
  console.log("🔐 Google Auth Configuration:");
  console.log(`   Environment: ${config.environment}`);
  console.log(`   Client ID: ${config.clientId.substring(0, 20)}...`);
  console.log(`   Redirect URI: ${config.redirectUri}`);
  console.log(`   Is Expo Go: ${config.environment === "expo"}`);
  console.log(`   Is Standalone: ${config.environment === "standalone"}`);
};

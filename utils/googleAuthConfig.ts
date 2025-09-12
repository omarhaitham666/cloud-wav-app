import { makeRedirectUri } from "expo-auth-session";
import Constants from "expo-constants";
import { Platform } from "react-native";

export interface GoogleAuthConfig {
  clientId: string;
  redirectUri: string;
  environment: 'development' | 'production' | 'expo' | 'standalone';
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
      ? "620097653378-oiekfojrsqr66pqrqdk231heib01kl1f.apps.googleusercontent.com" // Web client for Expo Go
      : Platform.OS === "android"
      ? "620097653378-0268ntbcmlqq3j8efk56fgti0fqj5j1s.apps.googleusercontent.com" // Android client for builds
      : "620097653378-0268ntbcmlqq3j8efk56fgti0fqj5j1s.apps.googleusercontent.com", // Fallback
    redirectUri: isExpoGo
      ? "https://auth.expo.io/@omar666/cloud-wav"
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
  console.log(`   Is Expo Go: ${config.environment === 'expo'}`);
  console.log(`   Is Standalone: ${config.environment === 'standalone'}`);
};

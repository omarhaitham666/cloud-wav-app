import { makeRedirectUri } from "expo-auth-session";
import Constants from "expo-constants";

export interface GoogleAuthConfig {
  clientId: string;
  redirectUri: string;
  environment: 'development' | 'production';
}

/**
 * Get Google OAuth configuration based on the current environment
 * This function automatically detects whether the app is running in development or production
 * and returns the appropriate configuration
 */
export const getGoogleAuthConfig = (): GoogleAuthConfig => {
  // Check if we're in development mode
  const isDev = __DEV__ || 
    Constants.expoConfig?.extra?.eas?.projectId === "b6661473-983d-4243-8408-35334958a427" ||
    Constants.expoConfig?.owner === "omar666";

  if (isDev) {
    // Development configuration
    return {
      clientId: "620097653378-oiekfojrsqr66pqrqdk231heib01kl1f.apps.googleusercontent.com",
      redirectUri: "https://auth.expo.io/@omar666/cloud-wav",
      environment: 'development',
    };
  } else {
    // Production configuration
    // TODO: Replace with your production Google OAuth client ID
    // You need to create a new OAuth client in Google Cloud Console for production
    return {
      clientId: "620097653378-0268ntbcmlqq3j8efk56fgti0fqj5j1s.apps.googleusercontent.com", // Replace with production client ID
      redirectUri: makeRedirectUri({
        scheme: "cloudwav",
        path: "auth",
      }),
      environment: 'production',
    };
  }
};

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
  console.log(`   Is Development: ${config.environment === 'development'}`);
};

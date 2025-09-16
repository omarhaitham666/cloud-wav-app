import { makeRedirectUri } from "expo-auth-session";
import Constants from "expo-constants";
import { Platform } from "react-native";

export interface GoogleAuthConfig {
  clientId: string;
  redirectUri: string;
  environment: "development" | "production" | "expo" | "standalone";
}

export function getGoogleAuthConfig(): GoogleAuthConfig {
  const isExpoGo = Constants.appOwnership === "expo";

  return {
    clientId: isExpoGo
      ? "620097653378-8t12ljiavs9l5cgd5qvde19ia56a7d84.apps.googleusercontent.com"
      : Platform.OS === "android"
      ? "620097653378-0268ntbcmlqq3j8efk56fgti0fqj5j1s.apps.googleusercontent.com"
      : "620097653378-0268ntbcmlqq3j8efk56fgti0fqj5j1s.apps.googleusercontent.com",
    redirectUri: isExpoGo
      ? process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URI ||
        "https://auth.expo.io/@omar666/cloud-wav"
      : makeRedirectUri({ scheme: "cloudwav", path: "auth" }),
    environment: isExpoGo ? "expo" : "standalone",
  };
}

export const googleDiscovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

export const logGoogleAuthConfig = (config: GoogleAuthConfig) => {
  console.log("🔐 Google Auth Configuration:");
  console.log(`   Environment: ${config.environment}`);
  console.log(`   Client ID: ${config.clientId.substring(0, 20)}...`);
  console.log(`   Redirect URI: ${config.redirectUri}`);
  console.log(`   Is Expo Go: ${config.environment === "expo"}`);
  console.log(`   Is Standalone: ${config.environment === "standalone"}`);
};

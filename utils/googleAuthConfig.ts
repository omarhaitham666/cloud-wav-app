// utils/googleAuthConfig.ts

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
      ? process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
        "620097653378-u9do7hco0so0r76191n8bthgvkuhnejt.apps.googleusercontent.com"
      : Platform.OS === "android"
      ? "620097653378-0268ntbcmlqq3j8efk56fgti0fqj5j1s.apps.googleusercontent.com"
      : "620097653378-u9do7hco0so0r76191n8bthgvkuhnejt.apps.googleusercontent.com",
    redirectUri: isExpoGo
      ? "https://auth.expo.io/@omar666/cloud-wav"
      : makeRedirectUri({ scheme: "cloudwav", path: "auth" }),
    environment: isExpoGo ? "expo" : "standalone",
  };
}

export const googleDiscovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth", // ✅ بدون مسافات
  tokenEndpoint: "https://oauth2.googleapis.com/token", // ✅ بدون مسافات
  revocationEndpoint: "https://oauth2.googleapis.com/revoke", // ✅ بدون مسافات
};

export const logGoogleAuthConfig = (config: GoogleAuthConfig) => {
  console.log("🔐 Google Auth Configuration:");
  console.log(`   Environment: ${config.environment}`);
  console.log(`   Client ID: ${config.clientId.substring(0, 20)}...`);
  console.log(`   Redirect URI: ${config.redirectUri}`);
  console.log(`   Is Expo Go: ${config.environment === "expo"}`);
  console.log(`   Is Standalone: ${config.environment === "standalone"}`);
};

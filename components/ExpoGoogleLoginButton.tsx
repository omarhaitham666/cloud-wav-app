import { useAuthRequest } from "expo-auth-session";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import Toast from "react-native-toast-message";
import { getGoogleAuthConfig, googleDiscovery, logGoogleAuthConfig } from "../utils/googleAuthConfig";

// Configure WebBrowser for better UX
WebBrowser.maybeCompleteAuthSession();

// Get Google OAuth configuration
const googleConfig = getGoogleAuthConfig();

// Google Icon SVG
const GoogleIcon = () => (
  <SvgXml
    xml={`
      <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    `}
    width={20}
    height={20}
  />
);

export default function ExpoGoogleLoginButton() {
  const { t } = useTranslation();
  const [isInProgress, setIsInProgress] = useState(false);

  // Debug: Log the configuration
  logGoogleAuthConfig(googleConfig);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: googleConfig.clientId,
      scopes: ["openid", "profile", "email"],
      redirectUri: googleConfig.redirectUri,
      responseType: "code",
      extraParams: {
        access_type: "offline",
      },
    },
    googleDiscovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      handleAuthResponse(response.params.code);
    }
  }, [response]);

  const handleAuthResponse = async (code: string) => {
    try {
      setIsInProgress(true);
      
      // Exchange authorization code for tokens
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: googleConfig.clientId,
          code,
          grant_type: "authorization_code",
          redirect_uri: googleConfig.redirectUri,
        }).toString(),
      });

      const tokens = await tokenResponse.json();

      if (tokens.access_token) {
        // Get user info
        const userResponse = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokens.access_token}`
        );
        const userInfo = await userResponse.json();

        // Navigate to profile with user data
        router.push({
          pathname: "/(drawer)/(tabs)/profile",
          params: {
            email: userInfo.email,
            name: userInfo.name,
            image: userInfo.picture,
          },
        });
      } else {
        Toast.show({
          type: "error",
          text1: t("auth.error"),
          text2: t("auth.Google Sign In Failed"),
        });
      }
    } catch (error) {
      console.error("Google Auth Error:", error);
      Toast.show({
        type: "error",
        text1: t("auth.error"),
        text2: t("auth.somethingWentWrong"),
      });
    } finally {
      setIsInProgress(false);
    }
  };

  const handleGoogleLogin = () => {
    if (request) {
      console.log("🚀 Starting Google Auth:", {
        clientId: request.clientId.substring(0, 20) + "...",
        redirectUri: request.redirectUri,
        scopes: request.scopes,
        responseType: request.responseType,
        environment: googleConfig.environment,
        isExpoGo: googleConfig.environment === 'expo',
        isStandalone: googleConfig.environment === 'standalone',
      });
      promptAsync();
    }
  };

  return (
    <TouchableOpacity
      onPress={handleGoogleLogin}
      disabled={isInProgress || !request}
      className="bg-white border border-gray-300 py-3 px-4 mb-5 rounded-md flex-row items-center justify-center"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      {isInProgress ? (
        <ActivityIndicator color="#4285F4" size="small" />
      ) : (
        <View className="flex-row items-center">
          <GoogleIcon />
          <Text className="text-gray-700 font-medium text-base ml-3">
            {t("auth.login.continueWithGoogle")}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

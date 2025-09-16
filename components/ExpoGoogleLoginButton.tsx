import { GoogleIcon } from "@/assets/icons/GoogleIcon";
import { useAuthRequest } from "expo-auth-session";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import {
  getGoogleAuthConfig,
  googleDiscovery,
  logGoogleAuthConfig,
} from "../utils/googleAuthConfig";

WebBrowser.maybeCompleteAuthSession();

const googleConfig = getGoogleAuthConfig();

export default function ExpoGoogleLoginButton() {
  const { t } = useTranslation();
  const [isInProgress, setIsInProgress] = useState(false);

  logGoogleAuthConfig(googleConfig);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: googleConfig.clientId,
      scopes: ["openid", "profile", "email"],
      redirectUri: googleConfig.redirectUri,
      responseType: "code",
    },
    googleDiscovery
  );

  useEffect(() => {
    if (response?.type === "success" && response.params.access_token) {
      handleAuthResponse(response.params.access_token);
    }
  }, [response]);

  const handleAuthResponse = async (accessToken: string) => {
    try {
      setIsInProgress(true);
      const apiResponse = await fetch(
        "https://api.cloudwavproduction.com/api/auth/google/mobile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: accessToken }),
        }
      );

      const result = await apiResponse.json();

      if (apiResponse.ok) {
        router.push({
          pathname: "/(drawer)/(tabs)/profile",
          params: {
            email: result?.user?.email ?? "",
            name: result?.user?.name ?? "",
            image: result?.user?.picture ?? "",
          },
        });
      } else {
        Toast.show({
          type: "error",
          text1: t("auth.error"),
          text2: result.message || t("auth.Google Sign In Failed"),
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
        isExpoGo: googleConfig.environment === "expo",
        isStandalone: googleConfig.environment === "standalone",
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
          <Text className="text-gray-700 font-medium ml-3">
            {t("auth.login.continueWithGoogle")}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

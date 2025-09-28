import { GoogleIcon } from "@/assets/icons/GoogleIcon";
import { makeRedirectUri } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

WebBrowser.maybeCompleteAuthSession();

export default function ExpoGoogleLoginButton() {
  const { t } = useTranslation();
  const [isInProgress, setIsInProgress] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Force use Expo proxy to avoid redirect URI issues
  const redirectUri = useMemo(() => {
    // Always use Expo proxy for Google Auth
    return makeRedirectUri({
      scheme: "cloudwav",
      path: "oauth",
    });
  }, []);

  console.log("Using Redirect URI:", redirectUri);

  const [request, response, promptAsync] = Google.useAuthRequest({
    // Use Web Client ID for all platforms when using Expo proxy
    clientId:
      "620097653378-u9do7hco0so0r76191n8bthgvkuhnejt.apps.googleusercontent.com",

    // Don't specify platform-specific client IDs when using proxy
    // androidClientId: undefined,
    // webClientId: undefined,

    responseType: "id_token",
    scopes: ["openid", "profile", "email"],
    extraParams: {
      prompt: "select_account",
    },
    redirectUri,
  });

  useEffect(() => {
    if (!response) return;

    setIsLoading(false);

    console.log("Auth response type:", response.type);

    if (response.type === "success") {
      const { id_token } = response.params || {};
      console.log("Success! ID Token received:", !!id_token);

      setErrorMsg(null);

      if (id_token) {
        handleAuthResponse(id_token);
      } else {
        console.error("No id_token in success response");
      }
    } else if (response.type === "error") {
      const err = (response as any)?.error || {};
      console.error("Google Auth Error Full Details:", {
        error: err,
        params: response.params,
        redirectUri,
      });

      setErrorMsg(err.error_description || err.error || "Unknown error");
      Toast.show({
        type: "error",
        text1: t("auth.error"),
        text2: err.error_description || "Authentication failed",
      });
    } else if (response.type === "cancel") {
      console.log("Auth cancelled by user");
      setErrorMsg("cancelled by user or system");
    }
  }, [response, t, redirectUri]);

  const handleGoogleLogin = () => {
    if (!request || isInProgress || isLoading) {
      console.log("Login blocked:", {
        request: !!request,
        isInProgress,
        isLoading,
      });
      return;
    }

    console.log("Starting Google auth...");
    console.log("Request details:", {
      redirectUri,
      clientId:
        "620097653378-u9do7hco0so0r76191n8bthgvkuhnejt.apps.googleusercontent.com",
    });

    setIsLoading(true);
    setErrorMsg(null);

    // Always use proxy with these settings
    promptAsync({
      useProxy: true,
      showInRecents: true,
    });
  };

  const handleAuthResponse = async (idToken: string) => {
    try {
      setIsInProgress(true);
      console.log("Processing auth response...");

      const apiResponse = await fetch(
        "https://api.cloudwavproduction.com/api/auth/google/mobile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + idToken,
          },
          body: JSON.stringify({ token: idToken }),
        }
      );

      const result = await apiResponse.json();
      console.log("Backend response status:", apiResponse.status);

      if (apiResponse.ok) {
        console.log("Auth successful, navigating to profile...");
        router.push({
          pathname: "/(drawer)/(tabs)/profile",
          params: {
            email: result?.user?.email ?? "",
            name: result?.user?.name ?? "",
            image: result?.user?.picture ?? "",
          },
        });
      } else {
        console.error("Backend error:", result);
        Toast.show({
          type: "error",
          text1: t("auth.error"),
          text2: result.message || "Google Sign In Failed",
        });
      }
    } catch (error) {
      console.error("API request failed:", error);
      Toast.show({
        type: "error",
        text1: t("auth.error"),
        text2: t("auth.somethingWentWrong"),
      });
    } finally {
      setIsInProgress(false);
    }
  };

  // Show loading while request is being prepared
  if (!request) {
    return (
      <View className="bg-gray-100 border border-gray-300 py-3 px-4 mb-5 rounded-md flex-row items-center justify-center">
        <ActivityIndicator color="#4285F4" size="small" />
        <Text className="text-gray-500 font-medium ml-3">
          Preparing Google Sign-In...
        </Text>
      </View>
    );
  }

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
        opacity: isInProgress || !request ? 0.6 : 1,
      }}
    >
      {isInProgress ? (
        <View className="flex-row items-center">
          <ActivityIndicator color="#4285F4" size="small" />
          <Text className="text-gray-700 font-medium ml-3">Signing in...</Text>
        </View>
      ) : (
        <View className="flex-row items-center">
          <GoogleIcon />
          <Text className="text-gray-700 font-medium ml-3">
            {t("auth.login.continueWithGoogle")}
          </Text>
          {__DEV__ && (
            <Text className="text-xs text-gray-400 ml-1">(Proxy)</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

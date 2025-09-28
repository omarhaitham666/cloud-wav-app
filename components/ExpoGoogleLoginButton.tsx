import { makeRedirectUri } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

WebBrowser.maybeCompleteAuthSession();

interface GoogleLoginProps {
  onSuccess?: (idToken: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

export default function GoogleLoginButton({
  onSuccess,
  onError,
  disabled = false,
}: GoogleLoginProps) {
  const redirectUri = useMemo(() => makeRedirectUri({ useProxy: true }), []);

  console.log("ExpoGo Redirect URI =>", redirectUri);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "620097653378-0268ntbcmlqq3j8efk56fgti0fqj5j1s.apps.googleusercontent.com",
    webClientId:
      "620097653378-dnki0i54cepum6oag9slv9htprc9q7ff.apps.googleusercontent.com",
    responseType: "id_token",
    scopes: ["openid", "profile", "email"],
    extraParams: { prompt: "select_account" },
    redirectUri,
  });

  useEffect(() => {
    if (!response) return;

    setIsLoading(false);

    if (response.type === "success") {
      const { id_token } = response.params || {};
      console.log("Google idToken ->", id_token);
      setErrorMsg(null);

      if (id_token) {
        onSuccess?.(id_token);
      }
    } else if (response.type === "error") {
      const err = (response as any)?.error || {};
      const errorMessage =
        err?.description ||
        err?.message ||
        "An unknown error occurred during Google Sign-In";
      setErrorMsg(errorMessage);
      onError?.(errorMessage);
    } else if (response.type === "cancel") {
      setErrorMsg("cancelled by user or system");
      onError?.("cancelled by user or system");
    }
  }, [response, onSuccess, onError]);

  const handlePress = () => {
    if (!request || disabled || isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);
    promptAsync({ useProxy: true, showInRecents: true });
  };

  const isButtonDisabled = !request || disabled || isLoading;

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.googleButton, isButtonDisabled && styles.buttonDisabled]}
        onPress={handlePress}
        disabled={isButtonDisabled}
        android_ripple={{ color: "#4285f4", borderless: false }}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#4285f4" />
        ) : (
          <Ionicons name="logo-google" size={20} color="#4285f4" />
        )}

        <Text
          style={[
            styles.buttonText,
            isButtonDisabled && styles.buttonTextDisabled,
          ]}
        >
          {isLoading ? " loading ..." : "login with Google"}
        </Text>
      </Pressable>

      {!request && !isLoading && (
        <Text style={styles.preparingText}>loading Google Sign-In...</Text>
      )}

      {errorMsg && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color="#dc3545" />
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}

      {__DEV__ && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugTitle}> Debug Info:</Text>
          <Text style={styles.debugText}>Redirect URI: {redirectUri}</Text>
          <Text style={styles.debugText}>
            sure to add this URI in Google Cloud Console OAuth credentials for
            both Android and Web client IDs.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dadce0",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: "#f8f9fa",
    borderColor: "#e8eaed",
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#3c4043",
    textAlign: "center",
  },
  buttonTextDisabled: {
    color: "#9aa0a6",
  },
  preparingText: {
    fontSize: 12,
    color: "#5f6368",
    textAlign: "center",
    fontStyle: "italic",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef7f7",
    borderRadius: 6,
    padding: 12,
    gap: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#dc3545",
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: "#dc3545",
    lineHeight: 20,
  },
  debugContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e8eaed",
    marginTop: 8,
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#202124",
    marginBottom: 4,
  },
  debugText: {
    fontSize: 11,
    color: "#5f6368",
    lineHeight: 16,
  },
});

import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

export default function GoogleLoginButton() {
  const { t, i18n } = useTranslation();
  const [isInProgress, setIsInProgress] = useState(false);
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "620097653378-oiekfojrsqr66pqrqdk231heib01kl1f.apps.googleusercontent.com",
      profileImageSize: 150,
    });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setIsInProgress(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const { idToken, user } = response.data;
        const { email, name, photo } = user;
        router.push({
          pathname: "/(drawer)/(tabs)/profile",
          params: {
            email: email,
            name: name,
            image: photo,
          },
        });
        setIsInProgress(true);
      } else {
        Toast.show({
          type: "error",
          text1: t("auth.error"),
          text2: t("auth.Google Sign In Failed"),
        });
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            Toast.show({
              type: "error",
              text1: t("auth.error"),
              text2: t("auth.Google Sign In Cancelled"),
            });
            break;
          case statusCodes.IN_PROGRESS:
            Toast.show({
              type: "error",
              text1: t("auth.error"),
              text2: t("auth.Google Sign In In Progress"),
            });
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Toast.show({
              type: "error",
              text1: t("auth.error"),
              text2: t("auth.Google Sign In Play Services Not Available"),
            });
            break;
          default:
            Toast.show({
              type: "error",
              text1: t("auth.error"),
              text2: error.message,
            });
            break;
        }
      } else {
        Toast.show({
          type: "error",
          text1: t("auth.error"),
          text2: t("auth.somethingWentWrong"),
        });
      }
      setIsInProgress(false);
    }
  };

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={() => {
        handleGoogleLogin();
      }}
      disabled={isInProgress}
    />
  );
}

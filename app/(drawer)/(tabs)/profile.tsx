import AuthProfile from "@/components/profile/AuthProfile";
import ProfileUser from "@/components/profile/ProfileUser";
import { useAuthRefresh } from "@/hooks/useAuthRefresh";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useAuth } from "@/store/auth-context";
import {
  ANIMATION_DELAY,
  getResponsiveSpacing,
  getSafeAreaInsets,
  useFadeIn,
  usePageTransition,
  useSlideIn,
} from "@/utils/animations";
import { getToken } from "@/utils/secureStore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import Animated, { BounceIn, SlideInUp } from "react-native-reanimated";

const Profile = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const spacing = getResponsiveSpacing();
  const safeArea = getSafeAreaInsets();

  const { animatedStyle: pageStyle, enterPage } = usePageTransition();
  const { animatedStyle: loadingStyle, startAnimation: startLoadingAnimation } =
    useFadeIn(0);
  const { animatedStyle: contentStyle, startAnimation: startContentAnimation } =
    useSlideIn("up", ANIMATION_DELAY.SMALL);

  const { refreshControl, scrollViewRef, TopLoader } = usePullToRefresh({
    onRefresh: async () => {
      await checkAuthToken();
    },
    scrollToTopOnRefresh: true,
    showTopLoader: true,
  });

  useEffect(() => {
    checkAuthToken();
    enterPage();
    startLoadingAnimation();
  }, [enterPage, startLoadingAnimation, startContentAnimation]);

  useAuthRefresh(() => {
    if (user) {
      setIsAuthenticated(true);
      setIsLoading(false);
      startContentAnimation();
    } else {
      checkAuthToken();
    }
  });

  const checkAuthToken = async () => {
    try {
      const token = await getToken("access_token");
      const authenticated = !!token;
      setIsAuthenticated(authenticated);

      if (authenticated) {
        startContentAnimation();
      }
    } catch (error) {
      console.error("Error checking auth token:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Animated.View
        style={[
          {
            flex: 1,
            backgroundColor: "#8B5CF6",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: safeArea.top,
            paddingBottom: safeArea.bottom,
          },
          pageStyle,
          loadingStyle,
        ]}
      >
        <Animated.View entering={BounceIn.delay(200).springify()}>
          <ActivityIndicator size="large" color="#fff" />
        </Animated.View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[{ flex: 1 }, pageStyle]}>
      <TopLoader />
      <ScrollView
        ref={scrollViewRef}
        style={[{ flex: 1 }, contentStyle]}
        refreshControl={refreshControl as any}
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: safeArea.top,
          paddingBottom: safeArea.bottom + spacing.padding.medium,
          minHeight: "100%",
        }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={SlideInUp.delay(300).springify()}
          style={{
            width: "100%",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isAuthenticated ? <ProfileUser /> : <AuthProfile />}
        </Animated.View>
      </ScrollView>
    </Animated.View>
  );
};

export default Profile;

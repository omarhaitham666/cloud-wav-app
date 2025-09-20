import AuthProfile from "@/components/profile/AuthProfile";
import ProfileUser from "@/components/profile/ProfileUser";
import SplashScreen from "@/components/SplashScreen";
import { useAuthRefresh } from "@/hooks/useAuthRefresh";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useAuth } from "@/store/auth-context";
import { getResponsiveSpacing, getSafeAreaInsets } from "@/utils/animations";
import { getToken } from "@/utils/secureStore";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

const Profile = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const spacing = getResponsiveSpacing();
  const safeArea = getSafeAreaInsets();

  const { refreshControl, scrollViewRef, TopLoader } = usePullToRefresh({
    onRefresh: async () => {
      await checkAuthToken();
    },
    scrollToTopOnRefresh: true,
    showTopLoader: true,
  });

  useEffect(() => {
    checkAuthToken();
  }, []);

  useAuthRefresh(() => {
    if (user) {
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      checkAuthToken();
    }
  });

  const checkAuthToken = async () => {
    try {
      const token = await getToken("access_token");
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error("Error checking auth token:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <SplashScreen />;

  return (
    <View style={{ flex: 1 }}>
      <TopLoader />
      <ScrollView
        ref={scrollViewRef}
        refreshControl={refreshControl as any}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: safeArea.bottom + spacing.padding.medium,
        }}
        showsVerticalScrollIndicator={false}
      >
        {isAuthenticated ? <ProfileUser /> : <AuthProfile />}
      </ScrollView>
    </View>
  );
};

export default Profile;

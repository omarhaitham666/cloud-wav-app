import AuthProfile from "@/components/profile/AuthProfile";
import ProfileUser from "@/components/profile/ProfileUser";
import { useAuthRefresh } from "@/hooks/useAuthRefresh";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useAuth } from "@/store/auth-context";
import { getToken } from "@/utils/secureStore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

const Profile = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

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

  if (isLoading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <TopLoader />
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        refreshControl={refreshControl as any}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {isAuthenticated ? <ProfileUser /> : <AuthProfile />}
      </ScrollView>
    </View>
  );
};

export default Profile;

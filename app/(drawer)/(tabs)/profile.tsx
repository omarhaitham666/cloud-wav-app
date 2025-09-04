import AuthProfile from "@/components/profile/AuthProfile";
import ProfileUser from "@/components/profile/ProfileUser";
import { getToken } from "@/utils/secureStore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

const Profile = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthToken();
  }, []);

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

  return isAuthenticated ? <ProfileUser /> : <AuthProfile />;
};

export default Profile;

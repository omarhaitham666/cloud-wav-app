import AuthScreen from "@/components/profile/AuthProfileScreen";
import ProfileDashboard from "@/components/profile/ProfileDashboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
      const token = await AsyncStorage.getItem("access_token");
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
      <View className="flex-1 bg-indigo-500 justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return isAuthenticated ? <ProfileDashboard /> : <AuthScreen />;
};

export default Profile;

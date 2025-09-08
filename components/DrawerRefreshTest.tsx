import { useDrawerRefresh } from '@/store/drawerRefreshContext';
import AppRefreshService from '@/utils/appRefresh';
import { AppFonts } from '@/utils/fonts';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

/**
 * Test component to demonstrate drawer refresh functionality
 * This component can be temporarily added to any screen for testing
 */
export default function DrawerRefreshTest() {
  const { refreshKey, triggerDrawerRefresh } = useDrawerRefresh();

  const handleTestDrawerRefresh = () => {
    triggerDrawerRefresh();
    Alert.alert('Drawer Refresh', 'Drawer content will refresh!');
  };

  const handleTestFullRefresh = async () => {
    await AppRefreshService.gentlePageRefresh();
    Alert.alert('Full Refresh', 'Both screen and drawer will refresh!');
  };

  const handleTestAuthRefresh = async () => {
    await AppRefreshService.refreshAfterAuthChange('login');
    Alert.alert('Auth Refresh', 'Auth change refresh triggered!');
  };

  return (
    <View className="p-4 bg-gray-100 m-4 rounded-lg">
      <Text 
        className="text-lg font-bold mb-4 text-center"
        style={{ fontFamily: AppFonts.bold }}
      >
        Drawer Refresh Test
      </Text>
      
      <Text 
        className="text-sm text-gray-600 mb-4 text-center"
        style={{ fontFamily: AppFonts.regular }}
      >
        Refresh Key: {refreshKey}
      </Text>
      
      <TouchableOpacity
        className="bg-blue-500 py-3 px-4 rounded-md mb-3"
        onPress={handleTestDrawerRefresh}
      >
        <Text 
          className="text-white text-center font-semibold"
          style={{ fontFamily: AppFonts.semibold }}
        >
          Test Drawer Refresh Only
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-green-500 py-3 px-4 rounded-md mb-3"
        onPress={handleTestFullRefresh}
      >
        <Text 
          className="text-white text-center font-semibold"
          style={{ fontFamily: AppFonts.semibold }}
        >
          Test Full Refresh (Screen + Drawer)
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-purple-500 py-3 px-4 rounded-md mb-3"
        onPress={handleTestAuthRefresh}
      >
        <Text 
          className="text-white text-center font-semibold"
          style={{ fontFamily: AppFonts.semibold }}
        >
          Test Auth Change Refresh
        </Text>
      </TouchableOpacity>

      <Text 
        className="text-xs text-gray-500 text-center mt-2"
        style={{ fontFamily: AppFonts.regular }}
      >
        The drawer will update when you refresh any screen
      </Text>
    </View>
  );
}

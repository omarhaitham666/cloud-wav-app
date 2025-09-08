import AppRefreshService from '@/utils/appRefresh';
import React, { useCallback, useRef, useState } from 'react';
import { Animated, RefreshControl, ScrollView } from 'react-native';

export interface UsePullToRefreshOptions {
  onRefresh?: () => Promise<void> | void;
  useAppRefresh?: boolean;
  refreshMessage?: string;
  refreshDescription?: string;
  scrollToTopOnRefresh?: boolean;
  showTopLoader?: boolean;
}

export interface UsePullToRefreshReturn {
  isRefreshing: boolean;
  refreshControl: React.ReactElement;
  handleRefresh: () => Promise<void>;
  scrollViewRef: React.RefObject<ScrollView | null>;
  TopLoader: React.ComponentType;
  showTopLoader: boolean;
}

export const usePullToRefresh = (options: UsePullToRefreshOptions = {}): UsePullToRefreshReturn => {
  const {
    onRefresh,
    useAppRefresh = false,
    scrollToTopOnRefresh = true,
    showTopLoader = true
  } = options;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTopLoaderVisible, setIsTopLoaderVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const topLoaderOpacity = useRef(new Animated.Value(0)).current;
  const spinValue = useRef(new Animated.Value(0)).current;

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    
    // Show top loader if enabled
    if (showTopLoader) {
      setIsTopLoaderVisible(true);
      Animated.timing(topLoaderOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
      // Start spinning animation
      spinValue.setValue(0);
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    }

    // Scroll to top if enabled
    if (scrollToTopOnRefresh && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }

    try {
      if (useAppRefresh) {
        // Use the app refresh service for full app reload
        await AppRefreshService.refreshApp({
          showToast: false,
          delay: 500,
        });
      } else if (onRefresh) {
        // Use custom refresh function
        await onRefresh();
      } else {
        // Trigger drawer refresh for any refresh action
        AppRefreshService.triggerDrawerRefresh();
      }
    } catch (error) {
      console.error('Pull to refresh error:', error);
    } finally {
      setIsRefreshing(false);
      
      // Hide top loader after a delay
      if (showTopLoader) {
        setTimeout(() => {
          Animated.timing(topLoaderOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            setIsTopLoaderVisible(false);
            spinValue.stopAnimation();
          });
        }, 1000);
      }
    }
  }, [isRefreshing, onRefresh, useAppRefresh, scrollToTopOnRefresh, showTopLoader, topLoaderOpacity, spinValue]);

  const refreshControl = React.createElement(RefreshControl, {
    refreshing: isRefreshing,
    onRefresh: handleRefresh,
    colors: ['#4f46e5', '#22c55e'],
    tintColor: "#4f46e5",
    title: "Pull to refresh",
    titleColor: "#6b7280"
  });

  // Top loader component
  const TopLoader = () => {
    if (!showTopLoader || !isTopLoaderVisible) return null;
  };

  return {
    isRefreshing,
    refreshControl,
    handleRefresh,
    scrollViewRef,
    TopLoader,
    showTopLoader: isTopLoaderVisible,
  };
};

export default usePullToRefresh;

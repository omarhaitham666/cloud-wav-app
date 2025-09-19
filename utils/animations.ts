import { Dimensions, Platform } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Animation timing constants
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 800,
};

export const ANIMATION_DELAY = {
  NONE: 0,
  SMALL: 100,
  MEDIUM: 200,
  LARGE: 300,
};

export const SPRING_CONFIG = {
  gentle: {
    damping: 20,
    stiffness: 90,
    mass: 1,
  },
  bouncy: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  snappy: {
    damping: 25,
    stiffness: 200,
    mass: 1,
  },
};

// Common animation hooks
export const useFadeIn = (delay = 0, duration = ANIMATION_DURATION.NORMAL) => {
  const opacity = useSharedValue(0);

  const startAnimation = () => {
    opacity.value = withDelay(delay, withTiming(1, { duration }));
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return { animatedStyle, startAnimation, opacity };
};

export const useSlideIn = (
  direction: "up" | "down" | "left" | "right" = "up",
  delay = 0,
  duration = ANIMATION_DURATION.NORMAL
) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  const getInitialValues = () => {
    switch (direction) {
      case "up":
        return { translateY: 50, translateX: 0 };
      case "down":
        return { translateY: -50, translateX: 0 };
      case "left":
        return { translateY: 0, translateX: 50 };
      case "right":
        return { translateY: 0, translateX: -50 };
      default:
        return { translateY: 50, translateX: 0 };
    }
  };

  const startAnimation = () => {
    const { translateX: initialX, translateY: initialY } = getInitialValues();
    translateX.value = initialX;
    translateY.value = initialY;
    opacity.value = 0;

    translateX.value = withDelay(delay, withSpring(0, SPRING_CONFIG.gentle));
    translateY.value = withDelay(delay, withSpring(0, SPRING_CONFIG.gentle));
    opacity.value = withDelay(delay, withTiming(1, { duration }));
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return { animatedStyle, startAnimation, translateX, translateY, opacity };
};

export const useScaleIn = (delay = 0, duration = ANIMATION_DURATION.NORMAL) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  const startAnimation = () => {
    scale.value = withDelay(delay, withSpring(1, SPRING_CONFIG.bouncy));
    opacity.value = withDelay(delay, withTiming(1, { duration }));
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return { animatedStyle, startAnimation, scale, opacity };
};

// Simple stagger animation hook that works with predefined item counts
export const useStaggerAnimation = (
  itemCount: number,
  staggerDelay = 100,
  baseDelay = 0
) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  const startAnimation = () => {
    opacity.value = withDelay(
      baseDelay,
      withTiming(1, { duration: ANIMATION_DURATION.NORMAL })
    );
    translateY.value = withDelay(
      baseDelay,
      withSpring(0, SPRING_CONFIG.gentle)
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return { animatedStyle, startAnimation };
};

// Page transition animations
export const usePageTransition = () => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  const enterPage = () => {
    opacity.value = withTiming(1, { duration: ANIMATION_DURATION.SLOW });
    translateY.value = withSpring(0, SPRING_CONFIG.gentle);
  };

  const exitPage = (callback?: () => void) => {
    opacity.value = withTiming(0, { duration: ANIMATION_DURATION.FAST });
    translateY.value = withTiming(
      30,
      { duration: ANIMATION_DURATION.FAST },
      () => {
        if (callback) runOnJS(callback)();
      }
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return { animatedStyle, enterPage, exitPage };
};

// Card hover animations
export const useCardHover = () => {
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.1);

  const onPressIn = () => {
    scale.value = withSpring(0.98, SPRING_CONFIG.snappy);
    shadowOpacity.value = withTiming(0.3, {
      duration: ANIMATION_DURATION.FAST,
    });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, SPRING_CONFIG.snappy);
    shadowOpacity.value = withTiming(0.1, {
      duration: ANIMATION_DURATION.FAST,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: shadowOpacity.value,
  }));

  return { animatedStyle, onPressIn, onPressOut };
};

// List item animations
export const useListItemAnimation = (index: number, delay = 0) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(screenWidth * 0.3);
  const scale = useSharedValue(0.9);

  const startAnimation = () => {
    const itemDelay = delay + index * 50;

    opacity.value = withDelay(
      itemDelay,
      withTiming(1, { duration: ANIMATION_DURATION.NORMAL })
    );
    translateX.value = withDelay(
      itemDelay,
      withSpring(0, SPRING_CONFIG.gentle)
    );
    scale.value = withDelay(itemDelay, withSpring(1, SPRING_CONFIG.gentle));
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  return { animatedStyle, startAnimation };
};

// Loading shimmer animation
export const useShimmer = () => {
  const shimmerOpacity = useSharedValue(0.3);

  const startShimmer = () => {
    shimmerOpacity.value = withTiming(1, { duration: 1000 }, () => {
      shimmerOpacity.value = withTiming(0.3, { duration: 1000 });
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: shimmerOpacity.value,
  }));

  return { animatedStyle, startShimmer };
};

// Parallax scroll animation
export const useParallaxScroll = (scrollY: Animated.SharedValue<number>) => {
  const parallaxStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 200],
      [0, -50],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
    };
  });

  return { parallaxStyle };
};

// Responsive spacing utilities
export const getResponsiveSpacing = () => {
  const isSmallScreen = screenWidth < 375;
  const isMediumScreen = screenWidth >= 375 && screenWidth < 414;

  return {
    padding: {
      small: isSmallScreen ? 12 : isMediumScreen ? 16 : 20,
      medium: isSmallScreen ? 16 : isMediumScreen ? 20 : 24,
      large: isSmallScreen ? 20 : isMediumScreen ? 24 : 32,
    },
    margin: {
      small: isSmallScreen ? 8 : isMediumScreen ? 12 : 16,
      medium: isSmallScreen ? 12 : isMediumScreen ? 16 : 20,
      large: isSmallScreen ? 16 : isMediumScreen ? 20 : 24,
    },
    fontSize: {
      small: isSmallScreen ? 12 : isMediumScreen ? 14 : 16,
      medium: isSmallScreen ? 14 : isMediumScreen ? 16 : 18,
      large: isSmallScreen ? 16 : isMediumScreen ? 18 : 20,
      xlarge: isSmallScreen ? 18 : isMediumScreen ? 20 : 24,
    },
    iconSize: {
      small: isSmallScreen ? 16 : isMediumScreen ? 18 : 20,
      medium: isSmallScreen ? 20 : isMediumScreen ? 22 : 24,
      large: isSmallScreen ? 24 : isMediumScreen ? 26 : 28,
    },
  };
};

// Safe area utilities for different phone sizes
export const getSafeAreaInsets = () => {
  const isSmallScreen = screenWidth < 375;
  const isNotchDevice = screenHeight > 800;

  return {
    top:
      Platform.OS === "ios"
        ? isNotchDevice
          ? 44
          : 20
        : isSmallScreen
        ? 24
        : 28,
    bottom:
      Platform.OS === "ios"
        ? isNotchDevice
          ? 34
          : 0
        : isSmallScreen
        ? 16
        : 20,
    horizontal: isSmallScreen ? 16 : 20,
  };
};

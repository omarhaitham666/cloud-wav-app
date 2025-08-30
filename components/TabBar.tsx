import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
  BadgeDollarSign,
  House,
  Music,
  Search,
  User,
} from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const { bottom } = useSafeAreaInsets();

  const getIconComponent = (routeName: string, isFocused: boolean) => {
    const color = isFocused ? "#4f46e5" : "#9ca3af";
    const size = 24;

    switch (routeName) {
      case "index":
        return <House color={color} size={size} />;
      case "search":
        return <Search color={color} size={size} />;
      case "price":
        return <BadgeDollarSign color={color} size={size} />;
      case "profile":
        return <User color={color} size={size} />;
      default:
        return <House color={color} size={size} />;
    }
  };

  return (
    <View
      className="flex-row absolute bottom-0 left-0 right-0 bg-white items-center justify-around"
      style={{
        height: 70 + bottom,
        paddingBottom: bottom,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
        zIndex: 10,
      }}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (route.name === "music") {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.8}
              className="items-center justify-center -mt-3"
            >
              <View className="w-16 h-16 rounded-full bg-indigo-600 items-center justify-center shadow-lg">
                <Music color="white" size={24} />
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            className="flex-1 items-center justify-center"
          >
            {getIconComponent(route.name, isFocused)}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

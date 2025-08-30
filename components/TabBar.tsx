import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
  BadgeDollarSign,
  Chrome as Home,
  House,
  Music,
  Search,
  User,
} from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

export function TabBar({ state, navigation }: BottomTabBarProps) {
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
        return <Home color={color} size={size} />;
    }
  };

  return (
    <View className="flex-row  absolute bottom-0 left-0 right-0 bg-white h-24 items-center justify-around  shadow-md">
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
              className="items-center justify-center -mt-8"
            >
              <View className="w-14 h-14 rounded-full bg-indigo-600 items-center justify-center shadow-lg">
                <Music color="white" size={22} />
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            className="flex-1 items-center justify-center py-2"
          >
            {getIconComponent(route.name, isFocused)}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

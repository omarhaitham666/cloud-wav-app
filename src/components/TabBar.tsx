import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { TouchableOpacity, View } from "react-native";

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          backgroundColor: "white",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          // position: "absolute",
          // bottom: 30,
          // left: 0,
          // right: 0,
          height: 50,
        },
      ]}
      className="items-center justify-around shadow-md"
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        if (route.name === "song") {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              className="items-center"
              style={{
                top: -30,
              }}
              activeOpacity={0.8}
            >
              <View className="w-16 h-16 rounded-full bg-indigo-600 items-center justify-center shadow-lg">
                <FontAwesome name="percent" size={22} color="white" />
              </View>
            </TouchableOpacity>
          );
        }

        let iconName: string = "";
        let IconComponent: any = Ionicons;

        if (route.name === "index") {
          iconName = "home-outline";
        } else if (route.name === "search") {
          iconName = "search-outline";
        } else if (route.name === "price") {
          IconComponent = FontAwesome;
          iconName = "music";
        } else if (route.name === "song") {
          IconComponent = Ionicons;
          iconName = "musical-note";
        } else if (route.name === "profile") {
          IconComponent = MaterialIcons;
          iconName = "person-outline";
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            className="items-center mb-3 justify-center flex-1"
            activeOpacity={0.7}
          >
            <IconComponent
              name={iconName}
              size={24}
              style={{ marginBottom: 20 }}
              color={isFocused ? "#4f46e5" : "#9ca3af"}
            />
            {/* <Text
              className={`text-[15px] ${
                isFocused ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              {label as string}
            </Text> */}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

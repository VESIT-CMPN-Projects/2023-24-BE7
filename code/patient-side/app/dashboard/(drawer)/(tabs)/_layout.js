import { View, Text, Button, TouchableOpacity } from "react-native";
import React from "react";
import { Tabs, router, useNavigation } from "expo-router";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { PRIMARY } from "../../../../styles/global";

export default function _layout() {
  const navigation = useNavigation();
  return (
    <Tabs
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity
            style={{ paddingLeft: 15 }}
            onPress={() => navigation.toggleDrawer()}
          >
            <MaterialCommunityIcons name="menu" size={24} color="black" />
          </TouchableOpacity>
        ),
        headerTitleStyle: {
          fontSize: 18,
        },
        headerTitleAlign: "center",
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          tabBarIcon: ({ size, color }) => (
            <FontAwesome5 name="home" size={size} color={color} />
          ),
          tabBarLabel: () => null,
          headerTitle: "Dashboard",
        }}
      />
      <Tabs.Screen
        name="notifications/index"
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="bell" size={size} color={color} />
          ),
          tabBarLabel: () => null,
          headerTitle: "Notifications",
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          tabBarIcon: ({ size, color }) => (
            <FontAwesome5 name="user-alt" size={size} color={color} />
          ),
          tabBarLabel: () => null,
          headerTitle: "Profile",
          headerRight: () => (
            <TouchableOpacity
              style={{ paddingRight: 15 }}
              onPress={() => router.push("dashboard/profile/settings")}
              activeOpacity={0.5}
            >
              <MaterialIcons name="settings" size={24} color={PRIMARY} />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Do not display the header for the ehr section as the layout is defined there. */}
      <Tabs.Screen
        name="profile/ehr"
        options={{
          href: null,
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="home/help"
        options={{
          href: null,
          headerTitle: "Help",
        }}
      />

      <Tabs.Screen
        name="home/awarenessPrograms"
        options={{
          href: null,
          headerTitle: "Awareness Programs",
        }}
      />

      <Tabs.Screen
        name="home/exercises"
        options={{
          href: null,
          headerTitle: "Exercises",
        }}
      />

      <Tabs.Screen
        name="home/meditation"
        options={{
          href: null,
          headerTitle: "Meditation",
        }}
      />

      <Tabs.Screen
        name="home/dietPlan"
        options={{
          href: null,
          headerTitle: "Diet Plan",
        }}
      />

      <Tabs.Screen
        name="profile/settings"
        options={{
          href: null,
          headerTitle: "Settings",
        }}
      />

      <Tabs.Screen
        name="notifications/new_appointment"
        options={{
          href: null,
          headerTitle: "New Appointment",
        }}
      />
    </Tabs>
  );
}

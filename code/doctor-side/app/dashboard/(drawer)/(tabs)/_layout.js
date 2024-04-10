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
        name="home"
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
        name="notifications/[appId]"
        options={{
          href: null,
          tabBarLabel: () => null,
          headerTitle: "Appointment Details",
        }}
      />
      <Tabs.Screen
        name="profile/info/[userId]"
        options={{
          href: null,
          tabBarLabel: () => null,
          headerTitle: "Patient Profile",
        }}
      />
      <Tabs.Screen
        name="profile/recommendation/[userId]"
        options={{
          href: null,
          tabBarLabel: () => null,
          headerTitle: "Doctor Recommendation",
        }}
      />
      <Tabs.Screen
        name="profile/recommendation/addMedicine"
        options={{
          href: null,
          tabBarLabel: () => null,
          headerTitle: "Add Medicine",
        }}
      />
    </Tabs>
  );
}

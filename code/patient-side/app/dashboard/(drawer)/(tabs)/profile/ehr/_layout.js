import React from "react";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const StackLayout = () => {
  const navigation = useNavigation();
  return (
    <Stack
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
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
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Electronic Health Records",
        }}
      />

      <Stack.Screen
        name="healthRecords"
        options={{
          headerTitle: "Health Records",
        }}
      />

      <Stack.Screen
        name="doctorRecommendation"
        options={{
          headerTitle: "Doctor Recommendation",
        }}
      />

      <Stack.Screen
        name="diaryLogs"
        options={{
          headerTitle: "Diary Log",
        }}
      />

      <Stack.Screen
        name="assessmentReports"
        options={{
          headerTitle: "Assessment Reports",
        }}
      />
    </Stack>
  );
};

export default StackLayout;

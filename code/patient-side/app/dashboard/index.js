import { View, Text } from "react-native";
import React from "react";
import { FOURTH } from "../../styles/global";

export default function Dashboard() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: FOURTH,
      }}
    >
      <Text>this is the dashboard page</Text>
    </View>
  );
}

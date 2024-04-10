import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { FOURTH, PRIMARY, THIRD } from "../styles/global";

export default function AcionProgressComponent({ action, progress }) {
  return (
    <View style={styles.container}>
      <View style={styles.uploadingBox}>
        <Text style={[styles.text, styles.uploadingHeader]}>
          {action === "upload" ? "Uploading file..." : "Deleting file..."}
        </Text>
        <View style={styles.bar}>
          {action === "upload" ? (
            <>
              <View style={styles.totalWidth}></View>
              <View
                style={[styles.progressWidth, { width: `${progress}%` }]}
              ></View>
            </>
          ) : (
            <>
              <ActivityIndicator color={PRIMARY} size={"large"} />
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#222222B0",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  text: {
    fontFamily: "Inter_400Regular",
  },
  uploadingBox: {
    backgroundColor: FOURTH,
    padding: 20,
    borderRadius: 8,
    width: "75%",
    elevation: 2,
  },
  uploadingHeader: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    marginBottom: 20,
  },
  totalWidth: {
    position: "relative",
    width: "100%",
    height: 10,
    backgroundColor: THIRD,
    borderRadius: 10,
  },
  progressWidth: {
    // width specified in the component
    position: "absolute",
    height: 10,
    backgroundColor: PRIMARY,
    borderRadius: 10,
  },
});

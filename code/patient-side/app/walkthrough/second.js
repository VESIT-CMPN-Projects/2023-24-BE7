import React from "react";
import { Text, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { FOURTH, PRIMARY, SECONDARY } from "../../styles/global.js";
import { router } from "expo-router";

const Walkthrough2 = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../../assets/schedule_appointments.jpg")}
      />
      <Text style={styles.title}>Schedule Appointments</Text>
      <Text style={styles.description}>
        Seamlessly book consultations with specialists, ensuring timely
        check-ups and expert advice to stay ahead in managing your health
      </Text>
      <TouchableOpacity
        onPress={() => router.replace("/walkthrough/third")}
        activeOpacity={0.8}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 250,
    marginBottom: 20,
    borderRadius: 5,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: FOURTH,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    color: PRIMARY,
  },
  description: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
    color: SECONDARY,
  },
  button: {
    width: 300,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: PRIMARY,
    marginTop: 56,
  },
  buttonText: {
    fontSize: 18,
    lineHeight: 21,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.25,
    color: "white",
  },
});

export default Walkthrough2;

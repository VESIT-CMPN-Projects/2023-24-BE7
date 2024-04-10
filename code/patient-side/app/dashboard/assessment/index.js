import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FOURTH, PRIMARY, SECONDARY } from "../../../styles/global";
import { router } from "expo-router";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const StrokeAssessmentLanding = () => {
  const [userDetails, setUserDetails] = useState(null);

  const fetchUser = async () => {
    const user = auth().currentUser;

    if (user) {
      // User is signed in, find the document from firestore.
      firestore()
        .collection("users")
        .doc(user.uid)
        .onSnapshot((docSnap) => {
          setUserDetails({
            uid: user.uid,
            ...docSnap.data(),
          });
        });
    } else {
      // No user is signed in. redirect to login.
      // console.log("No user is currently signed in");
      router.replace("/Login");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {!userDetails ? (
        <ActivityIndicator size={"large"} color={PRIMARY} style={{ flex: 1 }} />
      ) : (
        <View style={styles.disclaimer}>
          <Text style={[styles.text, styles.title]}>
            Looks Like You are New Here
          </Text>
          <Text style={[styles.text, styles.heading]}>
            Take up a simple stroke assessment
          </Text>
          <Text style={[styles.text, styles.description]}>
            Elevate stroke risk assessment with our user-friendly questionnaire,
            guiding users through expertly crafted questions, each contributing
            to a predictive scoring system.
          </Text>
          <Text style={[styles.text, styles.description, styles.boldDesc]}>
            Please mark accurate answers to all the questions.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              router.replace("dashboard/assessment/questionspage1")
            }
            activeOpacity={0.8}
          >
            <Text style={[styles.text, styles.buttonText]}>Start</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default StrokeAssessmentLanding;

const styles = StyleSheet.create({
  disclaimer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: FOURTH,
  },
  text: {
    fontFamily: "Inter_400Regular",
  },
  title: {
    color: PRIMARY,
    fontSize: 22,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 40,
  },
  heading: {
    fontSize: 18,
    marginBottom: 24,
    fontFamily: "Inter_500Medium",
  },
  description: {
    fontSize: 16,
    textAlign: "justify",
    color: SECONDARY,
    width: "100%",
    lineHeight: 25,
  },
  boldDesc: {
    marginTop: 15,
    fontFamily: "Inter_600SemiBold",
  },
  button: {
    width: 250,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: PRIMARY,
    marginTop: 80,
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    lineHeight: 21,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.25,
  },
});

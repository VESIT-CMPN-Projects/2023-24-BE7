import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";

import { ScrollView } from "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

import { router } from "expo-router";
import { FOURTH, PRIMARY, THIRD } from "../../../../../../styles/global";

export default function EHR() {
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

  const parse = (name) => {
    // Given a name which has more than 2 words, like name and surname, return the first word, i.e. only the name
    let arr = name.split(" ");
    if (arr.length > 1) return arr[0];
    return name;
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
      {/* If loading is true or user has not been fetched, show the activity indicator */}
      {!userDetails ? (
        <ActivityIndicator size={"large"} color={PRIMARY} style={{ flex: 1 }} />
      ) : (
        <View style={styles.container}>
          <Text style={[styles.text, styles.username]}>
            Hi, {userDetails && parse(userDetails.name)}!
          </Text>
          <Text style={[styles.text, styles.centeredText]}>
            Welcome to your health universe
          </Text>
          <View style={styles.ehrContainer}>
            <TouchableOpacity
              onPress={() => {
                router.push("dashboard/profile/ehr/assessmentReports");
              }}
              activeOpacity={0.6}
            >
              <View style={styles.eachSection}>
                <Text style={[styles.text, styles.sectionHeader]}>
                  View Assessment Reports
                </Text>
                <Image
                  source={require("../../../../../../assets/reports.png")}
                  style={styles.sectionImg}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push("dashboard/profile/ehr/healthRecords");
              }}
              activeOpacity={0.6}
            >
              <View style={styles.eachSection}>
                <Text style={[styles.text, styles.sectionHeader]}>
                  Health Records
                </Text>
                <Image
                  source={require("../../../../../../assets/healthrecords.png")}
                  style={styles.sectionImg}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push("dashboard/profile/ehr/diaryLogs");
              }}
              activeOpacity={0.6}
            >
              <View style={styles.eachSection}>
                <Text style={[styles.text, styles.sectionHeader]}>
                  View Diary Logs
                </Text>
                <Image
                  source={require("../../../../../../assets/dailylogs.png")}
                  style={styles.sectionImg}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push("dashboard/profile/ehr/doctorRecommendation");
              }}
              activeOpacity={0.6}
            >
              <View style={styles.eachSection}>
                <Text style={[styles.text, styles.sectionHeader]}>
                  View Doctor Recommendations
                </Text>
                <Image
                  source={require("../../../../../../assets/doctor_recommendation.png")}
                  style={styles.sectionImg}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: FOURTH,
  },
  text: {
    fontFamily: "Inter_400Regular",
  },
  username: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  centeredText: {
    marginVertical: 20,
    color: PRIMARY,
    fontSize: 20,
    fontFamily: "Inter_500Medium",
  },
  ehrContainer: {
    width: "100%",
  },
  eachSection: {
    width: "100%",
    height: 150,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: THIRD,
    borderRadius: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    width: "50%",
    paddingLeft: 20,
  },
  sectionImg: {
    height: "100%",
    width: "50%",
    objectFit: "cover",
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
  },
});

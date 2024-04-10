import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { router } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import moment from "moment";
import { PRIMARY, FOURTH, THIRD } from "../../../../styles/global";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

export default function home() {
  const [userDetails, setUserDetails] = useState(null);
  const [todayApps, setTodayApps] = useState([]);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    const user = auth().currentUser;

    if (user) {
      // User is signed in, find the document from firestore.
      firestore()
        .collection("admin")
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

  const fetchTodayAppointments = async () => {
    // when fetching multiple times, the document is pushed in the array. Hence we reset everything so that only one copy is there and not multiple copies.
    setTodayApps([]);
    setLoading(true);
    firestore()
      .collection("appointments")
      .orderBy("timeOfAppointment", "asc")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (moment(doc.data().dateOfAppointment).isSame(Date.now(), "day")) {
            setTodayApps((curr) => [...curr, { appId: doc.id, ...doc.data() }]);
          }
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // using is focused to determine whether the page is in focus. If yes, then fetch the appointments because the admin might have modified appointments and then came back here. Note - There is no way (using onSnapshot) to determine whether an appointment was updated, hence the only workaround is that whenever this page is rendered, fetch appointments again.
  useEffect(() => {
    if (isFocused) {
      fetchTodayAppointments();
    }
  }, [isFocused]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
      {!userDetails || loading ? (
        <ActivityIndicator size={"large"} color={PRIMARY} style={{ flex: 1 }} />
      ) : (
        <View style={styles.container}>
          <View style={{ width: "100%" }}>
            <Text style={[styles.text, styles.username]}>
              Welcome, Dr. {userDetails.name}
            </Text>
          </View>
          <View style={styles.appointmentContainer}>
            <View style={styles.appointmentHeader}>
              <Text style={[styles.text, styles.sectionHeader]}>
                Today's Appointments
              </Text>
              {todayApps.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    router.push("dashboard/notifications");
                  }}
                  activeOpacity={0.5}
                >
                  <Text style={[styles.text, styles.seeAllText]}>See all</Text>
                </TouchableOpacity>
              )}
            </View>

            {todayApps.length > 0 ? (
              todayApps.map((eachApp, ind) => (
                <View style={styles.eachAppointment} key={ind}>
                  <Image
                    source={{
                      uri: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    }}
                    style={styles.profileImg}
                  />
                  <View style={styles.detailsSection}>
                    <TouchableOpacity
                      onPress={() => {
                        router.push(`dashboard/profile/info/${eachApp.userId}`);
                      }}
                      activeOpacity={0.5}
                    >
                      <Text style={styles.patientName}>
                        {eachApp.patientName}
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.visitReason}>
                      {eachApp.purposeOfVisit}
                    </Text>
                    <Text style={styles.dateTime}>
                      At{" "}
                      {moment(eachApp.timeOfAppointment, "H:mm").format(
                        "h:mm A"
                      )}
                    </Text>
                  </View>
                  <View style={styles.rescheduleBox}>
                    <TouchableOpacity
                      style={styles.rescheduleBtn}
                      onPress={() => {
                        router.push(`dashboard/notifications/${eachApp.appId}`);
                      }}
                      activeOpacity={0.8}
                    >
                      <MaterialCommunityIcons
                        name="calendar-clock-outline"
                        size={18}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <>
                <Text style={[styles.text, styles.appointmentMsg1]}>
                  Oh, you have no appointments for today.
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    router.push("dashboard/notifications");
                  }}
                  activeOpacity={0.5}
                >
                  <Text style={[styles.text, styles.appointmentMsg2]}>
                    View all appointments.
                  </Text>
                </TouchableOpacity>
              </>
            )}
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
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
    color: PRIMARY,
    marginBottom: 20,
  },
  appointmentContainer: {
    marginVertical: 15,
    width: "100%",
  },
  appointmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  seeAllText: {
    marginBottom: 10,
    color: PRIMARY,
    paddingRight: 10,
    textDecorationLine: "underline",
    fontFamily: "Inter_600SemiBold",
  },
  sectionHeader: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 10,
  },
  eachAppointment: {
    width: "100%",
    height: 150,
    padding: 20,
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImg: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginRight: 20,
  },
  rescheduleBox: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  rescheduleBtn: {
    backgroundColor: PRIMARY,
    gap: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 30,
  },
  patientName: {
    fontFamily: "Inter_600SemiBold",
    color: PRIMARY,
    textDecorationLine: "underline",
    fontSize: 16,
    marginBottom: 3,
  },
  visitReason: {
    fontFamily: "Inter_600SemiBold",
    color: THIRD,
    marginBottom: 10,
  },
  dateTime: {
    fontFamily: "Inter_600SemiBold",
  },
  appointmentMsg1: {
    textAlign: "center",
    marginBottom: 5,
  },
  appointmentMsg2: {
    textAlign: "center",
    textDecorationLine: "underline",
    color: PRIMARY,
  },
});

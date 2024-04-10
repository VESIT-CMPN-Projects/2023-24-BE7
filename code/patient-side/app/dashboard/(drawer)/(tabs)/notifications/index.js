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
import { PRIMARY, FOURTH, THIRD } from "../../../../../styles/global";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";

export default function Notifications() {
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [alreadyFetchedApps, setAlreadyFetchedApps] = useState(false);

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

  const fetchAppointments = async () => {
    setLoading(true);
    let allApps = userDetails.appointments;
    // Step 1: Map each ID to a promise that fetches the document
    const fetchPromises = allApps.map((id) =>
      firestore()
        .collection("appointments")
        .doc(id)
        .get()
        .then((doc) => {
          // check if the appointment date is after the current time or today.
          if (
            doc.exists &&
            moment(doc.data().dateOfAppointment).isSameOrAfter(
              Date.now(),
              "day"
            )
          ) {
            return { appId: doc.id, ...doc.data() };
          } else {
            // The doc doesn't exist
            // console.log("No such document or the appointment has expired!");
            return null;
          }
        })
    );

    // Step 2: Use Promise.all to wait for all fetches to complete
    Promise.all(fetchPromises)
      .then((fetchedDocuments) => {
        // Filter out any nulls if a document didn't exist and sort based on dateOfAppointment
        const validDocuments = fetchedDocuments
          .filter((doc) => doc !== null)
          .sort(
            (a, b) =>
              new Date(a.dateOfAppointment) - new Date(b.dateOfAppointment)
          );

        // Update state with fetched documents
        setAppointments(validDocuments);
        // make loading false to display all the fetched documents at once.
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (userDetails) {
      fetchAppointments().then(setAlreadyFetchedApps(true));
    }
  }, [userDetails]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
      {/* If loading is true or user has not been fetched, show the activity indicator */}
      {!userDetails || loading ? (
        <ActivityIndicator size={"large"} color={PRIMARY} style={{ flex: 1 }} />
      ) : (
        <View style={styles.container}>
          <Text style={[styles.text, styles.sectionHeader]}>
            All Scheduled Appointments
          </Text>

          <View style={styles.allAppointmentsContainer}>
            {alreadyFetchedApps && appointments.length > 0 ? (
              <>
                {appointments.map((appointment) => (
                  <View key={appointment.appId} style={styles.eachAppointment}>
                    <Image
                      source={{
                        uri: "https://assets.lybrate.com/img/documents/doctor/dp/8a442fe9ddbc0ce82c9661b571902598/Neurology-BinduMenon-Nellore-2ac9b4.jpg",
                      }}
                      style={styles.profileImg}
                    />
                    <View style={styles.detailsSection}>
                      <Text style={styles.doctorName}>Dr. Bindu Menon</Text>
                      <Text style={styles.visitReason}>
                        {appointment.purposeOfVisit}
                      </Text>
                      <Text style={styles.dateTime}>
                        {moment(appointment.dateOfAppointment).format(
                          "ddd, MMM D [at]"
                        )}{" "}
                        {moment(appointment.timeOfAppointment, "H:mm").format(
                          "h:mm A"
                        )}
                      </Text>
                    </View>
                  </View>
                ))}
              </>
            ) : (
              <>
                <Text style={[styles.text, styles.appointmentMsg1]}>
                  Oh, you have no new appointments.
                </Text>
              </>
            )}
          </View>

          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.button}
            onPress={() => {
              router.push("dashboard/notifications/new_appointment");
            }}
          >
            <Text style={styles.buttonText}>Schedule a new appointment</Text>
          </TouchableOpacity>
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
  sectionHeader: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    width: "100%",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: PRIMARY,
    width: "100%",
    marginVertical: 30,
  },
  buttonText: {
    fontSize: 16,
    letterSpacing: 0.25,
    color: "white",
    fontFamily: "Inter_600SemiBold",
  },
  allAppointmentsContainer: {
    marginTop: 20,
    width: "100%",
  },
  eachAppointment: {
    width: "100%",
    height: 150,
    padding: 20,
    marginBottom: 20,
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  profileImg: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginRight: 20,
  },
  doctorName: {
    fontFamily: "Inter_600SemiBold",
  },
  visitReason: {
    fontFamily: "Inter_600SemiBold",
    color: THIRD,
    marginBottom: 10,
  },
  dateTime: {
    fontFamily: "Inter_600SemiBold",
    color: PRIMARY,
  },
  appointmentMsg1: {
    textAlign: "center",
    marginBottom: 5,
  },
});

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import { ScrollView } from "react-native-gesture-handler";
import React, { useState, useEffect, useRef } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { FOURTH, PRIMARY } from "../../../../../../styles/global";
import moment from "moment";
import { router } from "expo-router";

export default function DialyLogs() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);

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

  const fetchAllReports = () => {
    let allReports = userDetails.assessments;
    if (!allReports) {
      setLoading(false);
      return;
    }
    setLoading(true);
    // Step 1: Map each ID to a promise that fetches the document
    const fetchPromises = allReports.map((id) =>
      firestore()
        .collection("assessment-reports")
        .doc(id)
        .get()
        .then((doc) => {
          if (doc.exists) {
            return { reportId: doc.id, ...doc.data() };
          } else {
            // The doc doesn't exist
            // console.log("No such document!");
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
              // The latest submission should be on top.
              new Date(b.dateOfSubmission) - new Date(a.dateOfSubmission)
          );

        // Update state with fetched documents
        setReports(validDocuments);
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
      fetchAllReports();
    }
  }, [userDetails]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
      {/* If loading is true or user has not been fetched, show the activity indicator */}
      {!userDetails || loading ? (
        <ActivityIndicator size={"large"} color={PRIMARY} style={{ flex: 1 }} />
      ) : (
        <View style={styles.container}>
          <View style={styles.assessmentContainer}>
            <Text style={[styles.text, styles.sectionHeader]}>
              Your Assessment Reports
            </Text>
            {reports.length > 0 ? (
              <>
                {reports.map((report) => (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      router.push(
                        `dashboard/profile/ehr/reportView/${report.reportId}`
                      );
                    }}
                    style={styles.eachReport}
                    key={report.reportId}
                  >
                    <View>
                      <Text style={[styles.text, styles.eachHeader]}>
                        Prediction:{" "}
                        <Text
                          style={[
                            styles.text,
                            styles.eachHeader,
                            styles.eachHeaderDecision,
                          ]}
                        >
                          {report.prediction ? report.prediction : "No stroke"}
                        </Text>
                      </Text>
                      <Text style={styles.text}>
                        Submitted on: {report.dateOfSubmission}
                      </Text>
                    </View>

                    <Text style={[styles.text, styles.tapToView]}>
                      Tap to view
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <>
                <Text style={[styles.text, styles.appointmentMsg1]}>
                  Oh, you haven't submitted any stroke assessment.
                </Text>
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
  assessmentContainer: {
    width: "100%",
  },
  sectionHeader: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 10,
  },
  eachReport: {
    marginBottom: 10,
    borderRadius: 10,
    padding: 20,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eachHeader: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 5,
  },
  eachHeaderDecision: {
    color: PRIMARY,
  },
  tapToView: {
    fontSize: 12,
  },
  appointmentMsg1: {
    textAlign: "center",
    marginBottom: 5,
  },
});

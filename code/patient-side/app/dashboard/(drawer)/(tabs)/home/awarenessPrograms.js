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
import { FOURTH, PRIMARY } from "../../../../../styles/global";

export default AwarenessPrograms = () => {
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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
      {!userDetails ? (
        <ActivityIndicator size={"large"} color={PRIMARY} style={{ flex: 1 }} />
      ) : (
        <View style={styles.container}>
          <View style={styles.section}>
            <Text style={[styles.text, styles.body]}>
              Stroke stands as a leading cause of disability and death
              worldwide, presenting a significant public health challenge. Its
              impact extends beyond the immediate health repercussions to
              encompass long-term physical, emotional, and financial burdens on
              survivors, their families, and health systems. This essay explores
              the critical importance of stroke awareness programs, outlining
              how they function as pivotal instruments in stroke prevention,
              early detection, and the reduction of its devastating outcomes.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={[styles.text, styles.heading]}>
              Understanding Stroke
            </Text>
            <Text style={[styles.text, styles.body]}>
              A stroke occurs when the blood supply to part of the brain is
              interrupted or reduced, preventing brain tissue from getting
              oxygen and nutrients. Brain cells begin to die within minutes.
              Strokes can be ischemic, caused by clots obstructing blood flow to
              the brain, or hemorrhagic, caused by bleeding in or around the
              brain. Recognizing the early signs of stroke, encapsulated in the
              acronym FAST (Face drooping, Arm weakness, Speech difficulties,
              Time to call emergency services), is crucial for prompt treatment
              and minimizing brain damage
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={[styles.text, styles.heading]}>
              The Importance of Stroke Awareness Programs
            </Text>
            <Text style={[styles.text, styles.body]}>
              Stroke awareness programs play a vital role in educating the
              public about stroke risk factors, symptoms, and the importance of
              timely medical intervention. These programs aim to :
            </Text>

            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Educate on Prevention : </Text>
              By promoting knowledge about modifiable risk factors such as
              hypertension, smoking, obesity, high cholesterol, diabetes, and
              physical inactivity, these programs empower individuals to make
              healthier lifestyle choices.
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>
                Facilitate Early Recognition and Response :{" "}
              </Text>
              Training people to recognize stroke symptoms and the urgency of
              seeking immediate medical help can significantly decrease the time
              to treatment, enhancing the effectiveness of interventions like
              thrombolysis (clot-busting treatment).
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>
                Support Survivors and Caregivers :{" "}
              </Text>
              Providing information and resources to stroke survivors and their
              families helps them navigate the challenges of recovery,
              rehabilitation, and adaptation to life after stroke.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.text, styles.heading]}>
              Pre-Stroke Care: Lifestyle Modifications
            </Text>

            <Text style={[styles.text, styles.body]}>
              Pre-stroke care focuses on identifying and managing risk factors
              to prevent a stroke from occurring. Essential strategies include :{" "}
            </Text>

            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Controlling Hypertension : </Text>
              High blood pressure is a leading cause of stroke. Monitoring and
              maintaining blood pressure within recommended levels through
              lifestyle changes and medication is key.
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Managing Diabetes : </Text>
              Keeping blood sugar levels under control to prevent complications
              that may increase stroke risk.
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Regular Check-ups : </Text>
              Routine health screenings help identify and manage risk factors
              early.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={[styles.text, styles.heading]}>
              Post-Stroke Care: Rehabilitation
            </Text>

            <Text style={[styles.text, styles.body]}>
              Post-stroke care is critical for recovery and preventing another
              stroke. This phase involves :
            </Text>

            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Medication Management : </Text>
              To prevent secondary strokes, medications to manage blood
              pressure, prevent clotting, and control other conditions like
              diabetes may be prescribed.
            </Text>

            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Follow-up Care : </Text>
              Regular visits with healthcare providers to monitor health status,
              manage risk factors, and adjust treatments as needed.
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Safe Environment : </Text>
              Modifying the home to accommodate mobility limitations, prevent
              falls, and facilitate daily activities.
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Mental Health : </Text>
              Addressing the psychological impacts, such as depression and
              anxiety, that are common after a stroke through counseling,
              therapy, and medication if needed.
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

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
  section: {
    width: "100%",
    marginBottom: 10,
  },
  heading: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 20,
    marginBottom: 5,
  },
  body: {
    lineHeight: 24,
    // textAlign: "justify",
    marginBottom: 10,
  },
  subheading: {
    fontFamily: "Inter_600SemiBold",
  },
  bulletedPoints: {
    paddingLeft: 20,
  },
});

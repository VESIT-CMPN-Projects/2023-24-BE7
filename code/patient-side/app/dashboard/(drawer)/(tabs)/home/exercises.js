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

export default Exercises = () => {
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
              Exercise plays a vital role in both the prevention of stroke and
              the rehabilitation process following a stroke. Engaging in regular
              physical activity can significantly reduce the risk of stroke by
              improving overall cardiovascular health, while targeted exercises
              post-stroke can aid in recovery, enhancing mobility, strength, and
              independence. This essay delves into the beneficial exercises for
              pre-stroke prevention and post-stroke recovery, outlining
              effective strategies to incorporate physical activity into these
              critical phases of stroke management.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={[styles.text, styles.heading]}>
              Pre-Stroke: Exercise for Prevention
            </Text>
            <Text style={[styles.text, styles.body]}>
              The preventive power of exercise lies in its capacity to address
              key stroke risk factors, including hypertension, obesity,
              diabetes, and high cholesterol. By integrating regular physical
              activity into daily life, individuals can significantly mitigate
              these risks.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={[styles.text, styles.heading]}>
              Cardiovascular Exercises
            </Text>

            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Walking : </Text>
              Easily accessible and modifiable to suit individual fitness
              levels, walking improves circulation and heart health.
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Cycling : </Text>
              Both stationary and outdoor cycling are effective for increasing
              heart rate and enhancing leg strength without significant impact
              on the joints.
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Swimming : </Text>
              Offers a full-body workout, improving cardiovascular conditioning
              while being gentle on the body.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.text, styles.heading]}>Strength Training</Text>

            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Bodyweight Exercises : </Text>
              Activities like squats, lunges, and push-ups help maintain muscle
              mass, which is crucial for metabolic health.
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Resistance Band Workouts : </Text>
              These provide a low-impact option to build strength and
              flexibility, important for maintaining balance and preventing
              falls.
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Yoga and Tai Chi : </Text>
              These practices improve flexibility, balance, and stress
              management, contributing to lower blood pressure and enhanced
              mental well-being.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={[styles.text, styles.heading]}>
              Post-Stroke: Exercise for Recovery
            </Text>

            <Text style={[styles.text, styles.body]}>
              Following a stroke, tailored exercise programs are crucial for
              rehabilitation, helping survivors regain lost functions and
              improve quality of life. These exercises focus on restoring
              mobility, strength, and coordination.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={[styles.text, styles.heading]}>
              Mobility and Flexibility Exercises
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>
                Passive Range-of-Motion (ROM) Exercises :{" "}
              </Text>
              Initially, these may be necessary for survivors with limited
              mobility, gradually progressing to active exercises as strength
              returns.
            </Text>

            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Stretching : </Text>
              Regular stretching helps reduce spasticity and improve
              flexibility, crucial for restoring movement.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.text, styles.heading]}>
              Balance and Coordination Exercises
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Standing Exercises : </Text>
              Practices like shifting weight from one foot to another and
              standing on one foot help improve balance and prevent falls.
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Functional Training : </Text>
              Simulating daily activities (e.g., walking, stair climbing) can
              enhance coordination and restore independence.
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Hand-Eye Coordination : </Text>
              Activities like catching or throwing a ball, puzzle-solving, or
              playing video games can aid in re-establishing neural connections
              and improving cognitive function.
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

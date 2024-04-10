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

export default Meditation = () => {
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
              Meditation, an ancient practice with roots in various cultures and
              traditions, has gained recognition in the medical community for
              its potential benefits in preventing and recovering from stroke.
              By fostering mental calmness, reducing stress, and improving
              physiological functions, meditation can play a crucial role in
              both the pre-stroke prevention phase and the post-stroke recovery
              process. This essay explores the importance of meditation for
              individuals at risk of stroke and those recuperating from one,
              detailing how this practice can contribute to overall well-being
              and stroke resilience.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={[styles.text, styles.heading]}>
              Pre-Stroke: Meditation for Prevention
            </Text>
            <Text style={[styles.text, styles.body]}>
              Stress and hypertension are significant risk factors for stroke.
              Meditation helps mitigate these risks through various mechanisms,
              highlighting its importance in pre-stroke prevention strategies.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={[styles.text, styles.heading]}>
              Reducing Stress & Improving Heart Health
            </Text>

            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Cortisol Regulation : </Text>
              Meditation helps regulate cortisol levels, the hormone associated
              with stress, thereby reducing the body's stress response and
              potentially lowering blood pressure, a key stroke risk factor.
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>
                Blood Pressure Management :{" "}
              </Text>
              Regular meditation has been shown to improve blood pressure by
              promoting relaxation and dilation of blood vessels, which can
              reduce the strain on the heart and prevent arterial damage.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.text, styles.heading]}>
              Incorporating Meditation into Daily Life
            </Text>

            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Routine Practice : </Text>
              Incorporating meditation into daily routines, even for short
              periods, can cultivate the benefits over time. Starting with as
              little as 5-10 minutes a day can be effective.
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Diverse Techniques : </Text>
              Exploring different meditation techniques, such as mindfulness
              meditation, guided imagery, or loving-kindness meditation, can
              help individuals find the approach that best suits their
              preferences.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={[styles.text, styles.heading]}>
              Post-Stroke: Meditation for Recovery
            </Text>

            <Text style={[styles.text, styles.body]}>
              For stroke survivors, the recovery process involves not only
              physical rehabilitation but also coping with the psychological and
              emotional aftermath of the stroke. Meditation offers several
              benefits that can aid in post-stroke recovery.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={[styles.text, styles.heading]}>
              Reducing Secondary Stroke Risk
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>
                Continued Stress and Blood Pressure Management :{" "}
              </Text>
              By continuing to meditate post-stroke, individuals can maintain
              lower stress levels and better blood pressure control, reducing
              the risk of subsequent strokes.
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Coping Mechanism : </Text>
              Meditation provides a valuable tool for stroke survivors to cope
              with feelings of frustration, depression, and anxiety that may
              accompany the recovery process.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.text, styles.heading]}>
              Facilitating Sleep
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Improved Sleep Quality : </Text>
              Many stroke survivors experience difficulty sleeping. Meditation
              can improve sleep quality by promoting relaxation and addressing
              factors that contribute to sleep disturbances.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.text, styles.heading]}>
              Implementing Meditation Post-Stroke
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>
                Breath Awareness Meditation :{" "}
              </Text>
              Sit comfortably or lie down. Close your eyes and focus on your
              natural breathing pattern. Pay attention to the sensation of air
              moving in and out of your nostrils, or the rise and fall of your
              chest and abdomen. Enhances focus, reduces stress, and promotes
              relaxation.
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Guided Imagery : </Text>
              Listen to recordings of guided imagery designed to invoke calming
              scenarios, such as walking through a forest or sitting by a serene
              lake. The guide will help you visualize these settings in detail.
              Reduces anxiety and stress, provides mental escape, and can
              improve mood.
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Mindful Listening : </Text>
              Play natural sounds or soothing music without focusing on anything
              else but the sounds. Pay attention to different instruments,
              pitches, or elements within the sound and let them bring you into
              the present moment. Improves concentration, reduces feelings of
              stress, and can enhance auditory processing.
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Gratitude Meditation : </Text>
              Reflect on things you are grateful for, starting with the most
              basic (like having a roof over your head) and expanding to more
              specific aspects of your life and experiences. Encourages a
              positive mindset, reduces stress, and can improve overall
              satisfaction with life.
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>
                Focused Attention Meditation :{" "}
              </Text>
              Choose an object of focus, such as a candle flame or a simple
              object in the room. Keep your attention on this object, bringing
              your mind back gently whenever it wanders. Improves concentration,
              mental clarity, and can reduce the frequency of intrusive
              thoughts.
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

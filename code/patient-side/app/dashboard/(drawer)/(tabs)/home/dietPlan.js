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

export default DietPlan = () => {
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
              Diet plays a pivotal role in both the prevention of stroke and the
              rehabilitation process following a stroke. A well-structured diet
              plan can significantly reduce risk factors associated with stroke,
              such as hypertension, high cholesterol, and obesity, while a
              targeted nutritional approach post-stroke can support recovery,
              enhance healing, and improve overall well-being. This essay
              explores essential dietary considerations for pre-stroke
              prevention and post-stroke recovery, providing a guide to
              optimizing nutrition for these critical phases in stroke
              management.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={[styles.text, styles.heading]}>
              Pre-Stroke: Diet for Prevention
            </Text>
            <Text style={[styles.text, styles.body]}>
              Preventing a stroke necessitates a focus on eating patterns that
              support heart health and reduce risk factors. The following
              dietary guidelines are designed to foster cardiovascular health
              and minimize the likelihood of a stroke.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={[styles.text, styles.heading]}>
              Emphasize Fruits and Vegetables
            </Text>

            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Rich in Nutrients : </Text>
              Fruits and vegetables are loaded with vitamins, minerals, fiber,
              and antioxidants, which can help lower blood pressure and improve
              vascular health.
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Variety is Key : </Text>
              Incorporating a wide range of colors and types ensures a broad
              spectrum of nutrients.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.text, styles.heading]}>Whole Grains</Text>

            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Fiber-Rich : </Text>
              Whole grains like oats, quinoa, barley, and whole wheat help
              manage cholesterol levels and maintain a healthy weight.
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Replace Refined Grains : </Text>
              Opting for whole grains over refined grains (white bread, pasta)
              enhances nutritional intake and supports heart health.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={[styles.text, styles.heading]}>
              Protein, Salt and Fats
            </Text>

            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Heart-Healthy Options : </Text>
              Incorporate lean meats (chicken, turkey), fish rich in omega-3
              fatty acids (salmon, mackerel), legumes, and nuts. These proteins
              support muscle health without contributing to high cholesterol or
              saturated fat intake.
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Control Blood Pressure : </Text>
              High sodium intake is linked with increased blood pressure, a
              primary risk factor for stroke. Limiting salt and processed foods
              can help keep blood pressure in check.
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>
                Monounsaturated and Polyunsaturated Fats :{" "}
              </Text>
              Sources like olive oil, avocados, and fatty fish contribute to
              good cholesterol levels and cardiovascular health, reducing stroke
              risk.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={[styles.text, styles.heading]}>
              Post-Stroke: Diet for Recovery
            </Text>

            <Text style={[styles.text, styles.body]}>
              Following a stroke, the body needs extra nutrients to heal and
              recover. A well-balanced, nutrient-rich diet can aid in this
              process, addressing specific challenges that may arise
              post-stroke.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={[styles.text, styles.heading]}>
              Easy-to-Swallow Foods
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Texture Modifications : </Text>
              For those with difficulty swallowing (dysphagia), pureed foods,
              thickened liquids, and soft-cooked meals can facilitate easier
              eating and reduce the risk of aspiration.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.text, styles.heading]}>
              Protein and Omega-3 Fatty Acids
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Muscle Repair and Growth : </Text>
              Increased protein intake is crucial for healing and rebuilding
              muscle. Incorporating lean meats, dairy, or plant-based protein
              sources like beans and lentils can support recovery.
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Brain Health : </Text>
              Omega-3s, found in fatty fish, flaxseeds, and walnuts, are
              essential for brain function and may aid in the recovery of nerve
              cells.
            </Text>
            <Text style={[styles.text, styles.body, styles.bulletedPoints]}>
              <Text style={styles.subheading}>Reduce Inflammation : </Text>
              Saturated fats, trans fats, and added sugars can contribute to
              inflammation and should be minimized in the diet.
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

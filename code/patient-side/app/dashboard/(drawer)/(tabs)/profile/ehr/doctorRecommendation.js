import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

import { ScrollView } from "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { FOURTH, PRIMARY, SECONDARY } from "../../../../../../styles/global";
import { FontAwesome5 } from "@expo/vector-icons";

export default function DoctorRecommendation() {
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
      {/* If loading is true or user has not been fetched, show the activity indicator */}
      {!userDetails ? (
        <ActivityIndicator size={"large"} color={PRIMARY} style={{ flex: 1 }} />
      ) : (
        <View style={styles.container}>
          <View style={styles.medicineContainer}>
            <Text style={[styles.text, styles.sectionHeader]}>Medicines</Text>
            <View style={styles.allMedicineBox}>
              {/* If medicines is undefined or medicines length is 0 then dislay message else display all the medicines */}
              {!userDetails.medicines || userDetails.medicines.length == 0 ? (
                <>
                  <Text style={[styles.text, styles.noMedicineHeader]}>
                    You have no prescribed medicines
                  </Text>
                  <Text style={[styles.text, styles.noMedicineDesc]}>
                    Consult your doctor today!
                  </Text>
                </>
              ) : (
                userDetails.medicines.map((elem, index) => (
                  <View style={styles.eachMedicine} key={index}>
                    {/* In medicines - name, type, frequency are compulsory */}
                    {elem.type === "Tablet" ? (
                      <FontAwesome5 name="tablets" size={30} color="black" />
                    ) : (
                      <FontAwesome5 name="capsules" size={30} color="black" />
                    )}
                    <View style={styles.medcineDetails}>
                      {elem.name && (
                        <Text style={[styles.text, styles.medicineName]}>
                          {elem.name}
                        </Text>
                      )}
                      <Text style={[styles.text, styles.medicineDesc]}>
                        {/* display strength only if it exists. */}
                        {elem.type}
                        {elem.strength ? ", " + elem.strength : ""}
                      </Text>
                      <Text style={[styles.text, styles.medicineDesc]}>
                        {elem.frequency}
                      </Text>
                      {elem.when && (
                        <Text style={[styles.text, styles.medicineDesc]}>
                          {elem.when && elem.when.join(", ")}
                        </Text>
                      )}
                    </View>
                  </View>
                ))
              )}
            </View>
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
  medicineContainer: {
    width: "100%",
  },
  sectionHeader: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 10,
  },
  eachMedicine: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 20,
    gap: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  medcineDetails: {
    flexShrink: 1,
  },
  medicineName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    marginBottom: 5,
  },
  medicineDesc: {
    color: SECONDARY,
    fontSize: 12,
    marginBottom: 2,
  },
  noMedicineHeader: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 5,
  },
  noMedicineDesc: {
    textAlign: "center",
    color: SECONDARY,
  },
});

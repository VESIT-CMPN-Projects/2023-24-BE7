import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { ScrollView } from "react-native-gesture-handler";
import {
  PRIMARY,
  THIRD,
  FOURTH,
  SECONDARY,
} from "../../../../../../styles/global";
import { router, useLocalSearchParams } from "expo-router";
import { useIsFocused } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const { userId } = useLocalSearchParams();

  const [fullName, setFullName] = useState("");
  const [DOB, setDOB] = useState("");
  const [gender, setGender] = useState(null);

  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [bloodSugar, setBloodSugar] = useState("");

  const [medicinesStr, setMedicinesStr] = useState("");
  const [allergies, setAllergies] = useState("");
  const [strokeType, setStrokeType] = useState("");
  const [strokeDate, setStrokeDate] = useState("");

  const [providerName, setProviderName] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");

  const isFocused = useIsFocused();

  const fetchUser = async () => {
    const admin = auth().currentUser;

    if (admin) {
      // Admin is signed in, find the user's (patient's) document from firestore.
      firestore()
        .collection("users")
        .doc(userId)
        .onSnapshot((docSnap) => {
          setUserDetails({
            uid: userId,
            ...docSnap.data(),
          });
          updateFieldsFromFirebase(docSnap.data());
        });
    } else {
      // No user is signed in. redirect to login.
      // console.log("No user is currently signed in");
      router.replace("/Login");
    }
  };

  useEffect(() => {
    // When the screen is in focus, fetch the user's details. When its not, reset the state
    isFocused && fetchUser();
    !isFocused && setUserDetails(null);
  }, [isFocused]);

  const updateFieldsFromFirebase = (data) => {
    if (data.name) setFullName(data.name);
    if (data.dateOfBirth) setDOB(data.dateOfBirth);
    if (data.gender) setGender(data.gender);

    if (data.emergencyName) setEmergencyName(data.emergencyName);
    if (data.emergencyRelation) setEmergencyRelation(data.emergencyRelation);
    if (data.emergencyContact) setEmergencyContact(data.emergencyContact);

    if (data.height) setHeight(data.height);
    if (data.weight) setWeight(data.weight);
    if (data.bloodPressure) setBloodPressure(data.bloodPressure);
    if (data.bloodSugar) setBloodSugar(data.bloodSugar);

    if (data.medicinesStr) setMedicinesStr(data.medicinesStr);
    if (data.allergies) setAllergies(data.allergies);
    if (data.strokeType) setStrokeType(data.strokeType);
    if (data.strokeDate) setStrokeDate(data.strokeDate);

    if (data.insuranceProviderName) setProviderName(data.insuranceProviderName);
    if (data.insurancePolicyNumber) setPolicyNumber(data.insurancePolicyNumber);
  };

  const parse = (fullText) => {
    return fullText.toUpperCase().replace(/^(.{5}).*(.{5})$/, "$1xxx$2");
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
      {/* If loading is true or user has not been fetched, show the activity indicator */}
      {!userDetails ? (
        <ActivityIndicator size={"large"} color={PRIMARY} style={{ flex: 1 }} />
      ) : (
        <View style={styles.container}>
          <View style={styles.blueBox}>
            <View style={styles.personalDetails}>
              <Text style={[styles.text, styles.personName]}>
                {userDetails.name}
              </Text>
              <Text style={[styles.text, styles.personId]}>
                Unique ID: {parse(userDetails.uid)}
              </Text>
            </View>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              }}
              style={styles.profileImg}
            />
          </View>
          <View style={styles.detailsContainer}>
            <View>
              <Text style={styles.sectionHeader}>Personal Information</Text>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  value={fullName}
                  placeholder="Not provided"
                  style={styles.input}
                  editable={false}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Date of Birth</Text>
                <TextInput
                  value={DOB}
                  placeholder="Not provided"
                  style={styles.input}
                  editable={false}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Gender</Text>
                <TextInput
                  value={gender}
                  style={styles.input}
                  placeholder="Not provided"
                  editable={false}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Phone No.</Text>
                <TextInput
                  keyboardType="number-pad"
                  maxLength={10}
                  value={userDetails.phoneNumber}
                  placeholder="Not provided"
                  style={styles.input}
                  editable={false} // phone number cannot be changed
                />
              </View>
            </View>
            <View>
              <Text style={styles.sectionHeader}>
                Emergency Contact Details
              </Text>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  value={emergencyName}
                  placeholder="Not provided"
                  style={styles.input}
                  editable={false}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Realtionship</Text>
                <TextInput
                  value={emergencyRelation}
                  placeholder="Not provided"
                  style={styles.input}
                  editable={false}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Contact</Text>
                <TextInput
                  value={emergencyContact}
                  keyboardType="number-pad"
                  maxLength={10}
                  placeholder="Not provided"
                  style={styles.input}
                  editable={false}
                />
              </View>
            </View>
            <View>
              <Text style={styles.sectionHeader}>Patient Health Metrics</Text>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Height</Text>
                <View style={styles.inputBoxContainer}>
                  <TextInput
                    value={height}
                    keyboardType="decimal-pad"
                    maxLength={5}
                    placeholder="Not provided"
                    style={styles.input}
                    editable={false}
                  />
                  <Text style={styles.units}>cm</Text>
                </View>
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Weight</Text>
                <View style={styles.inputBoxContainer}>
                  <TextInput
                    value={weight}
                    keyboardType="decimal-pad"
                    maxLength={5}
                    placeholder="Not provided"
                    style={styles.input}
                    editable={false}
                  />
                  <Text style={styles.units}>kg</Text>
                </View>
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Blood Pressure Level</Text>
                <View style={styles.inputBoxContainer}>
                  <TextInput
                    value={bloodPressure}
                    maxLength={8}
                    placeholder="Not provided"
                    style={styles.input}
                    editable={false}
                  />
                  <Text style={styles.units}>mm Hg</Text>
                </View>
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Blood Sugar Level</Text>
                <View style={styles.inputBoxContainer}>
                  <TextInput
                    value={bloodSugar}
                    keyboardType="decimal-pad"
                    maxLength={5}
                    placeholder="Not provided"
                    style={styles.input}
                    editable={false}
                  />
                  <Text style={styles.units}>mg/dL</Text>
                </View>
              </View>
            </View>
            <View>
              <Text style={styles.sectionHeader}>Medical History</Text>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Medicines</Text>
                <TextInput
                  value={medicinesStr}
                  placeholder="Not provided"
                  style={[styles.input, { height: 100 }]}
                  multiline={true}
                  numberOfLines={5}
                  editable={false}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Allergies</Text>
                <TextInput
                  value={allergies}
                  placeholder="Not provided"
                  style={[styles.input, { height: 80 }]}
                  multiline={true}
                  numberOfLines={3}
                  editable={false}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Type of Stroke</Text>
                <TextInput
                  value={strokeType}
                  placeholder="Not provided"
                  style={styles.input}
                  editable={false}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>First Stroke Date</Text>
                <TextInput
                  value={strokeDate}
                  placeholder="Not provided"
                  style={styles.input}
                  editable={false}
                />
              </View>
            </View>
            <View>
              <Text style={styles.sectionHeader}>
                Health Insurance Provider
              </Text>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Provider Name</Text>
                <TextInput
                  value={providerName}
                  placeholder="Not provided"
                  style={styles.input}
                  editable={false}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Policy Number</Text>
                <TextInput
                  value={policyNumber}
                  placeholder="Not provided"
                  style={styles.input}
                  editable={false}
                />
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              router.push(`dashboard/profile/recommendation/${userId}`);
            }}
            activeOpacity={0.8}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Add Recommendation</Text>
          </TouchableOpacity>
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
    backgroundColor: FOURTH,
  },
  text: {
    fontFamily: "Inter_400Regular",
  },
  blueBox: {
    width: "100%",
    height: 200,
    backgroundColor: PRIMARY,
    padding: 20,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  detailsContainer: {
    width: "100%",
    paddingLeft: 15,
    paddingRight: 10,
  },
  personName: {
    fontSize: 20,
    color: "white",
    fontFamily: "Inter_500Medium",
    marginBottom: 10,
  },
  personId: {
    fontFamily: "Inter_500Medium",
    color: FOURTH,
  },
  profileImg: {
    width: 125,
    height: 125,
    borderRadius: 125,
  },
  sectionHeader: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    width: "100%",
    marginVertical: 15,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: "red", ///// REMOVVEVEEEE
    marginBottom: 20,
  },
  label: {
    fontFamily: "Inter_400Regular",
    width: 110,
  },
  input: {
    borderWidth: 1,
    borderColor: THIRD,
    height: 40,
    width: width - 110 - 25, // device width - labelWidth - container horizontal padding
    paddingHorizontal: 10,
    borderRadius: 10,
    fontFamily: "Inter_400Regular",
    backgroundColor: "#e1e1e1",
    color: "black",
  },
  inputBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  units: {
    fontSize: 16,
    position: "absolute",
    right: 10,
    fontFamily: "Inter_500Medium",
  },
  placeholderStyle: {
    color: SECONDARY,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  selectedTextStyle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: PRIMARY,
    marginTop: 15,
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.25,
    color: "white",
  },
});

export default Profile;

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { ScrollView } from "react-native-gesture-handler";
import { PRIMARY, THIRD, FOURTH, SECONDARY } from "../../../../../styles/global";
import { Dropdown } from "react-native-element-dropdown";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const data = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Do not specify", value: "Do not specify" },
  ];

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
          updateFieldsFromFirebase(docSnap.data());
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

  const updateProfile = async () => {
    if (fullName === "") {
      alert("Name field cannot be empty");
      return;
    }

    setIsLoading(true);
    let obj = {
      name: fullName,
      dateOfBirth: DOB,
      gender,

      emergencyName,
      emergencyRelation,
      emergencyContact,

      height: height,
      weight: weight,
      bloodPressure,
      bloodSugar: bloodSugar,

      medicinesStr,
      allergies,
      strokeType,
      strokeDate,

      insuranceProviderName: providerName,
      insurancePolicyNumber: policyNumber,
    };

    try {
      await firestore()
        .collection("users")
        .doc(userDetails.uid)
        .set(obj, { merge: true });
      router.replace("dashboard/(drawer)/(tabs)/home");
      // TODO: show some toast message
    } catch (err) {
      // console.log(err)
      alert(err);
    } finally {
      // TODO: clear all input fields.
      setIsLoading(false);
    }
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
                  onChangeText={(val) => setFullName(val)}
                  placeholder="Your name"
                  style={styles.input}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Date of Birth</Text>
                <TextInput
                  value={DOB}
                  onChangeText={(val) => setDOB(val)}
                  placeholder="DOB"
                  style={styles.input}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Gender</Text>
                <Dropdown
                  style={styles.input}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={data}
                  labelField="label"
                  valueField="value"
                  placeholder="Select gender"
                  value={gender}
                  onChange={(item) => {
                    setGender(item.value);
                  }}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Phone No.</Text>
                <TextInput
                  keyboardType="number-pad"
                  maxLength={10}
                  value={userDetails.phoneNumber}
                  placeholder="Phone Number"
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
                  onChangeText={(val) => setEmergencyName(val)}
                  placeholder="Contact Person Name"
                  style={styles.input}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Realtionship</Text>
                <TextInput
                  value={emergencyRelation}
                  onChangeText={(val) => setEmergencyRelation(val)}
                  placeholder="Your relation with the person"
                  style={styles.input}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Contact</Text>
                <TextInput
                  value={emergencyContact}
                  onChangeText={(val) => setEmergencyContact(val)}
                  keyboardType="number-pad"
                  maxLength={10}
                  placeholder="Contact"
                  style={styles.input}
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
                    onChangeText={(val) => setHeight(val)}
                    keyboardType="decimal-pad"
                    maxLength={5}
                    placeholder="Height"
                    style={styles.input}
                  />
                  <Text style={styles.units}>cm</Text>
                </View>
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Weight</Text>
                <View style={styles.inputBoxContainer}>
                  <TextInput
                    value={weight}
                    onChangeText={(val) => setWeight(val)}
                    keyboardType="decimal-pad"
                    maxLength={5}
                    placeholder="Weight"
                    style={styles.input}
                  />
                  <Text style={styles.units}>kg</Text>
                </View>
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Blood Pressure Level</Text>
                <View style={styles.inputBoxContainer}>
                  <TextInput
                    value={bloodPressure}
                    onChangeText={(val) => setBloodPressure(val)}
                    maxLength={8}
                    placeholder="Systolic/Diastolic"
                    style={styles.input}
                  />
                  <Text style={styles.units}>mm Hg</Text>
                </View>
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Blood Sugar Level</Text>
                <View style={styles.inputBoxContainer}>
                  <TextInput
                    value={bloodSugar}
                    onChangeText={(val) => setBloodSugar(val)}
                    keyboardType="decimal-pad"
                    maxLength={5}
                    placeholder="Random sugar test"
                    style={styles.input}
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
                  onChangeText={(val) => setMedicinesStr(val)}
                  placeholder="Prescribed Medicines & Dosage"
                  style={[styles.input, { height: 100 }]}
                  multiline={true}
                  numberOfLines={5}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Allergies</Text>
                <TextInput
                  value={allergies}
                  onChangeText={(val) => setAllergies(val)}
                  placeholder="Mention allergies"
                  style={[styles.input, { height: 80 }]}
                  multiline={true}
                  numberOfLines={3}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Type of Stroke</Text>
                <TextInput
                  value={strokeType}
                  onChangeText={(val) => setStrokeType(val)}
                  placeholder="Aschemic or Hemorrhage"
                  style={styles.input}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>First Stroke Date</Text>
                <TextInput
                  value={strokeDate}
                  onChangeText={(val) => setStrokeDate(val)}
                  placeholder="dd/mm/yyyy"
                  style={styles.input}
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
                  onChangeText={(val) => setProviderName(val)}
                  placeholder="Provider Name"
                  style={styles.input}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Policy Number</Text>
                <TextInput
                  value={policyNumber}
                  onChangeText={(val) => setPolicyNumber(val)}
                  placeholder="Policy Number"
                  style={styles.input}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={updateProfile}
            activeOpacity={0.8}
            style={styles.button}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={"white"} />
            ) : (
              <Text style={styles.buttonText}>Save Changes</Text>
            )}
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
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: PRIMARY,
    width: 300,
    marginTop: 15,
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 16,
    letterSpacing: 0.25,
    color: "white",
    fontFamily: "Inter_600SemiBold",
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
});

export default Profile;

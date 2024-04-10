import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import {
  PRIMARY,
  THIRD,
  FOURTH,
  SECONDARY,
} from "../../../../../../styles/global";
import { router, useLocalSearchParams } from "expo-router";
import { MultiSelect } from "react-native-element-dropdown";
import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

export default function AddMedicine() {
  const [userDetails, setUserDetails] = useState(null);

  const isFocused = useIsFocused();

  const [medicineName, setMedicineName] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [selectedStrength, setSelectedStrength] = useState(null);
  const [selectedFreq, setSelectedFreq] = useState(null);
  const { userId } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedTime, setSelectedTime] = useState([]);
  const time = [
    { label: "Before Breakfast", value: "Before Breakfast" },
    { label: "After Breakfast", value: "After Breakfast" },
    { label: "Before Lunch", value: "Before Lunch" },
    { label: "After Lunch", value: "After Lunch" },
    { label: "Before Dinner", value: "Before Dinner" },
    { label: "After Dinner", value: "After Dinner" },
  ];

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
        });
    } else {
      // No admin is signed in. redirect to login.
      // console.log("No user is currently signed in");
      router.replace("/Login");
    }
  };

  useEffect(() => {
    // When the screen is in focus, fetch the user's details. When its not, reset the state.
    isFocused && fetchUser();
    !isFocused && setUserDetails(null);
  }, [isFocused]);

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
      </View>
    );
  };

  const handleMedicineAdd = async () => {
    if (medicineName === "") {
      alert("Please enter medicine name");
      return;
    }
    if (!selectedType) {
      alert("Please select the type of medicine");
      return;
    }
    if (!selectedFreq) {
      alert("Please select the frequency of dosage.");
      return;
    }

    try {
      setIsLoading(true);
      const obj = {
        name: medicineName,
        type: selectedType,
        frequency: selectedFreq,
      };
      if (selectedStrength) {
        obj["strength"] = selectedStrength;
      }
      if (selectedTime.length > 0) {
        obj["when"] = selectedTime;
      }

      const updatedUser = await firestore()
        .collection("users")
        .doc(userId)
        .update({
          medicines: firestore.FieldValue.arrayUnion(obj),
        });
    } catch (error) {
      alert("Unknown error occurred");
    } finally {
      setMedicineName("");
      setSelectedType(null);
      setSelectedStrength(null);
      setSelectedFreq(null);
      setSelectedTime([]);
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
      {/* If loading is true or user has not been fetched, show the activity indicator */}
      {!userDetails ? (
        <ActivityIndicator size={"large"} color={PRIMARY} style={{ flex: 1 }} />
      ) : (
        <View style={styles.container}>
          <View style={styles.medicinesContainer}>
            <Text style={[styles.text, styles.sectionHeader]}>
              Adding new medicine for {userDetails.name}
            </Text>

            <View style={styles.medicineInputsContainer}>
              <View style={styles.inputContainer}>
                <Text style={[styles.text, styles.inputText]}>
                  Medicine Name:
                </Text>
                <TextInput
                  placeholder="Enter Medicine name"
                  style={styles.input}
                  value={medicineName}
                  onChangeText={(val) => setMedicineName(val)}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={[styles.text, styles.inputText]}>
                  Medicine Type:
                </Text>
                <TouchableOpacity
                  style={[
                    styles.options,
                    { borderBottomWidth: 0.5 },
                    selectedType === "Tablet" && styles.selectedOption,
                  ]}
                  onPress={() => setSelectedType("Tablet")}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.text,
                      styles.optionsText,
                      selectedType === "Tablet" && styles.selectedOptionText,
                    ]}
                  >
                    Tablet
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.options,
                    selectedType === "Capsule" && styles.selectedOption,
                  ]}
                  onPress={() => {
                    setSelectedType("Capsule");
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.text,
                      styles.optionsText,
                      selectedType === "Capsule" && styles.selectedOptionText,
                    ]}
                  >
                    Capsule
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.text, styles.inputText]}>
                  Choose medication strength:
                </Text>
                <TouchableOpacity
                  style={[
                    styles.options,
                    { borderBottomWidth: 0.5 },
                    selectedStrength === "500mg" && styles.selectedOption,
                  ]}
                  onPress={() => setSelectedStrength("500mg")}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.text,
                      styles.optionsText,
                      selectedStrength === "500mg" && styles.selectedOptionText,
                    ]}
                  >
                    500mg
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.options,
                    { borderBottomWidth: 0.55 },
                    selectedStrength === "750mg" && styles.selectedOption,
                  ]}
                  onPress={() => {
                    setSelectedStrength("750mg");
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.text,
                      styles.optionsText,
                      selectedStrength === "750mg" && styles.selectedOptionText,
                    ]}
                  >
                    750mg
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.options,
                    selectedStrength === "1000mg" && styles.selectedOption,
                  ]}
                  onPress={() => {
                    setSelectedStrength("1000mg");
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.text,
                      styles.optionsText,
                      selectedStrength === "1000mg" &&
                        styles.selectedOptionText,
                    ]}
                  >
                    1000mg
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.text, styles.inputText]}>
                  When to take it:
                </Text>
                <TouchableOpacity
                  style={[
                    styles.options,
                    { borderBottomWidth: 0.5 },
                    selectedFreq === "Everyday" && styles.selectedOption,
                  ]}
                  onPress={() => {
                    setSelectedFreq("Everyday");
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.text,
                      styles.optionsText,
                      selectedFreq === "Everyday" && styles.selectedOptionText,
                    ]}
                  >
                    Everyday
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.options,
                    selectedFreq === "Whenever you feel symptoms" &&
                      styles.selectedOption,
                  ]}
                  onPress={() => {
                    setSelectedFreq("Whenever you feel symptoms");
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.text,
                      styles.optionsText,
                      selectedFreq === "Whenever you feel symptoms" &&
                        styles.selectedOptionText,
                    ]}
                  >
                    Whenever you feel symptoms
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Text style={[styles.text, styles.inputText]}>
                  Time of the day:
                </Text>
                <MultiSelect
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  data={time}
                  labelField="label"
                  valueField="value"
                  placeholder="Select"
                  value={selectedTime}
                  onChange={(item) => {
                    setSelectedTime(item);
                  }}
                  renderItem={renderItem}
                  renderSelectedItem={(item, unSelect) => (
                    <TouchableOpacity
                      onPress={() => unSelect && unSelect(item)}
                    >
                      <View style={styles.selectedStyle}>
                        <Text style={styles.textSelectedStyle}>
                          {item.label}
                        </Text>
                        <MaterialIcons
                          name="delete-outline"
                          size={20}
                          color={SECONDARY}
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
              <View style={[styles.inputContainer, styles.inputContainerBtn]}>
                <TouchableOpacity
                  onPress={handleMedicineAdd}
                  style={styles.button}
                >
                  {isLoading ? (
                    <>
                      <ActivityIndicator color={"white"} />
                    </>
                  ) : (
                    <Text style={styles.buttonText}>Add</Text>
                  )}
                </TouchableOpacity>
              </View>
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
    paddingVertical: 20,
    backgroundColor: FOURTH,
  },
  text: {
    fontFamily: "Inter_400Regular",
  },
  medicinesContainer: {
    width: "100%",
  },
  sectionHeader: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 10,
  },

  medicineInputsContainer: {
    marginVertical: 15,
    gap: 20,
  },
  inputContainer: {},
  inputText: {
    marginBottom: 10,
    fontFamily: "Inter_500Medium",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: THIRD,
    height: 40,
    paddingLeft: 10,
    borderRadius: 5,
    fontFamily: "Inter_400Regular",
    backgroundColor: "#fff",
  },
  options: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    elevation: 1,
  },
  optionsText: {},
  selectedOption: {
    backgroundColor: PRIMARY,
  },
  selectedOptionText: {
    color: "#fff",
  },
  dropdown: {
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  selectedTextStyle: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "white",
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontFamily: "Inter_500Medium",
  },
  inputContainerBtn: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: PRIMARY,
    marginTop: 30,
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 18,
    lineHeight: 21,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.25,
    color: "white",
  },
});

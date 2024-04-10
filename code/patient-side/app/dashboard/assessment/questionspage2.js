import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { FOURTH, PRIMARY, SECONDARY } from "../../../styles/global";
import { router } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { Questions_array2 } from "../../../utilities/questionsArray";

const Questions_second = () => {
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

  const handleSubmit = () => {
    Alert.alert(
      "Thank you!",
      "Your assessment has been submitted successfully. The report will be available in some time. To view the report, check out the EHR section.",
      [{ text: "OK", onPress: () => router.push("dashboard/home") }]
    );
  };

  const [selectedOptions, setSelectedOptions] = useState(
    Array(Questions_array2.length).fill(null)
  );

  const handleOptionToggle = (questionIndex, option) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[questionIndex] =
      newSelectedOptions[questionIndex] ===
      Questions_array2[questionIndex][`option${option}`]
        ? null
        : Questions_array2[questionIndex][`option${option}`];
    setSelectedOptions(newSelectedOptions);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
      {/* If loading is true or user has not been fetched, show the activity indicator */}
      {!userDetails ? (
        <ActivityIndicator size={"large"} color={PRIMARY} style={{ flex: 1 }} />
      ) : (
        <View style={styles.container}>
          <View style={styles.title}>
            <Text style={[styles.text, styles.titleText]}>
              Few more to go...
            </Text>
          </View>
          {Questions_array2.map((question, index) => (
            <View style={styles.questionBox} key={question.id}>
              <View style={styles.question}>
                <Text style={[styles.text, styles.questionID]}>
                  {question.id}.
                </Text>
                <Text style={[styles.text, styles.questionContent]}>
                  {question.question}
                </Text>
              </View>
              <View style={styles.optionsContainer}>
                {["A", "B", "C", "D"]
                  .filter((option) => question[`option${option}`])
                  .map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        selectedOptions[index] ===
                          question[`option${option}`] && styles.selectedOption,
                      ]}
                      activeOpacity={0.5}
                      onPress={() => handleOptionToggle(index, option)}
                    >
                      <Text
                        style={[
                          styles.text,
                          selectedOptions[index] ===
                            question[`option${option}`] &&
                            styles.selectedOptionText,
                        ]}
                      >{`${option}. ${question[`option${option}`]}`}</Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={styles.nextButton}
            activeOpacity={0.8}
            onPress={handleSubmit}
          >
            <Text style={[styles.text, styles.buttonText]}>Submit</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: FOURTH,
  },
  text: {
    fontFamily: "Inter_400Regular",
  },
  title: {
    width: "100%",
    marginBottom: 20,
  },
  titleText: {
    color: PRIMARY,
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
  },
  questionBox: {
    width: "100%",
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  question: {
    flexDirection: "row",
    marginBottom: 10,
  },
  questionID: {
    marginRight: 5,
    fontFamily: "Inter_500Medium",
  },
  questionContent: {
    fontFamily: "Inter_500Medium",
    width: "95%",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  optionButton: {
    width: "48%",
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: FOURTH,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: "1%",
    borderRadius: 15,
    borderColor: PRIMARY,
    borderWidth: 1,
  },
  selectedOption: {
    backgroundColor: PRIMARY,
  },
  selectedOptionText: {
    color: "white",
  },
  nextButton: {
    width: 250,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: PRIMARY,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    lineHeight: 21,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.25,
  },
});

export default Questions_second;

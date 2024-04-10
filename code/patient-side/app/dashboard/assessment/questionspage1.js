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
import { FOURTH, PRIMARY, SECONDARY, THIRD } from "../../../styles/global";
import { router } from "expo-router";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { Questions_array1 } from "../../../utilities/questionsArray";
import moment from "moment";

const Questions_first = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const [selectedOptions, setSelectedOptions] = useState(
    Array(Questions_array1.length).fill(null)
  );

  const handleOptionToggle = (questionIndex, option) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[questionIndex] =
      newSelectedOptions[questionIndex] ===
      Questions_array1[questionIndex][`option${option}`]
        ? null
        : Questions_array1[questionIndex][`option${option}`];
    setSelectedOptions(newSelectedOptions);
    // console.log(newSelectedOptions);
  };

  const handleInputChange = (questionIndex, value) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[questionIndex] = value;
    setSelectedOptions(newSelectedOptions);
    // console.log(newSelectedOptions);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (selectedOptions.includes(null) || selectedOptions.includes("")) {
      alert("Please answer all the questions for accurate assessment.");
      setIsLoading(false);
      return;
    }
    const json = {
      age: selectedOptions[0],
      hypertension: selectedOptions[1] === "Yes" ? 1 : 0,
      heart_disease: selectedOptions[2] === "Yes" ? 1 : 0,
      nhiss: selectedOptions[3],
      systolic: selectedOptions[4],
      distolic: selectedOptions[5],
      glucose: selectedOptions[6],
      smoking: selectedOptions[7] === "Yes" ? 1 : 0,
      bmi: selectedOptions[8],
      ever_married: selectedOptions[9] === "Yes" ? 1 : 0,
      // work_type done later (10)
      residence_type: selectedOptions[11],
      gender: selectedOptions[12],
    };
    if (selectedOptions[10] === "Government Job") {
      json["work_type"] = "Govt_job";
    } else if (selectedOptions[10] === "Private") {
      json["work_type"] = "Private";
    } else if (selectedOptions[10] === "Self-employed") {
      json["work_type"] = "Self-employed";
    } else {
      json["work_type"] = "Never_worked";
    }
    try {
      const res = await fetch(
        "https://chaitanyas2002.pythonanywhere.com/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(json),
        }
      );

      const riskFactor = await res.text();
      // console.log(riskFactor);

      const report = await firestore()
        .collection("assessment-reports")
        .add({
          userId: userDetails.uid,
          selectedOptions: selectedOptions,
          dateOfSubmission: moment().format("DD-MM-YYYY"),
          prediction: riskFactor,
        });

      // report has been created with id = report.id. Append this in the user's report array
      // console.log(report);

      const updatedUser = await firestore()
        .collection("users")
        .doc(userDetails.uid)
        .update({
          assessments: firestore.FieldValue.arrayUnion(report.id),
        });

      // clear all inputs
      setSelectedOptions([]);
    } catch (error) {
      // console.log(error)
      alert("Unknown error occurred");
    } finally {
      setIsLoading(false);
      router.push("dashboard/home");
      Alert.alert(
        "Thank you!",
        "Your assessment has been submitted successfully. The report will be available in some time. To view the report, check out the EHR section.",
        [{ text: "OK", onPress: () => {} }]
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
      {/* If loading is true or user has not been fetched, show the activity indicator */}
      {!userDetails ? (
        <ActivityIndicator size={"large"} color={PRIMARY} style={{ flex: 1 }} />
      ) : (
        <View style={styles.container}>
          <View style={styles.title}>
            <Text style={[styles.text, styles.titleText]}>Let's Begin</Text>
          </View>
          {Questions_array1.map((question, index) => (
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
                {question.isInput ? (
                  <>
                    <TextInput
                      placeholder={question.placeholder}
                      value={selectedOptions[index] || ""}
                      keyboardType="number-pad"
                      style={styles.input}
                      onChangeText={(value) => handleInputChange(index, value)}
                    />
                  </>
                ) : (
                  <>
                    {["A", "B"].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          selectedOptions[index] ===
                            question[`option${option}`] &&
                            styles.selectedOption,
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
                    {question.optionC &&
                      question.optionD &&
                      ["C", "D"].map((option) => (
                        <TouchableOpacity
                          activeOpacity={0.5}
                          key={option}
                          style={[
                            styles.optionButton,
                            selectedOptions[index] ===
                              question[`option${option}`] &&
                              styles.selectedOption,
                          ]}
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
                  </>
                )}
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={styles.nextButton}
            activeOpacity={0.8}
            onPress={handleSubmit}
          >
            {isLoading ? (
              <ActivityIndicator color={"white"} />
            ) : (
              <Text style={[styles.text, styles.buttonText]}>Submit</Text>
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
  input: {
    borderWidth: 1,
    borderColor: THIRD,
    height: 40,
    width: "100%",
    paddingLeft: 20,
    borderRadius: 10,
    fontFamily: "Inter_400Regular",
    backgroundColor: "#fff",
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

export default Questions_first;

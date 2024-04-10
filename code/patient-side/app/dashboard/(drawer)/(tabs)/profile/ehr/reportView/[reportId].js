import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import { ScrollView, TextInput } from "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Tabs, router, useLocalSearchParams } from "expo-router";
import { FOURTH, PRIMARY, THIRD } from "../../../../../../../styles/global";
import { Questions_array1 } from "../../../../../../../utilities/questionsArray";
import { useIsFocused } from "@react-navigation/native";

export default function ReportDetailsView() {
  const [userDetails, setUserDetails] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [reportDoc, setReportDoc] = useState(null);
  const isFocused = useIsFocused();

  const { reportId } = useLocalSearchParams();

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

  const getReport = async (docId) => {
    const reportDoc = (
      await firestore().collection("assessment-reports").doc(docId).get()
    ).data();
    setReportDoc(reportDoc);
    setSelectedOptions(reportDoc.selectedOptions);
  };

  useEffect(() => {
    if (userDetails) {
      if (isFocused) {
        // userDetails has been fetched already and the screen in in focus. Just get the new details
        getReport(reportId);
      } else {
        // when the screen is not in focus (when back button is pressed), reset all the fields
        setSelectedOptions([]);
        setReportDoc(null);
      }
    } else {
      // if user details have not been fetched, fetch them. Once they are fetched, the below useEffect is called because userDetails is changed and from there you get the current details
      fetchUser();
    }
  }, [isFocused]);

  useEffect(() => {
    if (userDetails) {
      getReport(reportId);
    }
  }, [userDetails]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
      <Tabs.Screen
        options={{
          headerTitle: "Report Details",
        }}
      />
      {/* If user or report has not been fetched, show the activity indicator */}
      {!userDetails || !reportDoc ? (
        <ActivityIndicator size={"large"} color={PRIMARY} style={{ flex: 1 }} />
      ) : (
        <View style={styles.container}>
          <View style={styles.title}>
            <Text style={[styles.text, styles.titleText]}>
              Your answers to the assessment test taken on{" "}
              {reportDoc.dateOfSubmission}
            </Text>
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
                      editable={false}
                      placeholder={question.placeholder}
                      value={selectedOptions[index] || ""}
                      keyboardType="number-pad"
                      style={styles.input}
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
                        disabled={true}
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
                          disabled={true}
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
  title: {
    width: "100%",
    marginBottom: 40,
  },
  titleText: {
    color: PRIMARY,
    fontSize: 16,
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
});

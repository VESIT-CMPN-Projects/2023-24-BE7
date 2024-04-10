import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";

import { ScrollView } from "react-native-gesture-handler";
import React, { useState, useEffect, useRef } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import {
  FOURTH,
  PRIMARY,
  SECONDARY,
  THIRD,
} from "../../../../../../styles/global";
import moment from "moment";
import { Questions_array3 } from "../../../../../../utilities/questionsArray";
import { router } from "expo-router";
import mapScoreToColor from "../../../../../../utilities/mapScoreToColor";

export default function DialyLogs() {
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todayDate, setTodayDate] = useState(new Date());
  const [allLogs, setAllLogs] = useState([]);

  const [dateColor, setDateColor] = useState([]);

  const scrollRef = useRef();

  const [selectedOptions, setSelectedOptions] = useState(
    Array(Questions_array3.length).fill(null)
  );

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

  const handleOptionToggle = (questionIndex, option) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[questionIndex] =
      newSelectedOptions[questionIndex] ===
      Questions_array3[questionIndex][`option${option}`]
        ? null
        : Questions_array3[questionIndex][`option${option}`];
    setSelectedOptions(newSelectedOptions);
    // console.log(newSelectedOptions);
  };

  const calculateScore = (selectedOptions) => {
    let score = 0;
    if (selectedOptions[0] === "Yes" || selectedOptions[0] === "Not suggested")
      score += 20;
    if (selectedOptions[1] === "Yes" || selectedOptions[1] === "Not suggested")
      score += 20;
    if (selectedOptions[2] === "Yes" || selectedOptions[2] === "Not suggested")
      score += 20;
    if (selectedOptions[4] === "Yes" || selectedOptions[4] === "Not suggested")
      score += 20;
    if (selectedOptions[7] === "Yes") score += 20;
    return score;
  };

  const handleSubmit = async () => {
    const date = new Date();
    setIsLoading(true);

    let score = calculateScore(selectedOptions);
    try {
      const diaryLog = await firestore().collection("diary-logs").add({
        userId: userDetails.uid,
        score: score,
        answers: selectedOptions,
        timestamp: date.toISOString(),
      });

      // diary log has been created with id = diaryLog.id. Append this in the user's diary log array
      // console.log(diaryLog);

      const formattedDate = moment(date).format("DD-MM-YYYY");
      const obj = {
        [formattedDate]: diaryLog.id,
      };

      // iterate over all the diaryLogs to find whether the user has submitted on the same date previously. If yes, then update the object with the new document ID. If not, then create a new obj and push it. In the end, update it back to the firebase.
      let diaryLogs = userDetails.diaryLogs;
      let entryFound = false;
      for (let i = 0; i < diaryLogs.length; i++) {
        if (diaryLogs[i].hasOwnProperty(formattedDate)) {
          // Update existing entry
          let docToBeDeleted = diaryLogs[i][formattedDate];
          diaryLogs[i][formattedDate] = diaryLog.id; // ID of the newly created document
          entryFound = true;

          // User filled a new diary log hence a new document is created. Now you can delete the old document.
          firestore()
            .collection("diary-logs")
            .doc(docToBeDeleted)
            .delete()
            .then(() => {
              // console.log(`Document with ID: ${docToBeDeleted} deleted successfully!`);
            });
          break;
        }
      }

      if (!entryFound) {
        // Add new entry
        diaryLogs.push(obj);
      }

      firestore().collection("users").doc(userDetails.uid).update({
        diaryLogs: diaryLogs,
      });

      // clear all inputs and go back
      setSelectedOptions(Array(Questions_array3.length).fill(null));
      Alert.alert("Thank you!", "You have submitted your log for today.", [
        { text: "OK", onPress: () => {} },
      ]);
    } catch (error) {
      // console.log(error);
      alert("Unknown error occurred");
    } finally {
      setIsLoading(false);
      router.back();
    }
  };

  const fetchPreviousSevenDayLogs = async () => {
    // if fetched initially, then the function is called again because the user has added a new log, hence reset the state variables and fetch again.
    setDateColor([]);

    [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3].map((item, index) => {
      const date = moment().add(item, "days");
      const formattedDate = moment(date).format("DD-MM-YYYY");

      // iterate over diary logs of the user and find the entry of {date: docId} object.
      const res = userDetails.diaryLogs.find((obj) =>
        obj.hasOwnProperty(formattedDate)
      );

      // only if entry is present
      if (res) {
        // fetch the document corresponding to the formattedDate.
        firestore()
          .collection("diary-logs")
          .doc(res[formattedDate]) // gives the document ID
          .get()
          .then((doc) => {
            if (doc.exists) {
              setAllLogs((currentLogs) => [
                ...currentLogs,
                {
                  [formattedDate]: doc.data(),
                },
              ]);
              setDateColor((current) => [
                ...current,
                {
                  [formattedDate]: mapScoreToColor(doc.data().score),
                },
              ]);
            } else {
              // The doc doesn't exist
              // console.log("No such document log found");
            }
            // today's doc because item == 0 indicates today.
            if (doc.exists && item == 0) {
              setSelectedOptions(doc.data()["answers"]);
            }
          });
      } else {
        item < 0 &&
          setDateColor((curr) => [
            ...curr,
            {
              [formattedDate]: "#7f1d1d", // for missed (dark red)
            },
          ]);
      }
    });
  };

  const handleDateSelection = (date) => {
    setSelectedDate(date);
    const formattedDate = moment(date).format("DD-MM-YYYY");

    // filter through all the logs and find the doc with the key of formatted date.
    let filtered = allLogs.filter(
      (obj) => Object.keys(obj)[0] === formattedDate
    );

    // if length is zero, that means diary log was not filled on that day.
    if (filtered.length == 0) {
      setSelectedOptions(Array(Questions_array3.length).fill(null));
      return;
    }
    filtered = filtered[0][formattedDate];
    setSelectedOptions(filtered["answers"]);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (userDetails) {
      scrollRef.current?.scrollTo({
        x: Dimensions.get("window").width / 3,
        animated: true,
      });
      userDetails.diaryLogs && fetchPreviousSevenDayLogs();
    }
  }, [userDetails]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
      {/* If loading is true or user has not been fetched, show the activity indicator */}
      {!userDetails ? (
        <ActivityIndicator size={"large"} color={PRIMARY} style={{ flex: 1 }} />
      ) : (
        <View style={styles.container}>
          <Text style={[styles.text, styles.headerText]}>
            {moment(selectedDate).format("MMMM Do")}
          </Text>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            style={styles.scrollContainer}
            ref={scrollRef}
          >
            {[-6, -5, -4, -3, -2, -1, 0, 1, 2, 3].map((item, index) => {
              const date = moment().add(item, "days");
              const isDisabled = date > new Date();

              const formattedDate = moment(date).format("DD-MM-YYYY");
              let filtered = dateColor.filter(
                (obj) => Object.keys(obj)[0] === formattedDate
              );

              // if length is > 0, that means diary log was filled on that day and hence get the color
              let bgColor = null;
              if (filtered.length > 0) {
                bgColor = filtered[0][formattedDate];
              }

              return (
                <View key={index} style={styles.dayDateContainer}>
                  <Text
                    style={[
                      styles.text,
                      styles.dayText,
                      item === 0 && styles.todayDayText,
                    ]}
                  >
                    {moment(date).format("ddd")}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.dateContainer,
                      // default background color
                      { backgroundColor: "#e0e0e0" },
                      // if user has never filled log before, do not show it as missed, show as disabled.
                      userDetails.diaryLogs.length == 0 && {
                        backgroundColor: "#e0e0e0",
                      },
                      // today's box will be shown with a blue background
                      item === 0 && styles.todayDateContainer,
                      // if log was filled on that day, it overrides everything and that color is taken
                      bgColor && { backgroundColor: bgColor },
                      isDisabled && styles.disabledDay,
                    ]}
                    disabled={isDisabled}
                    onPress={() => handleDateSelection(date)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.text, styles.dateText]}>
                      {moment(date).format("DD")}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>

          {/* Questions */}
          {Questions_array3.map((question, index) => (
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
                        moment(selectedDate).format("D") !=
                          todayDate.getDate() && styles.disabledButton,
                        selectedOptions[index] ===
                          question[`option${option}`] && styles.selectedOption,
                        // option C has full width
                        option === "C" && { width: "100%" },
                      ]}
                      activeOpacity={0.5}
                      onPress={() => handleOptionToggle(index, option)}
                      disabled={
                        moment(selectedDate).format("D") != todayDate.getDate()
                      }
                    >
                      <Text
                        style={[
                          styles.text,
                          moment(selectedDate).format("D") !=
                            todayDate.getDate() && styles.disabledButtonText,
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
          {moment(selectedDate).format("D") == todayDate.getDate() && (
            <TouchableOpacity
              style={styles.submitButton}
              activeOpacity={0.8}
              onPress={handleSubmit}
            >
              {isLoading ? (
                <ActivityIndicator color={"white"} />
              ) : (
                <Text style={[styles.text, styles.buttonText]}>Submit</Text>
              )}
            </TouchableOpacity>
          )}
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
  headerText: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    marginTop: 14,
    textAlign: "center",
  },
  dayDateContainer: {
    alignItems: "center",
    gap: 5,
    marginRight: 15,
    paddingVertical: 5,
    marginBottom: 20,
  },
  dateContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  todayDateContainer: {
    backgroundColor: PRIMARY,
  },
  dayText: {
    color: SECONDARY,
  },
  todayDayText: {
    color: "#000",
    fontFamily: "Inter_600SemiBold",
  },
  disabledDay: {
    backgroundColor: "#e0e0e0",
  },
  selectedDay: {
    backgroundColor: "green",
  },
  dateText: {
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
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
  disabledButton: {
    backgroundColor: "#e0e0e0",
  },
  disabledButtonText: {
    color: THIRD,
  },
  submitButton: {
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

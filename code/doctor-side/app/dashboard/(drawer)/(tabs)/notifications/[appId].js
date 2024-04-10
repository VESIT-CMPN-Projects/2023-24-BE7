import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import moment from "moment";
import {
  PRIMARY,
  FOURTH,
  THIRD,
  SECONDARY,
} from "../../../../../styles/global";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";

export default function Notifications() {
  const [userDetails, setUserDetails] = useState(null);
  const [appDetails, setAppDetails] = useState(null);
  const { appId } = useLocalSearchParams();
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);

  const TODAY_DATE = new Date();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const fetchUser = async () => {
    const user = auth().currentUser;

    if (user) {
      // User is signed in, find the document from firestore.
      firestore()
        .collection("admin")
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

  const fetchAppointmentFromID = async () => {
    firestore()
      .collection("appointments")
      .doc(appId)
      .get()
      .then((doc) => {
        const data = doc.data();
        setAppDetails(data);
        setSelectedDate(data.dateOfAppointment);
        setSelectedTimeSlot(data.timeOfAppointment);
      });
  };

  const updateAppointment = () => {
    setIsLoading(true);
    try {
      firestore().collection("appointments").doc(appId).update({
        dateOfAppointment: selectedDate,
        timeOfAppointment: selectedTimeSlot,
      });
    } catch (err) {
      console.log(err);
      alert("Unknown error occurred");
    } finally {
      setIsLoading(false);
      router.back();
      alert("Appointment updated");
    }
  };

  useEffect(() => {
    if (userDetails) {
      if (isFocused) {
        // userDetails has been fetched already and the screen in in focus. Just get the appointment details.
        fetchAppointmentFromID(appId);
      } else {
        // when the screen is not in focus (when back button is pressed), reset all the fields
        setAppDetails(null);
        setSelectedDate(null);
        setSelectedTimeSlot(null);
      }
    } else {
      // if user details have not been fetched, fetch them. Once they are fetched, the below useEffect is called because userDetails is changed and from there you get the new appointment details.
      fetchUser();
    }
  }, [isFocused]);

  useEffect(() => {
    if (userDetails) {
      fetchAppointmentFromID(appId);
    }
  }, [userDetails]);

  const getDate = (count) => {
    const date = new Date(TODAY_DATE);
    date.setDate(date.getDate() + count);
    return date.toString();
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
      {!userDetails || !appDetails ? (
        <ActivityIndicator size={"large"} color={PRIMARY} style={{ flex: 1 }} />
      ) : (
        <View style={styles.container}>
          <View style={styles.eachAppointment}>
            <Image
              source={{
                uri: "https://assets.lybrate.com/img/documents/doctor/dp/8a442fe9ddbc0ce82c9661b571902598/Neurology-BinduMenon-Nellore-2ac9b4.jpg",
              }}
              style={styles.profileImg}
            />
            <View style={styles.detailsSection}>
              <Text style={styles.doctorName}>Dr. Bindu Menon</Text>
              <Text style={styles.doctorPost}>Specialist in Neurology</Text>
            </View>
          </View>

          <View style={styles.appointmentDetails}>
            <Text style={styles.sectionHeader}>Appointment For</Text>
            <TextInput
              value={`Patient name: ${appDetails.patientName}`}
              placeholder="Patient name"
              style={styles.input}
              editable={false}
            />
            <TextInput
              value={`Purpose: ${appDetails.purposeOfVisit}`}
              placeholder="Purpose of visit"
              style={styles.input}
              editable={false}
            />
          </View>

          <View style={styles.calendarContainer}>
            <Text style={styles.sectionHeader}>Select Date</Text>
            <Calendar
              style={styles.calendar}
              current={TODAY_DATE.toString()}
              minDate={TODAY_DATE.toString()}
              maxDate={getDate(30)}
              firstDay={1}
              hideExtraDays={true}
              onDayPress={(date) => {
                setSelectedDate(date.dateString);
              }}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: PRIMARY },
              }}
              theme={{
                textMonthFontFamily: "Inter_600SemiBold",
                textDayHeaderFontFamily: "Inter_600SemiBold",
                textDayFontFamily: "Inter_400Regular",
                monthTextColor: "white",
                arrowColor: "white",
                todayTextColor: PRIMARY,

                "stylesheet.calendar.header": {
                  header: {
                    backgroundColor: PRIMARY,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 5,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    marginHorizontal: 0,
                    marginVertical: 0,
                  },
                },
              }}
            />
          </View>

          <View style={styles.appointmentDetails}>
            <Text style={styles.sectionHeader}>Select Time Slot</Text>
            <View style={styles.timeContainer}>
              <TouchableOpacity
                onPress={() => setSelectedTimeSlot("11:00")}
                activeOpacity={0.5}
                style={[
                  styles.timeSlotBox,
                  selectedTimeSlot === "11:00" && styles.timeSlotSelected,
                ]}
              >
                <Text
                  style={[
                    styles.text,
                    selectedTimeSlot === "11:00" && styles.timeSlotTextSelected,
                  ]}
                >
                  11:00 AM to 12:00 PM
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSelectedTimeSlot("12:00")}
                activeOpacity={0.5}
                style={[
                  styles.timeSlotBox,
                  selectedTimeSlot === "12:00" && styles.timeSlotSelected,
                ]}
              >
                <Text
                  style={[
                    styles.text,
                    selectedTimeSlot === "12:00" && styles.timeSlotTextSelected,
                  ]}
                >
                  12:00 PM to 1:00 PM
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSelectedTimeSlot("15:00")}
                activeOpacity={0.5}
                style={[
                  styles.timeSlotBox,
                  selectedTimeSlot === "15:00" && styles.timeSlotSelected,
                ]}
              >
                <Text
                  style={[
                    styles.text,
                    selectedTimeSlot === "15:00" && styles.timeSlotTextSelected,
                  ]}
                >
                  3:00 PM to 4:00 PM
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSelectedTimeSlot("16:00")}
                activeOpacity={0.5}
                style={[
                  styles.timeSlotBox,
                  selectedTimeSlot === "16:00" && styles.timeSlotSelected,
                ]}
              >
                <Text
                  style={[
                    styles.text,
                    selectedTimeSlot === "16:00" && styles.timeSlotTextSelected,
                  ]}
                >
                  4:00 PM to 5:00 PM
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={updateAppointment}
            activeOpacity={0.8}
            style={styles.button}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={"white"} />
            ) : (
              <Text style={styles.buttonText}>Modify</Text>
            )}
          </TouchableOpacity>
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
  eachAppointment: {
    width: "100%",
    height: 150,
    padding: 20,
    marginBottom: 30,
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  profileImg: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginRight: 20,
  },
  doctorName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  doctorPost: {
    fontFamily: "Inter_600SemiBold",
    color: THIRD,
  },
  appointmentDetails: {
    width: "100%",
  },
  sectionHeader: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  input: {
    borderWidth: 1,
    borderColor: THIRD,
    height: 50,
    width: "100%",
    paddingLeft: 20,
    marginVertical: 15,
    borderRadius: 10,
    fontFamily: "Inter_400Regular",
    color: SECONDARY,
    backgroundColor: "#e1e1e1",
  },
  calendarContainer: {
    width: "100%",
    marginVertical: 15,
  },
  calendar: {
    marginHorizontal: 10,
    marginVertical: 15,
    color: PRIMARY,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: PRIMARY,
  },
  timeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 15,
    marginBottom: 30,
  },
  timeSlotBox: {
    // height: 30,
    width: "48%",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  timeSlotSelected: {
    backgroundColor: PRIMARY,
  },
  timeSlotTextSelected: {
    color: "white",
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
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 18,
    lineHeight: 21,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.25,
    color: "white",
  },
});

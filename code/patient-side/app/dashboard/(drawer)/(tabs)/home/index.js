import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { router } from "expo-router";
import {
  PRIMARY,
  BLUE_SHADE,
  FOURTH,
  THIRD,
  SECONDARY,
} from "../../../../../styles/global";
import { ScrollView } from "react-native-gesture-handler";
import moment from "moment";
import mapScoreToColor from "../../../../../utilities/mapScoreToColor";
import { CartesianChart, Bar } from "victory-native";
import { useFont } from "@shopify/react-native-skia";
import inter from "../../../../../assets/Inter-Medium.ttf";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Homepage() {
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [upcomingAppointment, setUpcomingAppointment] = useState(null);
  const [alreadyFetchedApps, setAlreadyFetchedApps] = useState(false);

  const scrollRef = useRef();
  const [dateColor, setDateColor] = useState([]);
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState([]);

  const font = useFont(inter, 12);

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

  const fetchUpcomingAppointment = async () => {
    setLoading(true);
    let allApps = userDetails.appointments;
    // Step 1: Map each ID to a promise that fetches the document
    const fetchPromises = allApps.map((id) =>
      firestore()
        .collection("appointments")
        .doc(id)
        .get()
        .then((doc) => {
          // check if the appointment date is after the current time or today.
          if (
            doc.exists &&
            moment(doc.data().dateOfAppointment).isSameOrAfter(
              Date.now(),
              "day"
            )
          ) {
            return { appId: doc.id, ...doc.data() };
          } else {
            // The doc doesn't exist
            // console.log("No such document or the appointment has expired!");
            return null;
          }
        })
    );

    // Step 2: Use Promise.all to wait for all fetches to complete
    Promise.all(fetchPromises)
      .then((fetchedDocuments) => {
        // Filter out any nulls if a document didn't exist
        // from all valid documents, find the document with the minimum time, because all documents fetched are of upcoming appointments and the one with the minimum time is the first upcoming appointment.
        const validDocuments = fetchedDocuments
          .filter((doc) => doc !== null)
          .sort(
            (a, b) =>
              new Date(a.dateOfAppointment) - new Date(b.dateOfAppointment)
          );

        // Update state with fetched documents
        if (validDocuments.length > 0) {
          setUpcomingAppointment(validDocuments[0]);
        } else {
          // no upcoming appointment.
          setUpcomingAppointment(null);
        }
        // make loading false to display all the fetched documents at once.
        setLoading(false);

        // scroll to a particular position (code placed here because it runs after all promises are completed.)
        scrollRef.current?.scrollTo({
          x: Dimensions.get("window").width / 3,
          animated: true,
        });
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });
  };

  const fetchPreviousSevenDayLogs = async () => {
    // if fetched initially, then the function is called again because the user has added a new log, hence reset the state variables and fetch again.
    setDateColor([]);
    setData([]);
    setChartData([]);

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
              setDateColor((current) => [
                ...current,
                {
                  [formattedDate]: mapScoreToColor(doc.data().score),
                },
              ]);
              setData((curr) => [
                ...curr,
                {
                  date: formattedDate,
                  day: moment(date).format("ddd"),
                  score: Math.max(doc.data().score, 5),
                },
              ]);
            } else {
              // The doc doesn't exist
              // console.log("No such document log found");
            }
          });
      } else {
        // if user has not filled log in previous day, keep a default score of 5.
        item < 0 &&
          setData((curr) => [
            ...curr,
            {
              date: formattedDate,
              day: moment(date).format("ddd"),
              score: 5,
            },
          ]);

        item < 0 &&
          setDateColor((curr) => [
            ...curr,
            {
              [formattedDate]: "#7f1d1d", // for missed (dark red)
            },
          ]);

        // if user has not filled today, show a bar with 0 height
        item == 0 &&
          setData((curr) => [
            ...curr,
            {
              date: formattedDate,
              day: moment(date).format("ddd"),
              score: 0,
            },
          ]);
      }
    });
  };

  const handleDateSelection = () => {
    router.push("dashboard/profile/ehr/diaryLogs");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (userDetails) {
      fetchUpcomingAppointment().then(setAlreadyFetchedApps(true));
      userDetails.diaryLogs && fetchPreviousSevenDayLogs();
    }
  }, [userDetails]);

  useEffect(() => {
    // Only when we have exactly 7 entries, update the state to show the graph
    if (data.length == 7) {
      const sortedData = [...data].sort(
        (a, b) => parseDate(a.date) - parseDate(b.date)
      );

      // Update the state with the sorted data
      setChartData(sortedData);
    }
  }, [data]);

  const parse = (name) => {
    // Given a name which has more than 2 words, like name and surname, return the first word, i.e. only the name
    let arr = name.split(" ");
    if (arr.length > 1) return arr[0];
    return name;
  };

  // Function to parse the date from DD-MM-YYYY format
  const parseDate = (dateString) => {
    const parts = dateString.split("-");
    return new Date(parts[2], parts[1] - 1, parts[0]);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
      {!userDetails || loading ? (
        <ActivityIndicator size={"large"} color={PRIMARY} style={{ flex: 1 }} />
      ) : (
        <View style={styles.container}>
          <Text style={[styles.text, styles.username]}>
            Hi, {userDetails && parse(userDetails.name)}!
          </Text>
          <View style={styles.assessmentContainer}>
            <View>
              <Text style={[styles.text, styles.heading]}>
                Stroke Assessment
              </Text>
              <Text style={[styles.text, styles.subText]}>
                Take up the quiz
              </Text>
            </View>
            <View>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.button}
                onPress={() => {
                  router.push("dashboard/assessment");
                }}
              >
                <Text style={styles.buttonText}>Test now</Text>
              </TouchableOpacity>
            </View>
          </View>

          {userDetails.diaryLogs.length > 0 && (
            <View style={styles.chartContainer}>
              <Text
                style={[styles.text, styles.sectionHeader, { marginBottom: 0 }]}
              >
                Your weekly report
              </Text>
              {chartData.length >= 6 ? (
                <>
                  <Text style={[styles.text, styles.chartSubText]}>
                    {/* From the first date in the array to the last date in the array */}
                    From{" "}
                    {moment(chartData[0].date, "DD-MM-YYYY").format("Do MMM")}{" "}
                    to{" "}
                    {moment(
                      chartData[chartData.length - 1].date,
                      "DD-MM-YYYY"
                    ).format("Do MMM")}
                  </Text>
                  <CartesianChart
                    data={chartData}
                    xKey="day"
                    yKeys={["score"]}
                    domainPadding={{ left: 50, right: 50, top: 10 }}
                    domain={{ y: [0, 100] }}
                    axisOptions={{
                      font,
                      tickCount: 7,
                      lineColor: THIRD,
                      labelColor: "#000",
                    }}
                  >
                    {({ points, chartBounds }) => {
                      return (
                        <Bar
                          points={points.score}
                          chartBounds={chartBounds}
                          color={PRIMARY}
                          innerPadding={0.4}
                          roundedCorners={{ topLeft: 4, topRight: 4 }}
                        />
                      );
                    }}
                  </CartesianChart>
                </>
              ) : (
                <View style={styles.loadingContainer}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={14}
                    color={SECONDARY}
                  />
                  <Text style={[styles.text, styles.loadingText]}>
                    Preparing the chart...
                  </Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.appointmentContainer}>
            <View style={styles.appointmentHeader}>
              <Text style={[styles.text, styles.sectionHeader]}>
                Next Appointment
              </Text>
              {upcomingAppointment && (
                <TouchableOpacity
                  onPress={() => {
                    router.push("dashboard/notifications");
                  }}
                  activeOpacity={0.5}
                >
                  <Text style={[styles.text, styles.seeAllText]}>See all</Text>
                </TouchableOpacity>
              )}
            </View>

            {upcomingAppointment ? (
              <View style={styles.eachAppointment}>
                <Image
                  source={{
                    uri: "https://assets.lybrate.com/img/documents/doctor/dp/8a442fe9ddbc0ce82c9661b571902598/Neurology-BinduMenon-Nellore-2ac9b4.jpg",
                  }}
                  style={styles.profileImg}
                />
                <View style={styles.detailsSection}>
                  <Text style={styles.doctorName}>Dr. Bindu Menon</Text>
                  <Text style={styles.visitReason}>
                    {upcomingAppointment.purposeOfVisit}
                  </Text>
                  <Text style={styles.dateTime}>
                    {moment(upcomingAppointment.dateOfAppointment).format(
                      "ddd, MMM D [at]"
                    )}{" "}
                    {moment(
                      upcomingAppointment.timeOfAppointment,
                      "H:mm"
                    ).format("h:mm A")}
                  </Text>
                </View>
              </View>
            ) : (
              <>
                <Text style={[styles.text, styles.appointmentMsg1]}>
                  Oh, you have no new appointments.
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    router.push("dashboard/notifications");
                  }}
                  activeOpacity={0.5}
                >
                  <Text style={[styles.text, styles.appointmentMsg2]}>
                    Schedule an appointment with a specialist now
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={styles.appointmentContainer}>
            <Text style={[styles.text, styles.sectionHeader]}>Diary Logs</Text>
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
                      onPress={() => handleDateSelection()}
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
          </View>

          <View style={styles.appointmentContainer}>
            <Text style={[styles.text, styles.sectionHeader]}>
              Preventive Measures
            </Text>

            <ScrollView
              style={styles.preventiveScroll}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
            >
              <TouchableOpacity
                onPress={() => {
                  router.push("dashboard/home/awarenessPrograms");
                }}
                activeOpacity={0.8}
              >
                <View style={styles.preventiveBox}>
                  <Image
                    source={require("../../../../../assets/awareness.jpg")}
                    style={styles.preventiveImg}
                  />
                  <Text style={[styles.text, styles.preventiveText]}>
                    Awareness Programs
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  router.push("dashboard/home/exercises");
                }}
                activeOpacity={0.8}
              >
                <View style={styles.preventiveBox}>
                  <Image
                    source={require("../../../../../assets/exercise.jpg")}
                    style={styles.preventiveImg}
                  />
                  <Text style={[styles.text, styles.preventiveText]}>
                    Exercises
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  router.push("dashboard/home/meditation");
                }}
                activeOpacity={0.8}
              >
                <View style={styles.preventiveBox}>
                  <Image
                    source={require("../../../../../assets/meditation.jpg")}
                    style={styles.preventiveImg}
                  />
                  <Text style={[styles.text, styles.preventiveText]}>
                    Meditation
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  router.push("dashboard/home/dietPlan");
                }}
                activeOpacity={0.8}
              >
                <View style={styles.preventiveBox}>
                  <Image
                    source={require("../../../../../assets/diet.jpg")}
                    style={styles.preventiveImg}
                  />
                  <Text style={[styles.text, styles.preventiveText]}>
                    Diet Plan
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
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
  username: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  assessmentContainer: {
    backgroundColor: BLUE_SHADE,
    width: "100%",
    borderRadius: 10,
    padding: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  heading: {
    fontSize: 16,
    paddingBottom: 5,
    fontFamily: "Inter_700Bold",
  },
  subText: {
    fontSize: 13,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: PRIMARY,
  },
  buttonText: {
    fontSize: 14,
    letterSpacing: 0.25,
    color: "white",
    fontFamily: "Inter_400Regular",
  },
  appointmentContainer: {
    marginVertical: 15,
    width: "100%",
  },
  appointmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  seeAllText: {
    marginBottom: 10,
    color: PRIMARY,
    paddingRight: 10,
    textDecorationLine: "underline",
    fontFamily: "Inter_600SemiBold",
  },
  sectionHeader: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 10,
  },
  eachAppointment: {
    width: "100%",
    height: 150,
    padding: 20,
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
  },
  visitReason: {
    fontFamily: "Inter_600SemiBold",
    color: THIRD,
    marginBottom: 10,
  },
  dateTime: {
    fontFamily: "Inter_600SemiBold",
    color: PRIMARY,
  },
  appointmentMsg1: {
    textAlign: "center",
    marginBottom: 5,
  },
  appointmentMsg2: {
    textAlign: "center",
    textDecorationLine: "underline",
    color: PRIMARY,
  },
  preventiveBox: {
    width: 200,
    height: 180,
    backgroundColor: PRIMARY,
    marginRight: 30,
    borderRadius: 15,
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  preventiveImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    objectFit: "cover",
  },
  preventiveText: {
    color: "white",
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },

  dayDateContainer: {
    alignItems: "center",
    gap: 5,
    marginRight: 15,
    paddingVertical: 5,
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
  chartContainer: {
    height: 250,
    width: "100%",
    marginVertical: 15,
  },
  chartSubText: {
    marginBottom: 10,
    color: SECONDARY,
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  loadingText: {
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    color: SECONDARY,
  },
});

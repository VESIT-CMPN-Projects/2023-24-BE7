import { View, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import { Tabs, router, useLocalSearchParams } from "expo-router";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

import Pdf from "react-native-pdf";
import { FOURTH, PRIMARY } from "../../../../../../../styles/global";
import { useIsFocused } from "@react-navigation/native";

export default function PdfView() {
  const { filename } = useLocalSearchParams();
  const [userDetails, setUserDetails] = useState(null);
  const [source, setSource] = useState(null);

  const isFocused = useIsFocused();

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
    if (userDetails) {
      if (isFocused) {
        // userDetails has been fetched already and the screen in in focus. Just get the url of the file.
        getURLFromFilename(filename);
      } else {
        // when the screen is not in focus (when back button is pressed), set the source of document to null.
        setSource(null);
      }
    } else {
      // if user details have not been fetched, fetch them. Once they are fetched, the below useEffect is called because userDetails is changed and from there you get the URL of the current file.
      fetchUser();
    }
  }, [isFocused]);

  useEffect(() => {
    if (userDetails) {
      getURLFromFilename(filename);
    }
  }, [userDetails]);

  const getURLFromFilename = (filename) => {
    // folder/filename is userDetails.uid/filename
    const ref = storage().ref(userDetails.uid + "/" + filename);
    ref.getDownloadURL().then((res) => setSource(res));
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs.Screen
        options={{
          headerTitle: filename.substring(filename.indexOf("_") + 1),
        }}
      />
      {/* If user not fetched or source not fetched, show the activity indicator */}
      {!userDetails || !source ? (
        <ActivityIndicator size={"large"} color={PRIMARY} style={{ flex: 1 }} />
      ) : (
        <View style={styles.container}>
          <Pdf
            trustAllCerts={false}
            source={{ uri: source, cache: true }}
            onError={(error) => {
              console.log(error);
            }}
            style={styles.pdf}
          />
        </View>
      )}
    </View>
  );
}

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
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

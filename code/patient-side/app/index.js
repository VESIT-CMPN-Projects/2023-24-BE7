import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import Walkthrough from "./walkthroughpage";
import Login from "./Login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function index() {
  let [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
  });

  const [showWalkthrough, setShowWalkthrough] = useState(true);
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("hasLaunched");
      if (value !== null) {
        setShowWalkthrough(false);
      }
    } catch (err) {
      // error reading value
      console.log(err);
    }
  };

  const showAllKeys = () => {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (error, stores) => {
        stores.map((result, i, store) => {
          console.log({ [store[i][0]]: store[i][1] });
          return true;
        });
      });
    });
  };

  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem("hasLaunched");
    } catch (e) {
      // remove error
    }
  };

  useEffect(() => {
    getData();
    // showAllKeys();  // to list all the key-value pairs
    // removeValue();  // to remove a key-value pair
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      {showWalkthrough ? <Walkthrough /> : <Login />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

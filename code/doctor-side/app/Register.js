import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Pressable,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

import { PRIMARY, FOURTH, THIRD, SECONDARY } from "../styles/global";

const { width, height } = Dimensions.get("window");

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);
    if (cPassword !== password) {
      alert("Passwords do not match");
      setIsLoading(false);
      return;
    }
    if (phoneNumber.toString().length !== 10) {
      alert("Invalid phone number");
      setIsLoading(false);
      return;
    }

    try {
      let email = phoneNumber + "@admin-health.com";
      const authRes = await auth().createUserWithEmailAndPassword(
        email,
        password
      );

      await firestore().collection("admin").doc(authRes.user.uid).set({
        name,
        phoneNumber,
        dateOfBirth: null,
        gender: null,
        height: null,
        weight: null,
        bloodPressure: null,
        bloodSugar: null,
        allergies: null,
        documents: [],
        diaryLogs: [],
      });

      // everything is good and the user has been created.
      // console.log(authRes.user);
      router.replace("dashboard");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("The phone number is already in use");
      } else if (error.code === "auth/invalid-email") {
        alert("The phone number is invalid");
      } else if (error.code === "auth/weak-password") {
        alert("Password should be at least 6 characters");
      } else alert(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.blueBox}>
        <Image
          style={styles.logoImg}
          source={require("../assets/logo-pure-white.png")}
        />
      </View>
      <View style={styles.loginBox}>
        <Text style={styles.text}>Create a new account</Text>

        <TextInput
          value={name}
          onChangeText={(val) => setName(val)}
          placeholder="Your name"
          style={styles.input}
          placeholderTextColor={THIRD}
        />

        <TextInput
          value={phoneNumber}
          onChangeText={(val) => setPhoneNumber(val)}
          keyboardType="number-pad"
          placeholder="Phone Number (10 digits)"
          style={styles.input}
          maxLength={10}
          placeholderTextColor={THIRD}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            value={password}
            onChangeText={(val) => setPassword(val)}
            secureTextEntry={!passwordVisible}
            placeholder="Password"
            style={styles.input}
            placeholderTextColor={THIRD}
          />
          <Pressable
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.icon}
          >
            <Ionicons
              name={passwordVisible ? "eye-off-outline" : "eye-outline"}
              size={26}
              color={SECONDARY}
            />
          </Pressable>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            value={cPassword}
            onChangeText={(val) => setCPassword(val)}
            secureTextEntry={!confirmPasswordVisible}
            placeholder="Confirm Password"
            style={styles.input}
            placeholderTextColor={THIRD}
          />
          <Pressable
            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            style={styles.icon}
          >
            <Ionicons
              name={confirmPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={26}
              color={SECONDARY}
            />
          </Pressable>
        </View>

        <TouchableOpacity
          onPress={handleRegister}
          activeOpacity={0.8}
          style={styles.button}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={"white"} />
          ) : (
            <Text style={styles.buttonText}>Sign up</Text>
          )}
        </TouchableOpacity>

        <Link href="/Login" asChild>
          <TouchableOpacity activeOpacity={0.6}>
            <Text style={styles.loginMainText}>
              Already have an account?
              <Text style={styles.loginSpecialText}>&nbsp; Log in</Text>
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  blueBox: {
    backgroundColor: PRIMARY,
    height: height * 0.3,
    width: width,
    justifyContent: "space-around",
    alignItems: "center",
  },
  logoImg: {
    width: "65%",
    height: 100,
    objectFit: "contain",
  },
  loginBox: {
    position: "absolute",
    top: height * 0.25,
    backgroundColor: FOURTH,
    width: width,
    height: height * 0.75,
    borderTopEndRadius: 30,
    borderTopLeftRadius: 30,
    zIndex: 2,
    flex: 1,
    paddingTop: 30,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  text: {
    color: PRIMARY,
    marginBottom: 20,
    fontSize: 18,
    color: PRIMARY,
    fontFamily: "Inter_700Bold",
  },
  input: {
    borderWidth: 1,
    borderColor: THIRD,
    height: 40,
    width: 300,
    paddingLeft: 20,
    marginVertical: 15,
    borderRadius: 10,
    fontFamily: "Inter_400Regular",
    backgroundColor: "#fff",
  },
  icon: {
    position: "absolute",
    right: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    width: 300,
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
  loginMainText: {
    fontFamily: "Inter_400Regular",
  },
  loginSpecialText: {
    fontFamily: "Inter_400Regular",
    color: PRIMARY,
  },
});

export default Register;

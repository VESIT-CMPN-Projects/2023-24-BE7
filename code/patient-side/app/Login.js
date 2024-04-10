import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  Pressable,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";

import { PRIMARY, FOURTH, THIRD, SECONDARY } from "../styles/global";

const { width, height } = Dimensions.get("window");

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);

    if (phoneNumber.toString().length !== 10) {
      alert("Invalid phone number");
      setIsLoading(false);
      return;
    }

    try {
      let email = phoneNumber + "@health.com";
      const authRes = await auth().signInWithEmailAndPassword(email, password);

      // everything is good and the user has been created.
      // console.log(authRes);

      router.replace("dashboard");
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        alert("Invalid credentials");
      }
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
        <TextInput
          keyboardType="number-pad"
          value={phoneNumber}
          onChangeText={(val) => setPhoneNumber(val)}
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

        <TouchableOpacity
          onPress={handleLogin}
          activeOpacity={0.8}
          style={styles.button}
        >
          {isLoading ? (
            <ActivityIndicator color={"white"} />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <Link href="/Register" asChild>
          <TouchableOpacity activeOpacity={0.6}>
            <Text style={styles.signupMainText}>
              Don't have an account?
              <Text style={styles.signupSpecialText}>&nbsp; Sign up</Text>
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
    paddingTop: 50,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: THIRD,
    height: 50,
    width: 300,
    paddingLeft: 20,
    marginVertical: 15,
    borderRadius: 10,
    fontFamily: "Inter_400Regular",
    backgroundColor: "#fff",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    position: "absolute",
    right: 10,
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
  signupMainText: {
    fontFamily: "Inter_400Regular",
  },
  signupSpecialText: {
    fontFamily: "Inter_400Regular",
    color: PRIMARY,
  },
});

export default Login;

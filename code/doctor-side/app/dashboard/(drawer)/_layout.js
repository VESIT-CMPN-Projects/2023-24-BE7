import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { Drawer } from "expo-router/drawer";
import { View, Image, Text, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { FOURTH, PRIMARY } from "../../../styles/global";
import { router, usePathname } from "expo-router";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const CustomDrawerContent = (props) => {
  const pathname = usePathname(); // use pathname to specify which drawer item is active
  const [userDetails, setUserDetails] = useState(null);

  const fetchUser = async () => {
    const user = auth().currentUser;

    if (user) {
      // User is signed in, find the document from firestore.
      const userDoc = (
        await firestore().collection("admin").doc(user.uid).get()
      ).data();

      // console.log(userDoc);
      setUserDetails({
        uid: user.uid,
        ...userDoc,
      });
    } else {
      // No user is signed in. redirect to login.
      // console.log("No user is currently signed in");
      router.replace("/Login");
    }
  };

  useEffect(() => {
    // console.log(pathname);
    fetchUser();
  }, []);

  const parse = (fullText) => {
    return fullText.toUpperCase().replace(/^(.{3}).*(.{3})$/, "$1xxx$2");
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} scrollEnabled={false}>
        <View style={styles.imgContainer}>
          <Image
            source={{
              uri: "https://assets.lybrate.com/img/documents/doctor/dp/8a442fe9ddbc0ce82c9661b571902598/Neurology-BinduMenon-Nellore-2ac9b4.jpg",
            }}
            style={styles.profileImg}
          />
          <Text style={styles.profileText}>
            {userDetails && userDetails.name}
          </Text>
          <Text style={styles.profileText}>
            {userDetails && parse(userDetails.uid)}
          </Text>
        </View>

        <DrawerItem
          focused={pathname === "/dashboard/profile" ? true : false}
          inactiveTintColor={PRIMARY}
          icon={({ color, size }) => (
            <FontAwesome5 name="user-alt" size={size} color={color} />
          )}
          label={"My Profile"}
          labelStyle={styles.drawerText}
          onPress={() => {
            router.push("dashboard/profile");
          }}
        />

        {/* <DrawerItem
          focused={pathname === "/dashboard/profile/ehr" ? true : false}
          inactiveTintColor={PRIMARY}
          icon={({ color, size }) => (
            <MaterialCommunityIcons
              name="note-multiple"
              size={size}
              color={color}
            />
          )}
          label={"EHR"}
          labelStyle={styles.drawerText}
          onPress={() => {
            router.push("dashboard/profile/ehr");
          }}
        /> */}

        <DrawerItemList {...props} />

        <DrawerItem
          focused={pathname === "/dashboard/notifications" ? true : false}
          inactiveTintColor={PRIMARY}
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="bell" size={size} color={color} />
          )}
          label={"Notifications"}
          labelStyle={styles.drawerText}
          onPress={() => {
            router.push("dashboard/notifications");
          }}
        />

        {/* <DrawerItem
          focused={pathname === "/dashboard/profile/settings" ? true : false}
          inactiveTintColor={PRIMARY}
          icon={({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          )}
          label={"Settings"}
          labelStyle={styles.drawerText}
          onPress={() => {
            router.push("dashboard/profile/settings");
          }}
        /> */}

        <DrawerItem
          inactiveTintColor={PRIMARY}
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="logout" size={size} color={color} />
          )}
          label={"Logout"}
          labelStyle={styles.drawerText}
          onPress={() => {
            // signout user from firebase and go to login screen.
            auth().signOut();
            router.replace("/Login");
          }}
        />
      </DrawerContentScrollView>
    </View>
  );
};

const DashboardDrawerLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          drawerInactiveTintColor: PRIMARY,
          headerShown: false,
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerItemStyle: {
              display: "none",
            },
            headerTitle: () => null,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FOURTH,
  },
  imgContainer: {
    backgroundColor: PRIMARY,
    paddingVertical: 30,
  },
  profileImg: {
    marginBottom: 15,
    width: 100,
    height: 100,
    alignSelf: "center",
    borderRadius: 50,
    objectFit: "cover",
  },
  profileText: {
    textAlign: "center",
    color: "white",
    fontFamily: "Inter_400Regular",
    fontSize: 16,
  },
  drawerText: {
    fontFamily: "Inter_700Bold",
  },
});

export default DashboardDrawerLayout;

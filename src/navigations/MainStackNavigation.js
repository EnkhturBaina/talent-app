import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/LoginScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import HomeScreen from "../screens/HomeScreen";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import ProfileScreen from "../screens/ProfileScreen";
import NewsScreen from "../screens/NewsScreen";
import MainContext from "../contexts/MainContext";
import AttendanceScreen from "../screens/AttendanceScreen";
import EmployeesScreen from "../screens/EmployeesScreen";
import { FONT_FAMILY_BOLD } from "../constant";
import { Icon } from "@rneui/base";
import RequestListScreen from "../screens/RequestListScreen";
import BiometricScreen from "../screens/BiometricScreen";
import SendRequestScreen from "../screens/SendRequestScreen";
// import { Icon } from "@rneui/base";

const Stack = createStackNavigator();

const LoginStackNavigator = (props) => {
  const state = useContext(MainContext);
  return (
    <Stack.Navigator
      initialRouteName="LoginTab"
      screenOptions={{
        headerStyle: {
          shadowColor: "transparent", // this covers iOS
          elevation: 0, // this covers Android
        },
      }}
    >
      <Stack.Screen
        name="LoginTab"
        component={LoginScreen}
        options={{
          title: "",
          headerShown: false,
          headerTitleStyle: {},
          headerLeft: () => <></>,
        }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{
          title: "Нууц үг сэргээх",
          headerTitleStyle: {},
          headerLeft: () => (
            <TouchableOpacity
              style={styles.headerLeftContainer}
              onPress={() => {
                props.navigation.goBack();
              }}
            >
              {/* <Icon type="feather" name="arrow-left" /> */}
              <Text>BACK</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="BiometricScreen"
        component={BiometricScreen}
        options={{
          title: "",
          headerShown: false,
          headerTitleStyle: {
            fontFamily: FONT_FAMILY_BOLD,
          },
          headerLeft: () => (
            <TouchableOpacity
              style={styles.headerLeftContainer}
              onPress={() => {
                props.navigation.goBack();
              }}
            >
              <Icon
                name="keyboard-arrow-left"
                type="material-icons"
                size={30}
              />
              <Text style={styles.headerLeftText}>Биометр баталгаажуулах</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const HomeScreenStackNavigator = (props) => {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        // headerShown: false,
        headerStyle: {
          shadowColor: "transparent", // this covers iOS
          elevation: 0, // this covers Android
        },
      }}
    >
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
          title: "",
          headerTitleStyle: {},
          headerLeft: () => <></>,
        }}
      />
      <Stack.Screen
        name="AttendanceScreen"
        component={AttendanceScreen}
        options={{
          title: "",
          headerShown: false,
          headerTitleStyle: {
            fontFamily: FONT_FAMILY_BOLD,
          },
          headerLeft: () => (
            <TouchableOpacity
              style={styles.headerLeftContainer}
              onPress={() => {
                props.navigation.goBack();
              }}
            >
              <Icon
                name="keyboard-arrow-left"
                type="material-icons"
                size={30}
              />
              <Text style={styles.headerLeftText}>Ирц</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="RequestListScreen"
        component={RequestListScreen}
        options={{
          title: "",
          headerShown: false,
          headerTitleStyle: {
            fontFamily: FONT_FAMILY_BOLD,
          },
          headerLeft: () => (
            <TouchableOpacity
              style={styles.headerLeftContainer}
              onPress={() => {
                props.navigation.goBack();
              }}
            >
              <Icon
                name="keyboard-arrow-left"
                type="material-icons"
                size={30}
              />
              <Text style={styles.headerLeftText}>Хүсэлт</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="EmployeesScreen"
        component={EmployeesScreen}
        options={{
          title: "",
          headerShown: false,
          headerTitleStyle: {
            fontFamily: FONT_FAMILY_BOLD,
          },
          headerLeft: () => (
            <TouchableOpacity
              style={styles.headerLeftContainer}
              onPress={() => {
                props.navigation.goBack();
              }}
            >
              <Icon
                name="keyboard-arrow-left"
                type="material-icons"
                size={30}
              />
              <Text style={styles.headerLeftText}>Ажилтан</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="SendRequestScreen"
        component={SendRequestScreen}
        options={{
          title: "",
          headerTitleStyle: {
            fontFamily: FONT_FAMILY_BOLD,
          },
          headerLeft: () => (
            <TouchableOpacity
              style={styles.headerLeftContainer}
              onPress={() => {
                props.navigation.goBack();
              }}
            >
              <Icon
                name="keyboard-arrow-left"
                type="material-icons"
                size={30}
              />
              <Text style={styles.headerLeftText}>Хүсэлт илгээх</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const NewsScreenStackNavigator = (props) => {
  return (
    <Stack.Navigator
      initialRouteName="NewsScreen"
      screenOptions={{
        headerShown: false,
        headerStyle: {
          shadowColor: "transparent", // this covers iOS
          elevation: 0, // this covers Android
        },
      }}
    >
      <Stack.Screen
        name="NewsScreen"
        component={NewsScreen}
        options={{
          title: "",
          headerTitleStyle: {},
          headerLeft: () => <></>,
        }}
      />
    </Stack.Navigator>
  );
};

const ProfileStackNavigator = (props) => {
  return (
    <Stack.Navigator
      initialRouteName="ProfileScreen"
      screenOptions={{
        headerShown: false,
        headerStyle: {
          shadowColor: "transparent", // this covers iOS
          elevation: 0, // this covers Android
        },
      }}
    >
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: "",
          headerLeft: () => <></>,
        }}
      />
    </Stack.Navigator>
  );
};

export {
  LoginStackNavigator,
  HomeScreenStackNavigator,
  NewsScreenStackNavigator,
  ProfileStackNavigator,
};

const styles = StyleSheet.create({
  headerLeftContainer: {
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  headerLeftText: {
    marginLeft: 10,
    fontFamily: FONT_FAMILY_BOLD,
    fontSize: 20,
    width: "100%",
  },
});

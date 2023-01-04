import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { FONT_FAMILY_BOLD } from "../constant";
import { Icon } from "@rneui/base";

import MainContext from "../contexts/MainContext";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import NewsScreen from "../screens/NewsScreen";
import AttendanceScreen from "../screens/AttendanceScreen";
import EmployeesScreen from "../screens/EmployeesScreen";
import RequestListScreen from "../screens/RequestListScreen";
import BiometricScreen from "../screens/BiometricScreen";
import SendRequestScreen from "../screens/SendRequestScreen";
import MapScreen from "../screens/MapScreen";
import NotificationScreen from "../screens/NotificationScreen";
import TaskScreen from "../screens/TaskScreen";
import HelpScreen from "../screens/HelpScreen";
import SalaryScreen from "../screens/SalaryScreen";
import EditUserDataScreen from "../screens/EditUserDataScreen";

const Stack = createStackNavigator();

const LoginStackNavigator = (props) => {
  const state = useContext(MainContext);
  return (
    <Stack.Navigator
      initialRouteName="LoginTab"
      screenOptions={{
        headerStyle: {
          shadowColor: "transparent",
          elevation: 0,
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
          shadowColor: "transparent",
          elevation: 0,
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
      <Stack.Screen
        name="MapScreen"
        component={MapScreen}
        options={{
          title: "",
          headerShown: false,
          headerTitleStyle: {
            fontFamily: FONT_FAMILY_BOLD,
          },
        }}
      />
      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{
          title: "",
          headerShown: false,
          headerTitleStyle: {},
          headerLeft: () => <></>,
        }}
      />
      <Stack.Screen
        name="TaskScreen"
        component={TaskScreen}
        options={{
          title: "",
          headerShown: false,
          headerTitleStyle: {},
          headerLeft: () => <></>,
        }}
      />
      <Stack.Screen
        name="HelpScreen"
        component={HelpScreen}
        options={{
          title: "",
          headerShown: false,
          headerTitleStyle: {},
          headerLeft: () => <></>,
        }}
      />
      <Stack.Screen
        name="SalaryScreen"
        component={SalaryScreen}
        options={{
          title: "",
          headerShown: false,
          headerTitleStyle: {},
          headerLeft: () => <></>,
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
          shadowColor: "transparent",
          elevation: 0,
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
      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
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
          shadowColor: "transparent",
          elevation: 0,
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
      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{
          title: "",
          headerTitleStyle: {},
          headerLeft: () => <></>,
        }}
      />
      <Stack.Screen
        name="EditUserDataScreen"
        component={EditUserDataScreen}
        options={{
          title: "",
          headerTitleStyle: {},
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

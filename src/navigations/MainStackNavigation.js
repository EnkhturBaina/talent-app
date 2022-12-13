import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/LoginScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import HomeScreen from "../screens/HomeScreen";
import { StyleSheet, TouchableOpacity } from "react-native";
import ProfileScreen from "../screens/ProfileScreen";
import NewsScreen from "../screens/NewsScreen";
import MainContext from "../contexts/MainContext";
import AttendanceScreen from "../screens/AttendanceScreen";
import EmployeesScreen from "../screens/EmployeesScreen";
// import { Icon } from "@rneui/base";

const Stack = createStackNavigator();

const LoginStackNavigator = (props) => {
  const state = useContext(MainContext);
  return (
    <Stack.Navigator
      initialRouteName="LoginTab"
      screenOptions={{
        headerShown: false,
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
        name="Reset"
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
              <Tex>BACK</Tex>
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
        headerShown: false,
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
          headerTitleStyle: {},
          headerLeft: () => <></>,
        }}
      />
      <Stack.Screen
        name="EmployeesScreen"
        component={EmployeesScreen}
        options={{
          title: "",
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
});

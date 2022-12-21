import { StyleSheet, Image, Text, Platform, View } from "react-native";
import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import home from "../../assets/tabIcons/home.png";
import news from "../../assets/tabIcons/news.png";
import user from "../../assets/tabIcons/user.png";
import {
  HomeScreenStackNavigator,
  LoginStackNavigator,
  NewsScreenStackNavigator,
  ProfileStackNavigator,
} from "./MainStackNavigation";
import MainContext from "../contexts/MainContext";
import { MAIN_COLOR } from "../constant";
import SplashScreen from "../screens/SplashScreen";

const Tab = createBottomTabNavigator();
const HomeScreenTabNavigation = () => {
  const state = useContext(MainContext);
  if (state.isLoading) {
    return <SplashScreen />;
  } else if (!state.isLoading && !state.isLoggedIn) {
    return <LoginStackNavigator />;
  } else {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: "absolute",
            backgroundColor: "black",
            borderRadius: 20,
            height: 50,
            marginHorizontal: 10,
            paddingTop: Platform.OS === "ios" ? 10 : 15,
            marginBottom: Platform.OS === "ios" ? 20 : 10,
            alignItems: "center",
          },
        }}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeScreenStackNavigator}
          options={{
            title: "",
            tabBarIcon: ({ focused }) => {
              return focused ? (
                <View style={styles.labelContainer}>
                  <Text style={styles.tabLabel}>Нүүр</Text>
                </View>
              ) : (
                <View>
                  <Image style={styles.tabIcon} source={home} color="#fff" />
                </View>
              );
            },
          }}
        />
        <Tab.Screen
          name="NewsTab"
          component={NewsScreenStackNavigator}
          options={{
            title: "",
            tabBarIcon: ({ focused }) => {
              return focused ? (
                <View style={styles.labelContainer}>
                  <Text style={styles.tabLabel}>Мэдээ</Text>
                </View>
              ) : (
                <View>
                  <Image style={styles.tabIcon} source={news} color="#fff" />
                </View>
              );
            },
          }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileStackNavigator}
          options={{
            title: "",
            tabBarIcon: ({ focused }) => {
              return focused ? (
                <View style={styles.labelContainer}>
                  <Text style={styles.tabLabel}>Профайл</Text>
                </View>
              ) : (
                <View>
                  <Image style={styles.tabIcon} source={user} color="#fff" />
                </View>
              );
            },
          }}
        />
      </Tab.Navigator>
    );
  }
};

export default HomeScreenTabNavigation;

const styles = StyleSheet.create({
  labelContainer: {
    width: "90%",
    backgroundColor: MAIN_COLOR,
    height: 40,
    borderRadius: 14,
    overflow: "hidden",
    marginTop: Platform.OS === "ios" ? 30 : 0,
  },
  tabLabel: {
    textAlign: "center",
    color: "#fff",
    textAlignVertical: "center",
    lineHeight: Platform.OS == "ios" ? 45 : 35,
  },
  tabIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
});

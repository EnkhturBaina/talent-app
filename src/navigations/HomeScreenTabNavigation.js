import { StyleSheet, Image, Text } from "react-native";
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
  } else {
    return (
      <>
        {/* Хэрэглэгч нэвтэрсэн үед Bottom TAB харуулах */}
        {state.isLoggedIn ? (
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                position: "absolute",
                backgroundColor: "black",
                borderRadius: 20,
                bottom: 20,
                height: 50,
                marginHorizontal: 10,
                paddingTop: 12,
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
                    <Text style={styles.tabLabel}>Нүүр</Text>
                  ) : (
                    <Image style={styles.tabIcon} source={home} />
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
                    <Text style={styles.tabLabel}>Мэдээ</Text>
                  ) : (
                    <Image style={styles.tabIcon} source={news} />
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
                    <Text style={styles.tabLabel}>Профайл</Text>
                  ) : (
                    <Image style={styles.tabIcon} source={user} />
                  );
                },
              }}
            />
          </Tab.Navigator>
        ) : (
          // Хэрэглэгч нэвтрээгүй үед Login Screen харуулах
          <LoginStackNavigator />
        )}
      </>
    );
  }
};

export default HomeScreenTabNavigation;

const styles = StyleSheet.create({
  tabLabel: {
    backgroundColor: MAIN_COLOR,
    color: "#fff",
    borderRadius: 14,
    height: 35,
    width: "90%",
    textAlign: "center",
    overflow: "hidden",
    lineHeight: Platform.OS == "ios" ? 40 : 35,
  },
  tabIcon: {
    width: 25,
    resizeMode: "contain",
  },
});

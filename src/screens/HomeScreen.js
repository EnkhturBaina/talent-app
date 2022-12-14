import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  NativeModules,
  Platform,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
const { StatusBarManager } = NativeModules;
import come from "../../assets/homeScreen/come.png";
import out from "../../assets/homeScreen/out.png";
import Attendance from "../../assets/homeScreen/Attendance.png";
import request from "../../assets/homeScreen/request.png";
import task from "../../assets/homeScreen/task.png";
import employee from "../../assets/homeScreen/employee.png";
import salary from "../../assets/homeScreen/salary.png";
import help from "../../assets/homeScreen/help.png";
import { Icon, Button } from "@rneui/base";
import {
  FONT_FAMILY_BOLD,
  FONT_FAMILY_LIGHT,
  MAIN_BORDER_RADIUS,
  MAIN_COLOR,
  MAIN_COLOR_GRAY,
  MAIN_COLOR_GREEN,
  MAIN_COLOR_RED,
} from "../constant";
import HeaderUser from "../components/HeaderUser";

const HomeScreen = (props) => {
  const menu = [
    { img: Attendance, label: "Ирц", nav: "AttendanceScreen" },
    { img: request, label: "Хүсэлт", nav: "RequestListScreen" },
    { img: task, label: "Даалгавар", nav: "" },
    { img: employee, label: "Ажилтан", nav: "EmployeesScreen" },
    { img: salary, label: "Цалин", nav: "" },
    { img: help, label: "Тусламж", nav: "" },
  ];
  const general_style = require("../style");
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBarManager.HEIGHT : 0,
        paddingBottom: 80,
      }}
    >
      <HeaderUser />
      <ScrollView contentContainerStyle={{ paddingBottom: 10 }} bounces={false}>
        <View style={styles.mainContainer}>
          <View style={styles.attendanceContainer}>
            <View style={styles.timeContainer}>
              <Text style={general_style.generalYellowTextBold}>
                Баасан, 2022-04-15
              </Text>
              <Text style={styles.currentTime}>16:04:15</Text>
              <Text style={general_style.generalYellowText}>
                Ажлын цаг: 9:00-18:00
              </Text>
            </View>
            <View style={styles.registerContainer}>
              <Image source={come} style={styles.inOutClockImg} />
              <Text style={{ fontFamily: FONT_FAMILY_BOLD }}>09:05</Text>
              <Button
                containerStyle={{ width: "50%" }}
                buttonStyle={{
                  backgroundColor: MAIN_COLOR_GREEN,
                  borderRadius: 20,
                }}
                title="Ирэх"
                titleStyle={{
                  fontSize: 14,
                  fontFamily: FONT_FAMILY_BOLD,
                }}
                onPress={() => console.log("COME")}
              />
            </View>
            <View style={styles.registerContainer}>
              <Image source={out} style={styles.inOutClockImg} />
              <Text style={{ fontFamily: FONT_FAMILY_BOLD }}>18:20</Text>
              <Button
                containerStyle={{ width: "50%" }}
                buttonStyle={{
                  backgroundColor: MAIN_COLOR_RED,
                  borderRadius: 20,
                }}
                title="Явах"
                titleStyle={{
                  fontSize: 14,
                  fontFamily: FONT_FAMILY_BOLD,
                }}
                onPress={() => console.log("OUT")}
              />
            </View>
          </View>
          <View style={styles.menuContainer}>
            {menu.map((el, index) => {
              return (
                <TouchableOpacity
                  style={styles.eachMenuContiner}
                  key={index}
                  onPress={() => props.navigation.navigate(el.nav)}
                >
                  <Image source={el.img} style={styles.eachMenuImg} />
                  <Text style={general_style.generalText}>{el.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainContainer: {},
  attendanceContainer: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderWidth: 0.5,
    alignItems: "center",
    borderColor: MAIN_COLOR_GRAY,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  menuContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 20,
    marginHorizontal: 20,
    alignContent: "center",
    alignItems: "center",
  },
  currentTime: {
    fontSize: 34,
    fontFamily: FONT_FAMILY_BOLD,
  },
  timeContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  registerContainer: {
    marginTop: 10,
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inOutClockImg: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  eachMenuContiner: {
    backgroundColor: "#fff",
    width: "30%",
    borderWidth: 0.5,
    alignItems: "center",
    borderColor: MAIN_COLOR_GRAY,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    borderRadius: 20,
    padding: 10,
    flexDirection: "column",
    margin: 5,
  },
  eachMenuImg: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});

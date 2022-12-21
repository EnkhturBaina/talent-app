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
import React, { useContext, useEffect, useState } from "react";
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
  MAIN_COLOR_GRAY,
  MAIN_COLOR_GREEN,
  MAIN_COLOR_RED,
  SERVER_URL,
} from "../constant";
import HeaderUser from "../components/HeaderUser";
import * as Location from "expo-location";
import axios from "axios";
import MainContext from "../contexts/MainContext";
import CustomSnackbar from "../components/CustomSnackbar";

const HomeScreen = (props) => {
  const state = useContext(MainContext);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [dateByName, setDateByName] = useState(null);
  const [inTime, setInTime] = useState(null);
  const [outTime, setOutTime] = useState(null);
  const [time, setTime] = useState();
  var date = new Date();

  const [visibleSnack, setVisibleSnack] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState("");
  const onToggleSnackBar = (msg) => {
    setVisibleSnack(!visibleSnack);
    setSnackBarMsg(msg);
  };

  const onDismissSnackBar = () => setVisibleSnack(false);

  const menu = [
    { img: Attendance, label: "Ирц", nav: "AttendanceScreen" },
    { img: request, label: "Хүсэлт", nav: "RequestListScreen" },
    { img: task, label: "Даалгавар", nav: "" },
    { img: employee, label: "Ажилтан", nav: "EmployeesScreen" },
    { img: salary, label: "Цалин", nav: "" },
    { img: help, label: "Тусламж", nav: "" },
  ];

  const whatDay = () => {
    switch (date.getDay()) {
      case 1:
        return "Даваа";
      case 2:
        return "Мягмар";
      case 3:
        return "Лхагва";
      case 4:
        return "Пүрэв";
      case 5:
        return "Баасан";
      case 6:
        return "Бямба";
      case 7:
        return "Нум";
      default:
        return "-";
    }
  };

  const general_style = require("../style");

  useEffect(() => {
    //Тухайн өдрийн нэрийг харуулах
    setDateByName(whatDay());
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();

    //Ажилтны тухайн өдрийн ажилдаа ирэх явах цагийг авах
    if (state.userData?.attendance_type?.details) {
      state.userData?.attendance_type?.details.map((el) => {
        if (el.WeekDay == date.getDay()) {
          setInTime(el.StartTime != null ? el.StartTime.substr(0, 5) : "00:00");
          setOutTime(el.EndTime != null ? el.EndTime.substr(0, 5) : "00:00");
        }
      });
    } else {
      setInTime("00:00");
      setOutTime("00:00");
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);
  useEffect(() => {
    // console.log("location =======>", location);
  }, [location]);

  const trackAttendance = async (type) => {
    await axios({
      method: "post",
      url: `${SERVER_URL}/mobile/attendance/track`,
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
      data: {
        ERPEmployeeId: state.userId,
        GMCompanyId: state.companyId,
        Type: type,
        Break: "",
        MobileUUID: state.uuid,
        latitude: location.latitude,
        longitude: location.longitude,
      },
    })
      .then((response) => {
        // console.log("track Attendance ======>", response.data.Extra);
        if (response.data?.Type == 0) {
          // setAttendanceList(response.data.Extra);
        } else if (response.data?.Type == 1) {
          console.log("WARNING", response.data.Msg);
        } else if (response.data?.Type == 2) {
        }
      })
      .catch(function (error) {
        if (error.response.status == "401") {
          AsyncStorage.removeItem("use_bio");
          state.setLoginErrorMsg("Холболт салсан байна. Та дахин нэвтэрнэ үү.");
          state.setIsLoading(false);
          state.logout();
        }
      });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBarManager.HEIGHT : 0,
        paddingBottom: 80,
        backgroundColor: "#fff",
      }}
    >
      <CustomSnackbar
        visible={visibleSnack}
        dismiss={onDismissSnackBar}
        text={snackBarMsg}
      />
      <HeaderUser />
      <Text>{state.expoPushToken}</Text>
      <Button
        title="Notification"
        onPress={async () => {
          await state.sendPushNotification(state.expoPushToken);
        }}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 10 }} bounces={false}>
        <View style={styles.mainContainer}>
          <View style={styles.attendanceContainer}>
            <View style={styles.timeContainer}>
              <Text style={general_style.generalYellowTextBold}>
                {dateByName},{" "}
                {`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
              </Text>
              <Text style={styles.currentTime}>{time}</Text>
              <Text style={general_style.generalYellowText}>
                Ажлын цаг: {inTime}-{outTime}
              </Text>
            </View>
            <View style={styles.registerContainer}>
              <Image source={come} style={styles.inOutClockImg} />
              <Text style={{ fontFamily: FONT_FAMILY_BOLD }}>{inTime}</Text>
              <Button
                containerStyle={{ width: "40%" }}
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
              <TouchableOpacity
                onPress={() =>
                  location
                    ? props.navigation.navigate("MapScreen", { data: location })
                    : onToggleSnackBar(
                        "Байршил тодорхойлж байна. Түр хүлээнэ үү"
                      )
                }
              >
                <Icon
                  name="arrow-right"
                  type="font-awesome"
                  size={40}
                  color={MAIN_COLOR_GREEN}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.registerContainer}>
              <Image source={out} style={styles.inOutClockImg} />
              <Text style={{ fontFamily: FONT_FAMILY_BOLD }}>{outTime}</Text>
              <Button
                containerStyle={{ width: "40%" }}
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
              <TouchableOpacity
                onPress={() =>
                  location
                    ? props.navigation.navigate("MapScreen", { data: location })
                    : onToggleSnackBar(
                        "Байршил тодорхойлж байна. Түр хүлээнэ үү"
                      )
                }
              >
                <Icon
                  name="arrow-right"
                  type="font-awesome"
                  size={40}
                  color={MAIN_COLOR_RED}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.menuContainer}>
            {menu.map((el, index) => {
              return (
                <TouchableOpacity
                  style={styles.eachMenuContiner}
                  key={index}
                  onPress={() =>
                    el.nav ? props.navigation.navigate(el.nav) : null
                  }
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

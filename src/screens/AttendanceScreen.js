import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  NativeModules,
  Platform,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Icon, CheckBox, Button } from "@rneui/themed";
import HeaderUser from "../components/HeaderUser";
import BottomSheet from "../components/BottomSheet";
import {
  FONT_FAMILY_BOLD,
  FONT_FAMILY_LIGHT,
  MAIN_BORDER_RADIUS,
  MAIN_COLOR,
  MAIN_COLOR_GRAY,
  SERVER_URL,
} from "../constant";
import MainContext from "../contexts/MainContext";
const { StatusBarManager } = NativeModules;
import Accordion from "react-native-collapsible/Accordion";
import axios from "axios";
import Loader from "../components/Loader";

const AttendanceScreen = (props) => {
  const state = useContext(MainContext);
  var date = new Date();
  const [selectedDate, setSelectedDate] = useState(state.last3Years[0]);
  const [attendanceList, setAttendanceList] = useState(""); //Ажилтны ирцийн мэдээлэл
  const [data, setData] = useState(""); //BottomSheet рүү дамжуулах Дата
  const [uselessParam, setUselessParam] = useState(false); //BottomSheet -г дуудаж байгааг мэдэх гэж ашиглаж байгамоо
  const [displayName, setDisplayName] = useState(""); //LOOKUP -д харагдах утга (display value)
  const [activeSections, setActiveSections] = useState([]);
  const [loadingAttendanceList, setLoadingAttendanceList] = useState(true);

  const setLookupData = (data, display) => {
    setData(data); //Lookup -д харагдах дата
    setDisplayName(display); //Lookup -д харагдах датаны текст талбар
    setUselessParam(!uselessParam);
  };

  const getEmployeeAttendanceList = async () => {
    setLoadingAttendanceList(true);
    await axios({
      method: "post",
      url: `${SERVER_URL}/mobile/attendance/list`,
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
      data: {
        ERPEmployeeId: state.userId,
        StartRange: selectedDate.id + "-01",
        EndRange:
          selectedDate.id +
          "-" +
          new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
      },
    })
      .then((response) => {
        // console.log("getEmployee AttendanceList======>", response.data.Extra);
        if (response.data?.Type == 0) {
          setAttendanceList(response.data.Extra);
        } else if (response.data?.Type == 1) {
          console.log("WARNING", response.data.Msg);
        } else if (response.data?.Type == 2) {
        }
        setLoadingAttendanceList(false);
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

  const renderSectionTitle = (section) => {
    return (
      <View style={styles.content}>
        <Text>1</Text>
      </View>
    );
  };

  const renderHeader = (section) => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{section.Date}</Text>
        <Text style={styles.headerTitle}>{section.WorkingHours}</Text>
        <Text style={styles.headerTitle}>
          {section.Overtime} / {section.DeficitTime}
        </Text>
        <Text
          style={[
            styles.headerTitle,
            { color: section.state?.Color, fontFamily: FONT_FAMILY_BOLD },
          ]}
        >
          {section.state?.Name}
        </Text>
      </View>
    );
  };

  const renderContent = (section) => {
    return (
      <View style={styles.content}>
        <Text>{section.titleMN}</Text>
      </View>
    );
  };

  const updateSections = (activeSections) => {
    setActiveSections(activeSections);
  };

  useEffect(() => {
    getEmployeeAttendanceList();
  }, [selectedDate]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBarManager.HEIGHT : 0,
        backgroundColor: "#fff",
      }}
    >
      <HeaderUser />
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.yearMonthPicker}
          onPress={() => setLookupData(state.last3Years, "name")}
        >
          <Text style={{ fontFamily: FONT_FAMILY_BOLD }}>
            {selectedDate.name}
          </Text>
          <Icon name="keyboard-arrow-down" type="material-icons" size={30} />
        </TouchableOpacity>
      </View>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitleBold}>Огноо</Text>
        <Text style={styles.headerTitleBold}>Ажилласан цаг</Text>
        <Text style={styles.headerTitleBold}>Илүү цаг/Хоцролт</Text>
        <Text style={styles.headerTitleBold}>Төлөв</Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 60,
        }}
      >
        {loadingAttendanceList ? (
          <Loader />
        ) : !loadingAttendanceList && attendanceList == "" ? (
          <Text style={styles.emptyText}>
            Ажилтны ирцийн мэдээлэл олдсонгүй
          </Text>
        ) : (
          <Accordion
            sections={attendanceList}
            activeSections={activeSections}
            // renderSectionTitle={renderSectionTitle}
            renderHeader={renderHeader}
            renderContent={renderContent}
            onChange={updateSections}
            underlayColor="transparent"
          />
        )}
      </ScrollView>
      <BottomSheet
        bodyText={data}
        dragDown={true}
        backClick={true}
        displayName={displayName}
        handle={uselessParam}
        action={(e) => setSelectedDate(e)}
      />
    </SafeAreaView>
  );
};

export default AttendanceScreen;

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginHorizontal: 20,
    alignItems: "center",
  },
  yearMonthPicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: MAIN_COLOR,
    borderWidth: 1,
    borderRadius: MAIN_BORDER_RADIUS,
    height: 40,
    alignItems: "center",
    paddingVertical: 5,
    paddingLeft: 10,
    paddingRight: 5,
    alignSelf: "flex-start",
  },
  headerTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingVertical: 10,
    marginTop: 10,
    marginHorizontal: 10,
    alignItems: "center",
  },
  headerTitle: {
    width: "25%",
    fontFamily: FONT_FAMILY_LIGHT,
    textAlign: "center",
    fontSize: 12,
  },
  headerTitleBold: {
    width: "25%",
    fontFamily: FONT_FAMILY_BOLD,
    textAlign: "center",
    fontSize: 12,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: MAIN_BORDER_RADIUS,
    borderWidth: 1,
    borderColor: MAIN_COLOR_GRAY,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    paddingHorizontal: 5,
    paddingVertical: 10,
    marginTop: 10,
    marginHorizontal: 10,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  emptyText: {
    fontFamily: FONT_FAMILY_BOLD,
    textAlign: "center",
    marginTop: 10,
  },
});

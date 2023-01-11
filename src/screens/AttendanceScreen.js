import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  NativeModules,
  Platform,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { Icon } from "@rneui/themed";
import HeaderUser from "../components/HeaderUser";
import BottomSheet from "../components/BottomSheet";
import {
  FONT_FAMILY_BOLD,
  FONT_FAMILY_LIGHT,
  MAIN_BORDER_RADIUS,
  MAIN_COLOR,
  MAIN_COLOR_GRAY,
  MAIN_COLOR_GREEN,
  MAIN_COLOR_RED,
} from "../constant";
import MainContext from "../contexts/MainContext";
const { StatusBarManager } = NativeModules;
import Accordion from "react-native-collapsible/Accordion";
import Loader from "../components/Loader";
import Empty from "../components/Empty";

const AttendanceScreen = (props) => {
  const state = useContext(MainContext);
  const [selectedDate, setSelectedDate] = useState(state.last3Years[0]);
  const [data, setData] = useState(""); //*****BottomSheet рүү дамжуулах Дата
  const [uselessParam, setUselessParam] = useState(false); //*****BottomSheet -г дуудаж байгааг мэдэх гэж ашиглаж байгамоо
  const [displayName, setDisplayName] = useState(""); //*****LOOKUP -д харагдах утга (display value)
  const [activeSections, setActiveSections] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const setLookupData = (data, display) => {
    setData(data); //*****Lookup -д харагдах дата
    setDisplayName(display); //*****Lookup -д харагдах датаны текст талбар
    setUselessParam(!uselessParam);
  };

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    state.getEmployeeAttendanceList(selectedDate, state.token);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const renderHeader = (section, index, isActive) => {
    return (
      <View
        style={[
          styles.headerContainer,
          { borderColor: isActive ? MAIN_COLOR : MAIN_COLOR_GRAY },
        ]}
      >
        <Text style={styles.headerTitle}>{section.Date}</Text>
        <Text style={styles.headerTitle}>{section.WorkingHours}</Text>
        <Text
          style={[
            styles.headerTitle,
            {
              color:
                section.DeficitTimeFormat == "00:00:00"
                  ? MAIN_COLOR_GREEN
                  : MAIN_COLOR_RED,
            },
          ]}
        >
          -{section.DeficitTimeFormat}
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
        <View style={styles.headerTitleContainer}>
          <View style={{ flexDirection: "column", width: "25%" }}>
            <Text style={styles.headerSubTitle}>Ирсэн цаг</Text>
            <Text style={styles.headerSubData}>
              {section.TimeIn?.substr(10, 6)}
            </Text>
          </View>
          <View style={{ flexDirection: "column", width: "25%" }}>
            <Text style={styles.headerSubTitle}>Завсарлага</Text>
            <Text style={styles.headerSubData}>{section.Break}</Text>
          </View>
          <View style={{ flexDirection: "column", width: "25%" }}>
            <Text style={styles.headerSubTitle}>Явсан цаг</Text>
            <Text style={styles.headerSubData}>
              {section.TimeOut?.substr(10, 6)}
            </Text>
          </View>
          <View style={{ flexDirection: "column", width: "25%" }}>
            <Text style={styles.headerSubTitle}>Илүү цаг</Text>
            <Text style={styles.headerSubData}>{section.OvertimeFormat}</Text>
          </View>
        </View>
      </View>
    );
  };

  const updateSections = (activeSections) => {
    setActiveSections(activeSections);
  };

  useEffect(() => {
    state.getEmployeeAttendanceList(selectedDate, state.token);
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
        <Text style={styles.headerTitleBold}>Хоцорсон цаг</Text>
        <Text style={styles.headerTitleBold}>Төлөв</Text>
      </View>

      {state.loadingAttendanceList ? (
        <Loader />
      ) : !state.loadingAttendanceList && state.attendanceList == "" ? (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: Platform.OS === "android" ? 80 : 50,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={"#fff"}
            />
          }
        >
          <Empty text="Ажилтны ирцийн мэдээлэл олдсонгүй" />
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingBottom: Platform.OS === "ios" ? 50 : 70,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              // colors={[MAIN_COLOR, MAIN_COLOR, MAIN_COLOR]}
              tintColor={"#fff"}
            />
          }
        >
          <Accordion
            sections={state.attendanceList}
            activeSections={activeSections}
            // renderSectionTitle={renderSectionTitle}
            renderHeader={renderHeader}
            renderContent={renderContent}
            onChange={updateSections}
            underlayColor="transparent"
          />
        </ScrollView>
      )}
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
  headerSubTitle: {
    fontFamily: FONT_FAMILY_BOLD,
    textAlign: "center",
    fontSize: 12,
  },
  headerSubData: {
    fontFamily: FONT_FAMILY_LIGHT,
    textAlign: "center",
    fontSize: 12,
  },
});

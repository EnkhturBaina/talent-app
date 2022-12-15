import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  NativeModules,
  Platform,
  TouchableOpacity,
  Touchable,
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
} from "../constant";
import MainContext from "../contexts/MainContext";
const { StatusBarManager } = NativeModules;
import Accordion from "react-native-collapsible/Accordion";

const AttendanceScreen = (props) => {
  const state = useContext(MainContext);
  const [selectedDate, setSelectedDate] = useState(state.last3Years[0]);
  const [data, setData] = useState(""); //BottomSheet рүү дамжуулах Дата
  const [uselessParam, setUselessParam] = useState(false); //BottomSheet -г дуудаж байгааг мэдэх гэж ашиглаж байгамоо
  const [displayName, setDisplayName] = useState(""); //LOOKUP -д харагдах утга (display value)
  const [activeSections, setActiveSections] = useState([]);

  const SECTIONS = [
    {
      title: "First",
      content: "Lorem ipsum...",
    },
    {
      title: "Second",
      content: "Lorem ipsum...",
    },
  ];

  const setLookupData = (data, display) => {
    setData(data); //Lookup -д харагдах дата
    setDisplayName(display); //Lookup -д харагдах датаны текст талбар
    setUselessParam(!uselessParam);
  };

  useEffect(() => {}, []);

  const renderSectionTitle = (section) => {
    return (
      <View style={styles.content}>
        <Text>{section.content}1</Text>
      </View>
    );
  };

  const renderHeader = (section) => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Баа, 29/01/2021</Text>
        <Text style={styles.headerTitle}>8 цаг 30 мин</Text>
        <Text style={styles.headerTitle}>0 цаг 30 мин</Text>
        <Text style={[styles.headerTitle, { color: MAIN_COLOR }]}>
          Хүлээгдэж буй
        </Text>
      </View>
    );
  };

  const renderContent = (section) => {
    return (
      <View style={styles.content}>
        <Text>{section.content}</Text>
      </View>
    );
  };

  const updateSections = (activeSections) => {
    setActiveSections(activeSections);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBarManager.HEIGHT : 0,
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
        <Text style={styles.headerTitle}>Огноо</Text>
        <Text style={styles.headerTitle}>Ажилласан цаг</Text>
        <Text style={styles.headerTitle}>Илүү цаг/Хоцролт</Text>
        <Text style={styles.headerTitle}>Төлөв</Text>
      </View>
      <Accordion
        sections={SECTIONS}
        activeSections={activeSections}
        // renderSectionTitle={renderSectionTitle}
        renderHeader={renderHeader}
        renderContent={renderContent}
        onChange={updateSections}
        underlayColor="transparent"
      />
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
  },
  headerTitle: {
    width: "25%",
    fontFamily: FONT_FAMILY_LIGHT,
    textAlign: "center",
    fontSize: 12,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: MAIN_BORDER_RADIUS,
    borderWidth: 1,
    borderColor: MAIN_COLOR_GRAY,
    paddingHorizontal: 5,
    paddingVertical: 10,
    marginTop: 10,
    marginHorizontal: 10,
  },
});

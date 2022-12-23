import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  NativeModules,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useContext, useState } from "react";
import HeaderUser from "../components/HeaderUser";
import {
  FONT_FAMILY_BOLD,
  FONT_FAMILY_LIGHT,
  MAIN_BORDER_RADIUS,
  MAIN_COLOR,
} from "../constant";
const { StatusBarManager } = NativeModules;
import MainContext from "../contexts/MainContext";
import { Icon } from "@rneui/base";
import BottomSheet from "../components/BottomSheet";

const NotificationScreen = () => {
  const state = useContext(MainContext);
  var date = new Date();
  const [selectedDate, setSelectedDate] = useState(state.last3Years[0]);
  const [data, setData] = useState(""); //BottomSheet рүү дамжуулах Дата
  const [uselessParam, setUselessParam] = useState(false); //BottomSheet -г дуудаж байгааг мэдэх гэж ашиглаж байгамоо
  const [displayName, setDisplayName] = useState(""); //LOOKUP -д харагдах утга (display value)

  const setLookupData = (data, display) => {
    setData(data); //Lookup -д харагдах дата
    setDisplayName(display); //Lookup -д харагдах датаны текст талбар
    setUselessParam(!uselessParam);
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
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }} bounces={false}>
        <TouchableOpacity
          style={[styles.taskContainer, { borderLeftColor: MAIN_COLOR }]}
        >
          <View style={styles.firstRow}>
            <View style={styles.stack1}>
              <Text style={styles.name}>Таны хүсэлт зөвшөөрөгдсөн</Text>
            </View>
            <View style={styles.stack2}>
              <Text style={styles.date}>2022-12-09 19:00</Text>
            </View>
          </View>
          <View style={styles.secondRow}>
            <Text numberOfLines={2} style={styles.description}>
              Таны илгээсэн илүү цагийн хүсэлт зөвшөөрөгдсөн
            </Text>
          </View>
        </TouchableOpacity>
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

export default NotificationScreen;

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
  taskContainer: {
    borderLeftWidth: 10,
    flexDirection: "column",
    flex: 1,
    height: 80,
    marginTop: 10,
    marginHorizontal: 20,
    backgroundColor: "#d9d9d9",
    padding: 10,
  },
  firstRow: {
    flexDirection: "row",
  },
  stack1: {
    flexDirection: "row",
    alignItems: "center",
    width: "60%",
  },
  stack2: {
    width: "40%",
    alignItems: "flex-end",
  },
  secondRow: {
    marginTop: 10,
    justifyContent: "center",
  },
  name: {
    fontFamily: FONT_FAMILY_BOLD,
  },
  date: {
    fontFamily: FONT_FAMILY_LIGHT,
  },
  description: {
    fontFamily: FONT_FAMILY_LIGHT,
  },
});

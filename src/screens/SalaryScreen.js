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
import React, { useState, useEffect, useContext } from "react";
import { Icon } from "@rneui/themed";
import HeaderUser from "../components/HeaderUser";
import BottomSheet from "../components/BottomSheet";
import {
  FONT_FAMILY_BOLD,
  FONT_FAMILY_LIGHT,
  MAIN_BORDER_RADIUS,
  MAIN_COLOR,
} from "../constant";
import MainContext from "../contexts/MainContext";
const { StatusBarManager } = NativeModules;

const SalaryScreen = (props) => {
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

  useEffect(() => {}, []);

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
        <TouchableOpacity style={styles.stackContainer}>
          <View style={styles.stack1}>
            <Text style={styles.name}>Ажиллавал зохих</Text>
          </View>
          <View style={styles.stack2}>
            <Text style={styles.date}>176 цаг 00 мин</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stackContainer}>
          <View style={styles.stack1}>
            <Text style={styles.name}>Амралт/чөлөө</Text>
          </View>
          <View style={styles.stack2}>
            <Text style={styles.date}>176 цаг 00 мин</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stackContainer}>
          <View style={styles.stack1}>
            <Text style={styles.name}>Бүртгэгдсэн</Text>
          </View>
          <View style={styles.stack2}>
            <Text style={styles.date}>176 цаг 00 мин</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stackContainer}>
          <View style={styles.stack1}>
            <Text style={styles.name}>Хоцорсон</Text>
          </View>
          <View style={styles.stack2}>
            <Text style={styles.date}>176 цаг 00 мин</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stackContainer}>
          <View style={styles.stack1}>
            <Text style={styles.name}>Эрт явсан</Text>
          </View>
          <View style={styles.stack2}>
            <Text style={styles.date}>176 цаг 00 мин</Text>
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

export default SalaryScreen;

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
  stackContainer: {
    borderColor: MAIN_COLOR,
    flexDirection: "row",
    marginHorizontal: 20,
    flex: 1,
    height: 60,
    marginTop: 10,
    alignItems: "center",
    borderLeftWidth: 10,
    borderRightWidth: 10,
  },
  stack1: {
    padding: 5,
    backgroundColor: "#d9d9d9",
    width: "50%",
    height: "100%",
    justifyContent: "center",
  },
  stack2: {
    width: "50%",
    alignItems: "center",
    backgroundColor: "#edebeb",
    height: "100%",
    justifyContent: "center",
  },
  name: {
    fontFamily: FONT_FAMILY_BOLD,
  },
  date: {
    fontFamily: FONT_FAMILY_LIGHT,
    fontSize: 16,
  },
});

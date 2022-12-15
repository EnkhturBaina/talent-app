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
import { Icon, CheckBox, Button } from "@rneui/themed";
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

const RequestListScreen = (props) => {
  const state = useContext(MainContext);
  const general_style = require("../style");
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
        <Button
          containerStyle={{}}
          buttonStyle={{
            backgroundColor: MAIN_COLOR,
            borderRadius: MAIN_BORDER_RADIUS,
            paddingVertical: 10,
          }}
          title="Хүсэлт илгээх"
          titleStyle={{
            fontSize: 16,
            fontFamily: FONT_FAMILY_BOLD,
          }}
          onPress={() => props.navigation.navigate("SendRequestScreen")}
        />
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
      <ScrollView contentContainerStyle={{ paddingBottom: 10 }} bounces={false}>
        <View style={styles.requestContainer}>
          <View style={styles.stack1}>
            <Text style={general_style.generalTextBold}>
              Ирц нөхөж бүртгүүлэх
            </Text>
            <View>
              <Text style={[general_style.generalText, { fontSize: 12 }]}>
                Эхлэх: 2022-12-09 18:00
              </Text>
              <Text style={[general_style.generalText, { fontSize: 12 }]}>
                Дуусах: 2022-12-09 19:00
              </Text>
            </View>
          </View>
          <View style={styles.stack2}>
            <Text>Өглөөний ирцээ бүртгүүлэхээ мартсан байна.</Text>
          </View>
        </View>
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

export default RequestListScreen;

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  requestContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    borderLeftColor: MAIN_COLOR,
    borderLeftWidth: 10,
    borderRightColor: MAIN_COLOR,
    borderRightWidth: 10,
  },
  stack1: {
    backgroundColor: "gray",
  },
});

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  NativeModules,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useState } from "react";
import HeaderUser from "../components/HeaderUser";
import {
  FONT_FAMILY_BOLD,
  FONT_FAMILY_LIGHT,
  MAIN_BORDER_RADIUS,
  MAIN_COLOR,
  MAIN_COLOR_GRAY,
} from "../constant";
const { StatusBarManager } = NativeModules;
import MainContext from "../contexts/MainContext";
import { Icon } from "@rneui/base";

const HelpScreen = () => {
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
      <TouchableOpacity
        style={styles.profileCard}
        onPress={() => console.log("A")}
      >
        <View style={styles.iconContainer}>
          <Icon type="feather" name="bell" size={30} />
        </View>
        <View style={styles.cardTextContainer}>
          <View>
            <Text style={styles.cardTopText}>Зааварчилгаа /iOS/</Text>
          </View>
        </View>

        <View style={styles.cardArrow}>
          <Icon name="keyboard-arrow-right" type="material-icons" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.profileCard}
        onPress={() => console.log("A")}
      >
        <View style={styles.iconContainer}>
          <Icon type="feather" name="bell" size={30} />
        </View>
        <View style={styles.cardTextContainer}>
          <View>
            <Text style={styles.cardTopText}>Зааварчилгаа /Android/</Text>
          </View>
        </View>

        <View style={styles.cardArrow}>
          <Icon name="keyboard-arrow-right" type="material-icons" />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HelpScreen;

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
  profileCard: {
    height: 60,
    flexDirection: "row",
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
    borderRadius: MAIN_BORDER_RADIUS,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    marginTop: 10,
    borderWidth: 0.5,
  },
  iconContainer: {
    marginHorizontal: 10,
    width: 40,
  },
  cardTextContainer: {
    textAlign: "left",
  },
  cardTopText: {
    fontFamily: FONT_FAMILY_BOLD,
    color: "#000",
  },
  cardArrow: {
    position: "absolute",
    right: 10,
  },
});

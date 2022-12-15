import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  NativeModules,
  Platform,
  Image,
  TouchableOpacity,
  Share,
} from "react-native";
import React, { useContext, useState } from "react";
import { Button, Icon } from "@rneui/base";
import { FONT_FAMILY_BOLD, MAIN_COLOR, MAIN_COLOR_GRAY } from "../constant";
import HeaderUser from "../components/HeaderUser";
import { Switch } from "react-native-paper";
const { StatusBarManager } = NativeModules;
import MainContext from "../contexts/MainContext";

const ProfileScreen = (props) => {
  const state = useContext(MainContext);
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  const shareSelected = async (data) => {
    try {
      const result = await Share.share({
        message: data,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {}
  };

  const menus = [
    { img: "user", label: "Миний мэдээлэл", nav: "" },
    { img: "mail", label: "Санал хүсэлт илгээх", nav: "" },
    { img: "bell", label: "Мэдэгдэлүүд", nav: "" },
    {
      img: "settings",
      label: "Ирэх/Явах цаг сануулах",
      nav: "",
      render: (
        <Switch
          value={isSwitchOn}
          onValueChange={onToggleSwitch}
          color={MAIN_COLOR}
        />
      ),
    },
    { img: "key", label: "Нууц үг солих", nav: "" },
    { img: "refresh-cw", label: "Байгууллага солих", nav: "" },
    {
      img: "share-2",
      label: "Хуваалцах",
      nav: "",
      action: (e) => shareSelected(e),
    },
    {
      img: "globe",
      label: "Хэл солих",
      nav: "",
      render: <Text style={{ fontFamily: FONT_FAMILY_BOLD }}>Монгол</Text>,
    },
    {
      img: "log-out",
      label: "Гарах",
      nav: "",
      action: () => state.logout(),
    },
  ];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBarManager.HEIGHT : 0,
      }}
    >
      <HeaderUser />
      <View style={styles.buttonsContainer}>
        {menus.map((el, index) => {
          return (
            <TouchableOpacity
              style={styles.profileCard}
              onPress={() =>
                el.action ? el.action("AAA") : props.navigation.navigate(el.nav)
              }
              key={index}
            >
              <View style={styles.iconContainer}>
                <Icon name={el.img} type="feather" color={MAIN_COLOR} />
              </View>
              <View style={styles.cardTextContainer}>
                <View>
                  <Text style={styles.cardTopText}>{el.label}</Text>
                </View>
              </View>

              <View style={styles.cardArrow}>
                {el.render ? (
                  el.render
                ) : (
                  <Icon name="keyboard-arrow-right" type="material-icons" />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  buttonsContainer: {
    marginTop: 10,
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
    borderRadius: 12,
    marginHorizontal: 20,
  },
  profileCard: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
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

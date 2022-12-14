import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  NativeModules,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useState } from "react";
import { Icon } from "@rneui/base";
import {
  FONT_FAMILY_BOLD,
  MAIN_BORDER_RADIUS,
  MAIN_COLOR,
  MAIN_COLOR_GRAY,
} from "../constant";
import HeaderUser from "../components/HeaderUser";
import { Switch } from "react-native-paper";
const { StatusBarManager } = NativeModules;
import MainContext from "../contexts/MainContext";
import CustomSnackbar from "../components/CustomSnackbar";
import CustomDialog from "../components/CustomDialog";

const ProfileScreen = (props) => {
  const state = useContext(MainContext);

  const onToggleSwitch = () => {
    onToggleSnackBar("Ирц бүртгэл сануулах тохиргоо хийгдлээ");
    state.setIsSwitchOn(!state.isSwitchOn);
  };

  const [visibleDialog, setVisibleDialog] = useState(false); //Dialog харуулах
  const [dialogType, setDialogType] = useState("warning"); //Dialog харуулах төрөл
  const [dialogText, setDialogText] = useState("Апп -с гарах уу?"); //Dialog -н текст

  const [visibleSnack, setVisibleSnack] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState("");

  //Snacbkbar харуулах
  const onToggleSnackBar = (msg) => {
    setVisibleSnack(!visibleSnack);
    setSnackBarMsg(msg);
  };

  //Snacbkbar хаах
  const onDismissSnackBar = () => setVisibleSnack(false);
  const menus = [
    {
      img: require("../../assets/profile/profile.png"),
      label: "Миний профайл",
      nav: "EditUserDataScreen",
      active: true,
    },
    {
      img: require("../../assets/profile/notif.png"),
      label: "Ирц бүртгэл сануулах",
      nav: "",
      active: true,
      render: (
        <Switch
          value={state.isSwitchOn}
          onValueChange={onToggleSwitch}
          color={MAIN_COLOR}
        />
      ),
      action: () => onToggleSwitch(),
    },
    {
      img: require("../../assets/profile/pass.png"),
      label: "Нууц үг солих",
      nav: "",
      active: false,
    },
    {
      img: require("../../assets/profile/org.png"),
      label: "Байгууллагийн тохиргоо",
      nav: "",
      active: false,
    },
    {
      img: require("../../assets/profile/lang.png"),
      label: "Хэл солих",
      nav: "",
      active: false,
      render: <Text style={{ fontFamily: FONT_FAMILY_BOLD }}>Монгол</Text>,
    },
    {
      img: "",
      label: "Гарах",
      nav: "",
      active: true,
      action: () => setVisibleDialog(),
    },
  ];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBarManager.HEIGHT : 0,
        backgroundColor: "#fff",
      }}
    >
      <CustomSnackbar
        visible={visibleSnack}
        dismiss={onDismissSnackBar}
        text={snackBarMsg}
        topPos={30}
      />
      <HeaderUser />
      <View style={styles.buttonsContainer}>
        {menus.map((el, index) => {
          return (
            <TouchableOpacity
              style={[styles.profileCard, { opacity: el.active ? 1 : 0.5 }]}
              onPress={() =>
                el.action
                  ? el.action("AAA")
                  : el.nav
                  ? props.navigation.navigate(el.nav)
                  : null
              }
              key={index}
              disabled={!el.active}
            >
              <View style={styles.iconContainer}>
                <Image
                  source={el.img}
                  color={MAIN_COLOR}
                  style={{ width: 30, height: 30 }}
                />
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
      <CustomDialog
        visible={visibleDialog}
        confirmFunction={() => {
          setVisibleDialog(false);
          state.logout();
        }}
        declineFunction={() => {
          setVisibleDialog(false);
        }}
        text={dialogText}
        confirmBtnText="Гарах"
        DeclineBtnText="Хаах"
        type={dialogType}
      />
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
    borderRadius: MAIN_BORDER_RADIUS,
    marginHorizontal: 20,
    backgroundColor: "#fff",
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

import React, { useContext } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FONT_FAMILY_BOLD, MAIN_COLOR } from "../constant";
import MainContext from "../contexts/MainContext";
import notif from "../../assets/notif.png";
import { useNavigation } from "@react-navigation/native";

const HeaderUser = (props) => {
  const navigation = useNavigation();
  const state = useContext(MainContext);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerFirstSection}>
        <Image source={{ uri: state.userData?.Image }} style={styles.userImg} />
        <View style={styles.titleContainer}>
          <Text style={styles.topText}>Сайн байна уу?</Text>
          <Text style={styles.userName}>{state.userData.FirstName}</Text>
        </View>
      </View>
      {!props.isNotificationScreen ? (
        <TouchableOpacity
          onPress={() => navigation.navigate("NotificationScreen")}
        >
          <Image
            source={notif}
            style={{ width: 35, height: 35, resizeMode: "contain" }}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default React.memo(HeaderUser);

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  headerFirstSection: {
    flexDirection: "row",
  },
  userImg: {
    width: 80,
    height: 80,
    borderRadius: 50,
    // resizeMode: "contain",
    overflow: "hidden",
  },
  titleContainer: {
    flexDirection: "column",
    marginTop: "5%",
    marginLeft: "5%",
  },
  topText: {
    color: MAIN_COLOR,
    fontFamily: FONT_FAMILY_BOLD,
    fontSize: 16,
  },
  userName: {
    fontFamily: FONT_FAMILY_BOLD,
    fontSize: 24,
  },
});

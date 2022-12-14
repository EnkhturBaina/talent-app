import { Icon } from "@rneui/base";
import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import avatar from "../../assets/avatar.jpg";
import { FONT_FAMILY_BOLD, FONT_FAMILY_LIGHT, MAIN_COLOR } from "../constant";

function HeaderUser() {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerFirstSection}>
        <Image source={avatar} style={styles.userImg} />
        <View style={styles.titleContainer}>
          <Text style={styles.topText}>Сайн байна уу?</Text>
          <Text style={styles.userName}>БҮРЭНЖАРГАЛ</Text>
        </View>
      </View>
      <Icon type="feather" name="bell" size={30} />
    </View>
  );
}

export default HeaderUser;

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
  },
  userName: {
    fontFamily: FONT_FAMILY_LIGHT,
  },
});

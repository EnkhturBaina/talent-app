// Ашиглагдах ерөнхий STYLE ууд
"use strict";
import { StyleSheet } from "react-native";
import { FONT_FAMILY_BOLD, FONT_FAMILY_LIGHT, MAIN_COLOR } from "./constant";

module.exports = StyleSheet.create({
  generalText: {
    fontFamily: FONT_FAMILY_LIGHT,
  },
  generalTextBold: {
    fontFamily: FONT_FAMILY_BOLD,
  },
  generalYellowText: {
    color: MAIN_COLOR,
    fontFamily: FONT_FAMILY_LIGHT,
  },
  generalYellowTextBold: {
    color: MAIN_COLOR,
    fontFamily: FONT_FAMILY_BOLD,
  },
});

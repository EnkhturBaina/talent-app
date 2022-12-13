import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  NativeModules,
  Platform,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Button, Icon } from "@rneui/base";
import HeaderUser from "../components/HeaderUser";
const { StatusBarManager } = NativeModules;

const EmployeesScreen = (props) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBarManager.HEIGHT : 0,
      }}
    >
      <HeaderUser />
      <Text>EmployeesScreen</Text>
    </SafeAreaView>
  );
};

export default EmployeesScreen;

const styles = StyleSheet.create({});

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

const AttendanceScreen = (props) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBarManager.HEIGHT : 0,
      }}
    >
      <HeaderUser />
      <TouchableOpacity>
        <Icon
          name="keyboard-arrow-left"
          type="material-icons"
          color="#000"
          size={30}
        />
      </TouchableOpacity>
      <Button title="ASD" onPress={() => props.navigation.goBack()} />
      <Text>AttendanceScreen</Text>
    </SafeAreaView>
  );
};

export default AttendanceScreen;

const styles = StyleSheet.create({});

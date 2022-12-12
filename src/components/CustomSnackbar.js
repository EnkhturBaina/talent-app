import { StyleSheet, Text } from "react-native";
import React from "react";
import { Snackbar } from "react-native-paper";

export default function ({ visible, dismiss, text }) {
  return (
    <Snackbar
      visible={visible}
      onDismiss={dismiss}
      wrapperStyle={{ top: 30, zIndex: 9999 }}
      duration={2000}
      style={{ backgroundColor: "#89898c" }}
    >
      <Text style={{ color: "#fff" }}>{text}</Text>
    </Snackbar>
  );
}

const styles = StyleSheet.create({});

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  NativeModules,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useContext, useRef } from "react";
import { Button } from "@rneui/themed";
import * as LocalAuthentication from "expo-local-authentication";
import {
  FONT_FAMILY_BOLD,
  FONT_FAMILY_LIGHT,
  MAIN_BORDER_RADIUS,
  MAIN_COLOR,
} from "../constant";
import MainContext from "../contexts/MainContext";
const { StatusBarManager } = NativeModules;
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BiometricScreen = (props) => {
  const state = useContext(MainContext);
  const animation = useRef(null);
  const [biometrics, setBiometrics] = useState(false);
  const [grantAccess, setGrantAccess] = useState(false);
  useEffect(() => {}, []);
  const confirmBio = () => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      // console.log("COMP", compatible);
      setBiometrics(compatible);
      compatible
        ? (async () => {
            const auth = await LocalAuthentication.authenticateAsync();
            // console.log("auth", auth);
            if (auth.success) {
              setGrantAccess(true);
              state.setIsLoggedIn(true);
            } else {
              setGrantAccess(false);
              state.setIsLoggedIn(true);
            }
          })()
        : null;
    })();
  };

  const skipBio = () => {
    state.setIsLoggedIn(true);
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBarManager.HEIGHT : 0,
        justifyContent: "space-evenly",
      }}
    >
      <View style={{ alignItems: "center" }}>
        <LottieView
          autoPlay
          ref={animation}
          style={{
            width: 400,
            height: 300,
            backgroundColor: "transparent",
          }}
          // Find more Lottie files at https://lottiefiles.com/featured
          source={require("../../assets/bio.json")}
        />
      </View>
      <View>
        <Text
          style={{
            fontFamily: FONT_FAMILY_BOLD,
            fontSize: 24,
            textAlign: "center",
          }}
        >
          Та биометр тохиргоо ашиглах үү?
        </Text>
        <Text
          style={{
            fontFamily: FONT_FAMILY_BOLD,
            fontSize: 16,
            textAlign: "center",
            marginHorizontal: 20,
            marginTop: 20,
          }}
        >
          Биометр тохиргоо ашиглан Talent апп-д нэвтрэх боломжтой.
        </Text>
      </View>
      <View style={styles.btnContainer}>
        <Button
          containerStyle={{
            width: "100%",
            marginTop: 10,
          }}
          buttonStyle={{
            backgroundColor: MAIN_COLOR,
            borderRadius: MAIN_BORDER_RADIUS,
            paddingVertical: 10,
          }}
          title="Ашиглах"
          titleStyle={{
            fontSize: 16,
            fontFamily: FONT_FAMILY_BOLD,
          }}
          onPress={() => confirmBio()}
        />
        <TouchableOpacity
          style={styles.skipContainer}
          onPress={() => skipBio()}
        >
          <Text style={styles.skipBtn}>Алгасах</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BiometricScreen;

const styles = StyleSheet.create({
  btnContainer: {
    width: "80%",
    alignItems: "center",
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: 10,
  },
  skipContainer: {
    padding: 10,
    marginTop: 10,
  },
  skipBtn: {
    fontFamily: FONT_FAMILY_LIGHT,
    textDecorationLine: "underline",
  },
});

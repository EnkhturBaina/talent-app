import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Icon, CheckBox, Button } from "@rneui/themed";
import MainContext from "../contexts/MainContext";
import CustomSnackbar from "../components/CustomSnackbar";
import talent_logo from "../../assets/talent_logo.png";
import { TextInput } from "react-native-paper";
import {
  MAIN_COLOR,
  MAIN_BORDER_RADIUS,
  FONT_FAMILY_BOLD,
  SERVER_URL,
} from "../constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const LoginScreen = (props) => {
  const state = useContext(MainContext);
  const [password, setPassword] = useState("Credo1234@");
  const [hidePassword, setHidePassword] = useState(true);

  const [visibleSnack, setVisibleSnack] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState("");

  const regex_email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

  //Snacbkbar харуулах
  const onToggleSnackBar = (msg) => {
    setVisibleSnack(!visibleSnack);
    setSnackBarMsg(msg);
  };

  //Snacbkbar хаах
  const onDismissSnackBar = () => setVisibleSnack(false);

  const checkHandleUseBiometric = () => {
    state.setIsUseBiometric(!state.isUseBiometric);
  };

  const hideShowPassword = () => {
    setHidePassword(!hidePassword);
  };

  const resetPassword = async () => {
    if (state.email == "") {
      onToggleSnackBar("И-мэйл хаягаа оруулна уу.");
    } else if (!regex_email.test(state.email)) {
      onToggleSnackBar("И-мэйл хаягаа зөв оруулна уу.");
    } else {
      await axios({
        method: "post",
        url: `${SERVER_URL}/send/recovery`,
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
        data: {
          email: state.email,
        },
      })
        .then(async (response) => {
          console.log("resetUUID =====>", response.data);
          if (response.data?.Type == 0) {
            onToggleSnackBar(response.data.Msg);
            state.setLoginErrorMsg("");
          } else if (response.data?.Type == 1) {
            state.setLoginErrorMsg(response.data.Msg);
          } else if (response.data?.Type == 2) {
            state.setLoginErrorMsg(response.data.Msg);
          }
        })
        .catch(function (error) {
          if (!error.status) {
            // network error
            state.logout();
            state.setIsLoading(false);
            state.setLoginErrorMsg("Холболт салсан байна.");
          }
        });
    }
  };
  const login = async () => {
    if (state.email == "") {
      onToggleSnackBar("И-мэйл хаягаа оруулна уу.");
    } else if (!regex_email.test(state.email)) {
      onToggleSnackBar("И-мэйл хаягаа зөв оруулна уу.");
    } else if (password == "") {
      onToggleSnackBar("Нууц үг оруулна уу.");
    } else {
      var tempUUID = uuidv4();
      state.setIsLoading(true);
      await axios({
        method: "post",
        url: `${SERVER_URL}/employee/mobile/login`,
        data: {
          email: state.email,
          password: password,
          MobileUUID: state.uuid ? state.uuid : tempUUID,
          ExponentPushToken: state.expoPushToken,
        },
      })
        .then(async (response) => {
          // console.log("RES", response.data);
          if (response.data?.Type == 0) {
            try {
              state.setUserData(response.data.Extra?.user);
              state.setToken(response.data.Extra?.access_token);
              state.setUserId(response.data.Extra?.user?.id);
              state.setCompanyId(response.data.Extra?.user?.GMCompanyId);
              //*****Login Хийсэн User -н Data -г Local Storage -д хадгалах
              await AsyncStorage.setItem(
                "user",
                JSON.stringify({
                  token: response.data.Extra?.access_token,
                  user: response.data.Extra?.user,
                })
              ).then(async (value) => {
                //*****UUID -г Local Storage -д хадгалах
                await AsyncStorage.setItem(
                  "uuid",
                  state.uuid ? state.uuid : tempUUID
                ).then(async (value) => {
                  if (state.isUseBiometric) {
                    //*****Biometric ашиглах CHECK хийгдсэн үед Local Storage -д хадгалах
                    await AsyncStorage.setItem("use_bio", "yes").then(
                      (value) => {
                        state.confirmBio();
                      }
                    );
                  } else {
                    //*****Biometric ашиглах CHECK хийгдээгүй үед Local Storage -д хадгалах
                    await AsyncStorage.setItem("use_bio", "no").then(
                      (value) => {
                        state.getUserDataLocalStorage();
                      }
                    );
                  }
                });
              });
            } catch (e) {
              // console.log("e====>", e);
            }
            state.setLoginErrorMsg("");
          } else if (response.data?.Type == 1) {
            state.setLoginErrorMsg(response.data.Msg);
            state.setIsLoading(false);
          } else if (response.data?.Type == 2) {
            state.setLoginErrorMsg(response.data.Msg);
            state.setIsLoading(false);
          }
        })
        .catch(function (error) {
          // console.log("error", error);
          if (!error.status) {
            // network error
            state.logout();
            state.setIsLoading(false);
            state.setLoginErrorMsg("Холболт салсан байна.");
          }
        });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : ""}
      style={{
        flex: 1,
        flexDirection: "column",
      }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <CustomSnackbar
          visible={visibleSnack}
          dismiss={onDismissSnackBar}
          text={snackBarMsg}
          topPos={30}
        />
        <View style={styles.loginImageContainer}>
          <Image style={styles.loginImg} source={talent_logo} />
        </View>
        {state.loginErrorMsg != "" ? (
          <Text
            style={{
              fontFamily: FONT_FAMILY_BOLD,
              color: "red",
              textAlign: "center",
            }}
          >
            {state.loginErrorMsg}
          </Text>
        ) : null}
        <View style={styles.stackSection}>
          <TextInput
            label="И-мэйл"
            mode="outlined"
            style={styles.generalInput}
            dense={true}
            value={state.email}
            returnKeyType="done"
            keyboardType="email-address"
            onChangeText={(e) => {
              state.setEmail(e);
            }}
            theme={{
              fonts: {
                regular: {
                  fontFamily: FONT_FAMILY_BOLD,
                },
              },
              colors: {
                primary: MAIN_COLOR,
              },
              roundness: MAIN_BORDER_RADIUS,
            }}
          />
          <View
            style={{
              width: "100%",
              marginRight: "auto",
              marginLeft: "auto",
              alignItems: "center",
            }}
          >
            <TextInput
              label="Нууц үг"
              mode="outlined"
              style={styles.generalInput}
              dense={true}
              value={password}
              returnKeyType="done"
              secureTextEntry={hidePassword}
              onChangeText={setPassword}
              theme={{
                fonts: {
                  regular: {
                    fontFamily: FONT_FAMILY_BOLD,
                  },
                },
                colors: {
                  primary: MAIN_COLOR,
                },
                roundness: MAIN_BORDER_RADIUS,
              }}
            />
            <TouchableOpacity
              style={styles.imageStyle}
              onPress={() => hideShowPassword()}
            >
              <Icon name={hidePassword ? "eye" : "eye-closed"} type="octicon" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.stackSection2}>
          <CheckBox
            containerStyle={styles.customCheckBox}
            textStyle={{
              fontWeight: "normal",
              marginLeft: 5,
              fontSize: 12,
              fontFamily: FONT_FAMILY_BOLD,
            }}
            title="FaceID ашиглах"
            iconType="material-community"
            checkedIcon="checkbox-outline"
            uncheckedIcon="checkbox-blank-outline"
            checked={state.isUseBiometric}
            onPress={checkHandleUseBiometric}
            checkedColor={MAIN_COLOR}
            uncheckedColor={MAIN_COLOR}
          />
          <TouchableOpacity onPress={() => resetPassword()}>
            <Text
              style={{
                textDecorationLine: "underline",
                fontSize: 12,
                fontFamily: FONT_FAMILY_BOLD,
              }}
            >
              Нууц үг сэргээх
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.stackSection3}>
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
            title="Нэвтрэх"
            titleStyle={{
              fontSize: 16,
              fontFamily: FONT_FAMILY_BOLD,
            }}
            onPress={() => login()}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  loginImageContainer: {
    alignItems: "center",
  },
  stackSection: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  loginImg: {
    width: 250,
    height: 200,
    resizeMode: "contain",
    marginTop: "30%",
  },
  generalInput: {
    width: "80%",
    // height: 40,
    backgroundColor: "#fff",
    marginTop: 10,
    padding: 0,
  },
  stackSection2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    width: "80%",
    marginRight: "auto",
    marginLeft: "auto",
  },
  stackSection3: {
    width: "80%",
    alignItems: "center",
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: 10,
  },
  imageStyle: {
    position: "absolute",
    zIndex: 999,
    right: "15%",
    top: "45%",
  },
  customCheckBox: {
    padding: 0,
    margin: 0,
    marginLeft: 0,
    alignItems: "center",
  },
});

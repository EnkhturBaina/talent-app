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
import React, { useContext, useState } from "react";
import { Icon, CheckBox, Button } from "@rneui/themed";
import MainContext from "../contexts/MainContext";
import CustomSnackbar from "../components/CustomSnackbar";
import talent_logo from "../../assets/talent_logo.png";
import { TextInput } from "react-native-paper";
import {
  MAIN_COLOR,
  MAIN_COLOR_GRAY,
  MAIN_BORDER_RADIUS,
  FONT_FAMILY_BOLD,
  SERVER_URL,
} from "../constant";
import { v4 as uuidv4 } from "uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const LoginScreen = (props) => {
  const state = useContext(MainContext);
  const [password, setPassword] = useState("Credo1234@");
  const [hidePassword, setHidePassword] = useState(true);

  const [visibleSnack, setVisibleSnack] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState("");

  const onToggleSnackBar = (msg) => {
    setVisibleSnack(!visibleSnack);
    setSnackBarMsg(msg);
  };

  const onDismissSnackBar = () => setVisibleSnack(false);

  const checkHandle = () => {
    state.setRemember(!state.remember);
  };

  const hideShowPassword = () => {
    setHidePassword(!hidePassword);
  };

  const resetUUID = async () => {
    console.log("state.token", state.token);
    await axios({
      method: "post",
      url: `${SERVER_URL}/mobile/reset`,
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
      data: {
        GMCompanyId: 1,
        ERPEmployeeId: 1,
      },
    })
      .then(async (response) => {
        console.log("resetUUID =====>", response.data);
      })
      .catch(function (error) {
        console.log("resetUUID error=====>", error);
      });
  };
  const login = async () => {
    if (state.emaal == "") {
      onToggleSnackBar("И-мэйл хаягаа оруулна уу.");
    } else if (password == "") {
      onToggleSnackBar("Нууц үг оруулна уу.");
    } else {
      var tempUUID = uuidv4();
      console.log("tempUUID", tempUUID);
      console.log("state.uuid", state.uuid);
      await axios({
        method: "post",
        url: `${SERVER_URL}/employee/mobile/login`,
        data: {
          email: state.email,
          password: password,
          // MobileUUID: state.uuid ? state.uuid : tempUUID,
          MobileUUID: "812206e1-7a92-4f7d-98b4-10e06cb5dfee",
        },
      })
        .then(async (response) => {
          console.log("RES", response.data);
          if (response.data?.Type == 0) {
            state.setIsLoading(true);
            try {
              state.setToken(response.data.Extra?.access_token);
              state.setUserId(response.data.Extra?.user?.id);
              state.setCompanyId(response.data.Extra?.user?.GMCompanyId);
              await AsyncStorage.setItem(
                "user",
                JSON.stringify({
                  token: response.data.Extra?.access_token,
                  user: response.data.Extra?.user,
                })
              ).then(async (value) => {
                await AsyncStorage.setItem("uuid", tempUUID).then((value) => {
                  console.log("THEN");
                  state.setIsLoginSuccess(true);
                  state.setIsLoading(false);
                  // props.navigation.navigate("BiometricScreen");
                });
              });
            } catch (e) {
              console.log("e====>", e);
            }
          } else if (response.data?.Type == 1) {
            onToggleSnackBar(response.data.Msg);
          } else if (response.data?.Type == 2) {
            onToggleSnackBar(response.data.Msg);
          }
        })
        .catch(function (error) {
          console.log("error", error);
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
        />
        <View style={styles.loginImageContainer}>
          <Image style={styles.loginImg} source={talent_logo} />
        </View>
        <Button title="RESET UUID" onPress={() => resetUUID()} />
        <Text>Credo1234@</Text>
        <View style={styles.stackSection}>
          <TextInput
            label="И-мэйл"
            mode="outlined"
            style={styles.generalInput}
            value={state.email}
            returnKeyType="done"
            keyboardType="email-address"
            maxLength={8}
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
              <Icon
                name={hidePassword ? "eye" : "eye-closed"}
                type="octicon"
                color={MAIN_COLOR_GRAY}
              />
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
            checked={state.remember}
            onPress={checkHandle}
            checkedColor={MAIN_COLOR}
            uncheckedColor={MAIN_COLOR}
          />
          <TouchableOpacity
            onPress={() => props.navigation.navigate("ResetPassword")}
          >
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
    height: 40,
    backgroundColor: "#fff",
    marginTop: 10,
  },
  searchIcon: {
    resizeMode: "contain",
    width: "13%",
    marginVertical: 20,
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

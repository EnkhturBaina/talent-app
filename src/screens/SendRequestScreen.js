import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  NativeModules,
  Platform,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Icon } from "@rneui/themed";
import BottomSheet from "../components/BottomSheet";
import {
  FONT_FAMILY_BOLD,
  FONT_FAMILY_LIGHT,
  MAIN_BORDER_RADIUS,
  MAIN_COLOR,
  MAIN_COLOR_GRAY,
  SERVER_URL,
} from "../constant";
import MainContext from "../contexts/MainContext";
import axios from "axios";
const { StatusBarManager } = NativeModules;
import Loader from "../components/Loader";

const SendRequestScreen = (props) => {
  const state = useContext(MainContext);
  const [data, setData] = useState(""); //BottomSheet рүү дамжуулах Дата
  const [uselessParam, setUselessParam] = useState(false); //BottomSheet -г дуудаж байгааг мэдэх гэж ашиглаж байгамоо
  const [displayName, setDisplayName] = useState(""); //LOOKUP -д харагдах утга (display value)
  const [fieldName, setFieldName] = useState(""); //Аль утгыг OBJECT -с update хийх
  const [absenceTypes, setAbsenceTypes] = useState(""); //Хүсэлтийн төрөл
  const [isLoadingRequest, setIsLoadingRequest] = useState(true);

  const [requestData, setRequestData] = useState({
    requestType: "", //Хүсэлтийн төрөл
    startDate: "",
    endDate: "",
    description: "",
  });

  const getAbsenceTypes = async () => {
    await axios({
      method: "post",
      url: `${SERVER_URL}/mobile/absence/type/list`,
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
      data: {
        GMCompanyId: state.companyId,
      },
    })
      .then((response) => {
        // console.log("get AbsenceTypes======>", response.data.Extra);
        if (response.data?.Type == 0) {
          setAbsenceTypes(response.data.Extra);
        } else if (response.data?.Type == 1) {
          console.log("WARNING", response.data.Msg);
        } else if (response.data?.Type == 2) {
        }
        setIsLoadingRequest(false);
      })
      .catch(function (error) {
        if (error.response.status == "401") {
          AsyncStorage.removeItem("use_bio");
          state.setLoginErrorMsg("Холболт салсан байна. Та дахин нэвтэрнэ үү.");
          state.setIsLoading(false);
          state.logout();
        }
      });
  };
  useEffect(() => {
    getAbsenceTypes();
  }, []);
  useEffect(() => {
    requestData && console.log("requestData", requestData);
  }, [requestData]);

  const setLookupData = (data, display, field) => {
    setData(data); //Lookup -д харагдах дата
    setDisplayName(display); //Lookup -д харагдах датаны текст талбар
    setFieldName(field);
    setUselessParam(!uselessParam);
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#fff",
          flexDirection: "column",
        }}
      >
        {isLoadingRequest ? (
          <Loader />
        ) : (
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 80,
            }}
          >
            <View style={styles.touchableSelectContainer}>
              <Text style={styles.title}>Хүсэлтийн төрөл сонгох</Text>
              <TouchableOpacity
                style={styles.touchableSelect}
                onPress={() =>
                  setLookupData(absenceTypes.types, "Name", "requestType")
                }
              >
                <Text style={{ fontFamily: FONT_FAMILY_BOLD }}>
                  {requestData.requestType.Name}
                </Text>
                <Icon
                  name="keyboard-arrow-down"
                  type="material-icons"
                  size={30}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.touchableSelectContainer}>
              <Text style={styles.title}>Эхлэх огноо</Text>
              <TouchableOpacity
                style={styles.touchableSelect}
                onPress={() =>
                  setLookupData(state.last3Years, "name", "startDate")
                }
              >
                <Text style={{ fontFamily: FONT_FAMILY_BOLD }}>
                  {/* {requestData.name} */}
                </Text>
                <Icon
                  name="keyboard-arrow-down"
                  type="material-icons"
                  size={30}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.touchableSelectContainer}>
              <Text style={styles.title}>Дуусах огноо</Text>
              <TouchableOpacity
                style={styles.touchableSelect}
                onPress={() =>
                  setLookupData(state.last3Years, "name", "endDate")
                }
              >
                <Text style={{ fontFamily: FONT_FAMILY_BOLD }}>
                  {/* {requestData.name} */}
                </Text>
                <Icon
                  name="keyboard-arrow-down"
                  type="material-icons"
                  size={30}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.touchableSelectContainer}>
              <Text style={styles.title}>Тайлбар</Text>
              <TextInput
                multiline={true}
                numberOfLines={4}
                onChangeText={(text) =>
                  setRequestData((prevState) => ({
                    ...prevState,
                    description: text,
                  }))
                }
                value={requestData.description}
                style={styles.description}
                returnKeyType="done"
                onBlur={() => {
                  Keyboard.dismiss();
                }}
              />
            </View>
          </ScrollView>
        )}

        <BottomSheet
          bodyText={data}
          dragDown={true}
          backClick={true}
          displayName={displayName}
          handle={uselessParam}
          action={(e) =>
            setRequestData((prevState) => ({
              ...prevState,
              [fieldName]: e,
            }))
          }
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SendRequestScreen;

const styles = StyleSheet.create({
  touchableSelectContainer: {
    width: "90%",
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: 10,
  },
  touchableSelect: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: MAIN_COLOR,
    borderWidth: 1,
    borderRadius: MAIN_BORDER_RADIUS,
    height: 40,
    alignItems: "center",
    paddingVertical: 5,
    paddingLeft: 10,
    paddingRight: 5,
    alignSelf: "flex-start",
    width: "100%",
    marginTop: 10,
  },
  description: {
    height: 200,
    marginTop: 10,
    borderRadius: MAIN_BORDER_RADIUS,
    padding: 10,
    borderWidth: 1,
    borderColor: MAIN_COLOR,
    textAlignVertical: "top",
  },
  title: {
    fontFamily: FONT_FAMILY_LIGHT,
  },
});

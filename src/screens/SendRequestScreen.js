import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Icon, Button } from "@rneui/themed";
import BottomSheetRequest from "../components/BottomSheetRequest";
import {
  FONT_FAMILY_BOLD,
  FONT_FAMILY_LIGHT,
  MAIN_BORDER_RADIUS,
  MAIN_COLOR,
  SERVER_URL,
} from "../constant";
import MainContext from "../contexts/MainContext";
import axios from "axios";
import Loader from "../components/Loader";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CustomSnackbar from "../components/CustomSnackbar";
import CustomDialog from "../components/CustomDialog";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SendRequestScreen = (props) => {
  const state = useContext(MainContext);
  const [data, setData] = useState(""); //BottomSheetRequest рүү дамжуулах Дата
  const [uselessParam, setUselessParam] = useState(false); //BottomSheetRequest -г дуудаж байгааг мэдэх гэж ашиглаж байгамоо
  const [displayName, setDisplayName] = useState(""); //LOOKUP -д харагдах утга (display value)
  const [fieldName, setFieldName] = useState(""); //Аль утгыг OBJECT -с update хийх
  const [showColor, setShowColor] = useState(""); //Өнгө харуулах эсэх
  const [absenceTypes, setAbsenceTypes] = useState(""); //Хүсэлтийн төрөл
  const [isLoadingRequest, setIsLoadingRequest] = useState(true);

  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showFromTimePicker, setShowFromTimePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [showToTimePicker, setShowToTimePicker] = useState(false);

  const [visibleSnack, setVisibleSnack] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState("");

  const [visibleDialog, setVisibleDialog] = useState(false);
  const [dialogType, setDialogType] = useState("success");
  const [dialogText, setDialogText] = useState("");

  //Snacbkbar харуулах
  const onToggleSnackBar = (msg) => {
    setVisibleSnack(!visibleSnack);
    setSnackBarMsg(msg);
  };

  //Snacbkbar хаах
  const onDismissSnackBar = () => setVisibleSnack(false);

  const [requestData, setRequestData] = useState({
    GMCompanyId: "",
    ERPEmployeeId: "",
    FromDate: "",
    ToDate: "",
    ERPSubstituteId: "",
    ERPAbsenceTypeCompanyId: "",
    ERPFromDatePartId: "",
    ERPToDatePartId: "",
    FromTime: "",
    ToTime: "",
    Comment: "",
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
        if (error.response?.status == "401") {
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

  const setLookupData = (data, display, field, color) => {
    setData(data); //Lookup -д харагдах дата
    setDisplayName(display); //Lookup -д харагдах датаны текст талбар
    setFieldName(field);
    setUselessParam(!uselessParam);
    setShowColor(color);
  };

  const handleConfirm = (type, param, data) => {
    if (type == "date") {
      setRequestData((prevState) => ({
        ...prevState,
        [param]: data.toLocaleDateString()?.split(".").join("-"), // DATE форматаас '.' -г '-' болгон хадгалах
      }));
    } else {
      setRequestData((prevState) => ({
        ...prevState,
        [param]: data.toLocaleTimeString()?.slice(0, -3), // TIME форматаас секунд хасаж хадгалах
      }));
    }
    setShowFromDatePicker(false);
    setShowFromTimePicker(false);
    setShowToDatePicker(false);
    setShowToTimePicker(false);
  };

  const saveAbsence = async () => {
    if (requestData.ERPAbsenceTypeCompanyId == "") {
      onToggleSnackBar("Хүсэлтийн төрөл сонгоно уу.");
    } else if (requestData.FromDate == "") {
      onToggleSnackBar("Эхлэх огноо оруулна уу.");
    } else if (requestData.ToDate == "") {
      onToggleSnackBar("Дуусах огноо оруулна уу.");
    } else {
      await axios({
        method: "post",
        url: `${SERVER_URL}/mobile/absence/save`,
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
        data: {
          ERPEmployeeId: state.userId,
          GMCompanyId: state.companyId,
          FromDate: requestData.FromDate,
          ToDate: requestData.ToDate,
          ERPAbsenceTypeCompanyId: requestData.ERPAbsenceTypeCompanyId?.id,
          Comment: requestData.Comment,
          FromTime: requestData.FromTime,
          ToTime: requestData.ToTime,
          MobileUUID: state.uuid,
        },
      })
        .then((response) => {
          // console.log("save Absence======>", response.data);
          if (response.data?.Type == 0) {
            setDialogType("success");
            setVisibleDialog(true);
            setDialogText(response.data.Msg);
          } else if (response.data?.Type == 1) {
            console.log("WARNING", response.data.Msg);
          } else if (response.data?.Type == 2) {
          }
          setIsLoadingRequest(false);
        })
        .catch(function (error) {
          if (error.response?.status == "401") {
            AsyncStorage.removeItem("use_bio");
            state.setLoginErrorMsg(
              "Холболт салсан байна. Та дахин нэвтэрнэ үү."
            );
            state.setIsLoading(false);
            state.logout();
          }
        });
    }
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
        <CustomSnackbar
          visible={visibleSnack}
          dismiss={onDismissSnackBar}
          text={snackBarMsg}
          topPos={0}
        />
        {isLoadingRequest ? (
          <Loader />
        ) : (
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 80,
              marginHorizontal: 20,
            }}
          >
            <View style={styles.touchableSelectContainer}>
              <Text style={styles.title}>Хүсэлтийн төрөл сонгох</Text>
              <TouchableOpacity
                style={styles.touchableSelect}
                onPress={() =>
                  setLookupData(
                    absenceTypes.types,
                    "Name",
                    "ERPAbsenceTypeCompanyId",
                    true
                  )
                }
              >
                <View style={styles.dataContainer}>
                  {requestData.ERPAbsenceTypeCompanyId?.Name ? (
                    <View
                      style={{
                        height: 20,
                        width: 40,
                        borderRadius: 8,
                        backgroundColor:
                          requestData?.ERPAbsenceTypeCompanyId?.category
                            ?.CalendarColor,
                      }}
                    ></View>
                  ) : null}
                  <Text
                    style={{
                      fontFamily: FONT_FAMILY_BOLD,
                      marginLeft: requestData.ERPAbsenceTypeCompanyId?.Name
                        ? 10
                        : 0,
                      flex: 1,
                    }}
                    numberOfLines={1}
                  >
                    {requestData.ERPAbsenceTypeCompanyId?.Name
                      ? requestData.ERPAbsenceTypeCompanyId?.Name
                      : "Сонгох"}
                  </Text>
                </View>

                <Icon
                  name="keyboard-arrow-down"
                  type="material-icons"
                  size={30}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.halfContainer}>
              <View style={styles.touchableHalfSelectContainer}>
                <Text style={styles.title}>Эхлэх огноо</Text>
                <TouchableOpacity
                  style={[
                    styles.touchableSelect,
                    {
                      backgroundColor:
                        requestData.ERPAbsenceTypeCompanyId == ""
                          ? "#edebeb"
                          : "#fff",
                    },
                  ]}
                  onPress={() => setShowFromDatePicker(true)}
                  disabled={requestData.ERPAbsenceTypeCompanyId == ""}
                >
                  <Text style={{ fontFamily: FONT_FAMILY_BOLD }}>
                    {requestData.FromDate != ""
                      ? requestData.FromDate
                      : "Сонгох"}
                  </Text>
                  <Icon
                    name="keyboard-arrow-down"
                    type="material-icons"
                    size={30}
                  />
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={showFromDatePicker}
                  mode="date"
                  onConfirm={(date) => handleConfirm("date", "FromDate", date)}
                  onCancel={() => setShowFromDatePicker(false)}
                  confirmTextIOS="Сонгох"
                  cancelTextIOS="Хаах"
                />
              </View>
              <View style={styles.touchableHalfSelectContainer}>
                <Text style={styles.title}>Эхний өдөр цаг</Text>
                <TouchableOpacity
                  style={[
                    styles.touchableSelect,
                    {
                      backgroundColor:
                        (requestData.ERPAbsenceTypeCompanyId == "" && "#fff") ||
                        (requestData.ERPAbsenceTypeCompanyId != "" &&
                          requestData.ERPAbsenceTypeCompanyId?.AllowHours == 0)
                          ? "#edebeb"
                          : "#fff",
                    },
                  ]}
                  onPress={() => setShowFromTimePicker(true)}
                  disabled={
                    requestData.ERPAbsenceTypeCompanyId == "" ||
                    (requestData.ERPAbsenceTypeCompanyId &&
                      requestData.ERPAbsenceTypeCompanyId?.AllowHours == 0)
                  }
                >
                  <Text style={{ fontFamily: FONT_FAMILY_BOLD }}>
                    {requestData.FromTime != ""
                      ? requestData.FromTime
                      : "Сонгох"}
                  </Text>
                  <Icon
                    name="keyboard-arrow-down"
                    type="material-icons"
                    size={30}
                  />
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={showFromTimePicker}
                  mode="time"
                  onConfirm={(time) => handleConfirm("time", "FromTime", time)}
                  onCancel={() => setShowFromTimePicker(false)}
                  confirmTextIOS="Сонгох"
                  cancelTextIOS="Хаах"
                />
              </View>
            </View>

            <View style={styles.halfContainer}>
              <View style={styles.touchableHalfSelectContainer}>
                <Text style={styles.title}>Дуусах огноо</Text>
                <TouchableOpacity
                  style={[
                    styles.touchableSelect,
                    {
                      backgroundColor:
                        requestData.ERPAbsenceTypeCompanyId == ""
                          ? "#edebeb"
                          : "#fff",
                    },
                  ]}
                  onPress={() => setShowToDatePicker(true)}
                  disabled={requestData.ERPAbsenceTypeCompanyId == ""}
                >
                  <Text style={{ fontFamily: FONT_FAMILY_BOLD }}>
                    {requestData.ToDate != "" ? requestData.ToDate : "Сонгох"}
                  </Text>
                  <Icon
                    name="keyboard-arrow-down"
                    type="material-icons"
                    size={30}
                  />
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={showToDatePicker}
                  mode="date"
                  onConfirm={(date) => handleConfirm("date", "ToDate", date)}
                  onCancel={() => setShowToDatePicker(false)}
                  confirmTextIOS="Сонгох"
                  cancelTextIOS="Хаах"
                />
              </View>
              <View style={styles.touchableHalfSelectContainer}>
                <Text style={styles.title}>Дуусах өдөр цаг</Text>
                <TouchableOpacity
                  style={[
                    styles.touchableSelect,
                    {
                      backgroundColor:
                        (requestData.ERPAbsenceTypeCompanyId == "" && "#fff") ||
                        (requestData.ERPAbsenceTypeCompanyId != "" &&
                          requestData.ERPAbsenceTypeCompanyId?.AllowHours == 0)
                          ? "#edebeb"
                          : "#fff",
                    },
                  ]}
                  onPress={() => setShowToTimePicker(true)}
                  disabled={
                    requestData.ERPAbsenceTypeCompanyId == "" ||
                    (requestData.ERPAbsenceTypeCompanyId &&
                      requestData.ERPAbsenceTypeCompanyId?.AllowHours == 0)
                  }
                >
                  <Text style={{ fontFamily: FONT_FAMILY_BOLD }}>
                    {requestData.ToTime != "" ? requestData.ToTime : "Сонгох"}
                  </Text>
                  <Icon
                    name="keyboard-arrow-down"
                    type="material-icons"
                    size={30}
                  />
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={showToTimePicker}
                  mode="time"
                  onConfirm={(time) => handleConfirm("time", "ToTime", time)}
                  onCancel={() => setShowToTimePicker(false)}
                  confirmTextIOS="Сонгох"
                  cancelTextIOS="Хаах"
                />
              </View>
            </View>
            {requestData.ERPAbsenceTypeCompanyId &&
            requestData.ERPAbsenceTypeCompanyId?.AllowHalfDay ? (
              <View style={styles.touchableSelectContainer}>
                <Text style={styles.title}>Эхлэх өдөр ажиллах хуваарь</Text>
                <TouchableOpacity
                  style={styles.touchableSelect}
                  onPress={() =>
                    setLookupData(
                      absenceTypes.parts,
                      "Name",
                      "ERPFromDatePartId",
                      false
                    )
                  }
                >
                  <Text style={{ fontFamily: FONT_FAMILY_BOLD }}>
                    {requestData.ERPFromDatePartId != ""
                      ? requestData.ERPFromDatePartId.Name
                      : "Сонгох"}
                  </Text>
                  <Icon
                    name="keyboard-arrow-down"
                    type="material-icons"
                    size={30}
                  />
                </TouchableOpacity>
              </View>
            ) : null}
            {requestData.ERPAbsenceTypeCompanyId &&
            requestData.ERPAbsenceTypeCompanyId?.AllowHalfDay ? (
              <View style={styles.touchableSelectContainer}>
                <Text style={styles.title}>Дуусах өдөр ажиллах хуваарь</Text>
                <TouchableOpacity
                  style={styles.touchableSelect}
                  onPress={() =>
                    setLookupData(
                      absenceTypes.parts,
                      "Name",
                      "ERPToDatePartId",
                      false
                    )
                  }
                >
                  <Text style={{ fontFamily: FONT_FAMILY_BOLD }}>
                    {requestData.ERPToDatePartId != ""
                      ? requestData.ERPToDatePartId.Name
                      : "Сонгох"}
                  </Text>
                  <Icon
                    name="keyboard-arrow-down"
                    type="material-icons"
                    size={30}
                  />
                </TouchableOpacity>
              </View>
            ) : null}
            {/* <View style={styles.touchableSelectContainer}>
              <Text style={styles.title}>Орлож ажиллах</Text>
              <TouchableOpacity
                style={styles.touchableSelect}
                onPress={() =>
                  setLookupData(state.last3Years, "name", "startDate", false)
                }
              >
                <Text style={{ fontFamily: FONT_FAMILY_BOLD }}>
                </Text>
                <Icon
                  name="keyboard-arrow-down"
                  type="material-icons"
                  size={30}
                />
              </TouchableOpacity>
            </View> */}
            <View style={styles.touchableSelectContainer}>
              <Text style={styles.title}>Тайлбар</Text>
              <TextInput
                multiline={true}
                numberOfLines={4}
                onChangeText={(text) =>
                  setRequestData((prevState) => ({
                    ...prevState,
                    Comment: text,
                  }))
                }
                value={requestData.Comment}
                style={styles.description}
                returnKeyType="done"
                onBlur={() => {
                  Keyboard.dismiss();
                }}
              />
            </View>
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
              title="Хадгалах"
              titleStyle={{
                fontSize: 16,
                fontFamily: FONT_FAMILY_BOLD,
              }}
              onPress={() => saveAbsence()}
            />
          </ScrollView>
        )}

        <BottomSheetRequest
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
          isColor={showColor}
        />
        <CustomDialog
          visible={visibleDialog}
          confirmFunction={() => {
            setVisibleDialog(false);
            props.navigation.goBack();
          }}
          declineFunction={() => {
            setVisibleDialog(false);
          }}
          text={dialogText}
          confirmBtnText="Буцах"
          DeclineBtnText=""
          type={dialogType}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SendRequestScreen;

const styles = StyleSheet.create({
  touchableSelectContainer: {
    marginTop: 10,
  },
  halfContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 10,
  },
  dataContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
  },
  touchableHalfSelectContainer: {
    width: "48%",
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
    marginTop: 5,
  },
  description: {
    height: 100,
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

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  NativeModules,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Icon, Button } from "@rneui/themed";
import HeaderUser from "../components/HeaderUser";
import BottomSheet from "../components/BottomSheet";
import {
  FONT_FAMILY_BOLD,
  MAIN_BORDER_RADIUS,
  MAIN_COLOR,
  MAIN_COLOR_GRAY,
} from "../constant";
import MainContext from "../contexts/MainContext";
import LoanInput from "../components/LoanInput";
import CustomDialog from "../components/CustomDialog";
import DateTimePickerModal from "react-native-modal-datetime-picker";
const { StatusBarManager } = NativeModules;

const EditUserDataScreen = (props) => {
  const state = useContext(MainContext);

  const [visibleDialog, setVisibleDialog] = useState(false); //Dialog харуулах
  const [dialogType, setDialogType] = useState("warning"); //Dialog харуулах төрөл
  const [dialogText, setDialogText] = useState(""); //Dialog -н текст

  const [data, setData] = useState(""); //BottomSheet рүү дамжуулах Дата
  const [uselessParam, setUselessParam] = useState(false); //BottomSheet -г дуудаж байгааг мэдэх гэж ашиглаж байгамоо
  const [fieldName, setFieldName] = useState(""); //Context -н аль утгыг OBJECT -с update хийхийг хадгалах
  const [displayName, setDisplayName] = useState(""); //LOOKUP -д харагдах утга (display value)

  const [showToDatePicker, setShowToDatePicker] = useState(false);

  const [profileData, setProfileData] = useState({
    department: "",
    team: "",
    office: "",
    firstName: "",
    lastName: "",
    position: "",
    birthDate: "",
    register: "",
    gender: "",
    mobileNumber: "",
    emergencyNumber: "",
    email: "",
  });

  const genderData = [
    { id: 1, name: "Эрэгтэй" },
    { id: 2, name: "Эмэгтэй" },
    { id: 0, name: "Бусад" },
  ];
  useEffect(() => {}, []);
  const setLookupData = (data, field, display) => {
    // console.log("refRBSheet", refRBSheet);
    setData(data); //Lookup -д харагдах дата
    setFieldName(field); //Context -н object -н update хийх key
    setDisplayName(display); //Lookup -д харагдах датаны текст талбар
    setUselessParam(!uselessParam);
  };

  const handleConfirm = (type, param, data) => {
    var month = data.getMonth() + 1;
    var day = data.getDate();

    //Тухайн сар 1 оронтой бол урд нь 0 залгах
    if (month.toString().length === 1) {
      month = `0${month}`;
    } else {
      month = month;
    }
    //Тухайн өдөр 1 оронтой бол урд нь 0 залгах
    if (day.toString().length === 1) {
      day = `0${day}`;
    } else {
      day = day;
    }
    if (type == "date") {
      setProfileData((prevState) => ({
        ...prevState,
        [param]: data.getFullYear() + "-" + month + "-" + day,
      }));
    }
    setShowToDatePicker(false);
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBarManager.HEIGHT : 0,
        backgroundColor: "#fff",
      }}
    >
      <HeaderUser />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          {
            paddingBottom: Platform.OS === "ios" ? 50 : 70,
          },
        ]}
        bounces={false}
      >
        <LoanInput label="Хэлтэс" value={profileData?.email} disabled />
        <LoanInput label="Баг" value={profileData.team} disabled />
        <LoanInput label="Оффис" value={profileData.office} disabled />
        <LoanInput
          label="Овог"
          value={profileData.firstName}
          onChangeText={(e) =>
            setProfileData((prevState) => ({
              ...prevState,
              firstName: e,
            }))
          }
        />
        <LoanInput
          label="Нэр"
          value={profileData.lastName}
          onChangeText={(e) =>
            setProfileData((prevState) => ({
              ...prevState,
              lastName: e,
            }))
          }
        />
        <LoanInput
          label="Албан тушаал"
          value={profileData.position}
          onChangeText={(e) =>
            setProfileData((prevState) => ({
              ...prevState,
              position: e,
            }))
          }
        />
        <View style={styles.touchableSelectContainer}>
          <Text style={styles.label}>Төрсөн огноо</Text>
          <TouchableOpacity
            style={styles.touchableSelect}
            onPress={() => setShowToDatePicker(true)}
          >
            <Text style={{ fontFamily: FONT_FAMILY_BOLD }}>
              {profileData.birthDate != "" ? profileData.birthDate : "Сонгох"}
            </Text>
            <Icon name="keyboard-arrow-down" type="material-icons" size={30} />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={showToDatePicker}
            mode="date"
            onConfirm={(date) => handleConfirm("date", "birthDate", date)}
            onCancel={() => setShowToDatePicker(false)}
            confirmTextIOS="Сонгох"
            cancelTextIOS="Хаах"
          />
        </View>
        <LoanInput
          label="Регистрийн дугаар"
          value={profileData.register}
          onChangeText={(e) =>
            setProfileData((prevState) => ({
              ...prevState,
              register: e,
            }))
          }
        />
        <View style={styles.touchableSelectContainer}>
          <Text style={styles.label}>Хүйс</Text>
          <TouchableOpacity
            style={styles.touchableSelect}
            onPress={() => {
              setLookupData(genderData, "gender", "name");
            }}
          >
            <Text style={{ fontFamily: FONT_FAMILY_BOLD }}>
              {profileData.gender != "" ? profileData.gender.name : "Сонгох"}
            </Text>
            <Icon name="keyboard-arrow-down" type="material-icons" size={30} />
          </TouchableOpacity>
        </View>
        <LoanInput
          label="Утас"
          value={profileData.mobileNumber}
          onChangeText={(e) =>
            setProfileData((prevState) => ({
              ...prevState,
              mobileNumber: e,
            }))
          }
          keyboardType="number-pad"
        />
        <LoanInput
          label="Шаардлагатай үед холбоо барих дугаар"
          value={profileData.emergencyNumber}
          onChangeText={(e) =>
            setProfileData((prevState) => ({
              ...prevState,
              emergencyNumber: e,
            }))
          }
        />
        <LoanInput
          label="И-мэйл"
          value={profileData.email}
          onChangeText={(e) =>
            setProfileData((prevState) => ({
              ...prevState,
              email: e,
            }))
          }
          keyboardType="email-address"
        />
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
          onPress={() => console.log("A")}
        />
      </ScrollView>
      <BottomSheet
        bodyText={data}
        dragDown={true}
        backClick={true}
        type="lookup"
        fieldName={fieldName}
        displayName={displayName}
        lookUpType="profile"
        handle={uselessParam}
        action={(e) =>
          setProfileData((prevState) => ({
            ...prevState,
            gender: e,
          }))
        }
      />
      <CustomDialog
        visible={visibleDialog}
        confirmFunction={() => {
          setVisibleDialog(false);
        }}
        declineFunction={() => {}}
        text={dialogText}
        confirmBtnText="Окей"
        DeclineBtnText=""
        type={dialogType}
      />
    </SafeAreaView>
  );
};

export default EditUserDataScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  label: {
    fontFamily: FONT_FAMILY_BOLD,
    padding: 5,
  },
  touchableSelectContainer: {
    marginBottom: 5,
  },
  touchableSelect: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: MAIN_COLOR_GRAY,
    height: 40,
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 10,
  },
});

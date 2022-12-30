import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  NativeModules,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useEffect, useContext, useRef } from "react";
import HeaderUser from "../components/HeaderUser";
import {
  FONT_FAMILY_BOLD,
  MAIN_COLOR,
  MAIN_COLOR_GREEN,
  MAIN_COLOR_RED,
  SERVER_URL,
} from "../constant";
import MainContext from "../contexts/MainContext";
const { StatusBarManager } = NativeModules;
import MapView, { Marker, Circle } from "react-native-maps";
import come from "../../assets/homeScreen/come.png";
import out from "../../assets/homeScreen/out.png";
import { Icon } from "@rneui/base";
import axios from "axios";
import CustomDialog from "../components/CustomDialog";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MapScreen = () => {
  const state = useContext(MainContext);
  const mapRef = useRef();
  const [position, setPosition] = useState({
    latitude: state.userData?.office?.latitude,
    longitude: state.userData?.office?.longitude,
    latitudeDelta: 0.0121,
    longitudeDelta: 0.0121,
  });

  const [visibleDialog, setVisibleDialog] = useState(false);
  const [dialogType, setDialogType] = useState("success");
  const [dialogText, setDialogText] = useState("");

  const trackAttendance = async (type) => {
    await axios({
      method: "post",
      url: `${SERVER_URL}/mobile/attendance/track`,
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
      data: {
        ERPEmployeeId: state.userId,
        GMCompanyId: state.companyId,
        Type: type,
        Break: "01:00:00",
        MobileUUID: state.uuid,
        latitude: state.location?.coords?.latitude,
        longitude: state.location?.coords?.longitude,
      },
    })
      .then((response) => {
        // console.log("track Attendance ======>", response.data);
        if (response.data?.Type == 0) {
          type == "IN"
            ? // Ажилдаа ирсэн цаг бүртгүүлэх үед харуулах
              state.setRegisteredInTime(
                response.data?.Extra?.TimeIn?.substr(11, 5)
              )
            : // Ажлаас явсан цаг бүртгүүлэх үед харуулах
              state.setRegisteredOutTime(
                response.data?.Extra?.TimeOut?.substr(11, 5)
              );
          setDialogType("success");
          setVisibleDialog(true);
          setDialogText(response.data.Msg);
        } else if (response.data?.Type == 1) {
          setDialogType("success");
          setVisibleDialog(true);
          setDialogText(response.data.Msg);
        } else if (response.data?.Type == 2) {
        }
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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBarManager.HEIGHT : 0,
        backgroundColor: "#fff",
      }}
    >
      <HeaderUser />
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={
          state.location
            ? {
                latitude: state.location?.coords?.latitude,
                longitude: state.location?.coords?.longitude,
                latitudeDelta: 0.0121,
                longitudeDelta: 0.0121,
              }
            : position
        }
        followsUserLocation={true}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        toolbarEnabled={false}
      >
        <Circle
          center={{
            latitude: parseFloat(state.userData?.office?.latitude),
            longitude: parseFloat(state.userData?.office?.longitude),
          }}
          radius={state.userData?.office?.radius}
          strokeWidth={1}
          strokeColor={MAIN_COLOR}
          fillColor={"rgba(255, 182, 41, 0.3)"}
        />
        <Marker
          title="Таны одоогийн байршил"
          coordinate={{
            latitude: state.location?.coords?.latitude,
            longitude: state.location?.coords?.longitude,
            latitudeDelta: 0.0121,
            longitudeDelta: 0.0121,
          }}
        />
        <Marker
          title={state.userData?.company?.Name}
          coordinate={{
            latitude: parseFloat(state.userData?.office?.latitude),
            longitude: parseFloat(state.userData?.office?.longitude),
          }}
        >
          <Image
            source={{ uri: state.userData?.company?.Image }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
            }}
            resizeMode="contain"
          />
        </Marker>
      </MapView>
      <View style={styles.floatButtons}>
        <TouchableOpacity
          onPress={() =>
            state.location
              ? mapRef.current.animateToRegion({
                  latitude: state.location?.coords?.latitude,
                  longitude: state.location?.coords?.longitude,
                  latitudeDelta: 0.0121,
                  longitudeDelta: 0.0121,
                })
              : null
          }
          style={styles.buttonContainer}
        >
          <Icon
            name="map-pin"
            type="feather"
            size={30}
            color="#fff"
            style={{
              backgroundColor: MAIN_COLOR,
              borderRadius: 50,
              padding: 5,
            }}
          />
          <Text style={[styles.btnText, { backgroundColor: MAIN_COLOR }]}>
            Байршил
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => trackAttendance("IN")}
          style={styles.buttonContainer}
        >
          <Image source={come} style={styles.inOutClockImg} />
          <Text style={[styles.btnText, { backgroundColor: MAIN_COLOR_GREEN }]}>
            Ирэх
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => trackAttendance("OUT")}
          style={styles.buttonContainer}
        >
          <Image source={out} style={styles.inOutClockImg} />
          <Text style={[styles.btnText, { backgroundColor: MAIN_COLOR_RED }]}>
            Явах
          </Text>
        </TouchableOpacity>
      </View>
      <CustomDialog
        visible={visibleDialog}
        confirmFunction={() => {
          setVisibleDialog(false);
        }}
        declineFunction={() => {
          setVisibleDialog(false);
        }}
        text={dialogText}
        confirmBtnText="Хаах"
        DeclineBtnText=""
        type={dialogType}
      />
    </SafeAreaView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  map: {
    marginBottom: 70,
    height: "100%",
  },
  floatButtons: {
    position: "absolute", //use absolute position to show button on top of the map
    top: "20%", //for center align
    left: 10,
    alignSelf: "flex-end", //for align to right
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  inOutClockImg: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  btnText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_BOLD,
    paddingVertical: 10,
    borderRadius: 20,
    overflow: "hidden",
    color: "#fff",
    width: 120,
    textAlign: "center",
  },
});

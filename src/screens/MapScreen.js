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
} from "../constant";
import MainContext from "../contexts/MainContext";
const { StatusBarManager } = NativeModules;
import MapView, { Marker, Circle } from "react-native-maps";
import come from "../../assets/homeScreen/come.png";
import out from "../../assets/homeScreen/out.png";
import { Icon } from "@rneui/base";
import * as Location from "expo-location";

const MapScreen = () => {
  const state = useContext(MainContext);
  const [location, setLocation] = useState(null); //Location мэдээлэл хадгалах
  const mapRef = useRef();
  const [position, setPosition] = useState({
    latitude: state.userData?.office?.latitude,
    longitude: state.userData?.office?.longitude,
    latitudeDelta: 0.0121,
    longitudeDelta: 0.0121,
  });

  useEffect(() => {
    (async () => {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    console.log("location", location);
    setPosition({
      latitude: location && location.coords ? location.coords.latitude : 0,
      longitude: location && location.coords ? location.coords.longitude : 0,
      latitudeDelta: 0.0121,
      longitudeDelta: 0.0121,
    });
  }, [location]);

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
        initialRegion={position}
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
        <Marker title="Таны одоогийн байршил" coordinate={position} />
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
          onPress={() => mapRef.current.animateToRegion(position)}
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
          onPress={() => console.log("COME")}
          style={styles.buttonContainer}
        >
          <Image source={come} style={styles.inOutClockImg} />
          <Text style={[styles.btnText, { backgroundColor: MAIN_COLOR_GREEN }]}>
            Ирэх
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => console.log("OUT")}
          style={styles.buttonContainer}
        >
          <Image source={out} style={styles.inOutClockImg} />
          <Text style={[styles.btnText, { backgroundColor: MAIN_COLOR_RED }]}>
            Явах
          </Text>
        </TouchableOpacity>
      </View>
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

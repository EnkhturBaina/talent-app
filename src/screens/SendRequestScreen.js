import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  NativeModules,
  Platform,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Icon, CheckBox, Button } from "@rneui/themed";
import HeaderUser from "../components/HeaderUser";
import BottomSheet from "../components/BottomSheet";
import {
  FONT_FAMILY_BOLD,
  FONT_FAMILY_LIGHT,
  MAIN_BORDER_RADIUS,
  MAIN_COLOR,
} from "../constant";
import MainContext from "../contexts/MainContext";
const { StatusBarManager } = NativeModules;

const SendRequestScreen = (props) => {
  const state = useContext(MainContext);
  const [data, setData] = useState(""); //BottomSheet рүү дамжуулах Дата
  const [uselessParam, setUselessParam] = useState(false); //BottomSheet -г дуудаж байгааг мэдэх гэж ашиглаж байгамоо
  const [displayName, setDisplayName] = useState(""); //LOOKUP -д харагдах утга (display value)
  const [fieldName, setFieldName] = useState(""); //Аль утгыг OBJECT -с update хийх

  const [requestData, setRequestData] = useState({
    requestType: "", //Хүсэлтийн төрөл
    startDate: "",
    endDate: "",
    description: "",
  });
  useEffect(() => {}, []);

  const setLookupData = (data, display, field) => {
    setData(data); //Lookup -д харагдах дата
    setDisplayName(display); //Lookup -д харагдах датаны текст талбар
    setFieldName(field);
    setUselessParam(!uselessParam);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBarManager.HEIGHT : 0,
      }}
    >
      <View>
        <Text>Хүсэлтийн төрөл сонгох</Text>
        <TouchableOpacity
          style={styles.touchableSelect}
          onPress={() => setLookupData(state.last3Years, "name", "requestType")}
        >
          <Text style={{ fontFamily: FONT_FAMILY_BOLD }}>
            {/* {requestData.name} */}
          </Text>
          <Icon name="keyboard-arrow-down" type="material-icons" size={30} />
        </TouchableOpacity>
      </View>
      <View>
        <Text>Эхлэх огноо</Text>
        <TouchableOpacity
          style={styles.touchableSelect}
          onPress={() => setLookupData(state.last3Years, "name", "requestType")}
        >
          <Text style={{ fontFamily: FONT_FAMILY_BOLD }}>
            {/* {requestData.name} */}
          </Text>
          <Icon name="keyboard-arrow-down" type="material-icons" size={30} />
        </TouchableOpacity>
      </View>
      <View>
        <Text>Дуусах огноо</Text>
        <TouchableOpacity
          style={styles.touchableSelect}
          onPress={() => setLookupData(state.last3Years, "name", "requestType")}
        >
          <Text style={{ fontFamily: FONT_FAMILY_BOLD }}>
            {/* {requestData.name} */}
          </Text>
          <Icon name="keyboard-arrow-down" type="material-icons" size={30} />
        </TouchableOpacity>
      </View>
      <View>
        <Text>Тайлбар</Text>
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
          style={{ height: 200, backgroundColor: "#fff" }}
        />
      </View>
      <BottomSheet
        bodyText={data}
        dragDown={true}
        backClick={true}
        displayName={displayName}
        handle={uselessParam}
        action={(e) => setSelectedDate(e)}
      />
    </SafeAreaView>
  );
};

export default SendRequestScreen;

const styles = StyleSheet.create({
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
  },
});

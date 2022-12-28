import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  NativeModules,
  Platform,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { Icon, Button } from "@rneui/themed";
import HeaderUser from "../components/HeaderUser";
import BottomSheet from "../components/BottomSheet";
import {
  FONT_FAMILY_BOLD,
  FONT_FAMILY_LIGHT,
  MAIN_BORDER_RADIUS,
  MAIN_COLOR,
  SERVER_URL,
} from "../constant";
import MainContext from "../contexts/MainContext";
const { StatusBarManager } = NativeModules;
import axios from "axios";
import Loader from "../components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

const RequestListScreen = (props) => {
  const state = useContext(MainContext);
  var date = new Date();
  const [selectedDate, setSelectedDate] = useState(state.last3Years[0]);
  const [data, setData] = useState(""); //BottomSheet рүү дамжуулах Дата
  const [uselessParam, setUselessParam] = useState(false); //BottomSheet -г дуудаж байгааг мэдэх гэж ашиглаж байгамоо
  const [displayName, setDisplayName] = useState(""); //LOOKUP -д харагдах утга (display value)
  const [absenceList, setAbsenceList] = useState(""); //Хүсэлтийн жагсаалт
  const [loadingAbsences, setLoadingAbsences] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  //Screen LOAD хийхэд дахин RENDER хийх
  const isFocused = useIsFocused();

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAbsences();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const setLookupData = (data, display) => {
    setData(data); //Lookup -д харагдах дата
    setDisplayName(display); //Lookup -д харагдах датаны текст талбар
    setUselessParam(!uselessParam);
  };

  useEffect(() => {
    getAbsences();
  }, [isFocused, selectedDate]);

  const getAbsences = async () => {
    console.log("getAbsences");
    setLoadingAbsences(true);
    await axios({
      method: "post",
      url: `${SERVER_URL}/mobile/absence/list`,
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
      data: {
        ERPEmployeeId: state.userId,
        StartRange: selectedDate.id + "-01",
        EndRange:
          selectedDate.id +
          "-" +
          new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
      },
    })
      .then((response) => {
        // console.log("get Absences======>", response.data.Extra);
        if (response.data?.Type == 0) {
          setAbsenceList(response.data.Extra);
        } else if (response.data?.Type == 1) {
          console.log("WARNING", response.data.Msg);
        } else if (response.data?.Type == 2) {
        }
        setLoadingAbsences(false);
      })
      .catch(function (error) {
        if (error.response?.status == "401") {
          AsyncStorage.removeItem("use_bio");
          state.setLoginErrorMsg("Холболт салсан байна. Та дахин нэвтэрнэ үү.");
          state.setIsLoading(false);
          state.logout();
        }
        // console.log("error", error.response?.status);
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
      <View style={styles.headerActions}>
        <Button
          containerStyle={{}}
          buttonStyle={{
            backgroundColor: MAIN_COLOR,
            borderRadius: MAIN_BORDER_RADIUS,
            height: 40,
          }}
          title="Хүсэлт илгээх"
          titleStyle={{
            fontSize: 16,
            fontFamily: FONT_FAMILY_BOLD,
          }}
          onPress={() => props.navigation.navigate("SendRequestScreen")}
        />
        <TouchableOpacity
          style={styles.yearMonthPicker}
          onPress={() => setLookupData(state.last3Years, "name")}
        >
          <Text style={{ fontFamily: FONT_FAMILY_BOLD }}>
            {selectedDate.name}
          </Text>
          <Icon name="keyboard-arrow-down" type="material-icons" size={30} />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: Platform.OS === "android" ? 80 : 50,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={"#fff"}
          />
        }
      >
        {loadingAbsences ? (
          <Loader />
        ) : !loadingAbsences && absenceList == "" ? (
          <Text style={styles.emptyText}>
            Ажилтны хүсэлтийн мэдээлэл олдсонгүй
          </Text>
        ) : (
          <>
            {absenceList.map((el, index) => {
              return (
                <View
                  style={[
                    styles.requestContainer,
                    {
                      borderColor: el.absence_type?.category?.CalendarColor,
                    },
                  ]}
                  key={index}
                >
                  <View style={styles.stack1}>
                    <Text style={styles.title} numberOfLines={2}>
                      {el.TypeTitle}
                    </Text>
                    <View>
                      <Text style={styles.comment}>Эхлэх: {el.FromDate}</Text>
                      <Text style={styles.comment}>Дуусах: {el.ToDate}</Text>
                    </View>
                  </View>
                  <View style={styles.stack2}>
                    <Text numberOfLines={4} style={styles.comment}>
                      {el.Comment}
                    </Text>
                  </View>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>

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

export default RequestListScreen;

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    alignItems: "center",
    paddingBottom: 10,
  },
  yearMonthPicker: {
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
  requestContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    flex: 1,
    height: 80,
    marginTop: 10,
    alignItems: "center",
    borderLeftWidth: 10,
    borderRightWidth: 10,
  },
  stack1: {
    padding: 5,
    backgroundColor: "#d9d9d9",
    width: "50%",
    height: "100%",
  },
  stack2: {
    padding: 5,
    width: "50%",
    backgroundColor: "#edebeb",
    height: "100%",
  },
  title: {
    fontFamily: FONT_FAMILY_BOLD,
    fontSize: 14,
  },
  comment: {
    fontFamily: FONT_FAMILY_LIGHT,
    fontSize: 12,
  },
  emptyText: {
    fontFamily: FONT_FAMILY_BOLD,
    textAlign: "center",
    marginTop: 10,
  },
});

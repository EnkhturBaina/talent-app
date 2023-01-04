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
import React, { useCallback, useContext, useEffect, useState } from "react";
import HeaderUser from "../components/HeaderUser";
import {
  FONT_FAMILY_BOLD,
  FONT_FAMILY_LIGHT,
  MAIN_BORDER_RADIUS,
  MAIN_COLOR,
  SERVER_URL,
} from "../constant";
const { StatusBarManager } = NativeModules;
import MainContext from "../contexts/MainContext";
import { Icon } from "@rneui/base";
import BottomSheet from "../components/BottomSheet";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Loader from "../components/Loader";
import Empty from "../components/Empty";

const TaskScreen = () => {
  const state = useContext(MainContext);
  var date = new Date();
  const [selectedDate, setSelectedDate] = useState(state.last3Years[0]);
  const [data, setData] = useState(""); //BottomSheet рүү дамжуулах Дата
  const [uselessParam, setUselessParam] = useState(false); //BottomSheet -г дуудаж байгааг мэдэх гэж ашиглаж байгамоо
  const [displayName, setDisplayName] = useState(""); //LOOKUP -д харагдах утга (display value)

  const [taskList, setTaskList] = useState("");
  const [loadingTask, setLoadingTask] = useState(true);

  const [refreshing, setRefreshing] = useState(false);
  //Screen LOAD хийхэд дахин RENDER хийх
  const isFocused = useIsFocused();

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getTaskList();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const setLookupData = (data, display) => {
    setData(data); //Lookup -д харагдах дата
    setDisplayName(display); //Lookup -д харагдах датаны текст талбар
    setUselessParam(!uselessParam);
  };

  const getTaskList = async () => {
    setLoadingTask(true);
    await axios({
      method: "post",
      url: `${SERVER_URL}/mobile/task/list`,
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
      data: {
        GMCompanyId: state.companyId,
        ERPEmployeeId: state.userId,
        MobileUUID: state.uuid,
      },
    })
      .then((response) => {
        // console.log("get TaskList======>", response.data.Extra);
        if (response.data?.Type == 0) {
          setTaskList(response.data.Extra);
        } else if (response.data?.Type == 1) {
          console.log("WARNING", response.data.Msg);
        } else if (response.data?.Type == 2) {
        }
        setLoadingTask(false);
      })
      .catch(function (error) {
        if (!error.status) {
          // network error
          state.logout();
          state.setIsLoading(false);
          state.setLoginErrorMsg("Холболт салсан байна.");
        } else if (error.response?.status == "401") {
          AsyncStorage.removeItem("use_bio");
          state.setLoginErrorMsg("Холболт салсан байна. Та дахин нэвтэрнэ үү.");
          state.setIsLoading(false);
          state.logout();
        }
      });
  };
  useEffect(() => {
    getTaskList();
  }, [isFocused, selectedDate]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBarManager.HEIGHT : 0,
        backgroundColor: "#fff",
      }}
    >
      <HeaderUser />
      {/* <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.yearMonthPicker}
          onPress={() => setLookupData(state.last3Years, "name")}
        >
          <Text style={{ fontFamily: FONT_FAMILY_BOLD }}>
            {selectedDate.name}
          </Text>
          <Icon name="keyboard-arrow-down" type="material-icons" size={30} />
        </TouchableOpacity>
      </View> */}
      {loadingTask ? (
        <Loader />
      ) : !loadingTask && taskList == "" ? (
        <Empty text="Ажилтанд хамааралтай даалгавар олдсонгүй" />
      ) : (
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
          {taskList.map((el, index) => {
            return (
              <TouchableOpacity
                style={[styles.taskContainer, { borderLeftColor: MAIN_COLOR }]}
                key={index}
              >
                <View style={styles.firstRow}>
                  <View style={styles.stack1}>
                    <Text style={styles.name}>Даалгавар</Text>
                  </View>
                  <View style={styles.stack2}>
                    <Text style={styles.date}>{el.created_at}</Text>
                  </View>
                </View>
                <View style={styles.secondRow}>
                  <Text numberOfLines={2} style={styles.description}>
                    {el.step.Name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
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

export default TaskScreen;

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginHorizontal: 20,
    alignItems: "center",
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
  taskContainer: {
    borderLeftWidth: 10,
    flexDirection: "column",
    flex: 1,
    marginTop: 10,
    marginHorizontal: 20,
    backgroundColor: "#edebeb",
    padding: 10,
  },
  firstRow: {
    flexDirection: "row",
  },
  stack1: {
    flexDirection: "row",
    alignItems: "center",
    width: "60%",
  },
  stack2: {
    width: "40%",
    alignItems: "flex-end",
  },
  secondRow: {
    flex: 1,
    marginTop: 10,
    justifyContent: "center",
  },
  name: {
    fontFamily: FONT_FAMILY_BOLD,
  },
  date: {
    fontFamily: FONT_FAMILY_LIGHT,
  },
  description: {
    fontFamily: FONT_FAMILY_LIGHT,
  },
});

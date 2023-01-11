import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  NativeModules,
  Platform,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Image,
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
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Loader from "../components/Loader";
import Empty from "../components/Empty";
import { SwipeListView } from "react-native-swipe-list-view";
import task from "../../assets/task.png";

const TaskScreen = () => {
  const state = useContext(MainContext);

  const [stateList, setStateList] = useState("");
  const [taskList, setTaskList] = useState("");
  const [loadingTask, setLoadingTask] = useState(true);

  const [refreshing, setRefreshing] = useState(false);
  //*****Screen LOAD хийхэд дахин RENDER хийх
  const isFocused = useIsFocused();

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getTaskList();
    wait(1000).then(() => setRefreshing(false));
  }, []);

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
        // console.log("getTaskList errrrrrrrrrrr=>", error);
        if (!error.status) {
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

  const getStateList = async () => {
    await axios({
      method: "post",
      url: `${SERVER_URL}/mobile/state/list`,
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
      data: {
        ERPEmployeeId: state.companyId,
        Type: "",
        MobileUUID: state.uuid,
      },
    })
      .then((response) => {
        // console.log("get TaskList======>", response.data.Extra);
        if (response.data?.Type == 0) {
          setStateList(response.data.Extra);
        } else if (response.data?.Type == 1) {
          console.log("WARNING", response.data.Msg);
        } else if (response.data?.Type == 2) {
        }
      })
      .catch(function (error) {
        if (!error.status) {
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
  const completeTask = async (erp_employee_id, task_id) => {
    var stateId = null;
    //*****Дуусгасан төлөвийн ID
    stateList.filter((obj) => {
      if (obj.Name == "Дуусгасан") {
        stateId = obj.id;
      }
    });
    await axios({
      method: "post",
      url: `${SERVER_URL}/mobile/task/state/change`,
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
      data: {
        ERPEmployeeId: erp_employee_id,
        ERPStateId: stateId,
        ERPSenderId: state.userId,
        id: task_id,
        MobileUUID: state.uuid,
      },
    })
      .then((response) => {
        // console.log("complete Task======>", response.data.Extra);
        if (response.data?.Type == 0) {
        } else if (response.data?.Type == 1) {
          console.log("WARNING", response.data.Msg);
        } else if (response.data?.Type == 2) {
        }
        getTaskList();
      })
      .catch(function (error) {
        if (!error.status) {
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
    getStateList();
    getTaskList();
  }, [isFocused]);

  const renderHiddenItem = (data) => {
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={() => completeTask(data.item.ERPEmployeeId, data.item.id)}
        >
          <Text style={styles.backTextWhite}>Дуусгах</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const renderItem = (el) => {
    return (
      <TouchableOpacity
        style={[styles.taskContainer, { borderLeftColor: MAIN_COLOR }]}
        activeOpacity={1}
      >
        <View style={styles.firstRow}>
          <View style={styles.stack1}>
            <Text style={styles.name}>Даалгавар</Text>
          </View>
          <View style={styles.stack2}>
            <Text style={styles.date}>{el.item.created_at}</Text>
          </View>
        </View>
        <View style={styles.secondRow}>
          <Text style={styles.description}>{el.item.step.Name}</Text>
          <Image
            source={task}
            style={{ width: 40, height: 40, resizeMode: "contain" }}
          />
        </View>
      </TouchableOpacity>
    );
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
      {loadingTask ? (
        <Loader />
      ) : !loadingTask && taskList == "" ? (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
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
          <Empty text="Ажилтанд хамааралтай даалгавар олдсонгүй" />
        </ScrollView>
      ) : (
        <SwipeListView
          data={taskList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={"#fff"}
            />
          }
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          disableRightSwipe
          rightOpenValue={-75}
          keyExtractor={(item) => item.id}
          style={{
            marginBottom: Platform.OS === "android" ? 80 : 50,
          }}
        />
      )}
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
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontFamily: FONT_FAMILY_BOLD,
  },
  date: {
    fontFamily: FONT_FAMILY_LIGHT,
  },
  description: {
    fontFamily: FONT_FAMILY_LIGHT,
    flex: 1,
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
    marginTop: 10,
    marginHorizontal: 20,
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: MAIN_COLOR,
    right: 0,
  },
  backTextWhite: {
    color: "#fff",
    fontFamily: FONT_FAMILY_LIGHT,
  },
});

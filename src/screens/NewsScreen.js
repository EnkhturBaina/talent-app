import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  NativeModules,
  Platform,
  TouchableOpacity,
  Image,
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
import avatar from "../../assets/avatar.jpg";
import axios from "axios";
import Empty from "../components/Empty";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../components/Loader";

const NewsScreen = () => {
  const state = useContext(MainContext);

  const [refreshing, setRefreshing] = useState(false);

  const [newsList, setNewsList] = useState(""); // Мэдээ, Мэдээлэл
  const [loadingNewsList, setLoadingNewsList] = useState(true);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getNewsList();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const getNewsList = async () => {
    setLoadingNewsList(true);
    await axios({
      method: "post",
      url: `${SERVER_URL}/mobile/notification/news`,
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
      data: {
        GMUserId: state.userId,
        MobileUUID: state.uuid,
      },
    })
      .then((response) => {
        // console.log("get NewsList======>", response.data.Extra);
        if (response.data?.Type == 0) {
          setNewsList(response.data.Extra);
        } else if (response.data?.Type == 1) {
          console.log("WARNING", response.data.Msg);
        } else if (response.data?.Type == 2) {
        }
        setLoadingNewsList(false);
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
    getNewsList();
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBarManager.HEIGHT : 0,
        backgroundColor: "#fff",
      }}
    >
      <HeaderUser />
      {loadingNewsList ? (
        <Loader />
      ) : !loadingNewsList && newsList == "" ? (
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
          <Empty text="Мэдээ, мэдээлэл системээс олдсонгүй" />
        </ScrollView>
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
          {newsList.map((el, index) => {
            return (
              <TouchableOpacity
                style={[styles.taskContainer, { borderLeftColor: MAIN_COLOR }]}
                key={index}
              >
                <View style={styles.firstRow}>
                  <View style={styles.stack1}>
                    <Image
                      source={{ uri: el.sender_employee?.Image }}
                      style={styles.userImg}
                    />
                    <Text style={styles.name}>
                      {el.sender_employee?.FirstName}
                    </Text>
                  </View>
                  <View style={styles.stack2}>
                    <Text style={styles.date}>{el.created_at}</Text>
                  </View>
                </View>
                <View style={styles.secondRow}>
                  <Text numberOfLines={2} style={styles.description}>
                    {el.Content}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default NewsScreen;

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
    width: "50%",
  },
  stack2: {
    width: "50%",
    alignItems: "flex-end",
  },
  secondRow: {
    flexDirection: "row",
    marginTop: 5,
  },
  userImg: {
    width: 40,
    height: 40,
    borderRadius: 50,
    // resizeMode: "contain",
    overflow: "hidden",
  },
  name: {
    fontFamily: FONT_FAMILY_BOLD,
    marginLeft: 10,
  },
  date: {
    fontFamily: FONT_FAMILY_LIGHT,
  },
  description: {
    fontFamily: FONT_FAMILY_LIGHT,
  },
});

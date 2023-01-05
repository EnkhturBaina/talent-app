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
import { Button } from "@rneui/themed";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../components/Loader";
import { SwipeListView } from "react-native-swipe-list-view";
import Empty from "../components/Empty";

const NotificationScreen = () => {
  const state = useContext(MainContext);
  const [refreshing, setRefreshing] = useState(false);

  const [notifList, setNotifList] = useState(""); // Мэдэгдлүүд
  const [loadingNotifList, setLoadingNotifList] = useState(true);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getNotifList();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const getNotifList = async () => {
    setLoadingNotifList(true);
    await axios({
      method: "post",
      url: `${SERVER_URL}/mobile/notification/list`,
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
      data: {
        GMUserId: state.userId,
        MobileUUID: state.uuid,
      },
    })
      .then((response) => {
        console.log("get NotifList======>", response.data.Extra);
        if (response.data?.Type == 0) {
          setNotifList(response.data.Extra);
        } else if (response.data?.Type == 1) {
          console.log("WARNING", response.data.Msg);
        } else if (response.data?.Type == 2) {
        }
        setLoadingNotifList(false);
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
  //Бүх мэдэгдэл уншсан болгох
  const readAllNotif = async () => {
    await axios({
      method: "post",
      url: `${SERVER_URL}/mobile/notification/read`,
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
      data: {
        GMUserId: state.userId,
        MobileUUID: state.uuid,
      },
    })
      .then((response) => {
        // console.log("get NotifList======>", response.data.Extra);
        if (response.data?.Type == 0) {
        } else if (response.data?.Type == 1) {
          console.log("WARNING", response.data.Msg);
        } else if (response.data?.Type == 2) {
        }
        getNotifList();
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

  //Тухайн 1 мэдэгдэл уншсан болгох
  const readNotif = async (notifId) => {
    await axios({
      method: "post",
      url: `${SERVER_URL}/mobile/notification/change`,
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
      data: {
        NotificationId: notifId,
        MobileUUID: state.uuid,
      },
    })
      .then((response) => {
        // console.log("get NotifList======>", response.data.Extra);
        if (response.data?.Type == 0) {
        } else if (response.data?.Type == 1) {
          console.log("WARNING", response.data.Msg);
        } else if (response.data?.Type == 2) {
        }
        getNotifList();
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
    getNotifList();
  }, []);

  const renderHiddenItem = (data) => {
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={() => readNotif(data.item.id)}
        >
          <Text style={styles.backTextWhite}>Унших</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const renderItem = (el) => {
    return (
      <TouchableOpacity
        style={[styles.notifContainer, { borderLeftColor: MAIN_COLOR }]}
        activeOpacity={1}
      >
        <View style={styles.firstRow}>
          <View style={styles.stack1}>
            <Text style={styles.name}>{el.item.Title}</Text>
          </View>
          <View style={styles.stack2}>
            <Text style={styles.date}>{el.item.created_at}</Text>
          </View>
        </View>
        <View style={styles.secondRow}>
          <Text numberOfLines={2} style={styles.description}>
            {el.item.Content}
          </Text>
        </View>
        <View style={styles.statusRow}>
          <Text
            numberOfLines={1}
            style={[
              styles.status,
              {
                backgroundColor: el.item?.state?.Color,
              },
            ]}
          >
            {el.item?.state?.Name}
          </Text>
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
      <View style={styles.headerActions}>
        <Button
          containerStyle={{}}
          buttonStyle={{
            backgroundColor: MAIN_COLOR,
            borderRadius: MAIN_BORDER_RADIUS,
            height: 40,
          }}
          title="Бүгдийг уншсан"
          titleStyle={{
            fontSize: 16,
            fontFamily: FONT_FAMILY_BOLD,
          }}
          // onPress={() => (notifList != "" ? readAllNotif() : null)}
        />
      </View>
      {loadingNotifList ? (
        <Loader />
      ) : !loadingNotifList && notifList == "" ? (
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
          <Empty text="Мэдэгдэл олдсонгүй" />
        </ScrollView>
      ) : (
        <SwipeListView
          data={notifList}
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
        />
      )}
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginHorizontal: 20,
    alignItems: "center",
  },
  notifContainer: {
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
    marginTop: 10,
    justifyContent: "center",
  },
  statusRow: {
    marginTop: 10,
    justifyContent: "center",
  },
  name: {
    fontFamily: FONT_FAMILY_BOLD,
  },
  date: {
    fontFamily: FONT_FAMILY_LIGHT,
    fontSize: 12,
  },
  description: {
    fontFamily: FONT_FAMILY_LIGHT,
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
  status: {
    alignSelf: "flex-start",
    borderRadius: 8,
    overflow: "hidden",
    fontFamily: FONT_FAMILY_LIGHT,
    paddingVertical: 3,
    paddingHorizontal: 5,
    color: "#fff",
  },
});

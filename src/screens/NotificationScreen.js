import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  NativeModules,
  Platform,
  TouchableOpacity,
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
import { Button } from "@rneui/themed";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../components/Loader";
import { SwipeListView } from "react-native-swipe-list-view";

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
        // console.log("get NotifList======>", response.data.Extra);
        if (response.data?.Type == 0) {
          setNotifList(response.data.Extra);
        } else if (response.data?.Type == 1) {
          console.log("WARNING", response.data.Msg);
        } else if (response.data?.Type == 2) {
        }
        setLoadingNotifList(false);
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
    getNotifList();
  }, []);

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => console.log("DELETE")}
      >
        <Text style={styles.backTextWhite}>READ</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBarManager.HEIGHT : 0,
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
          onPress={() => console.log("ALL READ")}
        />
      </View>
      {loadingNotifList ? (
        <Loader />
      ) : !loadingNotifList && notifList == "" ? (
        <Text style={styles.emptyText}>Мэдэгдэл олдсонгүй</Text>
      ) : (
        <SwipeListView
          data={notifList}
          closeOnRowOpen
          closeOnRowPress
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={"#fff"}
            />
          }
          renderItem={(el, rowMap) => (
            <TouchableOpacity
              style={[styles.notifContainer, { borderLeftColor: MAIN_COLOR }]}
              key={rowMap}
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
            </TouchableOpacity>
          )}
          renderHiddenItem={renderHiddenItem}
          disableRightSwipe
          rightOpenValue={-75}
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
    backgroundColor: "#d9d9d9",
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
    backgroundColor: "red",
    right: 0,
  },
});

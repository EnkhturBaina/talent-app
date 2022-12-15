import React, { useEffect, useState, useRef, useContext } from "react";
import { SERVER_URL } from "../constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Font from "expo-font";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";

const MainContext = React.createContext();

//Notification тохиргоо
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, //апп нээлттэй үед notification харагдах эсэх
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const MainStore = (props) => {
  const [userId, setUserId] = useState(""); //Нэвтэрсэн хэрэглэгчийн USER_ID
  const [companyId, setCompanyId] = useState(""); //Нэвтэрсэн хэрэглэгчийн COMPANY_ID
  const [uuid, setUuid] = useState(""); //UUID
  const [isLoggedIn, setIsLoggedIn] = useState(false); //Нэвтэрсэн эсэх
  const [isLoginSuccess, setIsLoginSuccess] = useState(false); //Амжилттай нэвтэрсэн эсэх
  const [remember, setRemember] = useState(false); // Сануулсан эсэх
  const [email, setEmail] = useState("lmunkhdemberel@gmail.com"); //Утасны дугаар
  const [token, setToken] = useState(""); //Хэрэглэгчийн TOKEN
  const [userData, setUserData] = useState(""); //Хэрэглэгчийн мэдээлэл
  const [isLoading, setIsLoading] = useState(true); //Апп ачааллах эсэх
  const [last3Years, setLast3Years] = useState(true); //Сүүлийн 3 жил-Сар (Хүсэлтэд ашиглах)

  const navigation = useNavigation();
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  async function registerForPushNotificationsAsync() {
    let token;
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync(); //Permission олгосон эсэх
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync(); //Permission олгоогүй бол дахин асуух
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data; //expo-notification TOKEN авах
    console.log(token);

    return token;
  }

  async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Original Title",
      body: "And here is the body!",
      data: { aaa: "goes here" },
      // badge: 7, //App -н Icon дээр харагдах тоо
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    ); //TOKEN хадгалах

    // Ирсэн Notification
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification); // Энд Notification -ы Object ирнэ
      });

    //Notification дээр дарах
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      //Notification -г ажилласны дараа чөлөөлж өгөх
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const getCustomFont = async () => {
    // Custom FONT унших
    await Font.loadAsync({
      "Nunito-Bold": require("../../assets/fonts/Nunito-Bold.ttf"),
      "Nunito-Light": require("../../assets/fonts/Nunito-Light.ttf"),
    });
    generateLast3Years();
    checkUserData();
  };

  const generateLast3Years = () => {
    // Сүүлийн 3 жилийг сартай GENERATE хийх
    var monthName = new Array(
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12"
    );
    var max = new Date().getFullYear();
    var min = max - 2;
    var years = [];
    var yearsWithMonths = [];
    var d = new Date();

    for (var i = max; i >= min; i--) {
      years.push(i);
    }
    years.map((el) => {
      for (var i = 0; i <= 11; i++) {
        yearsWithMonths.push({
          id: el + "-" + monthName[d.getMonth()],
          name: el + " - " + monthName[d.getMonth()] + " сар",
        });
        d.setMonth(d.getMonth() - 1);
      }
    });
    setLast3Years(yearsWithMonths);
  };
  useEffect(() => {
    getCustomFont();
  }, []);

  //Апп ажиллахад утасны local storage -с мэдээлэл шалгах
  const checkUserData = async () => {
    // AsyncStorage.removeItem("user");
    // AsyncStorage.removeItem("uuid");
    try {
      await AsyncStorage.getItem("user").then(async (user_value) => {
        if (user_value != null) {
          const JSONValue = JSON.parse(user_value);
          // console.log("USER VALUE ====>", JSONValue);
          setUserData(JSONValue.user);
          setToken(JSONValue.token);
          setUserId(JSONValue.user?.id);
          setCompanyId(JSONValue.user?.GMCompanyId);
          await AsyncStorage.getItem("uuid").then((uuid_value) => {
            // console.log("UUID VALUE ====>", uuid_value);
            setUuid(uuid_value);
            setIsLoading(false);
            setIsLoginSuccess(true);
            navigation.navigate("BiometricScreen");
          });
        } else {
          setIsLoginSuccess(false);
        }
      });
    } catch (e) {
      // error reading value
      console.log("checkUserData error======>", e);
    }
  };
  return (
    <MainContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        remember,
        setRemember,
        email,
        setEmail,
        isLoading,
        setIsLoading,
        token,
        setToken,
        userData,
        last3Years,
        isLoginSuccess,
        setIsLoginSuccess,
        userId,
        setUserId,
        companyId,
        setCompanyId,
        uuid,
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
};

export default MainContext;

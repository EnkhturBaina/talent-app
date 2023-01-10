import React, { useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from "expo-font";
import * as Notifications from "expo-notifications";
import axios from "axios";
import { SERVER_URL } from "../constant";

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
  const [email, setEmail] = useState("lmunkhdemberel@gmail.com"); //Утасны дугаар
  const [token, setToken] = useState(""); //Хэрэглэгчийн TOKEN
  const [userData, setUserData] = useState(""); //Хэрэглэгчийн мэдээлэл
  const [isLoading, setIsLoading] = useState(true); //Апп ачааллах эсэх
  const [last3Years, setLast3Years] = useState(""); //Сүүлийн 3 жил-Сар (Хүсэлтэд ашиглах)
  const [isUseBiometric, setIsUseBiometric] = useState(false); //Biometric тохиргоо хийх эсэх
  const [loginByBiometric, setLoginByBiometric] = useState(false); //Biometric тохиргоогоор нэвтрэх
  const [loginErrorMsg, setLoginErrorMsg] = useState(""); // Login хуудсанд харагдах алдааны MSG

  const [expoPushToken, setExpoPushToken] = useState(""); // EXPO PUSH NOTIFICATION TOKEN Хадгалах
  const [notification, setNotification] = useState(false); // Ирсэн Notification -ы мэдээлэл (OBJECT)

  const [attendanceList, setAttendanceList] = useState(""); //Ажилтны ирцийн мэдээлэл
  const [loadingAttendanceList, setLoadingAttendanceList] = useState(true); //Ажилтны ирцийн мэдээлэл татаж байхад LOADER харуулах

  const [location, setLocation] = useState(null); //Location мэдээлэл хадгалах

  const [registeredInTime, setRegisteredInTime] = useState(null); // Нүүр хуудсанд ажилтны тухайн өдөр ажилдаа ирсэн цаг харуулах (Ажилтны ирцийн мэдээлэл татахад тооцоолж харуулах)
  const [registeredOutTime, setRegisteredOutTime] = useState(null); // Нүүр хуудсанд ажилтны тухайн өдөр ажлаас явсан цаг харуулах (Ажилтны ирцийн мэдээлэл татахад тооцоолж харуулах)

  const [dateByName, setDateByName] = useState(null); //Тухайн өдрийн нэр
  const [inTime, setInTime] = useState(null); //Тухайн ажилтны тухайн өдөр ажилдаа ирэх цаг
  const [outTime, setOutTime] = useState(null); //Тухайн ажилтны тухайн өдөр ажлаас явах цаг

  const [isSwitchOn, setIsSwitchOn] = useState(false); //Ирц бүртгэл сануулах эсэх (Profile хуудаснаас тохируулах)
  const [checkSwitch, setCheckSwitch] = useState(false);

  var date = new Date();

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
    // console.log(token);

    return token;
  }

  const whatDay = () => {
    switch (date.getDay()) {
      case 1:
        return "Даваа";
      case 2:
        return "Мягмар";
      case 3:
        return "Лхагва";
      case 4:
        return "Пүрэв";
      case 5:
        return "Баасан";
      case 6:
        return "Бямба";
      case 7:
        return "Нум";
      default:
        return "-";
    }
  };

  const generateLast3Years = () => {
    var current_date = new Date();
    var max = new Date().getFullYear();
    var min = max - 2; // Одоогоос өмнөх 2 жил
    var date = `${min}-${current_date.getMonth()}`; // Одоогоос өмнөх 2 жилийн энэ өдөр
    var yearsWithMonths = []; //Жил-Сар түр хадгалах
    var month = 0;
    //set both start and end date to first date of the month
    const end_date = new Date(date.replace(" ", " ,1 "));
    const start_date = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    while (end_date <= start_date) {
      month = start_date.getMonth() + 1;
      if (month.toString().length === 1) {
        month = `0${month}`;
      } else {
        month = month;
      }
      yearsWithMonths.push({
        id: start_date.getFullYear() + "-" + month,
        name: start_date.getFullYear() + " - " + month + " сар",
      });
      start_date.setMonth(start_date.getMonth() - 1);
    }
    setLast3Years(yearsWithMonths);
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      // console.log("TOKEN", token);
      setExpoPushToken(token);
    }); //TOKEN хадгалах

    // Ирсэн Notification
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification); // Энд Notification -ы Object ирнэ
      });

    // Ирсэн Notification дээр дарах
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // console.log(response);
      });

    return () => {
      //Notification -г ажилласны дараа чөлөөлж өгөх (Заавал байна)
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

  useEffect(() => {
    getCustomFont();
  }, []);

  // Хэрэглэгчийн ирцын мэдээлэл авах
  const getEmployeeAttendanceList = async (selected_date, local_token) => {
    if (!selected_date) {
      selected_date = {
        id: date.getFullYear() + "-" + date.getMonth(),
        name: date.getFullYear() + " - " + date.getMonth() + " сар",
      };
    }
    try {
      setLoadingAttendanceList(true);

      await axios({
        method: "post",
        url: `${SERVER_URL}/mobile/attendance/list`,
        headers: {
          Authorization: `Bearer ${local_token}`,
        },
        data: {
          ERPEmployeeId: userId,
          StartRange: selected_date.id + "-01",
          EndRange:
            selected_date.id +
            "-" +
            new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
        },
      })
        .then((response) => {
          // console.log("getEmployee AttendanceList======>", response.data.Extra);
          if (response.data?.Type == 0) {
            response.data.Extra?.map((el) => {
              if (new Date().toISOString().slice(0, 10) == el.Date) {
                // Ажилдаа ирсэн цаг НҮҮР ХУУДСАНД харуулах
                setRegisteredInTime(
                  el.TimeIn != null && el.TimeIn?.substr(11, 5)
                );
                // Ажлаас явсан цаг НҮҮР ХУУДСАНД харуулах
                setRegisteredOutTime(
                  el.TimeOut != null && el.TimeOut?.substr(11, 5)
                );
              }
            });
            setAttendanceList(response.data.Extra);
            setIsLoggedIn(true);
            setIsLoading(false);
          } else if (response.data?.Type == 1) {
            console.log("WARNING", response.data.Msg);
          } else if (response.data?.Type == 2) {
          }
          setLoadingAttendanceList(false);
        })
        .catch(function (error) {
          if (!error.status) {
            // network error
            logout();
            setIsLoading(false);
            setLoginErrorMsg("Холболт салсан байна.");
          } else if (error.response?.status == "401") {
            AsyncStorage.removeItem("use_bio");
            setLoginErrorMsg("Холболт салсан байна. Та дахин нэвтэрнэ үү.");
            setIsLoading(false);
            logout();
          }
        });
    } catch (e) {
      // error reading value
      console.log("error======>", e);
    }
  };

  //Апп ажиллахад утасны local storage -с мэдээлэл шалгах
  const checkUserData = async () => {
    try {
      await AsyncStorage.getItem("uuid").then(async (uuid_value) => {
        setUuid(uuid_value);
        // console.log("UUID VALUE ====>", uuid_value);
        await AsyncStorage.getItem("use_bio").then(async (bio_value) => {
          // console.log("BIO VALUE ====>", bio_value);
          if (bio_value == "yes") {
            setIsUseBiometric(true);
            setLoginByBiometric(true);
          } else {
            getUserDataLocalStorage(uuid_value);
            setIsUseBiometric(false);
            setLoginByBiometric(false);
            // setIsLoading(false);
          }
        });
      });
    } catch (e) {
      // error reading value
      // console.log("checkUserData error======>", e);
    }
  };

  //Апп ажиллахад утасны local storage -с зөвхөн хэрэглэгчийн мэдээлэл авах
  const getUserDataLocalStorage = async (uuid_value) => {
    // setIsLoading(true);
    await AsyncStorage.getItem("user").then(async (user_value) => {
      // console.log("user_value VALUE ====>", user_value);
      if (user_value != null) {
        // Local Storage -д хэрэглэгчийн мэдээлэл байвал
        const JSONValue = JSON.parse(user_value);
        // console.log("USER VALUE ====>", JSONValue);
        setEmail(JSONValue.user?.PersonalEmail);
        setToken(JSONValue.token);
        setUserId(JSONValue.user?.id);
        setCompanyId(JSONValue.user?.GMCompanyId);
        setUserData(JSONValue.user);

        // setIsLoggedIn(true);
        // setIsLoading(false);
      } else {
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    getUserUUID(userData?.PersonalEmail, token, uuid);
    calcNotificationTime();
  }, [userData]);

  const logout = () => {
    setIsLoggedIn(false);
    setLoginErrorMsg("");
    // AsyncStorage.removeItem("user");
    // AsyncStorage.removeItem("use_bio");
    setLoginByBiometric(false);
  };

  // Тухайн хэрэглэгчийн утсанд хадгалагдсан UUID == DATABASE.UUID ижил байгаа эсэхийг шалгах
  const getUserUUID = async (local_email, local_token, uuid_value) => {
    await axios({
      method: "post",
      url: `${SERVER_URL}/mobile/token/list`,
      headers: {
        Authorization: `Bearer ${local_token}`,
      },
      data: {
        email: local_email,
      },
    })
      .then((response) => {
        // console.log("get UserUUID ======>", response.data.Extra);
        if (response.data?.Type == 0) {
          if (response.data?.Extra?.MobileUUID != uuid_value) {
            setIsLoggedIn(false);
            setIsLoading(false);
            AsyncStorage.removeItem("use_bio");
            setLoginErrorMsg("Холболт салсан байна. Та дахин нэвтэрнэ үү.");
            logout();
          } else {
            getEmployeeAttendanceList(last3Years[0], local_token);
          }
          // setAttendanceList(response.data.Extra);
        } else if (response.data?.Type == 1) {
          // console.log("WARNING", response.data.Msg);
        } else if (response.data?.Type == 2) {
        }
      })
      .catch(function (error) {
        if (!error.status) {
          // network error
          logout();
          setIsLoading(false);
          setLoginErrorMsg("Холболт салсан байна.");
        } else if (error.response?.status == "401") {
          AsyncStorage.removeItem("use_bio");
          setLoginErrorMsg("Холболт салсан байна. Та дахин нэвтэрнэ үү.");
          setIsLoading(false);
          logout();
        }
      });
  };

  const calcNotificationTime = async () => {
    await AsyncStorage.getItem("local_notif").then(async (value) => {
      if (value == "yes") {
        setIsSwitchOn(true);
      }
      setCheckSwitch(!checkSwitch);
    });

    //Тухайн өдрийн нэрийг харуулах
    setDateByName(whatDay());

    //Ажилтны тухайн өдрийн ажилдаа ирэх явах цагийг авах
    if (userData?.attendance_type?.details) {
      userData?.attendance_type?.details.map((el) => {
        if (el.WeekDay == date.getDay()) {
          setInTime(el.StartTime != null ? el.StartTime.substr(0, 5) : "00:00");
          setOutTime(el.EndTime != null ? el.EndTime.substr(0, 5) : "00:00");
        }
      });
    } else {
      //Ажиллахгүй өдөр 00:00 харуулах
      setInTime("00:00");
      setOutTime("00:00");
    }
  };

  const triggerNotifications = async () => {
    var notif_date_in = new Date();
    var notif_date_out = new Date();

    notif_date_in.setHours(
      parseInt(inTime?.substr(0, 2)),
      parseInt(inTime?.slice(-2)),
      0
    );
    notif_date_out.setHours(
      parseInt(outTime?.substr(0, 2)),
      parseInt(outTime?.slice(-2)),
      0
    );
    // console.log("notif_date_in BEFORE ============>", notif_date_in);
    // console.log("notif_date_out BEFORE ============>", notif_date_out);
    notif_date_in = new Date(notif_date_in - 1000 * (60 * 5));
    notif_date_out = new Date(notif_date_out - 1000 * (60 * 5));
    // console.log("notif_date_in", notif_date_in.getHours());
    // console.log("notif_date_out", notif_date_out.getMinutes());
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Мэдэгдэл 📬",
        body: "Ажилд ирэх цагаа бүртгүүлнэ үү.",
        data: {},
      },
      trigger: {
        hour: notif_date_in.getHours(),
        minute: notif_date_in.getMinutes(),
        repeats: true,
      },
    });
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Мэдэгдэл 📬",
        body: "Ажлаас явах цагаа бүртгүүлнэ үү.",
        data: {},
      },
      trigger: {
        hour: notif_date_out.getHours(),
        minute: notif_date_out.getMinutes(),
        repeats: true,
      },
    });
  };

  const localStorageCheckNotif = async () => {
    if (isSwitchOn) {
      triggerNotifications();
      await AsyncStorage.setItem("local_notif", "yes");
    } else {
      await AsyncStorage.setItem("local_notif", "no");
      Notifications.cancelAllScheduledNotificationsAsync();
    }
  };
  useEffect(() => {
    //CHECKED болсон үед ажиллах
    localStorageCheckNotif();
  }, [checkSwitch, isSwitchOn]);

  return (
    <MainContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        email,
        setEmail,
        isLoading,
        setIsLoading,
        token,
        setToken,
        userData,
        setUserData,
        last3Years,
        userId,
        setUserId,
        companyId,
        setCompanyId,
        uuid,
        logout,
        isUseBiometric,
        setIsUseBiometric,
        loginErrorMsg,
        setLoginErrorMsg,
        loginByBiometric,
        getUserDataLocalStorage,
        expoPushToken,
        location,
        setLocation,
        getEmployeeAttendanceList,
        attendanceList,
        loadingAttendanceList,
        registeredInTime,
        registeredOutTime,
        setRegisteredInTime,
        setRegisteredOutTime,
        isSwitchOn,
        setIsSwitchOn,
        dateByName,
        inTime,
        outTime,
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
};

export default MainContext;

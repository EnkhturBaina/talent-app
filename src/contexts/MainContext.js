import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Font from "expo-font";

const MainContext = React.createContext();

export const MainStore = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); //Нэвтэрсэн эсэх
  const [remember, setRemember] = useState(false); // Сануулсан эсэх
  const [mobileNumber, setMobileNumber] = useState(""); //Утасны дугаар
  const [token, setToken] = useState(""); //Хэрэглэгчийн TOKEN
  const [userData, setUserData] = useState(""); //Хэрэглэгчийн мэдээлэл
  const [isLoading, setIsLoading] = useState(true); //Апп ачааллах эсэх

  const getCustomFont = async () => {
    // Custom FONT унших
    await Font.loadAsync({
      "Nunito-Bold": require("../../assets/fonts/Nunito-Bold.ttf"),
      "Nunito-Light": require("../../assets/fonts/Nunito-Light.ttf"),
    });
    setIsLoading(false);
  };
  useEffect(() => {
    getCustomFont();
  }, []);

  const login = (mobile, password) => {
    //Нэвтрэх Fn
    console.log("mobile", mobile, "pass", password);
    setIsLoggedIn(true);
  };

  return (
    <MainContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        remember,
        setRemember,
        mobileNumber,
        setMobileNumber,
        login,
        isLoading,
        setIsLoading,
        token,
        setToken,
        userData,
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
};

export default MainContext;

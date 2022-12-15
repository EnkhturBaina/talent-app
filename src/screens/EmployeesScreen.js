import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  NativeModules,
  Platform,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Linking,
} from "react-native";
import React, { useRef, useState, useEffect, useContext } from "react";
import HeaderUser from "../components/HeaderUser";
import { Searchbar } from "react-native-paper";
import {
  CUSTOM_INDEX_EMPLOYEE,
  FONT_FAMILY_BOLD,
  FONT_FAMILY_LIGHT,
  MAIN_BORDER_RADIUS,
  MAIN_COLOR_GRAY,
  SERVER_URL,
} from "../constant";
import avatar from "../../assets/avatar.jpg";
const { StatusBarManager } = NativeModules;
import { AlphabetList } from "react-native-section-alphabet-list";
import RBSheet from "react-native-raw-bottom-sheet";
import call from "../../assets/call.png";
import sms from "../../assets/sms.png";
import email from "../../assets/email.png";
import axios from "axios";
import MainContext from "../contexts/MainContext";
import Loader from "../components/Loader";

const EmployeesScreen = (props) => {
  const state = useContext(MainContext);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const sheetRef = useRef(); //Bottomsheet
  const [filteredData, setFilteredData] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  const onChangeSearch = (query) => {
    setSearchVal(query);
    let newData = employees.filter((el) => {
      if (
        el.FullName?.toLowerCase()?.includes(query?.toLowerCase()) ||
        el.Position?.toLowerCase()?.includes(query?.toLowerCase())
      ) {
        return el;
      }
    });
    setFilteredData(newData);
  };

  const getCompanyEmployees = async () => {
    await axios({
      method: "post",
      url: `${SERVER_URL}/mobile/employee/list`,
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
      data: {
        GMCompanyId: state.companyId,
      },
    })
      .then((response) => {
        console.log("getCompanyEmployees======>", response.data.Extra);
        if (response.data?.Type == 0) {
          setEmployees(response.data.Extra);
          setFilteredData(response.data.Extra);
        } else if (response.data?.Type == 1) {
          console.log("WARNING", response.data.Msg);
        } else if (response.data?.Type == 2) {
        }
        setLoadingEmployees(false);
      })
      .catch(function (error) {
        console.log("error", error);
      });
  };

  useEffect(() => {
    getCompanyEmployees();
  }, []);

  if (loadingEmployees) {
    return <Loader />;
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBarManager.HEIGHT : 0,
        marginBottom: Dimensions.get("window").height - 370,
      }}
    >
      <HeaderUser />
      <View style={{ width: "100%", marginRight: "auto", marginLeft: "auto" }}>
        <Searchbar
          placeholder="Нэр, баг, хэлтэсээр хайх..."
          onChangeText={onChangeSearch}
          value={searchVal}
          inputStyle={{ backgroundColor: "#fff" }}
          style={styles.searchBar}
          elevation={0}
        />

        <View>
          <ScrollView
            nestedScrollEnabled={true}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingRight: 10,
              marginVertical: 15,
            }}
          >
            <TouchableOpacity
              onPress={() => sheetRef.current.open()}
              style={styles.favContainer}
            >
              <Image source={avatar} style={styles.favUserImg} />
              <Text numberOfLines={1}>Ana DavisssDavisssssss</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {filteredData && filteredData != "" ? (
          <AlphabetList
            data={searchVal ? filteredData : employees}
            index={CUSTOM_INDEX_EMPLOYEE}
            uncategorizedAtTop={true}
            style={styles.contactsContainer}
            indexContainerStyle={{
              width: 30,
              // position: "absolute",
              // right: -20,
            }}
            indexLetterContainerStyle={{
              width: "100%",
              height: 20,
              marginTop: 5,
            }}
            indexLetterStyle={{
              fontSize: 20,
              fontFamily: FONT_FAMILY_BOLD,
            }}
            renderCustomItem={(item) => (
              <TouchableOpacity
                style={styles.listItemContainer}
                onPress={() => {
                  setSelectedEmployee(item);
                  sheetRef.current.open();
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Image source={{ uri: item.Image }} style={styles.userImg} />
                  <View style={{ flexDirection: "column", marginLeft: 10 }}>
                    <Text style={styles.listItemLabel}>{item.value}</Text>
                    <Text style={styles.listItemDep}>{item.Position}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            renderCustomSectionHeader={(section) => (
              <View style={styles.sectionHeaderContainer}>
                <Text style={styles.sectionHeaderLabel}>{section.title}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.notFoundText}>Ажилтан олдсонгүй</Text>
        )}
      </View>
      <RBSheet
        ref={sheetRef}
        height={300}
        closeOnDragDown={true} //sheet -г доош чирж хаах
        closeOnPressMask={true} //sheet -н гадна дарж хаах
        customStyles={{
          container: {
            backgroundColor: "#fff",
            flexDirection: "column",
            borderTopEndRadius: 16,
            borderTopStartRadius: 16,
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
        }}
      >
        <View style={styles.bottomSheetContainer}>
          <View style={styles.lookupContainer}>
            <Image
              source={{ uri: selectedEmployee.Image }}
              style={styles.userImgBottomSheet}
            />
            <Text style={styles.userNameBottomSheet}>
              {selectedEmployee.FullName}
            </Text>
            <Text style={styles.listItemDep}>{selectedEmployee.Position}</Text>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <TouchableOpacity
                style={styles.listItemContainer}
                onPress={() =>
                  selectedEmployee.Mobile
                    ? Linking.openURL(`tel://${selectedEmployee.Mobile}`)
                    : null
                }
              >
                <Image source={call} style={styles.actionIcon} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.listItemContainer}
                onPress={() =>
                  selectedEmployee.Mobile
                    ? Linking.openURL(`sms://${selectedEmployee.Mobile}`)
                    : null
                }
              >
                <Image source={sms} style={styles.actionIcon} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.listItemContainer}
                onPress={() =>
                  selectedEmployee.email
                    ? Linking.openURL(`mailto://${selectedEmployee.email}`)
                    : null
                }
              >
                <Image source={email} style={styles.actionIcon} />
              </TouchableOpacity>
            </View>
            <Text style={styles.listItemDep}>{selectedEmployee.email}</Text>
            <Text style={styles.listItemDep}>{selectedEmployee.Mobile}</Text>
          </View>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default EmployeesScreen;

const styles = StyleSheet.create({
  favContainer: {
    alignItems: "center",
    marginHorizontal: 5,
    width: 80,
    maxWidth: 80,
  },
  notFoundText: {
    fontFamily: FONT_FAMILY_BOLD,
    textAlign: "center",
  },
  searchBar: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: MAIN_BORDER_RADIUS,
    height: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  favUserImg: {
    width: 60,
    height: 60,
    borderRadius: 50,
    // resizeMode: "contain",
    overflow: "hidden",
  },
  contactsContainer: {
    backgroundColor: "#fff",
    borderRadius: MAIN_BORDER_RADIUS,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  userImg: {
    width: 40,
    height: 40,
    borderRadius: 50,
    // resizeMode: "contain",
    overflow: "hidden",
  },
  userImgBottomSheet: {
    width: 80,
    height: 80,
    borderRadius: 50,
    // resizeMode: "contain",
    overflow: "hidden",
  },
  actionIcon: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: 15,
  },
  listItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: MAIN_BORDER_RADIUS,
    borderColor: MAIN_COLOR_GRAY,
    borderWidth: 1,
    // width: "90%",
    padding: 10,
    marginBottom: 5,
    marginHorizontal: 10,
  },
  listItemLabel: {
    fontFamily: FONT_FAMILY_BOLD,
    fontSize: 18,
  },
  userNameBottomSheet: {
    fontFamily: FONT_FAMILY_BOLD,
    fontSize: 18,
    textAlign: "center",
    marginTop: 15,
  },
  listItemDep: {
    fontFamily: FONT_FAMILY_LIGHT,
  },
  sectionHeaderContainer: {
    backgroundColor: MAIN_COLOR_GRAY,
    marginBottom: 5,
    // width: "90%",
  },
  sectionHeaderLabel: {
    fontFamily: FONT_FAMILY_BOLD,
    marginLeft: 10,
  },
  bottomSheetContainer: {
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  lookupContainer: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
    paddingBottom: Platform.OS == "ios" ? 30 : 25,
    alignItems: "center",
  },
});

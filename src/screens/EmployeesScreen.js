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
import React, { useRef, useState } from "react";
import { Button, Icon } from "@rneui/base";
import HeaderUser from "../components/HeaderUser";
import { Divider, Searchbar } from "react-native-paper";
import {
  CUSTOM_INDEX_EMPLOYEE,
  FONT_FAMILY_BOLD,
  FONT_FAMILY_LIGHT,
  MAIN_BORDER_RADIUS,
  MAIN_COLOR_GRAY,
  MAIN_COLOR,
} from "../constant";
import avatar from "../../assets/avatar.jpg";
const { StatusBarManager } = NativeModules;
import { AlphabetList } from "react-native-section-alphabet-list";
import RBSheet from "react-native-raw-bottom-sheet";
import call from "../../assets/call.png";
import sms from "../../assets/sms.png";

const EmployeesScreen = (props) => {
  const [searchVal, setSearchVal] = useState("");
  const sheetRef = useRef(); //Bottomsheet
  const [data, setData] = useState([
    { value: "Гillie-Mai Allen", key: "lCUTs2" },
    { value: "Цmmanuel Goldstein", key: "TXdL0c" },
    { value: "Дinston Smith", key: "zqsiEw" },
    { value: "Дilliam Blazkowicz", key: "psg2PM" },
    { value: "Дordon Comstock", key: "1K6I18" },
    { value: "Оhilip Ravelston", key: "NVHSkA" },
    { value: "Жosemary Waterlow", key: "SaHqyG" },
    { value: "Зulia Comstock", key: "iaT1Ex" },
    { value: "Рihai Maldonado", key: "OvMd5e" },
    { value: "Бurtaza Molina", key: "25zqAO" },
    { value: "Өeter Petigrew", key: "8cWuu3" },
  ]);
  const [filteredData, setFilteredData] = useState(data);
  var randoms = [...Array(20)].map(() => Math.floor(Math.random() * 9));
  const onChangeSearch = (query) => {
    setSearchVal(query);
    let newData = data.filter((el) => {
      if (
        el.value?.toLowerCase()?.includes(query?.toLowerCase()) ||
        el.key?.toLowerCase()?.includes(query?.toLowerCase())
      ) {
        return el;
      }
    });
    setFilteredData(newData);
  };
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
            {randoms.map((el, index) => {
              return (
                <TouchableOpacity
                  onPress={() => sheetRef.current.open()}
                  style={styles.favContainer}
                  key={index}
                >
                  <Image source={avatar} style={styles.favUserImg} />
                  <Text numberOfLines={1}>Ana DavisssDavisssssss</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        {filteredData && filteredData != "" ? (
          <AlphabetList
            data={searchVal ? filteredData : data}
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
              <View style={styles.listItemContainer}>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Image source={avatar} style={styles.userImg} />
                  <View style={{ flexDirection: "column", marginLeft: 10 }}>
                    <Text style={styles.listItemLabel}>{item.value}</Text>
                    <Text style={styles.listItemDep}>
                      Human resource director
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(`tel://94908577`)}
                  >
                    <Image source={call} style={styles.actionIcon} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(`sms://94908577`)}
                  >
                    <Image source={sms} style={styles.actionIcon} />
                  </TouchableOpacity>
                </View>
              </View>
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
        height={150}
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
          <View style={styles.lookupcontainer}>
            <View style={styles.listItemContainer}>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Image source={avatar} style={styles.userImg} />
                <View style={{ flexDirection: "column", marginLeft: 10 }}>
                  <Text style={styles.listItemLabel}>AAAA</Text>
                  <Text style={styles.listItemDep}>
                    Human resource director
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel://94908577`)}
                >
                  <Image source={call} style={styles.actionIcon} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`sms://94908577`)}
                >
                  <Image source={sms} style={styles.actionIcon} />
                </TouchableOpacity>
              </View>
            </View>
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
  lookupcontainer: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    paddingBottom: Platform.OS == "ios" ? 30 : 25,
  },
  bottomSheetBodyLookup: {
    fontFamily: FONT_FAMILY_BOLD,
    fontSize: 18,
    padding: 10,
    color: MAIN_COLOR,
  },
});

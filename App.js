import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import { MainStore } from "./src/contexts/MainContext";
import HomeScreenTabNavigation from "./src/navigations/HomeScreenTabNavigation";
import MainDrawerNavigation from "./src/navigations/MainDrawerNavigation";

export default function App() {
  return (
    <NavigationContainer>
      <MainStore>
        {/* <MainDrawerNavigation /> */}
        {/* Drawer нэмэгдэхээр бол дээрхи кодны коммент -г авах */}
        <HomeScreenTabNavigation />
      </MainStore>
    </NavigationContainer>
  );
}

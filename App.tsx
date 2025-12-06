import { NavigationContainer } from "@react-navigation/native";
import StackN from "./Navigation/StackN";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "./Utils/store_auth";
import TabNavigation from "./Navigation/TabNavigation";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Utils/firebase"; // tu config de firebase

export default function App() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return unsub;
  }, []);

  const [loaded] = useFonts({
    Montserrat: require("./assets/Fonts/Montserrat-VariableFont_wght.ttf"),
    Poppins_xbold: require("./assets/Fonts/Poppins-ExtraBold.ttf"),
    Poppins_bold: require("./assets/Fonts/Poppins-Bold.ttf"),
    Poppins_sbold: require("./assets/Fonts/Poppins-SemiBold.ttf"),
    Poppins_nbold: require("./assets/Fonts/Poppins-Medium.ttf"),
    Inter: require("./assets/Fonts/Inter-VariableFont_opsz,wght.ttf"),
  });

  if (!loaded) return null;

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {user ? <TabNavigation /> : <StackN />}
    </NavigationContainer>
  );
}

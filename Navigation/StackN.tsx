import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigation from "./TabNavigation";
import LoginScreen from "../Screens/LoginScreen";
import RegisterScreen from "../Screens/RegisterScreen";

export type RootStackParams = {
  Login: undefined;
  Register: undefined;
  Home: undefined; 
};

const Stack = createStackNavigator<RootStackParams>();

const StackN = () => {

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={TabNavigation}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackN;

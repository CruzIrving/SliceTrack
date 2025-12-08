import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ProfileScreen from "../Screens/Profile/ProfileScreen";
import OrderHistoryScreen from "../Screens/Profile/OrderHistoryScreen";
import DirectionsScreen from "../Screens/Profile/DirectionsScreen";
import PaymentScreen from "../Screens/Profile/PaymentScreen";
import SettingScreen from "../Screens/Profile/SettingScreen";

export type RootStackParamsP = {
  Profile: undefined;
  Orders: undefined;
  Directions: undefined;
  Payment: undefined;
  Setting: undefined; 
};

const Stack = createStackNavigator<RootStackParamsP>();

const StackN_Profile = () => {

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Orders"
        component={OrderHistoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Directions"
        component={DirectionsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Setting"
        component={SettingScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackN_Profile;

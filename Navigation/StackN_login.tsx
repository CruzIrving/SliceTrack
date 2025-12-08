import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../Screens/Login/LoginScreen";
import RegisterScreen from "../Screens/Login/RegisterScreen";

export type RootStackParams = {
  Login: undefined;
  Register: undefined;
  Home: undefined; 
};

const Stack = createStackNavigator<RootStackParams>();

const StackN_login = () => {

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
    </Stack.Navigator>
  );
};

export default StackN_login;

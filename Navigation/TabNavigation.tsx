import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../Screens/HomeScreen";
import MenuScreen from "../Screens/MenuScreen";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from '@expo/vector-icons/Feather';
import StackN_carrito from "./StackN_carrito";
import StackN_Profile from "./StackN_Profile";

const Tab = createBottomTabNavigator();

const TabNavigation = () => {

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#ff6b00",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Entypo name="home" size={24} color="orange" />
            ) : (
              <Entypo name="home" size={24} color="gray" />
            ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="restaurant" size={24} color="orange" />
            ) : (
              <Ionicons name="restaurant" size={24} color="gray" />
            ),
        }}
      />
      <Tab.Screen
        name="Carrito"
        component={StackN_carrito}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
             <Feather name="shopping-cart" size={24} c olor="orange" />
            ) : (
            <Feather name="shopping-cart" size={24} color="gray" />
            ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={StackN_Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <FontAwesome6 name="user" size={24} color="orange" />
            ) : (
              <FontAwesome6 name="user" size={24} color="gray" />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;

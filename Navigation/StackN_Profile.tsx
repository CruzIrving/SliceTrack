import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CarritoScreen from "../Screens/CarritoScreen";
import DetallesScreen from "../Screens/DetallesScreen";
import Ordersubmit from "../Screens/Ordersubmit";

export type RootStackParamsC = {
  Carro: undefined;
  Detalles: undefined;
  Order: undefined;
};

const Stack = createStackNavigator<RootStackParamsC>();

const StackN_carrito = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Carro"
        component={CarritoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Detalles"
        component={DetallesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Order"
        component={Ordersubmit}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackN_carrito;

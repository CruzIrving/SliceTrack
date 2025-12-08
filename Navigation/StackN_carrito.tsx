import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CarritoScreen from "../Screens/Cart/CarritoScreen";
import DetallesScreen from "../Screens/Cart/DetallesScreen";
import Ordersubmit from "../Screens/Cart/Ordersubmit";
import OrderTrackingScreen from "../Screens/Cart/OrderTrackingScreen";

export type RootStackParamsC = {
  Carro: undefined;
  Detalles: undefined;
  Order: undefined;
  OrderTracking: { orderId?: string };
};

const Stack = createStackNavigator<RootStackParamsC>();

const StackN_carrito = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Carro" component={CarritoScreen} />
      <Stack.Screen name="Detalles" component={DetallesScreen} />
      <Stack.Screen name="Order" component={Ordersubmit} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
    </Stack.Navigator>
  );
};

export default StackN_carrito;
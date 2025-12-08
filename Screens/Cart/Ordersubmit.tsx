import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCart } from "../../Components/CartContext";

type Order = {
  id: string;
  items: any[];
  address: string;
  createdAt: number;
  estimatedDelivery: number;
};

export default function OrdersubmitScreen() {
  const { cart, direcciones, selectedDireccionId, clearCart } = useCart();

  const [estimatedTime, setEstimatedTime] = useState<string>("");

  useEffect(() => {
    createOrder();
  }, []);

  const createOrder = async () => {
    const selectedAddress = direcciones.find(
      (d) => d.id === selectedDireccionId
    );

    const now = Date.now();
    const estimated = now + 30 * 60 * 1000; // +30 minutos

    const order: Order = {
      id: `order_${now}`,
      items: cart,
      address: selectedAddress?.fullAddress || "Dirección no encontrada",
      createdAt: now,
      estimatedDelivery: estimated,
    };

    // Guardar en AsyncStorage
    const stored = await AsyncStorage.getItem("@orders");
    const orders: Order[] = stored ? JSON.parse(stored) : [];
    orders.unshift(order);

    await AsyncStorage.setItem("@orders", JSON.stringify(orders));

    // Limpiar carrito
    clearCart();

    // Formato bonito para mostrar la hora
    const date = new Date(estimated);
    const formatted = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setEstimatedTime(formatted);
  };

  const selectedAddress = direcciones.find((d) => d.id === selectedDireccionId);

  return (
    <>
      <Text style={styles.title}> Pedido confirmado</Text>
      <View style={styles.container}>
        <Text style={styles.label}>Dirección de entrega</Text>
        <Text style={styles.value}>
          {selectedAddress?.fullAddress || "Sin dirección"}
        </Text>

        <Text style={styles.label}>Tiempo aproximado de llegada</Text>
        <Text style={styles.time}>🕒 {estimatedTime}</Text>

        <Text style={styles.info}>
          Podrás ver este y otros pedidos anteriores en tu historial de pedidos.
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#ff6b00",
    paddingTop: 70,
    paddingBottom: 30,
    backgroundColor: "#fff",
    textAlign: "center",
  },
  label: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  value: {
    fontSize: 18,
    fontWeight: "500",
  },
  time: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E7D32",
    marginTop: 4,
  },
  info: {
    marginTop: 30,
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
});

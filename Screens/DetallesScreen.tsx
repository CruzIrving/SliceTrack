import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useCart } from "../Components/CartContext"; // tu contexto del carrito
import DireccionCard from "../Components/Location";
import PagoCard from "../Components/PagoCard";

const DetallesPedidoScreen = ({ navigation }: any) => {
  const { cart } = useCart();
  const [pagoEditable, setPagoEditable] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const envio = 20;
  const total = subtotal + envio;

  return (
    <>
      <Text style={styles.title}>Detalles del pedido</Text>
      <ScrollView style={styles.container}>
        {/* Dirección */}
        <DireccionCard />

        {/* Método de pago */}
        <PagoCard />

        {/* Resumen del pedido */}
        <Text style={styles.label}>Resumen del carrito</Text>
        <View style={styles.card}>
          <View style={{ flex: 1 }}>
            {cart.map((item) => (
              <Text key={item.id} style={styles.infoText}>
                {item.name} ({item.size ?? "Tamaño no definido"}) x{" "}
                {item.quantity ?? 1} = ${item.price * (item.quantity || 1)}
              </Text> 
            ))}
            <Text
              style={[styles.infoText, { fontWeight: "900", marginTop: 5 }]}
            >
              Total: ${total}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.changeBtn}>Modificar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#ff6b00",
    paddingTop: 70,
    paddingBottom: 30,
    backgroundColor: "#fff",
    textAlign: "center",
  },
  container: { flex: 1, padding: 20 },
  label: {
    fontSize: 18,
    fontWeight: "900",
    color: "#000",
    marginBottom: 5,
    marginTop: 15,
  },
  card: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 3,
  },
  icon: { marginRight: 15 },
  infoText: { color: "#000", fontSize: 16, width: "70%" },
  changeBtn: { color: "#ff6b00", fontWeight: "bold" },
});

export default DetallesPedidoScreen;

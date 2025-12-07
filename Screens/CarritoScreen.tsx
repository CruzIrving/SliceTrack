import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useCart } from "../Components/CartContext";
import EvilIcons from "@expo/vector-icons/EvilIcons";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamsC } from "../Navigation/StackN_carrito";

type HomeNavProp = StackNavigationProp<RootStackParamsC, "Carro">;

type Props = {
  navigation: HomeNavProp;
};

const CarritoScreen = ({ navigation }: Props) => {
  const { cart, removeFromCart, clearCart } = useCart();

  const subtotal = cart.reduce((s, i) => s + i.price * (i.quantity || 1), 0);

  const envio = 20;
  const total = subtotal + envio;

  return (
    <>
      <Text style={styles.title}>Carrito</Text>
      <View style={styles.container}>
        {cart.length === 0 ? (
          <Text style={styles.empty}>Tu carrito está vacío</Text>
        ) : (
          <>
            <FlatList
              data={cart}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  {item.image ? (
                    <Image source={item.image} style={styles.img} />
                  ) : null}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.size}>{item.size}</Text>
                    <Text style={styles.price}>
                      {item.quantity ?? 1} x ${item.price}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                    <EvilIcons name="trash" size={56} color="orange" />
                  </TouchableOpacity>
                </View>
              )}
            />

            <View style={styles.footer}>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.subtotal}>Subtotal:</Text>
                <Text style={styles.subtotal}>${subtotal}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.subtotal}>Costo de envio:</Text>
                <Text style={styles.subtotal}>${envio}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.total}>Total:</Text>
                <Text style={styles.total}>${total}</Text>
              </View>
              {/* <TouchableOpacity onPress={clearCart} style={styles.clearBtn}>
                <Text style={{ color: "#fff" }}>Vaciar</Text>
                </TouchableOpacity> */}
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Detalles")}
              style={styles.confirmbtn}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: 900,
                  textAlign: "center",
                  fontSize: 20,
                }}
              >
                {" "}
                Confirmar pedido
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#ff6b00",
    paddingTop: 70,
    paddingBottom: 30,
    backgroundColor: "#Fff",
    textAlign: "center",
  },
  empty: { textAlign: "center", color: "#666" },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#fff",
    padding: 10,
    elevation: 5,
    borderRadius: 5,
  },
  img: {
    width: 90,
    height: 90,
    borderRadius: 8,
    resizeMode: "contain",
    marginRight: 10,
  },
  name: { fontWeight: "900", fontSize: 18 },
  price: { color: "#999", marginTop: 4, fontSize: 16, fontWeight: 900 },
  size:{ fontWeight: 900, color: "#999", fontSize: 18, },
  footer: {
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 5,
    padding: 20,
  },
  subtotal: {
    color: "#3e3e3eff",
    fontSize: 20,
  },
  total: { fontSize: 24, fontWeight: "900", color: "#ff6b00" },
  clearBtn: { backgroundColor: "#ff6b00", padding: 10, borderRadius: 8 },
  confirmbtn: { padding: 20, backgroundColor: "#ff6b00", width: "100%" },
});

export default CarritoScreen;

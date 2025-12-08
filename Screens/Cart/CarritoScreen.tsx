import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useCart } from "../../Components/CartContext";
import EvilIcons from "@expo/vector-icons/EvilIcons";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamsC } from "../../Navigation/StackN_carrito";

type HomeNavProp = StackNavigationProp<RootStackParamsC, "Carro">;

type Props = {
  navigation: HomeNavProp;
};

const CarritoScreen = ({ navigation }: Props) => {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const subtotal = cart.reduce((s, i) => s + i.price * (i.quantity || 1), 0);

  let envio = 0;

  switch (true) {
    case subtotal < 100:
      envio = 100;
      break;
    case subtotal < 200:
      envio = 50;
      break;
    case subtotal < 300:
      envio = 40;
      break;
    case subtotal < 400:
      envio = 20;
      break;
    case subtotal < 500:
      envio = 10;
      break;
    default:
      envio = 0;
  }

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

                    {/* Controles de cantidad */}
                    <View style={styles.qtyRow}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => decreaseQuantity(item.id)}
                      >
                        <Text style={styles.qtyText}>−</Text>
                      </TouchableOpacity>

                      <Text style={styles.qtyNumber}>
                        {item.quantity ?? 1}
                      </Text>

                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => increaseQuantity(item.id)}
                      >
                        <Text style={styles.qtyText}>+</Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.price}>${item.price}</Text>
                  </View>

                  <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                    <EvilIcons name="trash" size={56} color="orange" />
                  </TouchableOpacity>
                </View>
              )}
            />

            <View style={styles.footer}>
              <View style={styles.rowBetween}>
                <Text style={styles.subtotal}>Subtotal:</Text>
                <Text style={styles.subtotal}>${subtotal}</Text>
              </View>

              <View style={styles.rowBetween}>
                <Text style={styles.subtotal}>Costo de envío:</Text>
                <Text style={styles.subtotal}>${envio}</Text>
              </View>

              <View style={styles.rowBetween}>
                <Text style={styles.total}>Total:</Text>
                <Text style={styles.total}>${total}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("Detalles")}
              style={styles.confirmbtn}
            >
              <Text style={styles.confirmText}>Confirmar pedido</Text>
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
  price: { color: "#999", marginTop: 4, fontSize: 16, fontWeight: "900" },
  size: { fontWeight: "900", color: "#999", fontSize: 18 },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: "#ff6b00",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },
  qtyNumber: {
    marginHorizontal: 12,
    fontSize: 18,
    fontWeight: "900",
  },

  footer: {
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 5,
    padding: 20,
  },
  rowBetween: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  subtotal: {
    color: "#3e3e3eff",
    fontSize: 20,
  },
  total: { fontSize: 24, fontWeight: "900", color: "#ff6b00" },

  confirmbtn: {
    padding: 20,
    backgroundColor: "#ff6b00",
    width: "100%",
    marginTop: 10,
  },
  confirmText: {
    color: "#fff",
    fontWeight: "900",
    textAlign: "center",
    fontSize: 20,
  },
});

export default CarritoScreen;

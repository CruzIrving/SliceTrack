import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useCart } from "../Components/CartContext";

const CarritoScreen = () => {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((s, i) => s + i.price * (i.quantity || 1), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrito</Text>

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
                  <Text style={styles.price}>
                    {item.quantity ?? 1} x ${item.price}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeFromCart(item.id)}
                  style={styles.removeBtn}
                >
                  <Text style={{ color: "#fff" }}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <View style={styles.footer}>
            <Text style={styles.total}>Total: ${total}</Text>
            <TouchableOpacity onPress={clearCart} style={styles.clearBtn}>
              <Text style={{ color: "#fff" }}>Vaciar</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: "#f7f7f7" },
  title: { fontSize: 28, fontWeight: "700", color: "#ff6b00", marginBottom: 20 },
  empty: { textAlign: "center", color: "#666" },
  item: { flexDirection: "row", alignItems: "center", marginBottom: 12, backgroundColor: "#fff", padding: 10, borderRadius: 8 },
  img: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  name: { fontWeight: "700" },
  price: { color: "#666", marginTop: 4 },
  removeBtn: { backgroundColor: "#ff6b00", padding: 8, borderRadius: 6 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 },
  total: { fontSize: 18, fontWeight: "700" },
  clearBtn: { backgroundColor: "#ff6b00", padding: 10, borderRadius: 8 },
});

export default CarritoScreen;
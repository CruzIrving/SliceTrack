import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useCart } from "../../Components/CartContext";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { Ionicons } from "@expo/vector-icons";
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
    activeOrder, 
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
      {activeOrder && (
        <TouchableOpacity 
          style={styles.activeOrderButton}
          onPress={() => navigation.navigate("OrderTracking", { orderId: activeOrder.id })}
        >
          <Ionicons name="cube-outline" size={20} color="#fff" />
          <Text style={styles.activeOrderText}>Ver Pedido en Curso</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.container}>
        {cart.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Tu carrito está vacío</Text>
            <TouchableOpacity 
              style={styles.shopButton}
              onPress={() => {
                navigation.getParent()?.navigate("Menu");
              }}
            >
              <Text style={styles.shopButtonText}>Seguir Comprando</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <FlatList
              data={cart}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 10 }}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  {item.image ? (
                    <Image source={item.image} style={styles.img} />
                  ) : (
                    <View style={[styles.img, styles.placeholderImg]}>
                      <Ionicons name="pizza" size={30} color="#ccc" />
                    </View>
                  )}

                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    {item.size && <Text style={styles.size}>{item.size}</Text>}

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
                  </View>

                  <View style={styles.rightSection}>
                    <Text style={styles.price}>${item.price}</Text>
                    <TouchableOpacity 
                      style={styles.deleteBtn}
                      onPress={() => removeFromCart(item.id)}
                    >
                      <EvilIcons name="trash" size={28} color="#ff6b00" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />

            <View style={styles.footer}>
              <View style={styles.rowBetween}>
                <Text style={styles.subtotal}>Subtotal:</Text>
                <Text style={styles.subtotal}>${subtotal.toFixed(2)}</Text>
              </View>

              <View style={styles.rowBetween}>
                <Text style={styles.subtotal}>Costo de envío:</Text>
                <Text style={styles.subtotal}>${envio.toFixed(2)}</Text>
              </View>

              <View style={styles.separator} />

              <View style={styles.rowBetween}>
                <Text style={styles.total}>Total:</Text>
                <Text style={styles.total}>${total.toFixed(2)}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                if (cart.length === 0) {
                  Alert.alert("Carrito vacío", "Agrega productos al carrito primero");
                  return;
                }
                navigation.navigate("Detalles");
              }}
              style={styles.confirmbtn}
            >
              <Text style={styles.confirmText}>Continuar al Pago</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#ff6b00",
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: "#fff",
    textAlign: "center",
  },
  activeOrderButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff6b00",
    marginHorizontal: 20,
    marginBottom: 10,
    paddingVertical: 12,
    borderRadius: 10,
  },
  activeOrderText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 6,
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f7f7f7",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: { 
    fontSize: 18, 
    color: "#666", 
    marginTop: 15, 
    marginBottom: 25,
    textAlign: "center",
  },
  shopButton: {
    backgroundColor: "#ff6b00",
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 10,
  },
  shopButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: 8,
    resizeMode: "contain",
    marginRight: 12,
  },
  placeholderImg: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  name: { 
    fontWeight: "800", 
    fontSize: 16, 
    color: "#333",
    marginBottom: 2,
  },
  price: { 
    color: "#ff6b00", 
    fontSize: 16, 
    fontWeight: "800",
  },
  size: { 
    fontWeight: "500", 
    color: "#666", 
    fontSize: 14,
    marginBottom: 8,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: "#ff6b00",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
  qtyNumber: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    minWidth: 20,
    textAlign: "center",
  },
  rightSection: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 70,
  },
  deleteBtn: {
    padding: 5,
  },
  footer: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  subtotal: {
    color: "#555",
    fontSize: 16,
    fontWeight: "500",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 10,
  },
  total: { 
    fontSize: 20, 
    fontWeight: "900", 
    color: "#ff6b00",
  },
  confirmbtn: {
    padding: 16,
    backgroundColor: "#ff6b00",
    width: "100%",
    marginTop: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "800",
    textAlign: "center",
    fontSize: 18,
  },
});

export default CarritoScreen; 
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamsP } from "../../Navigation/StackN_Profile";
import Entypo from '@expo/vector-icons/Entypo'; 
import AntDesign from '@expo/vector-icons/AntDesign';

type NavigationProp = StackNavigationProp<RootStackParamsP, "Orders">;

type Props = {
  navigation: NavigationProp;
};

type Order = {
  id: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  address: string;
  createdAt: string; // ISO string
  status: "activo" | "entregado";
};

const OrderHistoryScreen = ({ navigation }: Props) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const loadOrders = async () => {
    const stored = await AsyncStorage.getItem("@orders");
    if (stored) {
      const parsed: Order[] = JSON.parse(stored).map((order: Order) => {
        const orderTime = new Date(order.createdAt).getTime();
        const now = Date.now();
        const status = now < orderTime + 30 * 60 * 1000 ? "activo" : "entregado";
        return { ...order, status };
      });
      parsed.sort((a, b) => (a.status === "activo" ? -1 : 1));
      setOrders(parsed);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const clearHistory = async () => {
    Alert.alert(
      "Eliminar historial",
      "¿Seguro que quieres eliminar todo el historial de pedidos?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("@orders");
            setOrders([]);
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <Text
        style={[
          styles.status,
          { color: item.status === "activo" ? "orange" : "green" },
        ]}
      >
        {item.status === "activo" ? "En camino" : "Entregado"}
      </Text>
      <Text style={styles.address}>Dirección: {item.address}</Text>
      <Text style={styles.time}>
        Pedido realizado: {new Date(item.createdAt).toLocaleTimeString()}
      </Text>
      <Text style={styles.time}>
        Hora de llegada Aprox: {new Date(item.createdAt + 30 * 60 * 1000).toLocaleTimeString()}
      </Text>
      <Text style={styles.itemsTitle}>Productos:</Text>
      {item.items.map((i) => (
        <Text key={i.id} style={styles.itemText}>
          {i.name} x{i.quantity} - ${i.price * i.quantity}
        </Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="caret-left" size={32} color="#ff6b00" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial</Text>
        <TouchableOpacity onPress={clearHistory}>
        <Entypo name="trash" size={32} color="#ff6b00" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>No tienes pedidos todavía</Text>
        }
        contentContainerStyle={{ padding: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 70,
    paddingBottom: 30,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  headerTitle: {
    color: "#ff6b00",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  orderCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 5, // actualizado
  },
  status: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  address: { fontSize: 14, marginBottom: 5 },
  time: { fontSize: 12, color: "#777", marginBottom: 5 },
  itemsTitle: { fontWeight: "bold", marginTop: 5 },
  itemText: { fontSize: 14, marginLeft: 10 },
  empty: { textAlign: "center", marginTop: 50, fontSize: 16, color: "#777" },
});

export default OrderHistoryScreen;

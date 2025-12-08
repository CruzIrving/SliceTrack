import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamsP } from "../../Navigation/StackN_Profile";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign"; 
import { useCart } from "../../Components/CartContext";// Ajusta la ruta si es distinta

type NavigationProp = StackNavigationProp<RootStackParamsP, "Payment">;

type Props = {
  navigation: NavigationProp;
};

const PaymentScreen = ({ navigation }: Props) => {
const { pagos, removePago, clearPagos } = useCart();

const deletePayment = (id: string) => {
  Alert.alert(
    "Eliminar método de pago",
    "¿Seguro que quieres eliminar esta tarjeta?",
    [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => removePago(id) },
    ]
  );
};

const clearPayments = () => {
  Alert.alert(
    "Eliminar métodos de pago",
    "¿Seguro que quieres eliminar todos los métodos de pago?",
    [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: clearPagos },
    ]
  );
};


  const renderItem = ({ item }: { item: typeof pagos[0] }) => {
    const maskedNumber = `**** **** **** ${item.cardNumber.slice(-4)}`;
    return (
      <View style={styles.card}>
        <View style={{ width: "90%" }}>
          <Text style={styles.cardHolder}>{item.cardHolder}</Text>
          <Text style={styles.cardNumber}>{maskedNumber}</Text>
          <Text style={styles.expiry}>Exp: {item.expiry}</Text>
        </View>
        <TouchableOpacity onPress={() => deletePayment(item.id)}>
          <Entypo name="trash" size={28} color="red" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="caret-left" size={32} color="#ff6b00" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Métodos de pago</Text>
        <TouchableOpacity onPress={clearPayments}>
          <Entypo name="trash" size={32} color="#ff6b00" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={pagos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>No tienes métodos de pago guardados</Text>
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
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 5,
  },
  cardHolder: { fontWeight: "bold", fontSize: 16, marginBottom: 3 },
  cardNumber: { fontSize: 14, marginBottom: 3 },
  expiry: { fontSize: 12, color: "#555" },
  empty: { textAlign: "center", marginTop: 50, fontSize: 16, color: "#777" },
});

export default PaymentScreen;

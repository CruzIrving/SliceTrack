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
import { useCart } from "../../Components/CartContext"; // Ajusta la ruta si es distinta

type NavigationProp = StackNavigationProp<RootStackParamsP, "Directions">;

type Props = {
  navigation: NavigationProp;
};

const DirectionsScreen = ({ navigation }: Props) => {
const { direcciones, removeDireccion, clearDirecciones } = useCart();

const deleteDirection = (id: string) => {
  Alert.alert(
    "Eliminar método de pago",
    "¿Seguro que quieres eliminar esta tarjeta?",
    [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => removeDireccion(id) },
    ]
  );
};

const clearDirections = () => {
  Alert.alert(
    "Eliminar métodos de pago",
    "¿Seguro que quieres eliminar todos los métodos de pago?",
    [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: clearDirecciones },
    ]
  );
};


  const renderItem = ({ item }: { item: typeof direcciones[0] }) => (
    <View style={styles.addressCard}>
      <View style={{ width: "90%" }}>
        <Text style={styles.label}>{item.label}</Text>
        <Text style={styles.fullAddress}>{item.fullAddress}</Text>
      </View>
      <TouchableOpacity onPress={() => deleteDirection(item.id)}>
        <Entypo name="trash" size={28} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="caret-left" size={32} color="#ff6b00" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Direcciones</Text>
        <TouchableOpacity onPress={clearDirections}>
          <Entypo name="trash" size={32} color="#ff6b00" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={direcciones}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>No tienes direcciones guardadas</Text>
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
  addressCard: {
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
  label: { fontWeight: "bold", fontSize: 16, marginBottom: 3 },
  fullAddress: { fontSize: 14, color: "#555" },
  empty: { textAlign: "center", marginTop: 50, fontSize: 16, color: "#777" },
});

export default DirectionsScreen;

// Location.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { useCart } from "./CartContext";
import { Ionicons } from "@expo/vector-icons";

const DireccionCard = () => {
  const { direccion, setDireccion } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerDireccion = async () => {
    setLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permiso denegado para acceder a la ubicación.");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const [placemark] = await Location.reverseGeocodeAsync(location.coords);

      const direccionCompleta = `${placemark.name ?? ""} ${
        placemark.street ?? ""
      }, ${placemark.city ?? ""}, ${placemark.region ?? ""}, ${
        placemark.postalCode ?? ""
      }`;

      setDireccion(direccionCompleta); // guardar en contexto y persistente
    } catch (e) {
      setError("No se pudo obtener la ubicación.");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Text style={styles.label}>Dirección</Text>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Ionicons
            name="location-outline"
            size={32}
            color="#ff6b00"
            style={styles.icon}
          />
          <Text style={styles.infoText}>
            {loading
              ? "Obteniendo ubicación..."
              : direccion ?? "No hay dirección asignada"}
          </Text>
          <TouchableOpacity
            onPress={obtenerDireccion}
            style={styles.buttonRight}
          >
            <Text style={styles.changeBtn}>
              {direccion ? "Modificar" : "Agregar"}
            </Text>
          </TouchableOpacity>
        </View>
        {error && <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 3,
  },
  label: {
    fontSize: 18,
    fontWeight: "900",
    color: "#000",
    marginBottom: 5,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: { marginRight: 10 },
  infoText: { flex: 1, color: "#000", fontSize: 16 },
  buttonRight: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  changeBtn: { color: "#ff6b00", fontWeight: "bold" },
});

export default DireccionCard;

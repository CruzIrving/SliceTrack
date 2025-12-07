// Location.tsx
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { useCart } from "./CartContext";
import { Ionicons } from "@expo/vector-icons";
import uuid from "react-native-uuid";

const DireccionCard = () => {
  const {
    direcciones,
    addDireccion,
    selectedDireccionId,
    setSelectedDireccion,
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showNewForm, setShowNewForm] = useState(direcciones.length === 0);
  const [label, setLabel] = useState("Casa");

  const direccionActual = useMemo(
    () => direcciones.find((d) => d.id === selectedDireccionId),
    [direcciones, selectedDireccionId]
  );

  const obtenerDireccionGPS = async () => {
    setLoading(true);
    setError(null);
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("Permiso de ubicación denegado.");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const [placemark] = await Location.reverseGeocodeAsync(
        location.coords
      );

      const direccionCompleta = `${placemark.name ?? ""} ${
        placemark.street ?? ""
      }, ${placemark.city ?? ""}, ${placemark.region ?? ""}, ${
        placemark.postalCode ?? ""
      }`;

      if (!direccionCompleta.trim()) {
        Alert.alert("Error", "No se pudo obtener la dirección.");
        return;
      }

      // guardar dirección
      await addDireccion({
        id: uuid.v4().toString(),
        label: label || "Dirección",
        fullAddress: direccionCompleta,
      });

      setShowNewForm(false);
      setModalVisible(false);
    } catch (e) {
      console.log(e);
      setError("No se pudo obtener la ubicación.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (id: string) => {
    await setSelectedDireccion(id);
    setModalVisible(false);
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
            {direccionActual
              ? `${direccionActual.label}: ${direccionActual.fullAddress}`
              : "No hay dirección seleccionada"}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
              setShowNewForm(direcciones.length === 0);
            }}
            style={styles.buttonRight}
          >
            <Text style={styles.changeBtn}>
              {direccionActual ? "Cambiar" : "Agregar"}
            </Text>
          </TouchableOpacity>
        </View>
        {error && <Text style={{ color: "red" }}>{error}</Text>}
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Direcciones</Text>

            {direcciones.length > 0 && !showNewForm ? (
              <>
                <FlatList
                  data={direcciones}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.addressRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: "700" }}>
                          {item.label}
                        </Text>
                        <Text style={{ color: "#666" }}>
                          {item.fullAddress}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleSelect(item.id)}
                        style={styles.selectBtn}
                      >
                        <Text style={{ color: "#fff" }}>
                          Seleccionar
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />

                <TouchableOpacity
                  onPress={() => setShowNewForm(true)}
                  style={styles.addNewBtn}
                >
                  <Text
                    style={{
                      color: "#ff6b00",
                      fontWeight: "700",
                      textAlign: "center",
                    }}
                  >
                    Agregar nueva dirección
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalSubtitle}>
                  Nueva dirección
                </Text>

                <TextInput
                  placeholder="Nombre (Casa, Trabajo...)"
                  value={label}
                  onChangeText={setLabel}
                  style={styles.input}
                />

                <TouchableOpacity
                  onPress={obtenerDireccionGPS}
                  style={styles.gpsBtn}
                  disabled={loading}
                >
                  <Text
                    style={{
                      color: "#fff",
                      textAlign: "center",
                      fontWeight: "700",
                    }}
                  >
                    {loading
                      ? "Obteniendo..."
                      : "Usar mi ubicación actual"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setShowNewForm(false);
                    if (direcciones.length === 0)
                      setModalVisible(false);
                  }}
                  style={{ marginTop: 10 }}
                >
                  <Text
                    style={{
                      color: "#ff6b00",
                      fontWeight: "700",
                      textAlign: "center",
                    }}
                  >
                    Cancelar
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {direcciones.length > 0 && !showNewForm && (
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ marginTop: 10 }}
              >
                <Text
                  style={{
                    color: "#ff6b00",
                    fontWeight: "700",
                    textAlign: "center",
                  }}
                >
                  Cerrar
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
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
  cardContent: { flexDirection: "row", alignItems: "center" },
  icon: { marginRight: 10 },
  infoText: { flex: 1, color: "#000", fontSize: 16 },
  buttonRight: { marginLeft: 10 },
  changeBtn: { color: "#ff6b00", fontWeight: "bold" },

  modalBg: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalCard: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 10,
    padding: 16,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },

  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  selectBtn: {
    backgroundColor: "#ff6b00",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addNewBtn: {
    marginTop: 12,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ff6b00",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  gpsBtn: {
    backgroundColor: "#ff6b00",
    padding: 12,
    borderRadius: 8,
  },
});

export default DireccionCard;

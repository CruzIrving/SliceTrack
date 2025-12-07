// Location.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Region } from "react-native-maps";
import { useCart } from "./CartContext";
import { Ionicons } from "@expo/vector-icons";

const DireccionCard = () => {
  const {
    direcciones,
    addDireccion,
    selectedDireccionId,
    setSelectedDireccion,
  } = useCart();

  const [showList, setShowList] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [label, setLabel] = useState("");
  const [markerCoord, setMarkerCoord] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [region, setRegion] = useState<Region | null>(null);

  const tempAddress = useRef<string>("");

  const selectedAddress = direcciones.find(
    (d) => d.id === selectedDireccionId
  );

  // --- Abrir lista ---
  const abrirSelector = () => {
    setError(null);
    setShowList(true);
  };

  // --- Abrir mapa ---
  const abrirMapa = async () => {
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
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setMarkerCoord(coords);
      setRegion({
        ...coords,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      setShowMap(true);
    } catch (e) {
      setError("No se pudo obtener la ubicación.");
    } finally {
      setLoading(false);
    }
  };

  // --- Confirmar pin ---
  const confirmarPin = async () => {
    if (!markerCoord) return;

    try {
      const [placemark] =
        await Location.reverseGeocodeAsync(markerCoord);

      tempAddress.current = `${placemark.name ?? ""} ${
        placemark.street ?? ""
      }, ${placemark.city ?? ""}, ${placemark.region ?? ""}, ${
        placemark.postalCode ?? ""
      }`;

      setShowMap(false);
      setShowForm(true);
    } catch {
      setError("No se pudo leer la dirección.");
    }
  };

  // --- Guardar ---
  const guardarDireccion = async () => {
    if (!label.trim()) {
      setError("Ponle nombre a la dirección 😅");
      return;
    }

    const nueva = {
      id: Date.now().toString(),
      label,
      fullAddress: tempAddress.current,
    };

    await addDireccion(nueva);
    await setSelectedDireccion(nueva.id);

    setLabel("");
    setShowForm(false);
    setShowList(false);
  };

  return (
    <>
      <Text style={styles.label}>Dirección</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons
            name="location-outline"
            size={32}
            color="#ff6b00"
            style={styles.icon}
          />

          <Text style={styles.infoText}>
            {selectedAddress
              ? `${selectedAddress.label}: ${selectedAddress.fullAddress}`
              : "No hay dirección seleccionada"}
          </Text>

          <TouchableOpacity onPress={abrirSelector}>
            <Text style={styles.changeBtn}>
              {direcciones.length > 0 ? "Cambiar" : "Agregar"}
            </Text>
          </TouchableOpacity>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}
      </View>

      {/* MODAL - lista de direcciones */}
      <Modal visible={showList} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            Tus direcciones
          </Text>

          <FlatList
            data={direcciones}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.addressItem,
                  item.id === selectedDireccionId &&
                    styles.selectedItem,
                ]}
                onPress={async () => {
                  await setSelectedDireccion(item.id);
                  setShowList(false);
                }}
              >
                <Text style={styles.addressLabel}>
                  {item.label}
                </Text>
                <Text style={styles.addressText}>
                  {item.fullAddress}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={{ textAlign: "center" }}>
                No hay direcciones guardadas
              </Text>
            }
          />

          <TouchableOpacity
            style={styles.addNewBtn}
            onPress={() => {
              setShowList(false);
              abrirMapa();
            }}
          >
            <Text style={styles.addNewText}>
              + Agregar nueva
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => setShowList(false)}
          >
            <Text style={styles.cancelText}>
              Cerrar
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* MODAL MAPA */}
      <Modal visible={showMap} animationType="slide">
        <View style={styles.modalContainer}>
          {!region || !markerCoord ? (
            <ActivityIndicator color="#ff6b00" />
          ) : (
            <>
              <MapView
                style={styles.map}
                region={region}
                onPress={(e) =>
                  setMarkerCoord(e.nativeEvent.coordinate)
                }
              >
                <Marker
                  draggable
                  coordinate={markerCoord}
                  onDragEnd={(e) =>
                    setMarkerCoord(e.nativeEvent.coordinate)
                  }
                />
              </MapView>

              <View style={styles.mapFooter}>
                <TouchableOpacity
                  onPress={() => setShowMap(false)}
                  style={styles.cancelBtn}
                >
                  <Text style={styles.cancelText}>
                    Cancelar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={confirmarPin}
                  style={styles.confirmBtn}
                >
                  <Text style={styles.confirmText}>
                    Confirmar
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>

      {/* MODAL FORM */}
      <Modal visible={showForm} transparent>
        <View style={styles.formOverlay}>
          <View style={styles.formCard}>
            <Text style={styles.modalTitle}>
              Guarda tu dirección
            </Text>

            <TextInput
              placeholder="Nombre (Casa, Trabajo...)"
              style={styles.input}
              value={label}
              onChangeText={setLabel}
            />

            <Text style={styles.previewText}>
              {tempAddress.current}
            </Text>

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={guardarDireccion}
            >
              <Text style={styles.confirmText}>
                Guardar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowForm(false)}
            >
              <Text style={styles.cancelText}>
                Cancelar
              </Text>
            </TouchableOpacity>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: { marginRight: 10 },
  infoText: { flex: 1, color: "#000", fontSize: 16 },

  changeBtn: { color: "#ff6b00", fontWeight: "bold" },
  error: { color: "red", marginTop: 5 },

  modalContainer: { flex: 1, padding: 20 },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 10,
    color: "#000",
  },

  addressItem: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedItem: { borderWidth: 2, borderColor: "#ff6b00" },
  addressLabel: { fontWeight: "bold", color: "#000" },
  addressText: { color: "#333" },

  addNewBtn: {
    marginTop: 10,
    padding: 15,
    alignItems: "center",
  },
  addNewText: {
    color: "#ff6b00",
    fontWeight: "bold",
    fontSize: 16,
  },

  map: { flex: 1 },

  mapFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },

  cancelBtn: {
    alignItems: "center",
    padding: 12,
  },
  cancelText: { color: "#000", fontWeight: "bold" },

  confirmBtn: {
    padding: 12,
    backgroundColor: "#ff6b00",
    borderRadius: 8,
  },
  confirmText: {
    color: "#fff",
    fontWeight: "bold",
  },

  formOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  formCard: {
    backgroundColor: "#fff",
    padding: 20,
    width: "90%",
    borderRadius: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  previewText: { color: "#000", marginBottom: 10 },
});

export default DireccionCard;

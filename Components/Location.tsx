import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Region } from "react-native-maps";
import { useCart, UserAddress } from "./CartContext";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  onValidChange: (valid: boolean) => void;
}

const DireccionCard = ({ onValidChange }: Props) => {
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
    longitude: number 
  } | null>(null);
  
  const [region, setRegion] = useState<Region | null>(null);

  const tempAddress = useRef<string>("");
  const tempCoords = useRef<{latitude: number; longitude: number} | null>(null);

  const selectedAddress = direcciones.find((d) => d.id === selectedDireccionId);

  useEffect(() => {
    onValidChange(!!selectedDireccionId);
  }, [selectedDireccionId]);
  const ZACUALTIPAN_CENTER = {
    latitude: 20.6490,
    longitude: -98.6520
  };

  const abrirSelector = () => {
    setError(null);
    setShowList(true);
  };
  const abrirMapa = async () => {
    setLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permiso de ubicación denegado.");
        setLoading(false);
        return;
      }
      const coords = ZACUALTIPAN_CENTER;
      const randomVariation = {
        latitude: coords.latitude + (Math.random() - 0.5) * 0.01,
        longitude: coords.longitude + (Math.random() - 0.5) * 0.01
      };

      setMarkerCoord(randomVariation);
      tempCoords.current = randomVariation;
      
      setRegion({ 
        ...randomVariation, 
        latitudeDelta: 0.02, 
        longitudeDelta: 0.02 
      });

      setShowMap(true);
    } catch (e) {
      setError("No se pudo abrir el mapa.");
    } finally {
      setLoading(false);
    }
  };
  const confirmarPin = async () => {
    if (!markerCoord) return;

    try {
      const [placemark] = await Location.reverseGeocodeAsync(markerCoord);
      
      const addressParts = [];
      if (placemark.name) addressParts.push(placemark.name);
      if (placemark.street) addressParts.push(placemark.street);
      if (placemark.city) addressParts.push(placemark.city);
      if (placemark.region) addressParts.push(placemark.region);
      if (placemark.postalCode) addressParts.push(placemark.postalCode);
      
      tempAddress.current = addressParts.join(", ") || "Zacualtipán, Hidalgo";
      tempCoords.current = markerCoord;

      setShowMap(false);
      setShowForm(true);
    } catch {
      setError("No se pudo obtener la dirección.");
    }
  };

  const guardarDireccion = async () => {
    if (!label.trim()) {
      setError("Ponle nombre a la dirección");
      return;
    }

    if (!tempCoords.current) {
      setError("No hay coordenadas guardadas.");
      return;
    }

    const nueva: UserAddress = {
      id: Date.now().toString(),
      label,
      fullAddress: tempAddress.current,
      latitude: tempCoords.current.latitude,
      longitude: tempCoords.current.longitude,
    };

    await addDireccion(nueva);
    await setSelectedDireccion(nueva.id);

    setLabel("");
    tempCoords.current = null;
    setShowForm(false);
    setShowList(false);
    
    Alert.alert(" Dirección guardada", "Tu ubicación ha sido guardada.");
  };
  const handleMapPress = (e: any) => {
    const newCoords = e.nativeEvent.coordinate;
    const maxDistance = 0.015;
    const latDiff = newCoords.latitude - ZACUALTIPAN_CENTER.latitude;
    const lngDiff = newCoords.longitude - ZACUALTIPAN_CENTER.longitude;
    
    if (Math.abs(latDiff) > maxDistance || Math.abs(lngDiff) > maxDistance) {
      const adjustedLat = ZACUALTIPAN_CENTER.latitude + 
        (Math.sign(latDiff) * maxDistance * 0.9);
      const adjustedLng = ZACUALTIPAN_CENTER.longitude + 
        (Math.sign(lngDiff) * maxDistance * 0.9);
      
      setMarkerCoord({
        latitude: adjustedLat,
        longitude: adjustedLng
      });
      tempCoords.current = { latitude: adjustedLat, longitude: adjustedLng };
    } else {
      setMarkerCoord(newCoords);
      tempCoords.current = newCoords;
    }
  };

  return (
    <>
      <Text style={styles.label}>Dirección</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="location-outline" size={32} color="#ff6b00" style={styles.icon} />
          <View style={styles.addressInfo}>
            <Text style={styles.infoText}>
              {selectedAddress
                ? selectedAddress.label
                : "No hay dirección seleccionada"}
            </Text>
            {selectedAddress && (
              <Text style={styles.addressDetail}>
                {selectedAddress.fullAddress}
                {selectedAddress.latitude && (
                  <Text style={styles.coordsText}> • 📍 Ubicación guardada</Text>
                )}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={abrirSelector}>
            <Text style={styles.changeBtn}>
              {direcciones.length > 0 ? "Cambiar" : "Agregar"}
            </Text>
          </TouchableOpacity>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}
      </View>

      <Modal visible={showList} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Tus Direcciones</Text>
            <TouchableOpacity onPress={() => setShowList(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={direcciones}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.addressItem, 
                  item.id === selectedDireccionId && styles.selectedItem
                ]}
                onPress={async () => {
                  await setSelectedDireccion(item.id);
                  setShowList(false);
                }}
              >
                <View style={styles.addressItemContent}>
                  <Ionicons 
                    name="location" 
                    size={20} 
                    color={item.id === selectedDireccionId ? "#ff6b00" : "#666"} 
                  />
                  <View style={styles.addressTexts}>
                    <Text style={styles.addressLabel}>{item.label}</Text>
                    <Text style={styles.addressText} numberOfLines={2}>
                      {item.fullAddress}
                    </Text>
                    {item.latitude && item.longitude && (
                      <Text style={styles.coordsText}>
                        📍 Coordenadas guardadas
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="location-outline" size={60} color="#ccc" />
                <Text style={styles.emptyText}>No hay direcciones guardadas</Text>
              </View>
            }
          />

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.addNewBtn}
              onPress={() => {
                setShowList(false);
                setTimeout(() => abrirMapa(), 300);
              }}
            >
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.addNewText}>Agregar Nueva Dirección</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelBtn} 
              onPress={() => setShowList(false)}
            >
              <Text style={styles.cancelText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showMap} animationType="slide">
        <View style={styles.mapModalContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ff6b00" />
              <Text style={styles.loadingText}>Cargando mapa de Zacualtipán...</Text>
            </View>
          ) : (
            <>
              <View style={styles.mapHeader}>
                <View>
                  <Text style={styles.mapTitle}>📍 Mueve el pin a tu ubicación</Text>
                  <Text style={styles.mapSubtitle}>Zacualtipán, Hidalgo</Text>
                </View>
                <TouchableOpacity onPress={() => setShowMap(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              {region && (
                <MapView 
                  style={styles.map} 
                  region={region}
                  initialRegion={{
                    ...ZACUALTIPAN_CENTER,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02
                  }}
                  onPress={handleMapPress}
                  scrollEnabled={true}
                  zoomEnabled={true}
                >
                  {markerCoord && (
                    <Marker 
                      draggable 
                      coordinate={markerCoord}
                      onDragEnd={(e) => handleMapPress(e)}
                    >
                      <View style={styles.mapPin}>
                        <Ionicons name="location" size={30} color="#ff6b00" />
                      </View>
                    </Marker>
                  )}
                </MapView>
              )}

              <View style={styles.mapFooter}>
                <TouchableOpacity 
                  style={styles.mapCancelBtn} 
                  onPress={() => setShowMap(false)}
                >
                  <Text style={styles.mapCancelText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.mapConfirmBtn} 
                  onPress={confirmarPin}
                >
                  <Ionicons name="checkmark" size={20} color="#fff" />
                  <Text style={styles.mapConfirmText}>Confirmar Ubicación</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>

      <Modal visible={showForm} transparent animationType="fade">
        <View style={styles.formOverlay}>
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Guardar Dirección</Text>
            
            <Text style={styles.formSubtitle}>¿Cómo quieres llamar a esta ubicación?</Text>
            
            <TextInput
              placeholder="Ej: Casa, Trabajo..."
              style={styles.input}
              value={label}
              onChangeText={setLabel}
              autoFocus
            />
            
            <View style={styles.addressPreview}>
              <Ionicons name="location" size={16} color="#666" />
              <Text style={styles.previewText} numberOfLines={3}>
                {tempAddress.current || "Ubicación en Zacualtipán"}
              </Text>
            </View>
            
            {tempCoords.current && (
              <Text style={styles.coordsPreview}>
                📍 Coordenadas guardadas para entrega
              </Text>
            )}

            <View style={styles.formButtons}>
              <TouchableOpacity 
                style={styles.formCancelBtn} 
                onPress={() => setShowForm(false)}
              >
                <Text style={styles.formCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.formSaveBtn} 
                onPress={guardarDireccion}
              >
                <Text style={styles.formSaveText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  label: { 
    fontSize: 18, 
    fontWeight: "900", 
    color: "#000", 
    marginBottom: 10 
  },
  card: { 
    backgroundColor: "#fff", 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 15, 
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  row: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  icon: { 
    marginRight: 12 
  },
  addressInfo: {
    flex: 1,
    marginRight: 10,
  },
  infoText: { 
    fontSize: 16, 
    fontWeight: "600",
    color: "#000", 
    marginBottom: 4,
  },
  addressDetail: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
  },
  coordsText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
  changeBtn: { 
    color: "#ff6b00", 
    fontWeight: "bold",
    fontSize: 16,
    paddingHorizontal: 8,
  },
  error: { 
    color: "red", 
    marginTop: 8,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: { 
    fontSize: 24, 
    fontWeight: "900", 
    color: "#000" 
  },
  listContent: {
    padding: 20,
  },
  addressItem: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedItem: {
    borderColor: "#ff6b00",
    backgroundColor: "#fff8f0",
  },
  addressItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressTexts: {
    flex: 1,
    marginLeft: 12,
  },
  addressLabel: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#000",
    marginBottom: 4,
  },
  addressText: { 
    fontSize: 14, 
    color: "#666",
    lineHeight: 18,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginTop: 16,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  addNewBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff6b00",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  addNewText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 16,
    marginLeft: 8,
  },
  cancelBtn: { 
    alignItems: "center", 
    padding: 12 
  },
  cancelText: { 
    color: "#666", 
    fontWeight: "600",
    fontSize: 16,
  },
  mapModalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  mapHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  mapSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  map: {
    flex: 1,
  },
  mapPin: {
    alignItems: "center",
  },
  mapFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  mapCancelBtn: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  mapCancelText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 16,
  },
  mapConfirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff6b00",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  mapConfirmText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  formOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  formCard: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#000",
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#f8f9fa",
  },
  addressPreview: {
    flexDirection: "row",
    backgroundColor: "#f0f7ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "flex-start",
  },
  previewText: {
    color: "#2c6bbf",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  coordsPreview: {
    fontSize: 12,
    color: "#4CAF50",
    fontStyle: "italic",
    marginBottom: 20,
  },
  formButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  formCancelBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  formCancelText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 16,
  },
  formSaveBtn: {
    backgroundColor: "#ff6b00",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 2,
    marginLeft: 8,
    alignItems: "center",
  },
  formSaveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default DireccionCard;
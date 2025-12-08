import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

type MapModalProps = {
  visible: boolean;
  onClose: () => void;
  userLocation: any;
  mapRegion: any;
  selectedAddress: any;
  distance: string;
  deliveryTimeRange: string;
  userZone: string;
  orderNumber: string;
  pizzeriaCoords: { latitude: number; longitude: number };
};

const MapModal: React.FC<MapModalProps> = ({
  visible,
  onClose,
  userLocation,
  mapRegion,
  selectedAddress,
  distance,
  deliveryTimeRange,
  userZone,
  orderNumber,
  pizzeriaCoords,
}) => {
  const hasExactLocation = selectedAddress?.latitude && selectedAddress?.longitude;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Encabezado */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ruta de Entrega</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={26} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Información */}
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="navigate" size={18} color="#ff6b00" />
              <Text style={styles.infoLabel}>Distancia:</Text>
              <Text style={styles.infoValue}>{distance} km</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="time" size={18} color="#ff6b00" />
              <Text style={styles.infoLabel}>Tiempo:</Text>
              <Text style={styles.infoValue}>{deliveryTimeRange}</Text>
            </View>
          </View>

          {/* Mapa */}
          <View style={styles.fullMapContainer}>
            {mapRegion && userLocation && (
              <MapView
                style={styles.fullMap}
                provider={PROVIDER_GOOGLE}
                region={mapRegion}
                showsUserLocation={false}
                showsMyLocationButton={false}
                scrollEnabled={true}
                zoomEnabled={true}
              >
        
                <Marker coordinate={pizzeriaCoords}>
                  <View style={styles.pizzaMarker}>
                    <Ionicons name="pizza" size={18} color="#fff" />
                  </View>
                </Marker>

          
                <Marker coordinate={userLocation}>
                  <View style={styles.userMarker}>
                    <Ionicons name="home" size={16} color="#fff" />
                  </View>
                </Marker>

              
                <Polyline
                  coordinates={[pizzeriaCoords, userLocation]}
                  strokeColor="#ff6b00"
                  strokeWidth={3}
                />
              </MapView>
            )}
          </View>

      
          <View style={styles.addressBox}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.addressText}>
              {selectedAddress?.fullAddress || userZone}
            </Text>
          </View>

   
          <TouchableOpacity 
            style={styles.closeModalButton} 
            onPress={onClose}
          >
            <Text style={styles.closeModalText}>Cerrar Mapa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 25,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: "#f8f9fa",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 13,
    color: "#666",
    marginLeft: 6,
    marginRight: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  fullMapContainer: {
    height: 280,
    width: "100%",
  },
  fullMap: {
    ...StyleSheet.absoluteFillObject,
  },
  pizzaMarker: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#ff6b00",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  userMarker: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#ff6b00",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  addressBox: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    marginHorizontal: 18,
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
    alignItems: "flex-start",
  },
  addressText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  closeModalButton: {
    backgroundColor: "#ff6b00",
    marginHorizontal: 18,
    marginTop: 15,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  closeModalText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});

export default MapModal;
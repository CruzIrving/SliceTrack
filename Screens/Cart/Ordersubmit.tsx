import React, { useEffect, useState, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCart } from "../../Components/CartContext";
import { Ionicons } from "@expo/vector-icons";
import MapModal from "../../Components/MapModal";

const { width } = Dimensions.get("window");

type Order = {
  id: string;
  items: any[];
  address: string;
  createdAt: number;
  estimatedDelivery: number;
  userLatitude?: number;
  userLongitude?: number;
  userZone?: string;
  orderNumber: string;
};

type OrdersubmitProps = {
  navigation: any;
  route?: any;
};

const PIZZERIA_COORDS = {
  latitude: 20.6490,
  longitude: -98.6520
};

export default function Ordersubmit({ navigation, route }: OrdersubmitProps) {
  const { cart, direcciones, selectedDireccionId, clearCart, setActiveOrder } = useCart();
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [showMapModal, setShowMapModal] = useState(false);
  const [deliveryTimeRange, setDeliveryTimeRange] = useState<string>("25-40 min");
  const [distance, setDistance] = useState<string>("1.5");
  const [userLocation, setUserLocation] = useState<any>(null);
  const [userZone, setUserZone] = useState<string>("Centro de Zacualtipán");
  const [mapRegion, setMapRegion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [estimatedTime, setEstimatedTime] = useState<string>("");
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    initializeOrder();
  }, []);

  const calculateRealDistance = (userLat: number, userLng: number): number => {
    const R = 6371;
    const dLat = (userLat - PIZZERIA_COORDS.latitude) * Math.PI / 180;
    const dLng = (userLng - PIZZERIA_COORDS.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(PIZZERIA_COORDS.latitude * Math.PI / 180) * 
              Math.cos(userLat * Math.PI / 180) * 
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let distance = R * c;
    return Math.min(Math.max(distance, 0.5), 5);
  };

  const getZoneFromRealCoords = (lat: number, lng: number): string => {
    const latDiff = lat - PIZZERIA_COORDS.latitude;
    const lngDiff = lng - PIZZERIA_COORDS.longitude;
    
    if (Math.abs(latDiff) < 0.005 && Math.abs(lngDiff) < 0.005) {
      return "Centro de Zacualtipán";
    }
    if (latDiff > 0.005) return "Zona Norte";
    if (latDiff < -0.005) return "Barranca de Metzttilán";
    if (lngDiff > 0.005) return "Zoquizoquipan";
    if (lngDiff < -0.005) return "Ayacatzinta";
    return "Zacualtipán";
  };

  const getUserRealLocation = (address: any) => {
    if (address?.latitude && address?.longitude) {
      return {
        latitude: address.latitude,
        longitude: address.longitude
      };
    }
    
    let hash = 0;
    for (let i = 0; i < address.fullAddress.length; i++) {
      hash = address.fullAddress.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const maxRadius = 0.015;
    const angle = (hash % 360) * Math.PI / 180;
    const radius = (hash % 1000) / 1000 * maxRadius;
    
    return {
      latitude: PIZZERIA_COORDS.latitude + Math.cos(angle) * radius,
      longitude: PIZZERIA_COORDS.longitude + Math.sin(angle) * radius
    };
  };

  const calculateDeliveryTime = (distKm: number): string => {
    const prepTime = 15;
    const travelTime = (distKm / 25) * 60;
    const totalTime = prepTime + travelTime;
    
    const minTime = Math.round(totalTime * 0.85);
    const maxTime = Math.round(totalTime * 1.15);
    
    return `${Math.max(20, minTime)}-${Math.max(30, maxTime)} min`;
  };

  const initializeOrder = async () => {
    try {
      const address = direcciones.find((d) => d.id === selectedDireccionId);
      
      if (!address) {
        Alert.alert("Error", "Selecciona una dirección primero");
        navigation.goBack();
        return;
      }
      
      setSelectedAddress(address);
      
      const userCoords = getUserRealLocation(address);
      setUserLocation(userCoords);
      
      const calculatedDistance = calculateRealDistance(
        userCoords.latitude, 
        userCoords.longitude
      );
      
      setDistance(calculatedDistance.toFixed(1));
      
      const zone = getZoneFromRealCoords(userCoords.latitude, userCoords.longitude);
      setUserZone(zone);
      
      const timeRange = calculateDeliveryTime(calculatedDistance);
      setDeliveryTimeRange(timeRange);
      
      setupMapRegion(userCoords);
      
      await createOrder(userCoords, address, zone, calculatedDistance);
      
    } catch (error) {
      console.error('Error:', error);
      Alert.alert("Error", "No se pudo completar el pedido");
    } finally {
      setIsLoading(false);
    }
  };

  const setupMapRegion = (userLoc: any) => {
    const latDelta = Math.max(0.02, Math.abs(userLoc.latitude - PIZZERIA_COORDS.latitude) * 2.5);
    const lngDelta = Math.max(0.02, Math.abs(userLoc.longitude - PIZZERIA_COORDS.longitude) * 2.5);
    
    setMapRegion({
      latitude: (PIZZERIA_COORDS.latitude + userLoc.latitude) / 2,
      longitude: (PIZZERIA_COORDS.longitude + userLoc.longitude) / 2,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    });
  };

  const createOrder = async (userLoc: any, address: any, zone: string, distanceKm: number) => {
    const now = Date.now();
    const times = deliveryTimeRange.split('-');
    const minTime = parseInt(times[0]);
    const maxTime = parseInt(times[1].split(' ')[0]);
    const avgTime = (minTime + maxTime) / 2;
    const estimated = now + (avgTime * 60 * 1000);

    const newOrderNumber = `ST${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderNumber(newOrderNumber);

    const date = new Date(estimated);
    const formattedTime = date.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit'
    });
    setEstimatedTime(formattedTime);

    const order: Order = {
      id: `order_${now}`,
      items: [...cart],
      address: address.fullAddress,
      createdAt: now,
      estimatedDelivery: estimated,
      userLatitude: userLoc.latitude,
      userLongitude: userLoc.longitude,
      userZone: zone,
      orderNumber: newOrderNumber,
    };

    try {
      await setActiveOrder(order);
      clearCart();
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const handleContinueShopping = () => {
    navigation.navigate("Menu");
  };

  const handleViewOrderDetails = () => {
    if (orderNumber) {
      navigation.navigate("OrderTracking", { 
        orderId: `order_${Date.now() - 1000}`
      });
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Ionicons name="pizza-outline" size={70} color="#ff6b00" />
          <Text style={styles.loadingText}>Procesando tu pedido...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>¡Pedido Confirmado!</Text>
      
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.confirmationIcon}>
            <Ionicons name="checkmark-circle" size={90} color="#ff6b00" />
          </View>

          <Text style={styles.mainMessage}>
            ¡Tu pedido está en camino!
          </Text>

          <View style={styles.orderNumberContainer}>
            <Text style={styles.orderNumberLabel}>Pedido:</Text>
            <Text style={styles.orderNumber}>{orderNumber}</Text>
          </View>

          <View style={styles.timeCard}>
            <Ionicons name="time-outline" size={26} color="#ff6b00" />
            <Text style={styles.timeText}>
              Llegará en <Text style={styles.timeHighlight}>{deliveryTimeRange}</Text>
            </Text>
            <Text style={styles.estimatedTime}>Aprox. {estimatedTime}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => setShowMapModal(true)}
            >
              <Ionicons name="map-outline" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Ver Ruta</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={handleViewOrderDetails}
            >
              <Ionicons name="cube-outline" size={20} color="#ff6b00" />
              <Text style={styles.secondaryButtonText}>Seguir</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinueShopping}
          >
            <Ionicons name="cart-outline" size={20} color="#fff" />
            <Text style={styles.continueButtonText}>Seguir Comprando</Text>
          </TouchableOpacity>

          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons name="location" size={22} color="#ff6b00" />
              <Text style={styles.infoTitle}>Dirección de entrega</Text>
            </View>
            
            <Text style={styles.addressText}>
              {selectedAddress?.fullAddress || "Zacualtipán, Hidalgo"}
            </Text>
            
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Ionicons name="navigate" size={16} color="#666" />
                <Text style={styles.detailLabel}>Distancia:</Text>
                <Text style={styles.detailValue}>{distance} km</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Ionicons name="pin" size={16} color="#666" />
                <Text style={styles.detailLabel}>Zona:</Text>
                <Text style={styles.detailValue}>{userZone}</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      <MapModal
        visible={showMapModal}
        onClose={() => setShowMapModal(false)}
        userLocation={userLocation}
        mapRegion={mapRegion}
        selectedAddress={selectedAddress}
        distance={distance}
        deliveryTimeRange={deliveryTimeRange}
        userZone={userZone}
        orderNumber={orderNumber}
        pizzeriaCoords={PIZZERIA_COORDS}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 30,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#ff6b00",
    paddingTop: 55,
    paddingBottom: 15,
    backgroundColor: "#fff",
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 5,
  },
  confirmationIcon: {
    alignItems: "center",
    marginVertical: 15,
  },
  mainMessage: {
    fontSize: 22,
    fontWeight: "800",
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  orderNumberContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  orderNumberLabel: {
    fontSize: 16,
    color: "#666",
    marginRight: 8,
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ff6b00",
  },
  timeCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e8e8e8",
  },
  timeText: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    marginBottom: 4,
    textAlign: "center",
  },
  timeHighlight: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ff6b00",
  },
  estimatedTime: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff6b00",
    borderRadius: 10,
    paddingVertical: 14,
    marginRight: 6,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 6,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 14,
    marginLeft: 6,
    borderWidth: 2,
    borderColor: "#ff6b00",
  },
  secondaryButtonText: {
    color: "#ff6b00",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 6,
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff6b00",
    borderRadius: 10,
    paddingVertical: 14,
    marginBottom: 20,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 6,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e8e8e8",
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginLeft: 10,
  },
  addressText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  detailsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: "#666",
    marginLeft: 5,
    marginRight: 4,
    flex: 1,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
  },
});
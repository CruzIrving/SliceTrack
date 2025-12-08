import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCart } from "../../Components/CartContext";

const OrderTrackingScreen = ({ navigation, route }: any) => {
  const { activeOrder, getOrderById } = useCart();
  const [order, setOrder] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [orderStatus, setOrderStatus] = useState("Preparando");
  const [progress, setProgress] = useState(0.3);

  useEffect(() => {
    loadOrder();
    const interval = setInterval(updateTime, 60000); // Actualizar cada minuto
    return () => clearInterval(interval);
  }, []);

  const loadOrder = async () => {
    try {
      const orderId = route.params?.orderId;
      let foundOrder = null;

      if (orderId) {
        // Buscar por ID específico
        const stored = await AsyncStorage.getItem("@orders");
        if (stored) {
          const orders = JSON.parse(stored);
          foundOrder = orders.find((o: any) => o.id === orderId);
        }
      } else {
        // Obtener el último pedido
        foundOrder = await getLastOrder();
      }

      if (foundOrder) {
        setOrder(foundOrder);
        updateStatus(foundOrder);
      }
    } catch (error) {
      console.error('Error loading order:', error);
    }
  };

  const updateStatus = (orderData: any) => {
    const now = Date.now();
    const elapsed = now - orderData.createdAt;
    const totalTime = orderData.estimatedDelivery - orderData.createdAt;
    
    // Calcular progreso (0 a 1)
    const progressValue = Math.min(elapsed / totalTime, 1);
    setProgress(progressValue);
    
    // Determinar estado basado en progreso
    if (progressValue < 0.3) {
      setOrderStatus("Preparando");
    } else if (progressValue < 0.7) {
      setOrderStatus("En camino");
    } else if (progressValue < 1) {
      setOrderStatus("Casi llegando");
    } else {
      setOrderStatus("Entregado");
    }
  };

  const updateTime = () => {
    if (!order) return;
    
    const now = Date.now();
    const timeRemaining = order.estimatedDelivery - now;
    
    if (timeRemaining <= 0) {
      setTimeLeft("¡Llegó!");
      setOrderStatus("Entregado");
      return;
    }
    
    const minutes = Math.floor(timeRemaining / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      setTimeLeft(`${hours}h ${remainingMinutes}m`);
    } else {
      setTimeLeft(`${minutes}m`);
    }
    
    updateStatus(order);
  };

  const getStatusColor = () => {
    switch (orderStatus) {
      case "Preparando": return "#FF6B00";
      case "En camino": return "#2196F3";
      case "Casi llegando": return "#4CAF50";
      case "Entregado": return "#4CAF50";
      default: return "#FF6B00";
    }
  };

  const getStatusIcon = () => {
    switch (orderStatus) {
      case "Preparando": return "restaurant";
      case "En camino": return "bicycle";
      case "Casi llegando": return "navigate";
      case "Entregado": return "checkmark-circle";
      default: return "time";
    }
  };

  const handleContact = () => {
    Alert.alert(
      "📞 Contactar al repartidor",
      "El repartidor te contactará 5 minutos antes de llegar.\n\nSi necesitas ayuda urgente:\n📱 771-123-4567",
      [{ text: "Entendido" }]
    );
  };

  const handleViewMap = () => {
    if (order) {
      navigation.navigate("Order", { 
        showMap: true,
        orderId: order.id 
      });
    }
  };

  const handleNewOrder = () => {
    navigation.navigate("Carro");
  };

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Ionicons name="search" size={60} color="#ccc" />
          <Text style={styles.notFoundText}>Pedido no encontrado</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Volver al Carrito</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const totalAmount = order.items.reduce(
    (sum: number, item: any) => sum + (item.price * (item.quantity || 1)), 
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Encabezado */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Seguimiento de Pedido</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Número de pedido */}
        <View style={styles.orderNumberCard}>
          <Ionicons name="receipt-outline" size={24} color="#666" />
          <Text style={styles.orderNumber}>
            Pedido: {order.id.replace('order_', 'ST')}
          </Text>
        </View>

        {/* Barra de progreso */}
        <View style={styles.progressCard}>
          <View style={styles.statusHeader}>
            <Ionicons 
              name={getStatusIcon()} 
              size={32} 
              color={getStatusColor()} 
            />
            <Text style={[styles.statusTitle, { color: getStatusColor() }]}>
              {orderStatus}
            </Text>
          </View>
          
          <Text style={styles.timeLeft}>
            {orderStatus === "Entregado" ? "¡Pedido entregado con éxito!" : `Tiempo restante: ${timeLeft}`}
          </Text>
          
          {/* Barra de progreso visual */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${progress * 100}%`, backgroundColor: getStatusColor() }
                ]} 
              />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>Preparado</Text>
              <Text style={styles.progressLabel}>En camino</Text>
              <Text style={styles.progressLabel}>Entregado</Text>
            </View>
          </View>
        </View>

        {/* Detalles del pedido */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>📦 Detalles del pedido</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Dirección:</Text>
            <Text style={styles.detailValue} numberOfLines={2}>
              {order.address}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total:</Text>
            <Text style={[styles.detailValue, { color: "#FF6B00" }]}>
              ${totalAmount.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Hora estimada:</Text>
            <Text style={styles.detailValue}>
              {new Date(order.estimatedDelivery).toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Artículos:</Text>
            <Text style={styles.detailValue}>
              {order.items.length} producto(s)
            </Text>
          </View>
        </View>

        {/* Lista de productos */}
        <View style={styles.itemsCard}>
          <Text style={styles.cardTitle}>🍕 Tu orden</Text>
          {order.items.map((item: any, index: number) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>x{item.quantity || 1}</Text>
              <Text style={styles.itemPrice}>
                ${(item.price * (item.quantity || 1)).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Acciones */}
        <View style={styles.actionsCard}>
          <TouchableOpacity style={styles.actionButton} onPress={handleContact}>
            <Ionicons name="call-outline" size={22} color="#FF6B00" />
            <Text style={styles.actionText}>Contactar Repartidor</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleViewMap}>
            <Ionicons name="map-outline" size={22} color="#FF6B00" />
            <Text style={styles.actionText}>Ver Ruta en Mapa</Text>
          </TouchableOpacity>
        </View>

        {/* Botón para nuevo pedido */}
        <TouchableOpacity style={styles.newOrderButton} onPress={handleNewOrder}>
          <Ionicons name="cart-outline" size={22} color="#fff" />
          <Text style={styles.newOrderText}>Hacer Otro Pedido</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  notFoundText: {
    fontSize: 20,
    color: "#666",
    marginTop: 20,
    marginBottom: 30,
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "#FF6B00",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#333",
    textAlign: "center",
    flex: 1,
  },
  orderNumberCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    marginHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF6B00",
    marginLeft: 8,
  },
  progressCard: {
    backgroundColor: "#fff",
    padding: 25,
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  statusTitle: {
    fontSize: 26,
    fontWeight: "800",
    marginLeft: 12,
  },
  timeLeft: {
    fontSize: 18,
    color: "#666",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  progressBarContainer: {
    marginTop: 10,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: "#666",
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e8e8e8",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLabel: {
    fontSize: 15,
    color: "#666",
    flex: 1,
  },
  detailValue: {
    fontSize: 15,
    color: "#333",
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
    paddingLeft: 10,
  },
  itemsCard: {
    backgroundColor: "#fff",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e8e8e8",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemName: {
    fontSize: 14,
    color: "#333",
    flex: 2,
  },
  itemQuantity: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    textAlign: "center",
  },
  itemPrice: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  actionsCard: {
    backgroundColor: "#fff",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e8e8e8",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  actionText: {
    fontSize: 16,
    color: "#FF6B00",
    fontWeight: "600",
    marginLeft: 12,
    flex: 1,
  },
  newOrderButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6B00",
    marginHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 30,
  },
  newOrderText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
  },
});

export default OrderTrackingScreen;
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  image?: any;
  size?: string;
};

export type PaymentMethod = {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
};

export type Order = {
  id: string;
  items: CartItem[];
  address: string;
  createdAt: number;
  estimatedDelivery: number;
  userLatitude?: number;
  userLongitude?: number;
  userZone?: string;
  orderNumber: string;
};

export type UserAddress = {
  id: string;
  label: string;
  fullAddress: string;
  latitude?: number;
  longitude?: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  
  direcciones: UserAddress[];
  addDireccion: (dir: UserAddress) => Promise<void>;
  removeDireccion: (id: string) => Promise<void>; 
  clearDirecciones: () => Promise<void>; 
  selectedDireccionId: string | null;
  setSelectedDireccion: (id: string | null) => Promise<void>;
  
  pagos: PaymentMethod[];
  addPago: (pago: PaymentMethod) => Promise<void>;
  removePago: (id: string) => Promise<void>; 
  clearPagos: () => Promise<void>; 
  selectedPaymentId: string | null;
  setSelectedPayment: (id: string | null) => Promise<void>;
  
  // NUEVAS PROPIEDADES AÑADIDAS
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => Promise<void>;
  hasActiveOrder: boolean;
  getOrderById: (orderId: string) => Promise<Order | null>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [direcciones, setDirecciones] = useState<UserAddress[]>([]);
  const [selectedDireccionId, setSelectedDireccionIdState] = useState<string | null>(null);
  const [pagos, setPagos] = useState<PaymentMethod[]>([]);
  const [selectedPaymentId, setSelectedPaymentIdState] = useState<string | null>(null);
  const [activeOrder, setActiveOrderState] = useState<Order | null>(null);
  const [hasActiveOrderState, setHasActiveOrderState] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [
        storedDirecciones, 
        storedSelectedDir, 
        storedPagos, 
        storedSelectedPago,
        storedActiveOrder
      ] = await Promise.all([
        AsyncStorage.getItem("@direcciones"),
        AsyncStorage.getItem("@selected_direccion"),
        AsyncStorage.getItem("@pagos"),
        AsyncStorage.getItem("@selected_pago"),
        AsyncStorage.getItem("@active_order")
      ]);

      if (storedDirecciones) setDirecciones(JSON.parse(storedDirecciones));
      if (storedSelectedDir) setSelectedDireccionIdState(storedSelectedDir);
      if (storedPagos) setPagos(JSON.parse(storedPagos));
      if (storedSelectedPago) setSelectedPaymentIdState(storedSelectedPago);
      if (storedActiveOrder) {
        const order = JSON.parse(storedActiveOrder);
        setActiveOrderState(order);
        setHasActiveOrderState(true);
      }
    } catch (error) {
      console.error('Error loading cart data:', error);
    }
  };

  // --- Pedidos activos ---
  const setActiveOrder = async (order: Order | null) => {
    setActiveOrderState(order);
    setHasActiveOrderState(!!order);
    
    if (order) {
      await AsyncStorage.setItem("@active_order", JSON.stringify(order));
      
      // También guardar en historial
      const storedOrders = await AsyncStorage.getItem("@orders");
      const orders: Order[] = storedOrders ? JSON.parse(storedOrders) : [];
      orders.unshift(order);
      await AsyncStorage.setItem("@orders", JSON.stringify(orders));
    } else {
      await AsyncStorage.removeItem("@active_order");
    }
  };

  const getOrderById = async (orderId: string): Promise<Order | null> => {
    try {
      const storedOrders = await AsyncStorage.getItem("@orders");
      if (!storedOrders) return null;
      
      const orders: Order[] = JSON.parse(storedOrders);
      return orders.find(order => order.id === orderId) || null;
    } catch (error) {
      console.error('Error getting order:', error);
      return null;
    }
  };

  // --- Direcciones ---
  const persistDirecciones = async (list: UserAddress[]) => {
    setDirecciones(list);
    await AsyncStorage.setItem("@direcciones", JSON.stringify(list));
  };

  const addDireccion = async (dir: UserAddress) => {
    const nuevas = [...direcciones, dir];
    await persistDirecciones(nuevas);
    if (!selectedDireccionId) await setSelectedDireccion(dir.id);
  };

  const setSelectedDireccion = async (id: string | null) => {
    setSelectedDireccionIdState(id);
    if (id) await AsyncStorage.setItem("@selected_direccion", id);
    else await AsyncStorage.removeItem("@selected_direccion");
  };

  // --- Pagos ---
  const persistPagos = async (list: PaymentMethod[]) => {
    setPagos(list);
    await AsyncStorage.setItem("@pagos", JSON.stringify(list));
  };

  const addPago = async (pago: PaymentMethod) => {
    const nuevos = [...pagos, pago];
    await persistPagos(nuevos);
    if (!selectedPaymentId) await setSelectedPayment(pago.id);
  };

  const setSelectedPayment = async (id: string | null) => {
    setSelectedPaymentIdState(id);
    if (id) await AsyncStorage.setItem("@selected_pago", id);
    else await AsyncStorage.removeItem("@selected_pago");
  };

  // --- Carrito ---
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          quantity: (copy[idx].quantity || 1) + 1,
        };
        return copy;
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const increaseQuantity = (id: string) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
      )
    );
  };

  const decreaseQuantity = (id: string) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, quantity: Math.max(1, (i.quantity || 1) - 1) } : i
        )
    );
  };

  const removeFromCart = (id: string) =>
    setCart((prev) => prev.filter((i) => i.id !== id));

  const clearCart = () => setCart([]);

  // --- Direcciones ---
  const removeDireccion = async (id: string) => {
    const updated = direcciones.filter((d) => d.id !== id);
    await persistDirecciones(updated);
  };

  const clearDirecciones = async () => {
    await persistDirecciones([]);
  };

  // --- Pagos ---
  const removePago = async (id: string) => {
    const updated = pagos.filter((p) => p.id !== id);
    await persistPagos(updated);
  };

  const clearPagos = async () => {
    await persistPagos([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        direcciones,
        addDireccion,
        removeDireccion,
        clearDirecciones,
        selectedDireccionId,
        setSelectedDireccion,
        pagos,
        addPago,
        removePago,
        clearPagos,
        selectedPaymentId,
        setSelectedPayment,
        // NUEVAS PROPIEDADES EXPORTADAS
        activeOrder,
        setActiveOrder,
        hasActiveOrder: hasActiveOrderState,
        getOrderById,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
// CartContext.tsx
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
  items: any[];
  address: string;
  createdAt: number;        // timestamp
  estimatedDelivery: number; // timestamp
};


export type UserAddress = {
  id: string;
  label: string;
  fullAddress: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;

  // 🔥 NUEVAS
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;

  removeFromCart: (id: string) => void;
  clearCart: () => void;

  direcciones: UserAddress[];
  addDireccion: (dir: UserAddress) => Promise<void>;
  selectedDireccionId: string | null;
  setSelectedDireccion: (id: string | null) => Promise<void>;

  pagos: PaymentMethod[];
  addPago: (pago: PaymentMethod) => Promise<void>;
  selectedPaymentId: string | null;
  setSelectedPayment: (id: string | null) => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const [direcciones, setDirecciones] = useState<UserAddress[]>([]);
  const [selectedDireccionId, setSelectedDireccionIdState] =
    useState<string | null>(null);

  const [pagos, setPagos] = useState<PaymentMethod[]>([]);
  const [selectedPaymentId, setSelectedPaymentIdState] =
    useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const storedDirecciones = await AsyncStorage.getItem("@direcciones");
      if (storedDirecciones) setDirecciones(JSON.parse(storedDirecciones));

      const storedSelectedDir = await AsyncStorage.getItem(
        "@selected_direccion"
      );
      if (storedSelectedDir) setSelectedDireccionIdState(storedSelectedDir);

      const storedPagos = await AsyncStorage.getItem("@pagos");
      if (storedPagos) setPagos(JSON.parse(storedPagos));

      const storedSelectedPago = await AsyncStorage.getItem("@selected_pago");
      if (storedSelectedPago) setSelectedPaymentIdState(storedSelectedPago);
    })();
  }, []);

  // --- Helpers direcciones ---
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

  // ✅ NUEVO
  const increaseQuantity = (id: string) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, quantity: (i.quantity || 1) + 1 }
          : i
      )
    );
  };

  // ✅ NUEVO
  const decreaseQuantity = (id: string) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === id
            ? { ...i, quantity: (i.quantity || 1) - 1 }
            : i
        )
        .filter((i) => (i.quantity || 0) > 0)
    );
  };

  const removeFromCart = (id: string) =>
    setCart((prev) => prev.filter((i) => i.id !== id));

  const clearCart = () => setCart([]);

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
        selectedDireccionId,
        setSelectedDireccion,

        pagos,
        addPago,
        selectedPaymentId,
        setSelectedPayment,
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

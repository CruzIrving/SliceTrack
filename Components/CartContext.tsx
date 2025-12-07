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
  cardNumber: string; // full number stored (consider cifrar en prod)
  cardHolder: string;
  expiry: string; // "MM/YY"
  cvv: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  direccion: string | null;
  setDireccion: (d: string) => void;
  pagos: PaymentMethod[];
  addPago: (pago: PaymentMethod) => Promise<void>;
  selectedPaymentId: string | null;
  setSelectedPayment: (id: string | null) => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [direccion, setDireccionState] = useState<string | null>(null);
  const [pagos, setPagos] = useState<PaymentMethod[]>([]);
  const [selectedPaymentId, setSelectedPaymentIdState] = useState<
    string | null
  >(null);

  // Cargar dirección desde AsyncStorage al iniciar
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("@direccion");
      if (stored) setDireccionState(stored);

      const storedPagos = await AsyncStorage.getItem("@pagos");
      if (storedPagos) setPagos(JSON.parse(storedPagos));

      const storedSelected = await AsyncStorage.getItem("@selected_pago");
      if (storedSelected) setSelectedPaymentIdState(storedSelected);
    })();
  }, []);

  const setDireccion = async (d: string) => {
    setDireccionState(d);
    try {
      await AsyncStorage.setItem("@direccion", d);
    } catch (e) {
      console.warn("Error guardando direccion", e);
    }
  };
  const persistPagos = async (newPagos: PaymentMethod[]) => {
    setPagos(newPagos);
    try {
      await AsyncStorage.setItem("@pagos", JSON.stringify(newPagos));
    } catch (e) {
      console.warn("Error guardando pagos", e);
    }
  };

  const addPago = async (pago: PaymentMethod) => {
    const nuevos = [...pagos, pago];
    await persistPagos(nuevos);
    // Si no hay seleccionado, seleccionamos el nuevo por defecto
    if (!selectedPaymentId) {
      await setSelectedPayment(pago.id);
    }
  };

  const setSelectedPayment = async (id: string | null) => {
    setSelectedPaymentIdState(id);
    try {
      if (id) await AsyncStorage.setItem("@selected_pago", id);
      else await AsyncStorage.removeItem("@selected_pago");
    } catch (e) {
      console.warn("Error guardando selected payment", e);
    }
  };

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: (copy[idx].quantity || 1) + 1 };
        return copy;
      }
      return [...prev, { ...item, quantity: item.quantity ?? 1 }];
    });
  };

  const removeFromCart = (id: string) =>
    setCart((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        direccion,
        setDireccion,
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

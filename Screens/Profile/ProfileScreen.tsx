import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import React, { useEffect } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";

import { signOut } from "firebase/auth";
import { auth } from "../../Utils/firebase";
import { useUser } from "../../Components/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamsP } from "../../Navigation/StackN_Profile";

type HomeNavProp = StackNavigationProp<RootStackParamsP, "Profile">;

type Props = {
  navigation: HomeNavProp;
};

const ProfileScreen = ({ navigation }: Props) => {
  const { user, setUser } = useUser();

  // Cargar datos desde AsyncStorage al iniciar
  useEffect(() => {
    (async () => {
      const storedEmail = await AsyncStorage.getItem("@user_email");
      const storedName = await AsyncStorage.getItem("@user_name");
      const storedPhone = await AsyncStorage.getItem("@user_number");
      const storedImage = await AsyncStorage.getItem("@user_image");

      setUser({
        email: storedEmail || "",
        name: storedName || "",
        phone: storedPhone || "",
        image: storedImage || "",
      });
    })();
  }, []);

  const openWhatsApp = (phone: string) => {
    const url = `https://wa.me/${phone}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) return Linking.openURL(url);
        console.log("No se puede abrir WhatsApp");
      })
      .catch((err) => console.log(err));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // limpiar contexto
    } catch (error) {
      console.log("Error al cerrar sesión:", error);
    }
  };

  if (!user) return null; // seguridad

  return (
    <View style={{ alignItems: "center" }}>
      <View style={style.header}>
        <Text style={style.text}>Mi perfil</Text>
        <FontAwesome6 name="bell" size={28} color="gray" />
      </View>

      <Image
        style={style.img}
        source={
          user.image
            ? { uri: user.image }
            : require("../../assets/Images/user.png")
        }
      />

      <Text style={style.name}>{user.name}</Text>
      <Text style={style.numero}>{user.phone}</Text>
      <Text style={style.email}>{user.email}</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("Orders")}
        style={style.options}
      >
        <AntDesign name="clock-circle" size={32} color="orange" />
        <Text style={style.optext}>Mis pedidos</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Directions")}
        style={style.options}
      >
        <Ionicons name="location-outline" size={32} color="orange" />
        <Text style={style.optext}>Dirección</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Payment")}
        style={style.options}
      >
        <MaterialIcons name="payment" size={32} color="orange" />
        <Text style={style.optext}>Métodos de pago</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => openWhatsApp(user.phone)}
        style={style.options}
      >
        <Feather name="help-circle" size={32} color="orange" />
        <Text style={style.optext}>Ayuda y soporte</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Setting")}
        style={style.options}
      >
        <Feather name="settings" size={32} color="orange" />
        <Text style={style.optext}>Configuración</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout}>
        <Text style={style.close}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: "#fff",
    paddingTop: 70,
    paddingBottom: 30,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: "25%",
    alignItems: "center",
  },
  text: { fontSize: 32, fontWeight: "900", color: "#ff6b00" },
  img: {
    marginTop: 40,
    borderColor: "#000",
    borderWidth: 3,
    borderRadius: 100,
    width: 150,
    height: 150,
  },
  name: { fontWeight: "900", fontSize: 20 },
  email: { fontSize: 16, color: "#7c7c7c", marginBottom: 20 },
  numero: { fontSize: 16, color: "#7c7c7c" },
  options: {
    elevation: 3,
    shadowColor: "#000",
    marginBottom: 10,
    flexDirection: "row",
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  optext: { fontSize: 16 },
  close: { color: "#959595ff", fontStyle: "italic", marginTop: 5, fontSize: 20 },
});

export default ProfileScreen;

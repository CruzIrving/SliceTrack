import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";

const ProfileScreen = () => {
  return (
    <View style={{ alignItems: "center" }}>
      <View style={style.header}>
        <Text style={style.text}>Mi perfil</Text>
        <FontAwesome6 name="bell" size={28} color="gray" />
      </View>
      <Image
        style={style.img}
        source={require("../assets/Images/image 15.png")}
      />
      <Text style={style.name}>Maria martinez</Text>
      <Text style={style.email}>maria.martinez@gmail.com</Text>

      <View style={style.options}>
        <AntDesign name="clock-circle" size={32} color="orange" />
        <Text style={style.optext}>Mis pedidos</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
      </View>
      <View style={style.options}>
        <Ionicons name="location-outline" size={32} color="orange" />
        <Text style={style.optext}>Direccion</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
      </View>
      <View style={style.options}>
        <MaterialIcons name="payment" size={32} color="orange" />
        <Text style={style.optext}>Metodos de pago</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
      </View>
      <View style={style.options}>
        <Feather name="help-circle" size={32} color="orange" />
        <Text style={style.optext}>Ayuda y soporte</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
      </View>
      <View style={style.options}>
        <Feather name="settings" size={32} color="orange" />
        <Text style={style.optext}>Configuracion</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
      </View>
      <TouchableOpacity>
        <Text style={style.close}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
  header: {
    width: "100%",
    textAlign: "center",
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: "30%",
    alignItems: "center",
  },
  text: {
    fontSize: 25,
    fontWeight: 900,
    color: "#ff6b00",
  },
  img: {
    marginTop: 40,
    borderColor: "#000",
    borderWidth: 3,
    borderRadius: 100,
    width: 150,
    height: 150,
  },
  name: {
    fontWeight: 900,
    fontSize: 20,
  },
  email: {
    fontSize: 16,
    color: "#7c7c7c",
    marginBottom: 20,
  },
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
  optext: {
    fontSize: 16,
  },
  close: {
    color: "#959595ff",
    fontStyle: "italic",
    marginTop: 25,
    fontSize: 20,
  },
});

export default ProfileScreen;

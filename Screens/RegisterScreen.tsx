import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParams } from "../Navigation/StackN";
import { useState } from "react";

import { useFonts } from "expo-font";

type HomeNavProp = StackNavigationProp<RootStackParams, "Login">;

type Props = {
  navigation: HomeNavProp;
};

const RegisterScreen = ({ navigation }: Props) => {
const [loaded] = useFonts({
  Montserrat: require("../assets/Fonts/Montserrat-VariableFont_wght.ttf"),
  Poppins_xbold: require("../assets/Fonts/Poppins-ExtraBold.ttf"),
  Poppins_bold: require("../assets/Fonts/Poppins-Bold.ttf"), 
  Poppins_sbold: require("../assets/Fonts/Poppins-SemiBold.ttf"),
  Poppins_nbold: require("../assets/Fonts/Poppins-Medium.ttf"),
  Inter: require("../assets/Fonts/Inter-VariableFont_opsz,wght.ttf"),
})

if (!loaded) return null;

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [checked, setChecked] = useState(false);

  return (
    <LinearGradient
      style={style.container}
      colors={["#fff", "#f0f0f0", "#ffaf60", "#ff6b00"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={style.logo}>Slice Track</Text>
      <View style={style.card}>
        <Text style={style.title}>Bienvenido</Text>
        <Text style={style.text}>
          Bienvenido a Slice Track, ingreses sus datos por favor
        </Text>

        <Text style={style.label}>Email</Text>
        <TextInput
          style={style.input}
          value={email}
          onChangeText={setEmail}
        ></TextInput>

        <Text style={style.label}>Contraseña</Text>
        <TextInput
          style={style.input}
          value={pass}
          onChangeText={setPass}
        ></TextInput>

        <Text style={style.label}>Confirmar Contraseña</Text>
        <TextInput
          style={style.input}
          value={pass}
          onChangeText={setPass}
        ></TextInput>

          <TouchableOpacity
            style={style.recordar}
            onPress={() => setChecked(!checked)}
          >
            <View style={[style.box, checked && style.boxChecked]}></View>
            <Text style={{ fontSize: 12, fontWeight: 900, }}>Recordar</Text>
          </TouchableOpacity>

        <TouchableOpacity
          style={[style.button, { backgroundColor: "#ff6b00" }]}
        >
          <Text style={style.textbtn}>Registrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[style.button, { backgroundColor: "#000" }]}>
          <Image source={require("../assets/Icons/Google.png")} />
          <Text style={style.textbtn}>Registrar con Google</Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            gap: 15,
            marginTop: 20,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: 900 }}>
            ¿Ya tienes cuenta?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={{ fontSize: 16, fontWeight: 900, color: "#ff6b00" }}>
              Inicia sesión
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default RegisterScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo:{
    fontSize: 32,
    fontWeight: 900,
    color: "#ff6b00",
  },
  card: {
    width: 300,
    height: 550,
    padding: 20,
    marginTop: 40,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  title: {
    fontWeight: 900,
    fontSize: 24,
  },
  text: {
    color: "#676767ff",
    fontWeight: 700,
    fontSize: 14,
    marginVertical: 5,
  },
  label: {
    fontWeight: 700,
    paddingLeft: 3,
    fontSize: 20,
    marginTop: 10,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ff6b00",
    borderWidth: 1,
    borderRadius: 7,
  },
  recordar: {
    marginTop: 10,
    gap: 5,
    display: "flex",
    flexDirection: "row",
  },
  box: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: "#ff6b00",
    justifyContent: "center",
    alignItems: "center",
  },
  boxChecked: {
    backgroundColor: "#ff1b00",
  },
  button: {
    width: "100%",
    marginTop: 10,
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  textbtn: {
    textAlign: "center",
    color: "#fff",
    fontWeight: 700,
    fontSize: 20,
    padding: 10,
  },
});

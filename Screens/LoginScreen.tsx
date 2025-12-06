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

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Utils/firebase";

type HomeNavProp = StackNavigationProp<RootStackParams, "Login">;

type Props = {
  navigation: HomeNavProp;
};

const LoginScreen = ({ navigation }: Props) => {
  const  [ loading, setLoading ] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [checked, setChecked] = useState(false);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validate = () => {
    if (!email.trim()) return "El correo no puede estar vacío.";
    if (!validateEmail(email.trim())) return "Formato de correo inválido.";
    if (!pass.trim()) return "La contraseña no puede estar vacía.";
    if (pass.length < 6)
      return "La contraseña debe tener al menos 6 caracteres.";

    return null;
  };

  const handleLogin = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true)
      await signInWithEmailAndPassword(auth, email.trim(), pass.trim());
    } catch (e: any) {
      switch (e.code) {
        case "auth/invalid-credential":
          setError("Correo o contraseña incorrectos.");
          break;
        case "auth/user-disabled":
          setError("Este usuario está deshabilitado.");
          break;
        case "auth/too-many-requests":
          setError("Demasiados intentos. Intenta más tarde.");
          break;
        default:
          setError("Error inesperado. Intenta de nuevo.");
      }
    }finally{
      setLoading(false)
    }
  };

  return (
    <LinearGradient
      style={style.container}
      colors={["#fff", "#f0f0f0", "#ffaf60", "#ff6b00"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={style.logo}>Logo</Text>
      <View style={style.card}>
        <Text style={style.title}>Bienvenido</Text>
        <Text style={style.text}>
          Bienvenido de nuevo, ingreses sus datos por favor
        </Text>

        <Text style={style.label}>Email</Text>
        <TextInput
          style={style.input}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={(text) => setEmail(text.trim())}
        ></TextInput>

        <Text style={style.label}>Contraseña</Text>
        <TextInput
          secureTextEntry
          style={style.input}
          value={pass}
          onChangeText={setPass}
        ></TextInput>

        {!!error && <Text style={{ color: "#f00" }}>{error}</Text>}

        <View style={style.remember}>
          <TouchableOpacity
            style={style.recordar}
            onPress={() => setChecked(!checked)}
          >
            <View style={[style.box, checked && style.boxChecked]}></View>
            <Text style={{ fontSize: 12, fontWeight: 900 }}>Recordar</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 12, fontWeight: 900 }}>
            ¿Olvidaste tu contraseña?
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          style={[style.button, { backgroundColor: "#ff6b00" }]}
        >
          <Text style={style.textbtn}>
            { loading ? "Cargando..." : "Ingresar"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[style.button, { backgroundColor: "#000" }]}>
          <Image source={require("../assets/Icons/Google.png")} />
          <Text style={style.textbtn}>Ingresar con Google</Text>
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
            ¿No tienes cuenta?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={{ fontSize: 16, fontWeight: 900, color: "#ff6b00" }}>
              Registrate
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default LoginScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    backgroundColor: "#fff",
    width: 150,
    height: 150,
    fontSize: 25,
    fontWeight: "bold",
    lineHeight: 145,
    borderColor: "#ffb600",
    borderWidth: 2,
    textAlign: "center",
    borderRadius: 100,
  },
  card: {
    width: 300,
    height: 500,
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
  remember: {
    marginTop: 10,
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  recordar: {
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

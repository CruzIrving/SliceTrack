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
import { RootStackParams } from "../../Navigation/StackN_login";
import { useState } from "react";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Utils/firebase";
import { useAuthStore } from "../../Utils/store_auth";

type HomeNavProp = StackNavigationProp<RootStackParams, "Login">;

type Props = {
  navigation: HomeNavProp;
};

const RegisterScreen = ({ navigation }: Props) => {
  const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [Confirmpass, setConfirmPass] = useState("");
  const [checked, setChecked] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async () => {
    setError("");

    if (!email.trim() || !pass.trim() || !Confirmpass.trim()) {
      setError("Completa todos los campos.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Correo inválido.");
      return;
    }

    if (pass.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (pass !== Confirmpass) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email, pass);

      // guardamos usuario en Zustand
      setUser(res.user);
    } catch (err: any) {
      console.log(err.code);

      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Este correo ya está registrado.");
          break;
        case "auth/invalid-email":
          setError("El correo no es válido.");
          break;
        case "auth/weak-password":
          setError("Contraseña demasiado débil.");
          break;
        default:
          setError("Error al registrarte. Intenta de nuevo.");
          break;
      }
    } finally {
      setLoading(false);
    }
  };

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
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
        ></TextInput>

        <Text style={style.label}>Contraseña</Text>
        <TextInput
          style={style.input}
          value={pass}
          secureTextEntry
          onChangeText={setPass}
        ></TextInput>

        <Text style={style.label}>Confirmar Contraseña</Text>
        <TextInput
          style={style.input}
          secureTextEntry
          value={Confirmpass}
          onChangeText={setConfirmPass}
        ></TextInput>

        {error !== "" && <Text style={{ color: "#f00" }}>{error}</Text>}

        <TouchableOpacity
          style={style.recordar}
          onPress={() => setChecked(!checked)}
        >
          <View style={[style.box, checked && style.boxChecked]}></View>
          <Text style={{ fontSize: 12, fontWeight: 900 }}>Recordar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          style={[style.button, { backgroundColor: "#ff6b00" }]}
        >
          <Text style={style.textbtn}> {loading ? "Cargando...": "Registrar"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[style.button, { backgroundColor: "#000" }]}>
          <Image source={require("../../assets/Icons/Google.png")} />
          <Text style={style.textbtn}>Registrar con Google</Text>
        </TouchableOpacity>
        <Text>
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            gap: 15,
            marginTop: 5,
            marginBottom: 10,
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
  logo: {
    fontSize: 32,
    fontWeight: 900,
    color: "#ff6b00",
  },
  card: {
    width: 300,
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

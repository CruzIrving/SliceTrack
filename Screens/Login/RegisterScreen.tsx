import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParams } from "../../Navigation/StackN_login";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Utils/firebase";
import { useUser } from "../../Components/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

type HomeNavProp = StackNavigationProp<RootStackParams, "Login">;

type Props = {
  navigation: HomeNavProp;
};

const RegisterScreen = ({ navigation }: Props) => {
  const { setUser } = useUser();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [Confirmpass, setConfirmPass] = useState("");
  const [num, setNum] = useState("");
  const [checked, setChecked] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async () => {
    setError("");

    if (num.length !== 10) {
      setError("El teléfono debe tener 10 dígitos");
      return;
    }

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
      const res = await createUserWithEmailAndPassword(auth, email.trim(), pass.trim());

      const username = email.split("@")[0];

      // Guardar en AsyncStorage
      await AsyncStorage.setItem("@user_email", email.trim());
      await AsyncStorage.setItem("@user_name", username);
      await AsyncStorage.setItem("@user_number", num);
      await AsyncStorage.setItem("@user_image", "");

      // Actualizar contexto
      setUser({
        name: username,
        email: email.trim(),
        phone: num,
        image: "",
      });

      // Navegar a Home o pantalla principal
      // navigation.navigate("Home");

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
          Bienvenido a Slice Track, ingresa tus datos por favor
        </Text>

        <Text style={style.label}>Email</Text>
        <TextInput
          style={style.input}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
        />

        <Text style={style.label}>Número</Text>
        <TextInput
          keyboardType="numeric"
          style={style.input}
          value={num}
          onChangeText={setNum}
        />

        <Text style={style.label}>Contraseña</Text>
        <TextInput
          style={style.input}
          secureTextEntry
          value={pass}
          onChangeText={setPass}
        />

        <Text style={style.label}>Confirmar Contraseña</Text>
        <TextInput
          style={style.input}
          secureTextEntry
          value={Confirmpass}
          onChangeText={setConfirmPass}
        />

        {!!error && <Text style={{ color: "#f00" }}>{error}</Text>}

        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          style={[style.button, { backgroundColor: "#ff6b00" }]}
        >
          <Text style={style.textbtn}>
            {loading ? "Cargando..." : "Registrar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[style.button, { backgroundColor: "#000" }]}>
          <Image source={require("../../assets/Icons/Google.png")} />
          <Text style={style.textbtn}>Registrar con Google</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", gap: 15, marginTop: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: "900" }}>
            ¿Ya tienes cuenta?
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 16, fontWeight: "900", color: "#ff6b00" }}>
              Inicia sesión
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};
// Styles se mantienen igual que tu versión actual


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
    fontSize: 16,
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
    fontSize: 16,
    padding: 10,
  },
});

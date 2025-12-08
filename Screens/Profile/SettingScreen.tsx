import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "../../Components/UserContext";

const SettingScreen = () => {
  const { user, setUser } = useUser();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [number, setNumber] = useState("");
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const storedEmail = await AsyncStorage.getItem("@user_email");
      const storedUsername = await AsyncStorage.getItem("@user_name");
      const storedNumber = await AsyncStorage.getItem("@user_number");
      const storedImage = await AsyncStorage.getItem("@user_image");

      if (storedEmail) setEmail(storedEmail);
      if (storedUsername) setUsername(storedUsername);
      if (storedNumber) setNumber(storedNumber);
      if (storedImage) setImage(storedImage);

      // Inicializar contexto si aún no tiene datos
      if (!user && (storedEmail || storedUsername || storedNumber)) {
        setUser({
          name: storedUsername || "",
          email: storedEmail || "",
          phone: storedNumber || "",
          image: storedImage || "",
        });
      }
    })();
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permiso denegado", "Se necesita permiso para acceder a la galería");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const saveChanges = async () => {
    await AsyncStorage.setItem("@user_email", email);
    await AsyncStorage.setItem("@user_name", username);
    await AsyncStorage.setItem("@user_number", number);
    if (image) await AsyncStorage.setItem("@user_image", image);

    // Actualizar contexto para reflejar cambios en ProfileScreen
    setUser({
      name: username,
      email,
      phone: number,
      image: image || "",
    });

    Alert.alert("¡Listo!", "Tus datos se han actualizado correctamente");
  };

  return (
    <ScrollView contentContainerStyle={{ alignItems: "center", padding: 20 }}>
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={image ? { uri: image } : require("../../assets/Images/image 15.png")}
          style={styles.img}
        />
        <Text style={styles.changePhoto}>Cambiar foto</Text>
      </TouchableOpacity>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nombre de usuario</Text>
        <TextInput style={styles.input} value={username} onChangeText={setUsername} />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Número de teléfono</Text>
        <TextInput
          style={styles.input}
          value={number}
          onChangeText={setNumber}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={{ width: "100%" }} onPress={saveChanges}>
        <LinearGradient
          colors={["#ffaf60", "#ff6b00"]}
          style={styles.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.buttonText}>Guardar cambios</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  img: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#ff6b00",
    marginTop: 20,
  },
  changePhoto: {
    color: "#ff6b00",
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },
  inputGroup: {
    width: "100%",
    marginTop: 20,
  },
  label: {
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#ff6b00",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  button: {
    borderRadius: 10,
    marginTop: 30,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default SettingScreen;

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import MenuItem from "../Components/MenuItem";

const MenuScreen = () => {
  const [active, setActive] = useState<
    "pizzas" | "bebidas" | "combos" | "postres"
  >("pizzas");

  return (
    <ScrollView>
      <View style={style.header}>
        <Text style={style.title}>Menú</Text>
        <EvilIcons name="search" size={42} color="gray" />
      </View>

      <View style={style.navbar}>
        <TouchableOpacity
          onPress={() => setActive("pizzas")}
          style={[
            style.button,
            { backgroundColor: active === "pizzas" ? "#ff6b00" : "#fff" },
          ]}
        >
          <Text
            style={[
              style.btnText,
              {
                color: active === "pizzas" ? "#fff" : "#666",
              },
            ]}
          >
            Pizzas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActive("bebidas")}
          style={[
            style.button,
            { backgroundColor: active === "bebidas" ? "#ff6b00" : "#fff" },
          ]}
        >
          <Text
            style={[
              style.btnText,
              {
                color: active === "bebidas" ? "#fff" : "#666",
              },
            ]}
          >
            Bebidas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActive("combos")}
          style={[
            style.button,
            { backgroundColor: active === "combos" ? "#ff6b00" : "#fff" },
          ]}
        >
          <Text
            style={[
              style.btnText,
              {
                color: active === "combos" ? "#fff" : "#666",
              },
            ]}
          >
            Combos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActive("postres")}
          style={[
            style.button,
            { backgroundColor: active === "postres" ? "#ff6b00" : "#fff" },
          ]}
        >
          <Text
            style={[
              style.btnText,
              {
                color: active === "postres" ? "#fff" : "#666",
              },
            ]}
          >
            Postres
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ padding: 20 }}>
        {active === "pizzas" ? (
          <>
            <MenuItem
              name="Pizza pollo bufalo"
              price={120}
              size="Pizza Chica"
              image={require("../assets/Images/Pizza1.png")}
            />
          </>
        ) : active === "bebidas" ? (
          <>
            <MenuItem
              name="Pizza pollo bufalo"
              price={120}
              size="Pizza Chica"
              image={require("../assets/Images/Pizza1.png")}
            />
          </>
        ) : active === "combos" ? (
          <>
            <MenuItem
              name="Pizza pollo bufalo"
              price={120}
              size="Pizza Chica"
              image={require("../assets/Images/Pizza1.png")}
            />
          </>
        ) : (
          <>
            <MenuItem
              name="Pizza pollo bufalo"
              price={120}
              size="Pizza Chica"
              image={require("../assets/Images/Pizza1.png")}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 30,
    elevation: 2,
    marginBottom: 1,
    gap: "25%",
    backgroundColor: "#fff",
  },
  title: {
    color: "#ff6b00",
    fontWeight: 900,
    fontSize: 32,
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    width: "25%",
    padding: 10,
    backgroundColor: "#fff",
  },
  btnText: {
    textAlign: "center",
    fontWeight: 700,
    fontSize: 16,
  },
});

export default MenuScreen;

import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import MenuItem from "../Components/MenuItem";
import { useCart } from "../Components/CartContext";

const MenuScreen = () => {
  const { addToCart } = useCart();
  const [active, setActive] = useState<"pizzas" | "bebidas" | "combos" | "postres">("pizzas");

  return (
    <ScrollView>
      <View style={style.header}>
        <Text style={style.title}>Menú</Text>
        <EvilIcons name="search" size={42} color="gray" />
      </View>

      <View style={style.navbar}>
        <TouchableOpacity onPress={() => setActive("pizzas")} style={[style.button, { backgroundColor: active === "pizzas" ? "#ff6b00" : "#fff" }]}>
          <Text style={[style.btnText, { color: active === "pizzas" ? "#fff" : "#666" }]}>Pizzas</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActive("bebidas")} style={[style.button, { backgroundColor: active === "bebidas" ? "#ff6b00" : "#fff" }]}>
          <Text style={[style.btnText, { color: active === "bebidas" ? "#fff" : "#666" }]}>Bebidas</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActive("combos")} style={[style.button, { backgroundColor: active === "combos" ? "#ff6b00" : "#fff" }]}>
          <Text style={[style.btnText, { color: active === "combos" ? "#fff" : "#666" }]}>Combos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActive("postres")} style={[style.button, { backgroundColor: active === "postres" ? "#ff6b00" : "#fff" }]}>
          <Text style={[style.btnText, { color: active === "postres" ? "#fff" : "#666" }]}>Postres</Text>
        </TouchableOpacity>
      </View>

      <View style={{ padding: 20 }}>
        {active === "pizzas" ? (
          <>
            <MenuItem
              name="Pizza Pollo Búfalo"
              price={120}
              size="Pizza Chica"
              image={require("../assets/Images/Pizza1.png")}
              onPress={() =>
                addToCart({
                  id: "menu-pizza-pollo-bufalo",
                  name: "Pizza Pollo Búfalo",
                  price: 120,
                  image: require("../assets/Images/Pizza1.png"),
                })
              }
            />

            <MenuItem
              name="Pizza Pollo Chipotle"
              price={140}
              size="Pizza Mediana"
              image={require("../assets/Images/pizza2.png")}
              onPress={() =>
                addToCart({
                  id: "menu-pizza-chipotle",
                  name: "Pizza Pollo Chipotle",
                  price: 140,
                  image: require("../assets/Images/pizza2.png"),
                })
              }
            />
          </>
        ) : active === "bebidas" ? (
          <>
            <MenuItem
              name="Coca-Cola 500ml"
              price={40}
              size="500ml"
              image={require("../assets/Images/Pizza1.png")}
              onPress={() =>
                addToCart({
                  id: "menu-bebida-coca",
                  name: "Coca-Cola 500ml",
                  price: 40,
                  image: require("../assets/Images/Pizza1.png"),
                })
              }
            />
          </>
        ) : active === "combos" ? (
          <>
            <MenuItem
              name="Combo Familiar"
              price={220}
              size="Familiar"
              image={require("../assets/Images/Pizza1.png")}
              onPress={() =>
                addToCart({
                  id: "menu-combo-1",
                  name: "Combo Familiar",
                  price: 220,
                  image: require("../assets/Images/Pizza1.png"),
                })
              }
            />
          </>
        ) : (
          <>
            <MenuItem
              name="Brownie"
              price={50}
              size="Porcion"
              image={require("../assets/Images/Pizza1.png")}
              onPress={() =>
                addToCart({
                  id: "menu-postre-1",
                  name: "Brownie",
                  price: 50,
                  image: require("../assets/Images/Pizza1.png"),
                })
              }
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
    fontWeight: "900",
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
    fontWeight: "700",
    fontSize: 16,
  },
});

export default MenuScreen;

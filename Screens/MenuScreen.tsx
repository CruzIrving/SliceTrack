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

      <View style={{ padding: 20, marginBottom: 20}}>
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

            <MenuItem
              name="pizza peperonni"
              price={120}
              size="Pizza Chica"
              image={require("../assets/Images/pizza_peperonni.png")}
              onPress={() =>
                addToCart({
                  id: "menu-pizza-peperonni",
                  name: "pizza_peperonni",
                  price: 120,
                  image: require("../assets/Images/pizza_peperonni.png"),
                })
              }
            />

            <MenuItem
              name="Pizza margherita"
              price={250}
              size="Pizza Mediana"
              image={require("../assets/Images/Pizza_margherita_sushi.png")}
              onPress={() =>
                addToCart({
                  id: "menu-Pizza-margherita",
                  name: "Pizza_margherita",
                  price: 250,
                  image: require("../assets/Images/Pizza_margherita_sushi.png"),
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
              image={require("../assets/Images/CocaCola600ml.png")}
              onPress={() =>
                addToCart({
                  id: "menu-bebida-coca",
                  name: "Coca-Cola 500ml",
                  price: 40,
                  image: require("../assets/Images/CocaCola600ml.png"),
                })
              }
            />
            <MenuItem
              name="Coca-Cola 2L"
              price={80}
              size="2L"
              image={require("../assets/Images/cocacola_2L.png")}
              onPress={() =>
                addToCart({
                  id: "menu-bebida-CocaCola-2L",
                  name: "Coca-Cola 2L",
                  price: 80,
                  image: require("../assets/Images/cocacola_2L.png"),
                })
              }
            />

            <MenuItem
              name="Sprite 500ml"
              price={40}
              size="500ml"
              image={require("../assets/Images/sprite_600ml.png")}
              onPress={() =>
                addToCart({
                  id: "menu-bebida-sprite",
                  name: "Sprite 500ml",
                  price: 40,
                  image: require("../assets/Images/sprite_600ml.png"),
                })
              }
            />

            <MenuItem
              name="Fanta 500ml lata"
              price={40}
              size="500ml"
              image={require("../assets/Images/fanta_lata.png")}
              onPress={() =>
                addToCart({
                  id: "menu-bebida-fanta",
                  name: "Fanta de lata",
                  price: 40,
                  image: require("../assets/Images/fanta_lata.png"),
                })
              }
            />

          
          </>
        ) : active === "combos" ? (
          <>
            <MenuItem
              name="Combo Familiar"
              price={400}
              size="Familiar"
              image={require("../assets/Images/ComboFamiliar.png")}
              onPress={() =>
                addToCart({
                  id: "menu-combo-1",
                  name: "Combo Familiar",
                  price: 400,
                  image: require("../assets/Images/ComboFamiliar.png"),
                })
              }
            />

            <MenuItem
              name="Combo Brother"
              price={1000}
              size="Familiar"
              image={require("../assets/Images/combo_brother.png")}
              onPress={() =>
                addToCart({
                  id: "menu-combo-2",
                  name: "Combo Brother",
                  price: 1000,
                  image: require("../assets/Images/combo_brother.png"),
                })
              }
            />

            <MenuItem
              name="Combo chiken"
              price={1000}
              size="Familiar"
              image={require("../assets/Images/pack_pollo.png")}
              onPress={() =>
                addToCart({
                  id: "menu-combo-3",
                  name: "Combo chiken",
                  price: 1000,
                  image: require("../assets/Images/pack_pollo.png"),
                })
              }
            />

            <MenuItem
              name="Combo pastes"
              price={200}
              size="Familiar 10 pastes"
              image={require("../assets/Images/pack_pastes.png")}
              onPress={() =>
                addToCart({
                  id: "menu-combo-4",
                  name: "Combo pastes",
                  price: 200,
                  image: require("../assets/Images/pack_pastes.png"),
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
              image={require("../assets/Images/Brownie.png")}
              onPress={() =>
                addToCart({
                  id: "menu-postre-1",
                  name: "Brownie",
                  price: 50,
                  image: require("../assets/Images/Brownie.png"),
                })
              }
            />

            <MenuItem
              name="pastel de queso"
              price={50}
              size="Porcion"
              image={require("../assets/Images/pastel_de_queso.png")}
              onPress={() =>
                addToCart({
                  id: "menu-postre-2",
                  name: "pastel de queso",
                  price: 50,
                  image: require("../assets/Images/pastel_de_queso.png"),
                })
              }
            />

            <MenuItem
              name="pastel de chocolate"
              price={50}
              size="Porcion"
              image={require("../assets/Images/pastel_de_cocolate.png")}
              onPress={() =>
                addToCart({
                  id: "menu-postre-3",
                  name: "pastel de chocolate",
                  price: 50,
                  image: require("../assets/Images/pastel_de_cocolate.png"),
                })
              }
            />

            <MenuItem
              name="pastel de fresas"
              price={50}
              size="Porcion"
              image={require("../assets/Images/pastel_de_fresa.png")}
              onPress={() =>
                addToCart({
                  id: "menu-postre-1",
                  name: "Brownie",
                  price: 50,
                  image: require("../assets/Images/pastel_de_fresa.png"),
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

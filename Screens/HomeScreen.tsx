import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import SquareCardHome from "../Components/SquareCardHome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";

const HomeScreen = () => {

  return (
    <ScrollView style={style.container}>
      <View style={style.header}>
        <TouchableOpacity>
          <FontAwesome6 name="bell" size={28} color="gray" />
        </TouchableOpacity>
        <Text style={style.title}>Slice Track</Text>
        <TouchableOpacity>
          <Image
            style={style.profile}
            source={require("../assets/Images/image 8.png")}
          />
        </TouchableOpacity>
      </View>

      <View style={style.inputsearch}>
        <View style={{ opacity: 0.5 }}>
          <FontAwesome6 name="magnifying-glass" size={28} color="gray" />
        </View>

        <TextInput
          style={style.searchtext}
          placeholder="¿Qué se te antoja hoy?"
        />
        <TouchableOpacity style={{ marginLeft: "auto", marginRight: 10 }}>
          <Text style={{ fontSize: 20, color: "#ff6b00" }}>Buscar</Text>
        </TouchableOpacity>
      </View>

      <View style={style.promo}>
        <View style={style.promotext}>
          <Text style={{ fontSize: 20, fontWeight: "900", color: "#fff" }}>
            2x1
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#fff" }}>
            Pizza Familiar
          </Text>
        </View>
        <Image
          style={style.promoimg}
          source={require("../assets/Images/image 2.png")}
        />
      </View>

      <View style={style.buttons}>
        <TouchableOpacity style={style.btn}>
          <FontAwesome5
            name="pizza-slice"
            size={20}
            color="orange"
            style={style.iconbtn}
          />
          <Text style={{ fontSize: 16 }}> Pizzas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.btn}>
          <FontAwesome6
            name="glass-water"
            size={20}
            color="orange"
            style={style.iconbtn}
          />
          <Text style={{ fontSize: 16 }}> Bebidas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.btn}>
          <Ionicons
            name="fast-food-outline"
            size={20}
            color="orange"
            style={style.iconbtn}
          />
          <Text style={{ fontSize: 16 }}> Combos</Text>
        </TouchableOpacity>
      </View>

      <Text style={style.advice}>
        <Text style={{ color: "#ff6b00" }}>Nueva:</Text> Pizza Bombina!
      </Text>

      <Text style={style.sectionTitle}>Pizzas populares</Text>

      <View style={style.row}>
        <SquareCardHome
          name="Pizza Pollo Búfalo"
          price={220}
          img={require("../assets/Images/Pizza1.png")}
          size="Grande"
        />

        <SquareCardHome
          name="Pizza Pollo Chipotle"
          price={140}
          img={require("../assets/Images/pizza2.png")}
          size="Mediana"
        />
      </View>

      <Text style={style.sectionTitle}>Pizzas Especiales</Text>

      <View style={style.row}>
        <SquareCardHome
          name="Pizza Pollo Búfalo"
          price={220}
          img={require("../assets/Images/Pizza1.png")}
          size="Grande"
        />

        <SquareCardHome
          name="Pizza Pollo Chipotle"
          price={140}
          img={require("../assets/Images/pizza2.png")}
          size="Mediana"
        />
      </View>
      <View style={{ height: 50, width: 50, }}></View>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    marginTop: 40,
    backgroundColor: "#f0f0f0",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  title: {
    fontSize: 32,
    color: "#ff6b00",
    fontWeight: "900",
    fontFamily: "Montserrat",
  },
  profile: {
    width: 32,
    height: 32,
    borderColor: "#00f",
    borderWidth: 2,
    borderRadius: 20,
  },
  inputsearch: {
    marginTop: 40,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    paddingLeft: 10,
    borderColor: "#ff6b00",
    borderRadius: 5,
    borderWidth: 2,
  },
  searchtext: {
    color: "#787878ff",
    fontSize: 16,
    marginLeft: 10,
    marginRight: 40,
  },
  promo: {
    width: "100%",
    position: "relative",
    marginTop: 15,
  },
  promotext: {
    zIndex: 1,
    width: 130,
    padding: 10,
    position: "absolute",
    top: 55,
    backgroundColor: "#ff6b00",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  promoimg: {
    borderRadius: 10,
    width: "100%",
    height: 170,
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
  },
  iconbtn: {
    borderRadius: 20,
    overflow: "hidden",
    borderColor: "#ff6b00",
    borderWidth: 1,
    width: 28,
    height: 28,
    textAlign: "center",
    lineHeight: 25,
  },
  btn: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  advice: {
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 5,
    fontSize: 16,
    marginRight: "auto",
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    textAlign: "left",
    marginRight: "auto",
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
});

export default HomeScreen;

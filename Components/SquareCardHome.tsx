import { View, Text, StyleSheet, Image, TouchableOpacity, processColor } from "react-native";
import React from "react";
import { useCart } from "./CartContext";

const SquareCardHome = ({
  name,
  price,
  img,
  size,
}: {
  name: string;
  price: number;
  img: any;
  size: string;
}) => {
  const { addToCart } = useCart();
  return (
    <View style={style.squarecard}>
      <TouchableOpacity
        onPress={() =>
          addToCart({
            id: `${name}_id`,
            name: `${name}`,
            price: price,
            image: img,
            size: `${size}`,
          })
        }
      >
        <Image style={style.pizza} source={img} />
        <Text style={style.name}>{name}</Text>
        <Text style={style.size}>{size}</Text>
        <Text style={style.price}>${price}</Text>
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
  squarecard: {
    width: 160,
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 10,
    elevation: 5,
  },
  pizza: {
    marginRight: "auto",
    marginLeft: "auto",
    width: 100,
    height: 100,
  },
  name: {
    fontWeight: 900,
    fontSize: 14,
    textAlign: "center",
    color: "rgba(0, 0, 0, 1)",
  },
  size: {
    color: "#999",
    fontSize: 14,
    fontWeight: 700,
    textAlign: "center",
  },
  price: {
    textAlign: "center",
    fontWeight: 900,
    fontSize: 16,
    color: "rgba(255, 115, 0, 1)",
  },
});

export default SquareCardHome;

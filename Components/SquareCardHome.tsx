import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";

const SquareCardHome = ({
  name,
  price,
  img,
}: {
  name: string;
  price: number;
  img: any;
}) => {
  return (
    <View style={style.squarecard}>
      <TouchableOpacity>
        <Image style={style.pizza} source={img} />
        <Text style={style.name}>{name}</Text>
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
  price: {
    textAlign: "center",
    fontWeight: 900,
    fontSize: 16,
    color: "rgba(255, 115, 0, 1)",
  },
});

export default SquareCardHome;

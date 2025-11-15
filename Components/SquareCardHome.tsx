import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'

const SquareCardHome = (Name: string, Price: number, img: string) => {
  return (
    <View style={style.squarecard}>
        <Image
        style={style.pizza}
        source={require(img)}
        />
      <Text style={style.name} >{Name}</Text>
      <Text style={style.price}>{Price}</Text>
    </View>
  )
}

const style = StyleSheet.create({
    squarecard: {
        width: 150,
        borderRadius: 20,
        backgroundColor: "#fff",
    },
    pizza: {
        width: 100,
    },
    name: {
        fontWeight: 900,
        fontSize: 16,
        textAlign: "center",
        color: "rgba(255, 255, 255, 1)",
    },
    price: {
        color: "rgba(255, 115, 0, 1)",
    },
})

export default SquareCardHome
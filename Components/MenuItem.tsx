import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import Entypo from '@expo/vector-icons/Entypo';
import React from 'react'

const MenuItem = ({name, size, price, image}: {name: string, size: string, price: number, image: any } ) => {
  return (
    <View style={style.element}>
        <Image style={style.img} source={image}></Image>
        <View>
            <Text style={style.name}>{name}</Text>
            <Text style={style.size}>{size}</Text>
        </View>
        <TouchableOpacity>
        <Entypo style={style.icon} name="plus" size={24} color="white" />
        <Text style={style.price}>${price}</Text>
        </TouchableOpacity>
    </View>
  )
}

const style = StyleSheet.create({
    element:{
        width: "100%",
        elevation: 5,
        backgroundColor: "#fff",
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    img:{
        width: 100,
        height: 100,
        marginRight: 5,
    }
    ,name:{
        fontWeight: 900,
        fontSize: 20,
    }
    ,size:{
        fontWeight: 700,
        fontSize: 16,
        color: "#979797ff",
    }
    ,icon:{
        backgroundColor: "#ff6b00",
        textAlign: "center",
        borderRadius: 100,
        padding: 10,
    },
    price:{
        fontWeight: 900,
        fontSize: 20,
        fontFamily: "Montserrat",
        color: "#ff6b00",
    }
})

export default MenuItem
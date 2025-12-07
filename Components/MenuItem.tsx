import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import Entypo from '@expo/vector-icons/Entypo';
import React from 'react'

const MenuItem = ({name, size, price, image, onPress}: {name: string, size: string, price: number, image: any, onPress?: () => void } ) => {
    return (
        <View style={style.element}>
            <Image style={style.img} source={image} />

            <View>
                <Text style={style.name}>{name}</Text>
                <Text style={style.size}>{size}</Text>
            </View>

            <TouchableOpacity onPress={onPress}>
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
        marginBottom: 20,
    },
    img: {
        width: 90,
        height: 90,
        resizeMode: "contain",
        marginRight: 10,
    },

    name:{
        fontWeight: "900",
        fontSize: 20,
    },
    size:{
        fontWeight: "700",
        fontSize: 16,
        color: "#979797ff",
    },
    icon:{
        backgroundColor: "#ff6b00",
        textAlign: "center",
        borderRadius: 100,
        padding: 10,
    },
    price:{
        fontWeight: "900",
        fontSize: 20,
        fontFamily: "Montserrat",
        color: "#ff6b00",
    }
})

export default MenuItem

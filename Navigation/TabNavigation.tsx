import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../Screens/HomeScreen'
import MenuScreen from '../Screens/MenuScreen'
import CarritoScreen from '../Screens/CarritoScreen'
import ProfileScreen from '../Screens/ProfileScreen'

const Tab = createBottomTabNavigator()

const TabNavigation = () => {
  return (
    <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Menu" component={MenuScreen} />
        <Tab.Screen name="Carrito" component={CarritoScreen} />
        <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

export default TabNavigation;
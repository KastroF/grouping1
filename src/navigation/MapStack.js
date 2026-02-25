import React from 'react'
import {createStackNavigator} from "@react-navigation/stack"
import Map from '../screens/Map'
import ChatBot from '../screens/ChatBot'
import ContainerMap from '../screens/ContainerMap'

const Stack = createStackNavigator()

export default function MapStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen name='Map1' component={Map} options={{
            headerShown: false
        }} />
        <Stack.Screen name='ContainerMap' component={ContainerMap} options={{
            headerShown: false
        }} />
        <Stack.Screen name='ChatBot' component={ChatBot} options={{
            headerShown: false
        }} />
    </Stack.Navigator>
  )
}

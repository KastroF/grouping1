import React from 'react'
import {createStackNavigator} from "@react-navigation/stack"
import Parrainage from '../screens/Parrainage'
import Congrats from '../screens/Congrats'



const Stack = createStackNavigator()


export default function CongratStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen name='Parrainage'  component={Parrainage} options={{
            headerShown: false
        }} />
        <Stack.Screen name='Congrats'  component={Congrats} options={{
            headerShown: false
        }} />
    </Stack.Navigator>
  )
}

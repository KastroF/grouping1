import React from 'react'
import {createStackNavigator} from "@react-navigation/stack"
import Congrats from '../screens/Congrats'



const Stack = createStackNavigator()


export default function CongratStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen name='Congrats'  component={Congrats} options={{
            headerShown: false
        }} />
    </Stack.Navigator> 
  )
}

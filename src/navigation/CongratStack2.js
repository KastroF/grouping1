import React from 'react'
import {createStackNavigator} from "@react-navigation/stack"
import Congrats2 from '../screens/Congrats2'



const Stack = createStackNavigator()
export default function CongratStack2() {
  return (
    <Stack.Navigator>
        <Stack.Screen name='Congrats2' component={Congrats2} options={{
            headerShown: false
        }} />
    </Stack.Navigator>
  )
}

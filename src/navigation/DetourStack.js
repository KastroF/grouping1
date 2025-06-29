import React from 'react'
import {createStackNavigator} from "@react-navigation/stack"
import Detour from '../screens/Detour'
import Login from '../screens/Login'
import SignIn from '../screens/SignIn'



const Stack = createStackNavigator()

export default function DetourStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen name='Detour' component={Detour} options={{
            headerShown: false
        }} />
        <Stack.Screen name='Login1' component={Login} options={{
            headerShown: false
        }} />
        <Stack.Screen name='Sign In' component={SignIn} options={{
          headerShown: false, 
          
        }} />
    </Stack.Navigator>
  )
}

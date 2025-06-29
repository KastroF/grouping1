import React from 'react'


import {createStackNavigator} from "@react-navigation/stack"
import Login from '../screens/Login'
import SignIn from '../screens/SignIn'
import ValideCode from '../screens/ValideCode'
import Disconnect from '../screens/Disconnect'
const Stack = createStackNavigator()

export default function LoginStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen name='Login1' component={Login} options={{
            headerShown: false
        }} />
        <Stack.Screen name='Sign In' component={SignIn} options={{
          headerShown: false, 
          
        }} />
         <Stack.Screen name='Valide Code' component={ValideCode} options={{
          headerShown: false, 
          
        }} />
          <Stack.Screen name='Deconnexion' component={Disconnect} options={{
          headerShown: false, 
          
        }} />
    </Stack.Navigator>
  )
}

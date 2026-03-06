import React from 'react'
import {createStackNavigator} from "@react-navigation/stack"
import Congrats2 from '../screens/Congrats2'



const Stack = createStackNavigator()
export default function CongratStack2({type, goHome}) {
  return (
    <Stack.Navigator>
        <Stack.Screen name='Congrats2' options={{
            headerShown: false
        }}>
          {(props) => <Congrats2 {...props} type={type} goHome={goHome} />}
        </Stack.Screen>
    </Stack.Navigator>
  )
}

import React from 'react'

import {createStackNavigator} from "@react-navigation/stack"
import OnboardingScreen from '../screens/OnboardingScreen';
import Home from '../screens/Home';
import HomeStack from './HomeStack';
import BottomTabBar from './BottomTabBar';
import { useNavigation } from '@react-navigation/native';


const Stack = createStackNavigator(); 


export default function AppStack() {
  return (
    <Stack.Navigator >

<Stack.Screen name='OnboardingScreen' component={OnboardingScreen} options={{
            headerShown: false
        }} />

            <Stack.Screen name='Tab'component={BottomTabBar}  options={{
            headerShown: false
       
       }} />
            
       

       
 
    </Stack.Navigator>
  )
}

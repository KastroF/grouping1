import React from 'react'

import {createStackNavigator} from "@react-navigation/stack"; 
import MyAccount from '../screens/MyAccount';
import Disconnect from '../screens/Disconnect';
import CreateAnnouncement from '../screens/CreateAnnouncement';
import AnnouncementForm from '../screens/AnnouncementForm';
import MyAnnouncements from '../screens/MyAnnouncements';
import Parameters from '../screens/Parameters';
import AnnonceDetails from '../screens/AnnonceDetails';
import Reception from '../screens/Reception';
import Messenger from '../screens/Messenger';
import Modify from '../screens/Modify';
import Connexion from '../screens/Connexion';
import ChatBot from '../screens/ChatBot';
import ContainerMap from '../screens/ContainerMap';

const Stack = createStackNavigator()

export default function MyAccountStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen name='MyAccount' component={MyAccount} options={{
            headerShown: false
        }} />
        <Stack.Screen name='Deconnexion' component={Disconnect} options={{
          headerShown: false, 
          
        }} />
          <Stack.Screen name="Announcement" component={CreateAnnouncement} options={{
            headerShown: false
        }} />
         <Stack.Screen name="AnnouncementForm" component={AnnouncementForm} options={{
            headerShown: false
        }} />
           <Stack.Screen name='My Announcements' component={MyAnnouncements} options={{
            headerShown: false
        }} />
          <Stack.Screen name='Parameters' component={Parameters} options={{
            headerShown: false
        }} />
            <Stack.Screen name='Details' component={AnnonceDetails} options={{
            headerShown: false
        }} />
         <Stack.Screen name='Reception' component={Reception} options={{
            headerShown: false
        }} />
         <Stack.Screen name='Messenger' component={Messenger} options={{
          headerShown: false, 
          
        }} />
          <Stack.Screen name='Modify' component={Modify} options={{
            headerShown: false
        }} />
         <Stack.Screen name='Connexion' component={Connexion} options={{
            headerShown: false
        }} />
         <Stack.Screen name='ChatBot' component={ChatBot} options={{
            headerShown: false
        }} />
         <Stack.Screen name='ContainerMap' component={ContainerMap} options={{
            headerShown: false
        }} />
    </Stack.Navigator>
  
  )
}

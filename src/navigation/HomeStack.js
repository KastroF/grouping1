import React from 'react'

import {createStackNavigator} from "@react-navigation/stack"
import Home from '../screens/Home'
import CreateAnnouncement from '../screens/CreateAnnouncement'
import AnnouncementForm from '../screens/AnnouncementForm'
import Search from '../screens/Search'
import MyAccount from '../screens/MyAccount'
import MyAnnouncements from '../screens/MyAnnouncements'
import Disconnect from '../screens/Disconnect'
import AnnonceDetails from '../screens/AnnonceDetails'
import Parameters from '../screens/Parameters'
import Ouhaaa from '../screens/Ouhaaa'
import Login from '../screens/Login'
import SignIn from '../screens/SignIn'
import Messenger from '../screens/Messenger'
import Reception from '../screens/Reception'
import Modify from '../screens/Modify'
import Connexion from '../screens/Connexion'

const Stack = createStackNavigator()

export default function HomeStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen name="Hommee" component={Home} options={{
            headerShown: false
        }} />
        <Stack.Screen name="Announcement" component={CreateAnnouncement} options={{
            headerShown: false
        }} />
         <Stack.Screen name="AnnouncementForm" component={AnnouncementForm} options={{
            headerShown: false
        }} />
         <Stack.Screen name="Search" component={Search} options={{
            headerShown: false
        }} />
        <Stack.Screen name='MyAccount' component={MyAccount} options={{
            headerShown: false
        }} />
          <Stack.Screen name='My Announcements' component={MyAnnouncements} options={{
            headerShown: false
        }} />
          <Stack.Screen name='Details' component={AnnonceDetails} options={{
            headerShown: false
        }} />
           <Stack.Screen name='Parameters' component={Parameters} options={{
            headerShown: false
        }} />
          <Stack.Screen name='Deconnexion' component={Disconnect} options={{
          headerShown: false, 
          
        }} />
          <Stack.Screen name='Ouhaaa' component={Ouhaaa} options={{
          headerShown: false, 
          
        }} />
          <Stack.Screen name='Login1' component={Login} options={{
            headerShown: false
        }} />
        <Stack.Screen name='Sign In' component={SignIn} options={{
          headerShown: false, 
          
        }} />
         <Stack.Screen name='Messenger' component={Messenger} options={{
          headerShown: false, 
          
        }} />
          <Stack.Screen name='Reception' component={Reception} options={{
            headerShown: false
        }} />
         <Stack.Screen name='Modify' component={Modify} options={{
            headerShown: false
        }} />
          <Stack.Screen name='Connexion' component={Connexion} options={{
            headerShown: false
        }} />
    </Stack.Navigator>
  )
}

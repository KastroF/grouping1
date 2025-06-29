import React from 'react'
import {createStackNavigator} from "@react-navigation/stack"
import MyAnnouncements from '../screens/MyAnnouncements'
import CreateAnnouncement from '../screens/CreateAnnouncement'
import AnnouncementForm from '../screens/AnnouncementForm'
import AnnonceDetails from '../screens/AnnonceDetails'


const Stack = createStackNavigator()


export default function MyAnnouncementStack() {
  return (
    <Stack.Navigator >
        <Stack.Screen name='My Announcements' component={MyAnnouncements} options={{
            headerShown: false
        }} />
          <Stack.Screen name="Announcement" component={CreateAnnouncement} options={{
            headerShown: false
        }} />
         <Stack.Screen name="AnnouncementForm" component={AnnouncementForm} options={{
            headerShown: false
        }} />
        <Stack.Screen name='Details' component={AnnonceDetails} options={{
            headerShown: false
        }} />
    </Stack.Navigator>
  )
}

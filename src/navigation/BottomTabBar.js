import React, { useContext, useEffect, useRef, useState } from 'react'

import {createBottomTabNavigator} from "@react-navigation/bottom-tabs"
import HomeStack from './HomeStack';
import MapStack from './MapStack';
import LoginStack from './LoginStack';
import { Image, Platform, StyleSheet, PermissionsAndroid, View, Alert, } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { AuthContext } from './AuthProvider';
import MyAccountStack from './MyAccountStack';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import notifee from '@notifee/react-native';
import { useFetchFunctions } from '../infrastructures/functions';
import { useNotifications } from '../notifications/useNotifications';


const Tab = createBottomTabNavigator(); 


const VIEW_NOTIFS_URL = "https://grouping.glitch.me/api/notification/viewnotifs";
//const VIEW_NOTIFS_URL = "https://grouping-82aac4e3da78.herokuapp.com/api/notification/viewnotifs";


export default function BottomTabBar() {

    const {isTabBarVisible, setIsTabBarVisible, user, setBadgee, token, badgee} = useContext(AuthContext);
    const {laFonctionGet} = useFetchFunctions()
   
   // const  = useNavigation(); 

   useNotifications();

    useEffect(() => {

      // alert(isTabBarVisible);
      setIsTabBarVisible(false);

      console.log("Le token est là", token);


       notifee.setBadgeCount(0);


     /*  messaging().setBackgroundMessageHandler(async (message) => {

        const badge = message.data?.badge || 0; 
  
       

        await notifee.setBadgeCount(parseInt((badge)));

       

        const status = message.data?.status || null; 


          //  setLerefresh(!lerefresh)
          setBadgee(badge);

          console.log("le message", message);


      })
  
      messaging().onMessage(async (message) => {

        console.log("regarde bien l'arrivée");
  
          const badge = message.data?.badge || 0; 
  
         // Alert.alert(message.notification.title, message.notification.body);
          setBadgee(badge);

          await notifee.setBadgeCount(parseInt((badge)));

          
  
          const status = message.data?.status || null; 

          console.log("le meaage", message);
  
  
            //  setLerefresh(!lerefresh)
           

          


          
      })  */

      messaging().onNotificationOpenedApp(async (message) => {

        await notifee.setBadgeCount(0);
        

        laFonctionGet(VIEW_NOTIFS_URL, {token}).then((data) => {

            if(data && data.status === 0){

                    console.log("Tout est Ok Ok");
            }

          }, (err) => {

                console.log(err); 

          })


      })


    }, [])

  return (
    <Tab.Navigator 
        
    screenOptions={{
        tabBarShowLabel: false, 
    
        tabBarStyle: {
            position: "absolute", 
            bottom: 0, 
            left: 0, 
            right: 0, 
            elevation: 0, 
            display: !isTabBarVisible ? "flex" : "none",
            backgroundColor: "#fff", 
            borderTopRightRadius: 15, 
            borderTopLeftRadius: 15,
           // display:  "flex", // Contrôle de la visibilité, 
            paddingBottom:  0, 
           
        }
    
    }}
    >
        <Tab.Screen name='Home' component={HomeStack} options={{
            headerShown: false, 
            
            tabBarIcon: ({focused}) => (

                    <View style={{
                        backgroundColor: focused ? COLORS.primary : "white", padding: Platform.OS === 'android' ? 5 : 10,   borderRadius: SIZES.height * 0.5, 
                        justifyContent: "center", 
                        alignItems: "center"
                    }}>

                        <Image  source={focused ? require("../assets/images/home2.png") :  require("../assets/images/home.png")}
                            style={{
                                height: focused ? SIZES.h4 : SIZES.h3,  
                                width:focused ? SIZES.h4 : SIZES.h3, 
                                resizeMode: "contain"
                            }}
                        />

                    </View>
            )
          
        }} />

         <Tab.Screen name='Map' component={MapStack} options={{
            headerShown: false, 
            
            tabBarIcon: ({focused}) => (

                    <View style={{
                        backgroundColor: focused ? COLORS.primary : "white", padding: Platform.OS === 'android' ? 5 : 10,   borderRadius: SIZES.height * 0.5, 
                        justifyContent: "center", 
                        alignItems: "center"
                    }}>

                        <Image  source={ focused ? require("../assets/images/white_map.png") :  require("../assets/images/map.png")} 
                            style={{
                                height:  focused ? SIZES.h4 : SIZES.h3, 
                                width: focused ? SIZES.h4 : SIZES.h3, 
                                resizeMode: "contain"
                            }}
                        />

                    </View>
            )
          
        }} />

<Tab.Screen name={token ? "MonCompte" : 'Login' }  component={token ? MyAccountStack : LoginStack} options={{
            headerShown: false, 
            tabBarBadge: badgee === 0 ? null : badgee,
            tabBarBadgeStyle: {
                backgroundColor: 'red', // Couleur de fond du badge
                color: 'white', // Couleur du texte du badge
                fontSize: 12, // Taille du texte du badge
              },
            tabBarIcon: ({focused}) => (

                    <View style={{
                        backgroundColor: focused ? COLORS.primary : "white", padding: (user && user.photo) ? 5 : Platform.OS === 'android' ? 5 : 10,   borderRadius: SIZES.height * 0.5, 
                        justifyContent: "center", 
                        alignItems: "center"
                    }}>

            <Image source={ (token  && user)  ?  user.photo ?  {uri: user.photo} : focused ? require("../assets/images/white_user.png") : require("../assets/images/user.png") :  focused ?  require("../assets/images/white_connexion.png") : require("../assets/images/adduser.png") } 
                    style={{
                        height: token ? (user && !user.photo) ? focused?  SIZES.h4 :SIZES.h3 :  focused?  SIZES.h3 :SIZES.h2 : focused?  SIZES.h4 :SIZES.h3,
                        width: token ? (user && !user.photo) ? focused?  SIZES.h4 :SIZES.h3 :  focused?  SIZES.h3 :SIZES.h2:  focused?  SIZES.h4 :SIZES.h3, 
                        resizeMode: "cover", 
                        borderRadius : (user && user.photo) ? SIZES.height * 0.5 : 0 
                    }} />

                    </View>
            )
          
        }}
        listeners={{
            tabPress: () => {

                setBadgee(0);
            }
        }}
        />
    {/*
        <Tab.Screen name='Home' component={HomeStack} options={{
            headerShown: false, 
            
            
            tabBarIcon: ({focused}) => (
                
                <View style={{alignItems: "center", justifyContent: "center", top: Platform.OS === "android" ? 0 : 5, 
                backgroundColor: focused ? COLORS.primary : "white", padding: 10,   borderRadius: SIZES.height * 0.5}}>
          
                     <Image source={ focused ? require("../assets/images/home2.png") :  require("../assets/images/home.png")} style={{
                        height: focused?  SIZES.height * 0.02 :SIZES.height * 0.03,
                        width: focused ? SIZES.height * 0.02 :SIZES.height * 0.03,  
                        resizeMode: "contain"
                     }} />
                 
                </View>
            )
        }} />
        <Tab.Screen name='Map' component={MapStack} options={{
            headerShown: false, 
            tabBarIcon: ({focused}) => (
                <View style={{alignItems: "center", justifyContent: "center", top: Platform.OS === "android" ? 0 : 10, 
                backgroundColor: focused ? COLORS.primary : "white", padding: 10,  borderRadius: SIZES.height * 0.5}}>
                       <Image source={ focused ? require("../assets/images/white_map.png") :  require("../assets/images/map.png")} 
                        style={{
                            height: focused?  SIZES.height * 0.02 :SIZES.height * 0.03, 
                            width: focused ? SIZES.height * 0.02 :SIZES.height * 0.03,  
                            resizeMode: "contain"
                        }} />
        
                </View>
            )
        }} />
        <Tab.Screen name={token ? "MonCompte" : 'Login' }  component={token ? MyAccountStack : LoginStack} options={{
            headerShown: false, 
            tabBarIcon: ({focused}) => (
                <View style={{alignItems: "center", justifyContent: "center", top: Platform.OS === "android" ? 0 : 10, 
                backgroundColor: focused ? COLORS.primary : "white", padding: focused ? 5 : 10,  borderRadius: SIZES.height * 0.5}}>
                    <Image source={ (token  && user)  ?  user.photo ?  {uri: user.photo} : focused ? require("../assets/images/white_user.png") : require("../assets/images/user.png") :  focused ?  require("../assets/images/white_connexion.png") : require("../assets/images/adduser.png") } 
                    style={{
                        height: token ? (user && !user.photo) ? focused?  SIZES.height * 0.02 :SIZES.height * 0.03 :  focused?  SIZES.height * 0.04 :SIZES.height * 0.05 : focused?  SIZES.height * 0.02 :SIZES.height * 0.03,
                        width: token ? (user && !user.photo) ? focused?  SIZES.height * 0.02 :SIZES.height * 0.03 :  focused ? SIZES.height * 0.04 :SIZES.height * 0.05 :  focused ? SIZES.height * 0.02 :SIZES.height * 0.03,  
                        resizeMode: "contain", 
                        borderRadius : (user && user.photo) ? SIZES.height * 0.1 : 0 
                    }} />
                </View>
            )
        }} />

    */}


    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({

    shadow: {
        shadowColor: COLORS.orange, 
        shadowOffset: {
            width: 0, 
            height: 10,
        }, 
        shadowOpacity: 0.25, 
        shadowRadius: 3.5, 
        elevation: 5
    }
})

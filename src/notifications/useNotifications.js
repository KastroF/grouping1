import React, { useContext, useEffect } from 'react'
import {PermissionsAndroid, Platform} from 'react-native';
import messaging from "@react-native-firebase/messaging"
import DeviceInfo from 'react-native-device-info';
import { AuthContext } from '../navigation/AuthProvider';
import { useFetchFunctions } from '../infrastructures/functions';
import { API } from '../config/api';

const SAVE_FCMTOKEN_URL = API.USER_UPDATE_FCM;

const requestUserPermissions = async () => {

        
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

        if(granted === PermissionsAndroid.RESULTS.GRANTED){

            console.log("Nous avons la permission pour les notifs"); 


        }else{

            console.log("C'est chaud pour les notifs les gars");

        }
    }




export const useNotifications = () => {
    
    const {token} = useContext(AuthContext); 
    const {postFunction} = useFetchFunctions()



    const getToken = async () => {

        try{

            messaging().requestPermission();
            const tokenn = await messaging().getToken(); 
            const uniqueId = await  DeviceInfo.getUniqueId();
            console.log("Le token", token);
            console.log("FCM Token", tokenn);

            if(token){


                postFunction(SAVE_FCMTOKEN_URL, {deviceId: uniqueId, fcmToken: tokenn}, token).then(() => {

                    
                })
            }


        }catch(err){

                console.log(err)
        }
    }


    useEffect(() => {

        if(Platform.OS === "android"){
            requestUserPermissions();
        }
       
       getToken();

    },[token])
}

/*

import { View, Text, PermissionsAndroid, Platform } from 'react-native'
import React, { useContext, useEffect } from 'react'
import messaging from "@react-native-firebase/messaging"
import { useFetchFunctions } from '../utils/functions';
import { AuthContext } from '../navigation/AuthProvider';

const ADD_FCM_TOKEN_URL_ANDROID = "https://kredix.onrender.com/api/token/addtoken";

const ADD_FCM_TOKEN_URL_IOS = "https://kredix.onrender.com/api/token/addtoken";


const requestUserPermission = async () => {

        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS); 

        if(granted === PermissionsAndroid.RESULTS.GRANTED){

            console.log("Notification permission granted")
        
        }else{

            console.log("Notification permission denied")
        }

    }



export default function useNotification() {

    const {postData} = useFetchFunctions(); 
    const {token} = useContext(AuthContext); 


    const getToken = async () => {

        try{

            messaging().requestPermission();
            const tokenn = await messaging().getToken(); 
            console.log("FCM Token", tokenn); 

            postData(Platform.OS === "android" ? ADD_FCM_TOKEN_URL_ANDROID : 
                ADD_FCM_TOKEN_URL_IOS, {token: tokenn, platform: Platform.OS === "android" ? "android" : "ios"}, token
            ).then((data) => {

                if(data){

                    console.log("Yes", data)
                }

            }, (err) => {

                    console.log(err);
            })
          


        }catch(err){

            console.log("Failed to get Fcm Token", err); 
        }
}

 useEffect(() => {
    
    requestUserPermission();
    getToken();

 },[]); 

 /*useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Message reçu en foreground !', remoteMessage);
  
      // Affichage local si besoin
      notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        android: {
          channelId: 'default',
          smallIcon: 'ic_launcher', // Utilise ton nom d’icône
        },
      });
    });
  
    return unsubscribe;
  }, []); 



}
*/

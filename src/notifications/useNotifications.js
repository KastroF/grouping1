import React, { useContext, useEffect } from 'react'
import {PermissionsAndroid, Platform} from 'react-native';
import messaging from "@react-native-firebase/messaging"
import DeviceInfo from 'react-native-device-info';
import { AuthContext } from '../navigation/AuthProvider';
import { useFetchFunctions } from '../infrastructures/functions';


const ADD_FCM_TOKEN_URL = "https://mavoiex.glitch.me/api/user/addfcmtoken"; 
const SAVE_FCMTOKEN_URL = "https://grouping.glitch.me/api/user/updatefcmToken";
//const SAVE_FCMTOKEN_URL = "https://grouping-82aac4e3da78.herokuapp.com/api/user/updatefcmToken";

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

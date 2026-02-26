import React, { useContext, useEffect } from 'react'
import {PermissionsAndroid, Platform} from 'react-native';
import messaging from "@react-native-firebase/messaging"
import DeviceInfo from 'react-native-device-info';
import { AuthContext } from '../navigation/AuthProvider';
import { useFetchFunctions } from '../infrastructures/functions';
import { API } from '../config/api';

const SAVE_FCMTOKEN_URL = API.USER_UPDATE_FCM;

const saveFcmToken = async (postFunction, authToken) => {
    try {
        const fcmToken = await messaging().getToken();
        const deviceId = await DeviceInfo.getUniqueId();
        console.log("FCM Token:", fcmToken);

        if (authToken && fcmToken) {
            await postFunction(SAVE_FCMTOKEN_URL, { deviceId, fcmToken }, authToken);
            console.log("FCM Token enregistré avec succès");
        }
    } catch (err) {
        console.log("Erreur récupération FCM Token:", err);
    }
};

export const useNotifications = () => {

    const {token} = useContext(AuthContext);
    const {postFunction} = useFetchFunctions();

    const requestAndGetToken = async () => {
        try {
            // Demander la permission (Android + iOS)
            if (Platform.OS === "android") {
                await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                );
            }

            // Attendre la permission Firebase (important pour iOS)
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
                console.log("Permission notifications accordée:", authStatus);
                await saveFcmToken(postFunction, token);
            } else {
                console.log("Permission notifications refusée");
            }
        } catch (err) {
            console.log("Erreur permissions:", err);
        }
    };

    useEffect(() => {
        if (token) {
            requestAndGetToken();
        }
    }, [token]);

    // Écouter le rafraîchissement du token FCM
    useEffect(() => {
        const unsubscribe = messaging().onTokenRefresh(async (newFcmToken) => {
            console.log("FCM Token rafraîchi:", newFcmToken);
            try {
                const deviceId = await DeviceInfo.getUniqueId();
                if (token) {
                    await postFunction(SAVE_FCMTOKEN_URL, { deviceId, fcmToken: newFcmToken }, token);
                    console.log("Nouveau FCM Token enregistré");
                }
            } catch (err) {
                console.log("Erreur mise à jour FCM Token:", err);
            }
        });

        return unsubscribe;
    }, [token]);
}

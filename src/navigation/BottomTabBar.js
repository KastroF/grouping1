import React, { useContext, useEffect, useState } from 'react'

import {createBottomTabNavigator} from "@react-navigation/bottom-tabs"
import HomeStack from './HomeStack';
import MapStack from './MapStack';
import LoginStack from './LoginStack';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { AuthContext } from './AuthProvider';
import MyAccountStack from './MyAccountStack';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { useFetchFunctions } from '../infrastructures/functions';
import { useNotifications } from '../notifications/useNotifications';
import { useNavigation } from '@react-navigation/native';
import { API } from '../config/api';
import NotificationBanner from '../components/NotificationBanner';
import FloatingChatButton from '../components/FloatingChatButton';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';

const Tab = createBottomTabNavigator();

const VIEW_NOTIFS_URL = API.NOTIF_VIEW;

// Badge anime
function AnimatedBadge({ count }) {
  const scale = useSharedValue(0);

  useEffect(() => {
    if (count > 0) {
      scale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withSpring(1, { damping: 12, stiffness: 200 })
      );
    } else {
      scale.value = withTiming(0, { duration: 150 });
    }
  }, [count]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  if (count === 0) return null;

  return (
    <Animated.View style={[badgeStyles.container, animatedStyle]}>
      <Text style={badgeStyles.text}>
        {count > 99 ? '99+' : count}
      </Text>
    </Animated.View>
  );
}

const badgeStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    zIndex: 10,
  },
  text: {
    color: '#fff',
    fontSize: 11,
    fontFamily: FONTS.bold,
    fontWeight: '700',
  },
});


export default function BottomTabBar() {

    const {isTabBarVisible, setIsTabBarVisible, user, setBadgee, token, badgee} = useContext(AuthContext);
    const {laFonctionGet} = useFetchFunctions();
    const navigation = useNavigation();

    // Notification banner states
    const [isVisible, setIsVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [leStatut, setLeStatut] = useState(null);
    const [senderId, setSenderId] = useState('');

    useNotifications();

    useEffect(() => {

      setIsTabBarVisible(false);

      notifee.setBadgeCount(0);

      // Fetch initial badge count from API
      if(token){
        laFonctionGet(API.NOTIF_NOT_READ, token).then((data) => {
          if(data && data.status === 0){
            setBadgee(data.badges || 0);
          }
        }, (err) => {
          console.log(err);
        })
      }

      // Créer le channel Android (requis pour Android 8+)
      const createChannel = async () => {
        await notifee.createChannel({
          id: 'default',
          name: 'Notifications',
          importance: 4, // HIGH
          sound: 'default',
          vibration: true,
        });
      };
      createChannel();

      // Foreground notifications - visible on ALL screens
      const unsubOnMessage = messaging().onMessage(async (message) => {
        const badge = message.data?.badge || 0;

        await notifee.setBadgeCount(parseInt(badge));

        const notifTitle = message.notification?.title || '';
        const notifBody = message.notification?.body || '';

        setTitle(notifTitle);
        setBody(notifBody);
        setBadgee(parseInt(badge));
        setIsVisible(true);

        // Afficher une vraie notification système en foreground
        await notifee.displayNotification({
          title: notifTitle,
          body: notifBody,
          android: {
            channelId: 'default',
            smallIcon: 'ic_launcher',
            sound: 'default',
            pressAction: { id: 'default' },
          },
          ios: {
            sound: 'default',
          },
        });

        const status = message.data?.status || null;
        if (status) {
          setLeStatut(status);
          if (parseInt(status) === 5) {
            setSenderId(message.data?.senderId);
          }
        }
      });

      // Notification opened from background
      const unsubOnOpen = messaging().onNotificationOpenedApp(async (message) => {
        await notifee.setBadgeCount(0);
        setBadgee(0);

        if (token) {
          laFonctionGet(VIEW_NOTIFS_URL, token);
        }

        const status = message.data?.status;
        if (status && parseInt(status) === 0) {
          navigation.navigate('MonCompte', { screen: 'My Announcements' });
        }
        if (status && parseInt(status) === 1) {
          navigation.navigate('MonCompte', { screen: 'Details', params: { _id: message.data?.annonceId } });
        }
        if (status && parseInt(status) === 5) {
          navigation.navigate('MonCompte', { screen: 'Messenger', params: { _id: message.data?.senderId } });
        }
      });

      return () => {
        unsubOnMessage();
        unsubOnOpen();
      };

    }, [])

    const handleBannerPress = () => {
      setIsVisible(false);
      setTimeout(() => {
        if (parseInt(leStatut) === 5) {
          navigation.navigate('MonCompte', { screen: 'Messenger', params: { _id: senderId } });
        }
        if (parseInt(leStatut) === 0) {
          navigation.navigate('MonCompte', { screen: 'My Announcements' });
        }
        if (parseInt(leStatut) === 1) {
          navigation.navigate('MonCompte', { screen: 'Details', params: { _id: senderId } });
        }
      }, 300);
    };

  return (
    <View style={{flex: 1}}>
    <Tab.Navigator
    screenOptions={{
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
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

                    <AnimatedBadge count={badgee} />

                    </View>
            )

        }}
        listeners={{
            tabPress: () => {
                setBadgee(0);
                if(token){
                    laFonctionGet(VIEW_NOTIFS_URL, token);
                }
            }
        }}
        />

    </Tab.Navigator>

    {!isTabBarVisible && <FloatingChatButton />}

    <NotificationBanner
      isVisible={isVisible}
      onClose={() => setIsVisible(false)}
      onPress={handleBannerPress}
      title={title}
      body={body}
    />

    </View>
  )
}

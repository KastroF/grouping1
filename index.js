/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import "./src/i18n";
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

// Background message handler - DOIT être au top-level, avant AppRegistry
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Notification reçue en arrière-plan:', remoteMessage);

  const badge = remoteMessage.data?.badge;
  if (badge) {
    await notifee.setBadgeCount(parseInt(badge));
  }
});

AppRegistry.registerComponent(appName, () => App);

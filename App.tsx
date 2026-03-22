/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import SplashScreen from 'react-native-splash-screen'
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Provider from './src/navigation';


function App()  {

  useEffect(() => {


    if(Platform.OS === "android"){


    SplashScreen.hide();

    }


  },[])

  return (
    <GestureHandlerRootView style={{flex: 1}}>
        <Provider />
    </GestureHandlerRootView>
  );
}



export default App;

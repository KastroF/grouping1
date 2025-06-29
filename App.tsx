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
import Provider from './src/navigation';


import OnboardingScreen from './src/screens/OnboardingScreen';


function App()  {

  useEffect(() => {


    if(Platform.OS === "android"){


    SplashScreen.hide();

    }


  },[])

  return (
    
        <Provider />
    
  
  );
}



export default App;

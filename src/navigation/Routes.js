import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native'
import React, { useContext, useEffect } from 'react'
import AppStack from './AppStack'
import { AuthContext } from './AuthProvider'
import CongratStack from './CongratStack';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const navigationRef = createNavigationContainerRef();

export default function Routes() {



  const {account} = useContext(AuthContext); 
  const {setToken, setUser} = React.useContext(AuthContext); 


  useEffect(() => {

    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('token');
        const user = await AsyncStorage.getItem("user");

        //console.log("la value", value);
        //console.log(user);
        if (value !== null) {

          setToken(value); 
          
          setUser(JSON.parse(user));
         
          
        }
      } catch (e) {
        // error reading value
        console.log(e);
      }
    };



    getData();


  }, [])

  return (

    <NavigationContainer ref={navigationRef} >
       {account ? <CongratStack /> : <AppStack  /> } 
    </NavigationContainer>
    
  )
}

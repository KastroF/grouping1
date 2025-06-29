import React from 'react'
import { StyleSheet } from 'react-native'
import { AuthContext } from '../navigation/AuthProvider'
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Disconnect({navigation}) {
    
    const {setToken, setUser, user} = React.useContext(AuthContext); 
    const [loading, setLoading] = React.useState(false);


    React.useEffect(() => {


        disconnect();


    }, [])


   const disconnect = () => {

            setLoading(true); 
      

            AsyncStorage.removeItem("token", () => {

                   setLoading(false);
                  // setLoading2(true);
         
                  setToken(""); 
                  setUser(null);
                  navigation.navigate("Home");
                  //navigation.reset();

            })
    }


//if(!user) return <AppStack />

}


const styles = StyleSheet.create({

    container: {
        flex: 1, 
        backgroundColor: "#fff", 
        alignItems: "center", 
        justifyContent: "center"
       
    }
})

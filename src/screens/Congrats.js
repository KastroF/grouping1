import React, { useContext } from 'react'
import { View, Text, Image } from 'react-native'
import Button1 from '../components/Button1'

import { COLORS, FONTS, SIZES } from '../constants/theme'
import { AuthContext } from '../navigation/AuthProvider'

export default function Congrats() {

    const {setAccount, idd, setIdd, setUserId} = useContext(AuthContext); 

    const iamConnected = () => {

        setAccount(false);
        setUserId(idd);
        setIdd(null);

    }

  return (
    <View style={{
        flex: 1,
        backgroundColor: COLORS.primary, 
        paddingHorizontal: 30, 
        paddingVertical: 50, 
        alignItems: "center", 
        justifyContent: "space-around"
    }}>

        <View style={{
            paddingHorizontal: 35
        }} >
            <Text style={{
                fontFamily: FONTS.bold, 
                fontSize: 26, 
                color: "#fff", 
                textAlign: "center"
            }}> {'Félicitations, vous êtes désormais connecté à Grouping.'}</Text>
        </View>

        <View >
            <Image 
                source={require("../assets/images/congrats.png")}
                style={{
                    width: SIZES.width - 150, 
                    height: SIZES.width, 
                    resizeMode: "contain"
                }}
            />
        </View>

        <View style={{
            width: "100%"
        }}>
            <Button1 onPress={iamConnected} backgroundColor="#fff" label={idd ? "Commencer" : "Commencer"}  textColor={COLORS.primary} fontFamily={FONTS.regular} 
            fontSize={25} borderRadius={15} />
        </View>
    
    </View>
  )
}

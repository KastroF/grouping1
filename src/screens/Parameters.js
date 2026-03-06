import React, { useContext } from 'react'
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native'
import { COLORS, FONTS, SIZES } from '../constants/theme'
import { AuthContext } from '../navigation/AuthProvider'

export default function Parameters({navigation}) {

    const {language} = useContext(AuthContext);

    const miniMenu = (text, text2) => {

            return(
                <TouchableOpacity onPress={() => navigation.navigate(text2)} style={{
                    marginTop: 5, 
                    backgroundColor: "#fff", 
                    paddingHorizontal: 35, 
                    paddingVertical: Platform.OS === "android" ? 10 : 15
                }}>
                    <Text style={{
                        fontFamily: FONTS.bold, 
                        color: COLORS.primary, 
                        fontSize: SIZES.h3
                    }}>{text}</Text>
                </TouchableOpacity>
            )
    }

  return (
    <View style={{
        flex: 1, 
        backgroundColor: "rgb(241, 246, 251)"
    }}>

        <View style={{
            paddingTop: Platform.OS === "android" ? 35 : 55, 
            paddingHorizontal: 15, 
            paddingBottom: 15, 
            flexDirection: "row", 
            backgroundColor: "#fff"
        }}>

            <TouchableOpacity onPress={() => navigation.goBack()} >
                <Image source={require("../assets/images/left2.png")}
                    style={{
                        height: SIZES.h3, 
                        width: SIZES.h3, 
                        resizeMode: "contain"
                    }} />
            </TouchableOpacity>

            <View style={{
                flex: 1, 
                alignItems: "center"
            }}>
                <Text style={{
                    fontFamily: FONTS.bold, 
                    color: COLORS.primary, 
                    fontSize: SIZES.h4, 
                    marginTop: Platform.OS === "android" ? -7 : 0, 

                    marginLeft: -10
                }}>
                    {language === "English" ? "Settings" : "Paramètres"}
                </Text>
            </View>

        </View>

        {miniMenu(language === "English" ? "Edit profile" : "Modifier le profil", "Modify")}
        {miniMenu(language === "English" ? "Change password" : "Modifier le mot de passe", "Connexion")}
        {//miniMenu("Paramètres de facturation")}
}
        

    </View>
  )
}

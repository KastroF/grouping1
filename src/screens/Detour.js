import React, { useContext } from 'react'
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native'
import Button1 from '../components/Button1'
import { COLORS, FONTS, SIZES } from '../constants/theme'
import { AuthContext } from '../navigation/AuthProvider';



export default function Detour({navigation}) {

    const {language} = useContext(AuthContext);
  return (
    <View style={{
        flex: 1, 
        backgroundColor: COLORS.primary, 
        alignItems: "center", 
        justifyContent: "center"
    }}>
        <View >
            <Text style={{
                fontFamily: FONTS.bold, 
                color: "#fff", 
                fontSize: SIZES.h2
            }}>{language === "English" ? "Congratulations!" : "Félicitations !"}</Text>
        </View>

        <View style={{
            marginTop: Platform.OS === "ios" ? 15 : 10, 
            paddingHorizontal: 30
        }}>
            <Text style={{
                textAlign: "center", 
                color: "#fff", 
                fontFamily: FONTS.regular, 
                fontSize: SIZES.h5, 
                lineHeight: SIZES.h5
            }}>
                {language === "English" ? <Text>Your request has been received. Please <Text style={{fontFamily: FONTS.bold}}>create an account</Text> so an advertiser can contact you within 48 hours</Text> : <Text>Votre demande a été prise en compte. Veuillez <Text style={{fontFamily: FONTS.bold}}>créer un compte</Text> afin qu'un annonceur vous contacte sous 48h</Text>}
            </Text>
        </View>



        <View style={{
                alignItems: "center", 
                marginTop: 40
            }}>
                <Image
                    source={require("../assets/images/felicitation.png")}

                    style={{
                        width : SIZES.width  -100, 
                        height: SIZES.width / 1.5, 
                        resizeMode: "contain"
                    }}
                />
            </View>

        <View style={{
            paddingHorizontal: 30, 
            width: "100%"
        }}>
             <View style={{
            marginTop: 25, 
             
            }}>
                <Button1 label={language === "English" ? "Create an account" : "Créer un compte"} backgroundColor="#fff" textColor={COLORS.primary} fontFamily={FONTS.regular} borderRadius={12}
                onPress={() => {navigation.navigate("Login1", {idg: true})}} />
            </View>
        </View>

        <View style={{
            marginTop: 20
        }} >
            <Text style={{
                fontFamily: FONTS.regular, 
                fontSize: SIZES.h6, 
                color: "#fff", 
                textAlign: "center"
            }}>{language === "English" ? "Already have an account?" : "Avez-vous déjà un compte ?"}</Text>

            <View style={{ 
                marginTop: Platform.OS === "android" ? 5 : 10
            }} >
                <TouchableOpacity onPress={() => navigation.navigate("Sign In", {idg: true})}>
                    <Text style={{
                        fontFamily: FONTS.regular, 
                        fontSize: SIZES.h6, 
                        color: "rgb(47, 101, 208)", 
                        textAlign: "center", 
                        textDecorationLine: "underline"
                    }}>{language === "English" ? "Sign in here" : "Se connecter ici"}</Text>
                </TouchableOpacity>
            </View>
        </View>
       

    </View>
  )
}

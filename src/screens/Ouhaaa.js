import React from 'react'
import { Image, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Button1 from '../components/Button1'
import { COLORS, FONTS, SIZES } from '../constants/theme'

export default function Ouhaaa({navigation, route}) {

    let userId; 

    if(route.params && route.params.userId){

        userId = route.params.userId;
    }
   

  return (
    <View style={{
        flex: 1
    }}>

        <Image source={require("../assets/images/degrade.png")} style={{
            transform: [{rotate: "-90deg"}, { translateX: (SIZES.width - SIZES.height) / 2 },
            { translateY: (SIZES.width - SIZES.height) / 2 },], 
            height: SIZES.width,
            width: SIZES.height, 
            
        }} />

<ScrollView contentContainerStyle={{
    
}} style={{
    position: "absolute", 
    left: 0, 
    top: 0
}}>

        <View style={{
        
        }}>

      

            <View style={{
                paddingHorizontal: 20, 
                paddingVertical: Platform.OS === "ios" ? 55 : 35
            }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image 
                    source={require("../assets/images/left.png")}
                    style={{
                        height: SIZES.h3, 
                        width: SIZES.h3, 
                        resizeMode: "contain"
                    }}
               />
                </TouchableOpacity>

            </View>

            <View style = {{
                flex: 1, 
                alignItems: "center", 
                justifyContent: "center"
            }}>

                <View style={{
                    alignItems: "center", 
                    width: SIZES.width , 
            
                }}>
                    <Image 
                        source={require("../assets/images/white_grouping.png")}
                     
                    style={{
                        width : SIZES.width / 2.5, 
                        height: SIZES.width / 2.5
                    }}
                    />

                    <View style={{
                        marginTop: 15, 

                    }}>
                        <Text style={{
                            fontFamily: FONTS.bold, 
                            color: "#fff", 
                            fontSize: SIZES.height * 0.075
                        }}>Ouhaaa !</Text>
                    </View>
                    <View style={{
                        marginTop: Platform.OS === "android" ? -10 : 5, 
                        paddingHorizontal: 30

                    }}>
                        <Text style={{
                            fontFamily: FONTS.bold, 
                            color: "#fff", 
                            fontSize: SIZES.h3, 
                            marginTop: Platform.OS === "android" ? 5 : 15, 
                            textAlign: "center"
                        }}>Connectez-vous ou créez un compte pour avoir accès à cette annonce</Text>
                    </View>

                    <View style={{width: "100%", paddingHorizontal: 40, marginTop: 20}}>
                        <Button1 label="Se connecter"  fontFamily={FONTS.regular} backgroundColor= "#fff" 
                        textColor={COLORS.primary} borderRadius={10} onPress = {() => { navigation.goBack();  navigation.navigate("Sign In", {from: true, _id: userId}) }} />

                         <Button1 label="Créer un compte"  fontFamily={FONTS.regular} backgroundColor= "rgba(255, 255, 255, 0.2)" 
                        textColor={"#fff"} borderRadius={10}  onPress = {() => { navigation.goBack();  navigation.navigate("Login1", {_id: userId,})}} />
                    </View>

                </View>

                

            </View>

           

        </View>

        </ScrollView>

    </View>
  )
}

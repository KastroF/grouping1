import React from 'react'
import { Image, Platform, Text, TouchableOpacity } from 'react-native'
import FontAwesome from "react-native-vector-icons/FontAwesome"
import { SIZES } from '../constants/theme'

export default function Button1({label, backgroundColor, textColor, fontFamily, fontSize, disabled,
      borderRadius, iconName, iconSize, iconColor, iconNAme, imagePath, size1, onPress,  ...rest}) {
  return (
    <TouchableOpacity disabled={disabled} {...rest} style={{
   
        paddingHorizontal: 15, 

        backgroundColor, 
        borderRadius, 
        marginTop: 15, 
        paddingVertical: Platform.OS === "android" ? 10 : 15,
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "center", 
   
        
    }}onPress={onPress} >

       { (iconName && iconName === "search") || imagePath ? <Image source={imagePath}
        style={{
          height: size1 ? SIZES.h4 : SIZES.h3, 
          width: size1 ? SIZES.h4 : SIZES.h3, 
          resizeMode: "contain", 
          marginTop: -3
        }}
        /> : iconName ? <FontAwesome name={iconName} size={SIZES.h3} color={iconColor} /> : "" }
                           
                        

        <Text style={{
            color: textColor, 
            fontFamily: fontFamily, 
            fontSize : size1 ? SIZES.h4 :  SIZES.h3, 
          
            textAlign: "center", 
            marginLeft: (iconName || imagePath) ? 15 : 0, 
            marginTop: Platform.OS === "android" ? -5 : 0
       
        }}>{label}</Text>
    </TouchableOpacity>
  )
}

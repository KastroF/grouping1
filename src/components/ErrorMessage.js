import React from 'react'
import { Platform, Text, View } from 'react-native'
import { FONTS, SIZES } from '../constants/theme'

export default function ErrorMessage({errorMessage, left}) {
  return (
    <View style={{
        marginTop: Platform.OS === "ios" ? 10 : 5, 
        paddingHorizontal:  left ?  5 : 20, 
        alignItems: left ? "flex-start" : "center"
    }}>

        <Text style={{
            fontFamily: FONTS.regular, 
            color: "red", 
            fontSize: SIZES.h6, 
            textAlign: left ? "left" : "center"
        }}>
            {errorMessage}
        </Text>

    </View>
  )
}

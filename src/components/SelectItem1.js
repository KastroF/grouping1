import React from 'react'
import { Platform, Text, TouchableOpacity, View } from 'react-native'
import { COLORS, SIZES } from '../constants/theme'
import Octicons from "react-native-vector-icons/Octicons"

export default function SelectItem1({label1, label2, marginTop, ...rest}) {
  return (
    <TouchableOpacity style={{
                            
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between",
        paddingVertical: Platform.OS === "android" ? 5 : 10, 
        paddingLeft: 10, 
        paddingRight: 20, 
        borderColor: COLORS.light_blue, 
        borderWidth: 1, 
        borderRadius: 8, 
        marginTop: marginTop ? marginTop: 0

    }} {...rest} >

        <View style={{
            flex: 1
        }}>
            <Text style={[{
                color: COLORS.primary, 
                fontFamily: "AristotelicaProTx-Rg", 
                
                fontSize: SIZES.height * 0.017
            }, ]}>{label1}</Text>
            <Text style={[{
                color: COLORS.primary, 
                fontFamily: "AristotelicaProTx-Rg", 
                fontSize: SIZES.height * 0.021, 
                marginTop: Platform.OS === "ios" ? 10 : 2
            }, ]}>{label2}</Text>
        </View>

        <View>
            <Octicons name="triangle-down" size={SIZES.height * 0.035} color = {COLORS.primary} />
        </View>

    </TouchableOpacity>
  )
}

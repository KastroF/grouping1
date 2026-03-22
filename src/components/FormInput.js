import React from 'react'
import { Platform, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { COLORS, FONTS, SIZES } from '../constants/theme'
import FontAwesome from "react-native-vector-icons/FontAwesome"
import FontAwesome6 from "react-native-vector-icons/FontAwesome6"
import Feather from "react-native-vector-icons/Feather"
import RNPickerSelect from 'react-native-picker-select';


export default function FormInput({indicatif, label, iconName, placeholder,
     value, password, isNumeric,  imagePath, backgroundColor, multilines, numberOfLines, fontSize, devise, ...rest}) {

    const [eyee, setEyee] = React.useState(false);
    const [securePass, setSecurePass] = React.useState(false);

    React.useEffect(() => {

        if(password){

            setSecurePass(password);
        }


    }, [])

    const changeEye = () => {

        setEyee(!eyee);
        setSecurePass(!securePass);
    }
    

  return (
    <View style={{
        flexDirection: "row", 
        alignItems: "center",
        paddingVertical: Platform.OS === "ios" ? 10 : 3,
      //  paddingBottom: Platform.OS === "ios" ? 10 : 5,
        height: multilines ? 110 : 65,

        backgroundColor: backgroundColor ? backgroundColor : COLORS.input_blue, 
        borderRadius: 10,
        borderWidth: 1, 
        borderColor: COLORS.middle_blue
    }}>


        <View style={{
           // paddingTop: Platform.OS === "android" ? 2 : 5, 
            paddingHorizontal: 10, 
            flex: 1
        }}>
            <Text style={{
                fontFamily: FONTS.ligth, 
                fontSize: SIZES.h7, 
                color: COLORS.other_blue
            }}>{label}</Text>

           <TextInput

                secureTextEntry={securePass ? true : false}
                placeholder={placeholder}
                multiline={multilines ?  true : false}
                numberOfLines={multilines ? numberOfLines : 1 }
                placeholderTextColor="#bbb"
                keyboardType={isNumeric ? "numeric" : "default"}
                style={{
                    fontSize: SIZES.h6,
                    lineHeight: SIZES.h6,
                    fontFamily: FONTS.regular, 
                    flex: 1, 
                    paddingVertical: Platform.OS === "android" ? 1 : 3,
                    marginTop: Platform.OS === "ios" ? 5 : 1,
                    color: "#000"
                }}
                value={value}
                {...rest}
            /> 
        </View>



      <TouchableOpacity onPress={changeEye} disabled={iconName !== "eye"} style={{
            marginRight: 10
        }}>
           {iconName === "eye" && <Feather name={ eyee ? "eye-off" : "eye"} size={SIZES.h5} color = {COLORS.primary} />}
           {iconName !== "eye" && iconName !== "dollar" && iconName !== "plane" && iconName !== "edit" && <Image source={imagePath} style={{
            height: SIZES.h5, 
            width: SIZES.h5, 
            resizeMode: "contain"
           }} />}
           {devise &&  <Text style={{fontFamily: FONTS.bold, fontSize: SIZES.h5, color: COLORS.primary}}>{devise}</Text>}
           {iconName === "edit" && <FontAwesome name="edit" size={SIZES.h5} color = {COLORS.primary} />}
           {iconName === "plane" && <FontAwesome6 name="plane-departure" size={SIZES.h5} color = {COLORS.primary} />}
        </TouchableOpacity>

    </View>
  )
}

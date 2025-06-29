import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import { FONTS, SIZES } from '../constants/theme'
import { useFetchFunctions } from '../infrastructures/functions'

export default function Notification({message, notif, onClick, onClose}) {
  
    const {timeAgo} = useFetchFunctions(); 

    

    return (
    <TouchableOpacity onPress={onClick} style={styles.viewBlock} >
        <View style={styles.flexBoxx}>
        <View>
            <Image 
                source={ notif ? require("../assets/images/Grouping.png") : message.user.photo ? {uri: message.user.photo} : require("../assets/images/user.png") }
                style={{
                    height: 40, 
                    width: 40, 
                    resizeMode: "cover", 
                    borderRadius: 8
                }}
            />
        </View>
        <View style={{
            marginLeft: 7, 
            flex: 1
        }}>
                <Text style={{
                    color: "#000", 
                    fontSize: SIZES.h6, 
                    fontFamily: FONTS.bold
                }}>
                   { notif ? "Administrateur" : message.user.name}
                </Text>
                <Text 
                numberOfLines={ notif ? 3 : 1}
                style={{
                    marginTop: Platform.OS === "android" ? 10 : 15, 
                    color: "#aaa", 
                    fontFamily: FONTS.ligth, 
                    fontSize: SIZES.h6, 
                    lineHeight: SIZES.h5, 
                    textAlign: "justify"
                }}>
                    { notif ?  message.body : message.firstMessage.text}
                </Text>
        </View>
       {notif ? <View style={{
            marginLeft: 15
        }}>    
            <TouchableOpacity style={{
                marginLeft: -10
            }} onPress={onClose}>
                <Image 
                        source={require("../assets/images/close.png")}
                        style={{
                            height: 21, 
                            width: 21, 
                            resizeMode: "cover"
                        }}
                    />
            </TouchableOpacity>
        </View> : ""}
        
        </View>
        <View style={{
            flexDirection: "row", 
            marginTop: 10, 
            justifyContent: "flex-end"
        }} >
           <Text style={{
                 color: "#aaa", 
                 fontFamily: FONTS.ligth, 
                 fontSize: SIZES.h7, 
                 
           }}> { notif ? timeAgo(new Date(message.date)) : timeAgo(new Date(message.firstMessage.date)) } </Text>
        </View>
    </TouchableOpacity>
    
  )
}


const styles = StyleSheet.create({

        viewBlock: {
            paddingHorizontal: 15, 
            paddingVertical: 10, 
            marginTop: 3,
            backgroundColor: "#fff", 
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            // Ombres pour Android
            elevation: 5,
           

        }, 
        flexBoxx: {
            display: "flex", 
            flexDirection: "row", 
        }
})
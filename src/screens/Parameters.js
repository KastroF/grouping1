import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Image, Platform, Share, Text, TouchableOpacity, View } from 'react-native'
import { COLORS, FONTS, SIZES } from '../constants/theme'
import { AuthContext } from '../navigation/AuthProvider'
import { useFetchFunctions } from '../infrastructures/functions'
import { API } from '../config/api'
import Feather from 'react-native-vector-icons/Feather'

export default function Parameters({navigation}) {

    const {language, token} = useContext(AuthContext);
    const {laFonctionGet} = useFetchFunctions();
    const [referralCode, setReferralCode] = useState(null);
    const [loadingCode, setLoadingCode] = useState(true);

    useEffect(() => {
        laFonctionGet(API.USER_GET_REFERRAL, token).then((data) => {
            console.log("REFERRAL DATA:", JSON.stringify(data));
            if (data && data.status === 0 && data.referralCode) {
                setReferralCode(data.referralCode);
            }
            setLoadingCode(false);
        }, (err) => { console.log("REFERRAL ERROR:", err); setLoadingCode(false); });
    }, []);

    const shareReferralCode = async () => {
        if (referralCode) {
            try {
                await Share.share({
                    message: language === "English"
                        ? `Join me on Grouping! Use my referral code: ${referralCode}`
                        : `Rejoins-moi sur Grouping ! Utilise mon code de parrainage : ${referralCode}`,
                });
            } catch (e) {
                console.log(e);
            }
        }
    };

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

        {/* Code de parrainage */}
        <View style={{
            marginTop: 5,
            backgroundColor: "#fff",
            paddingHorizontal: 35,
            paddingVertical: Platform.OS === "android" ? 10 : 15
        }}>
            <Text style={{
                fontFamily: FONTS.bold,
                color: COLORS.primary,
                fontSize: SIZES.h3
            }}>{language === "English" ? "My referral code" : "Mon code de parrainage"}</Text>

            {loadingCode ? (
                <ActivityIndicator color={COLORS.primary} style={{ marginTop: 10 }} />
            ) : referralCode ? (
                <View style={{ marginTop: 10 }}>
                    <View style={{
                        backgroundColor: "rgb(241, 246, 251)",
                        paddingVertical: 12,
                        paddingHorizontal: 15,
                        borderRadius: 8,
                        alignItems: "center"
                    }}>
                        <Text style={{
                            fontFamily: FONTS.bold,
                            fontSize: SIZES.h2,
                            color: COLORS.primary,
                            letterSpacing: 2
                        }}>{referralCode}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={shareReferralCode}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: 10,
                            backgroundColor: COLORS.primary,
                            paddingVertical: 10,
                            borderRadius: 8
                        }}
                    >
                        <Feather name="share-2" size={16} color="#fff" />
                        <Text style={{
                            fontFamily: FONTS.bold,
                            fontSize: SIZES.h5,
                            color: "#fff",
                            marginLeft: 8
                        }}>{language === "English" ? "Share my code" : "Partager mon code"}</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <Text style={{
                    fontFamily: FONTS.regular,
                    fontSize: SIZES.h5,
                    color: "#888",
                    marginTop: 10
                }}>{language === "English" ? "No referral code available" : "Aucun code de parrainage disponible"}</Text>
            )}
        </View>

        {//miniMenu("Paramètres de facturation")}
}
        

    </View>
  )
}

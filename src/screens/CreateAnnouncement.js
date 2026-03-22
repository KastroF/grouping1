import React, { useContext } from 'react'
import { useEffect } from 'react';
import { Image, ImageBackground, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { COLORS, FONTS, SIZES } from '../constants/theme'
import { AuthContext } from '../navigation/AuthProvider';
import Feather from "react-native-vector-icons/Feather"
import Button1 from '../components/Button1';

export default function CreateAnnouncement({navigation}) {

    const {isTabBarVisible, token, language} = useContext(AuthContext);

    useEffect(() => {

       // setIsTabBarVisible(true);

    },[])

    const goBack = () => {

            navigation.goBack();
    }

    const goToForm = (value) => {

            if(token){

                navigation.navigate("AnnouncementForm", {value})

            }else{

                navigation.navigate("Login1", {idg: true});

            }


    }

  return (
    <View style={{
        flex: 1 
    }}>
        <ImageBackground source={require("../assets/images/degrade.png")} 
            style={{
                flex: 1, 

                width: SIZES.height , 
                height: SIZES.width + 50 ,
                transform: [{ rotate: '-90deg' }], 
                
                resizeMode: "contain", 
                left: -50
                
            }}
        />


        <View  style={{
            zIndex: 2, 
            position: "absolute", 
            top: 0, 
            left: 0
        }}>

  

            <View style={{
                height: Platform.OS === "ios" ? 60 : 0, 
                backgroundColor: "rgba(0,0,0,0.4)", 
                width: SIZES.width
            }}>

          

            </View>

    <ScrollView bounces={false} 
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{
        
    }}>
            <Animated.View entering={FadeInDown.duration(400).springify().damping(18)} style={{
                marginTop: 15,
                paddingHorizontal: 15
            }}>
                <TouchableOpacity onPress={goBack}>
                    <Feather name='chevron-left' size={SIZES.h1} color="#fff" />
                </TouchableOpacity>

            </Animated.View>

            <Animated.View entering={FadeInDown.delay(100).duration(450).springify().damping(16)} style={{
                alignItems: "center",
                marginTop: 10
            }}>
                <Image
                    source={require("../assets/images/white_grouping.png")}

                    style={{
                        width : SIZES.width / 2.5,
                        height: SIZES.width / 2.5
                    }}
                />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(250).duration(500).springify().damping(18)} style={{
                alignItems: "center",
                marginTop: Platform.OS === "ios" ? 50 : 30,
                paddingHorizontal: 30
            }}>
                <Text style={{
                    fontFamily: FONTS.bold,
                    fontSize: SIZES.h1,
                    color: "#fff",
                    textAlign: "center"
                }}>
                   {language === "English" ? "What would you like to post?" : "Que souhaitez-vous annoncer?" }
                </Text>

                <Text style={{
                    marginTop: Platform.OS === "ios" ? 10 : 5,
                    fontFamily: FONTS.regular,
                    color: "#fff",
                    textAlign: "center",
                    fontSize: SIZES.h4,
                    lineHeight: SIZES.h4
                }}>
                    {language === "English" ? "You can share your container space or your luggage by posting an ad!" : "Vous pouvez partager votre espace de conteneur ou vos "+
                    "bagages en publiant une annonce !"}
                </Text>

                <Animated.View entering={FadeInUp.delay(450).duration(450).springify().damping(18)} style={{
                    marginTop: Platform.OS === "ios" ? 30 : 20,
                    width: "100%"
                }}>

                    <Button1

                    borderRadius={12}

                    label={language === "English" ? "Share your kilos" : "Partagez vos kilos"}
                    backgroundColor="#fff"
                    textColor={COLORS.primary}
                    fontFamily={FONTS.regular}
                    fontSize={SIZES.h3}
                    iconSize={SIZES.h3}
                    size1={true}
                    imagePath = {require("../assets/images/avion1.png")}
                    onPress={() => goToForm("kilos")}
                    />

                <Animated.View entering={FadeInUp.delay(580).duration(450).springify().damping(18)}>
                <Button1 borderRadius={12}

                    label={language === "English" ? "Share a container" : "Partagez un conteneur"}
                    backgroundColor="#fff"
                    textColor={COLORS.primary}
                    fontFamily={FONTS.regular}
                    size1={true}
                    fontSize={18}
                    iconSize={20}
                    imagePath = {require("../assets/images/container1.png")}
                    onPress={() => goToForm("container")}
                    />
                </Animated.View>

                </Animated.View>



            </Animated.View>

            

        </ScrollView>

        </View>
           

        
    </View>
  )
}

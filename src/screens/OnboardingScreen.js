import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, Image, ImageBackground, Modal, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; 

import  AppIntroSlider from "react-native-app-intro-slider"
import { COLORS, FONTS, SIZES } from '../constants/theme';
import AntDesign from "react-native-vector-icons/AntDesign"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

import BottomTabBar from '../navigation/BottomTabBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../navigation/AuthProvider';
import { translate } from '../i18n/locales/translate';
//import { useTranslation } from "react-i18next";
//import i18n from "i18next";


const {height, width} = Dimensions.get("screen");

export default function OnboardingScreen({navigation}) {

    const [showHomePage, setShowHomePage] = useState(false); 
    const {setLanguage, language} = useContext(AuthContext)
    const [lang, setLang] = useState(false); 
    const [langage, setLangage] = useState("Langage"); 
    const [modalVisible, setModalVisible] = useState(false); 
    const [check, setCheck] = useState(""); 
    //const { t } = useTranslation();

    const goToHome =  async () => {


            AsyncStorage.setItem("onboarding", "true").then(() => {

                    setShowHomePage(true);
            })
    }

    useEffect(() => {

        AsyncStorage.getItem("language").then((value1) => {

            if(value1){

               // console.log(value1);
                setLanguage(value1); 

                setLang(true);
                //setLanguage(value1);

              //  alert(value1);
            }

            AsyncStorage.getItem("onboarding").then((value) => {

                if(value){
    
                        setShowHomePage(true);
                }
    
            }, (err) => {
    
                    console.log(err)
            })


        }, (error) => {

                console.log(error)
        })


    },[])



    const slides = [

        {
            id: 1, 
            title: language === "English" ? translate.slides.text1.en : translate.slides.text1.fr, 
            image: require("../assets/images/container.png")
        }, 
 
        {
            id: 4, 
            title: language === "English" ? translate.slides.text2.en : translate.slides.text2.fr, 
            image: require("../assets/images/avion.png")
        }

    ]; 

    const buttonLabel = (label) => {

      return  <View style={{
            padding: 12
        }}>
            <Text style={{
                fontSize: SIZES.h4, 
                color: COLORS.primary, 
                fontFamily: "AristotelicaProTx-Rg",
            }}>
                {label}
            </Text>
        </View>

    }

  if (!showHomePage) return !lang ? <View style={{
    flex: 1, 
    backgroundColor: "#fff"
  }}>

    <Modal 
        visible={modalVisible}
        onRequestClose={() => {

                setModalVisible(false); 
        }}
        animationType="slide"
        transparent={true}
    >
        <Pressable onPress={() => setModalVisible(false)} style={{
            flex: 1, 
            backgroundColor: "rgba(0,0,0,0.3)", 
            alignItems: "center", 
            justifyContent: "center"
        }}>
            <View style={{
                backgroundColor: "#fff", 
                width: SIZES.width - 60, 
                borderRadius: 8
            }}>
                <TouchableOpacity onPress={() => {setCheck("french"); setLangage("Français");  setModalVisible(false)}} style={{
                    paddingVertical: Platform.OS === "android" ? 10 : 15, 
                    paddingHorizontal: 10, 
                    flexDirection: "row", 
                    alignItems: "center", 
         
                }}>

                    <MaterialIcons name={check === "french" ? "radio-button-checked" : "radio-button-off"} 
                        size={SIZES.h3} color={COLORS.primary} />
                        <Text style={{
                            fontFamily: FONTS.bold, 
                            fontSize: SIZES.h3, 
                            color: COLORS.primary, 
                            marginLeft: 6, 
                            marginTop: Platform.OS === "android" ? -3 : 0
                        }}>Français</Text>
                </TouchableOpacity>

                <View style={{
                    
                }}>
                    <View style={{
                                   borderBottomWidth: 1, 
                                   borderBottomColor: "#eee", 
                                   width: "100%"
                    }} />
                </View>

                <TouchableOpacity  onPress={() => {setCheck("english"); setLangage("English"); setModalVisible(false)}}  style={{
                    paddingVertical: Platform.OS === "android" ? 10 : 15, 
                    paddingHorizontal: 10, 
                    flexDirection: "row", 
                    alignItems: "center", 

                }}>

                    <MaterialIcons name={check === "english" ? "radio-button-checked" : "radio-button-off"} 
                        size={SIZES.h3} color={COLORS.primary} />
                        <Text style={{
                            fontFamily: FONTS.bold, 
                            fontSize: SIZES.h3, 
                            color: COLORS.primary, 
                            marginLeft: 6, 
                            marginTop: Platform.OS === "android" ? -3 : 0
                        }}>English</Text>
                </TouchableOpacity>

            </View>
        </Pressable>
    </Modal>

    <ImageBackground source={require("../assets/images/backWhite.png")} style={styles.backgroundImage}>

        <View style={{
            flex: 1, 
            alignItems: "center", 
            justifyContent: "center", 
            paddingHorizontal: 40
        }}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={{
                paddingVertical: Platform.OS === "ios" ? 15 : 10, 
               
                width: "100%", 
                borderWidth: 1, 
                borderColor: "#fff", 
                flexDirection: "row", 
                alignItems: "center", 
                justifyContent: "center", 
                backgroundColor: COLORS.primary, 
                borderRadius: 8
            }}>

                <Text style={{
                    fontSize: SIZES.h3, 
                 
                    color: "#fff", 
                    fontFamily: FONTS.regular, 
                    marginRight: 15,
                    alignSelf: "center", 
                   // marginTop: Platform.OS === "android" ? -5 : 0
                }}>{langage}</Text>

                <AntDesign name='down' size={SIZES.h4} color="#fff" />

            </TouchableOpacity>
        </View>

        {  (langage && langage !== "Langage" ) &&  <TouchableOpacity onPress={() => {setLanguage(langage); AsyncStorage.setItem("language", langage).then(() => {

            setLang(true);

        })}} style={{
            position: "absolute", 
            bottom: 20, 
            right: 20, 
            padding: Platform.OS === "android" ? 10 : 15, 
            borderRadius: 100, 
            backgroundColor: COLORS.primary, 
            alignItems: "center", 
            justifyContent: "center"
        }}>

         <AntDesign name='arrowright' size={SIZES.h2} color="#fff" /> 

        </TouchableOpacity>}
    
    </ImageBackground>

  </View>  : <ImageBackground source={require("../assets/images/Background.png")} 
       style={styles.backgroundImage}
    >

        <View style={{
            flex: 1, 
        
        }} >



        <View 
            style={{
                height: Platform.OS === "ios" ? height/5 + 60 : height/5 , 
            }}
        />
    
        <View style={styles.whiteBox}>

            <View
                
                style={{
                    alignItems: "center", 
                    width, 
                    paddingVertical: 30
                }}
            >
                <View style={styles.grayLine} />
            </View>

            <View style={{
                flex: 1, 
         
            }}>

                <AppIntroSlider 
                    data={slides}
                    renderItem={({item}) => {

                            return (
                                <View style={{
                                    alignItems: "center", 
                                    
                                    flex: 1, 
                                    paddingHorizontal: 30
                                }}>
                                    <Image 
                                        source={item.image}
                                        style={{
                                           width: SIZES.width - 100, 
                                           height: 300, 
                                           resizeMode: "contain" 
                                            
                                        }}
                                    />
                                    <Text style={[{
                                        color: COLORS.primary, 
                                        fontSize: SIZES.h2
                                    }, styles.onboardingTitle]}>
                                        {item.title}
                                    </Text>
                                </View>
                            )
                    }}

                    activeDotStyle={{
                        backgroundColor: COLORS.orange, 
                        width: 25
                    }}
                    renderNextButton = {() => buttonLabel("Next")}
                   
                    
                    renderDoneButton = {() => buttonLabel("Done")}
                    onDone={goToHome}
                />

            </View>

        </View>

        </View>
    </ImageBackground>
  

  return <BottomTabBar />


}




const styles = StyleSheet.create({

    container: {

            flex: 1, 
            backgroundColor: "#fff", 

    }, 

    text1: {

            fontFamily: "AristotelicaProTx-Lt", 
            color: "#000", 
            fontSize: 14
    }, 
    text2: {

        fontFamily: "AristotelicaProTx-Bld", 
        color: "#000", 
        fontSize: 14
    }, 
    backgroundImage: {
            flex: 1
    }, 
    whiteBox : {
        backgroundColor: "#fff", 
        flex: 1, 
    
        borderTopRightRadius: 35, 
        borderTopLeftRadius: 35
    },

    grayLine: {

        width: width/2.5, 
        height: 5, 
        borderRadius: 5, 
        backgroundColor: "rgb(228, 228, 228)"
    }, 

    onboardingTitle: {
        fontFamily: "AristotelicaProTx-Bld", 
        textAlign: "center", 
        marginTop: 20,
        paddingBottom: 30, 
        lineHeight: 30
    }, 




})
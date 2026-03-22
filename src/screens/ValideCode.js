import React, { useContext, useRef, useState } from 'react'
import { Image, Platform, SafeAreaView, Text, TextInput, TouchableOpacity } from 'react-native'
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FontAwesome6 from "react-native-vector-icons/FontAwesome6"
import Button1 from '../components/Button1';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import { COLORS, FONTS } from '../constants/theme';
import { useFetchFunctions } from '../infrastructures/functions';
import { AuthContext } from '../navigation/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../config/api';

const ADD_USER_URL = API.USER_REGISTER;
export default function ValideCode({route, navigation}) {

const {code} = route.params; 
const [otpValue, setOtpValue] = useState('');
const inputRefs = [useRef(), useRef(), useRef(), useRef()];
const {user, isTabBarVisible, setIsTabBarVisible, setToken,  setAccount, language} = useContext(AuthContext);
const [errorMessage, setErrorMessage] = useState(""); 
const {postFunction} = useFetchFunctions(); 
const [validate, setVAlidate] = useState(false);
const [load, setLoad] = useState(false); 

  
const focusNextInput = (index) => {
    if (index < inputRefs.length - 1) {
      inputRefs[index + 1].current.focus();
    }
  };

  const goBack  = () => {

        navigation.goBack(); 
  }


  const storeData = async (value, user) => {

    console.log("La valeur " + value)

    try {

      await AsyncStorage.setItem('token', value); 
      await AsyncStorage.setItem('user', JSON.stringify(user)); 
     

    } catch (e) {
      console.log(e)
    }

  };


  const onChangeText = (text, index) => {
    if (/^\d+$/.test(text)) {
      setOtpValue((prevValue) => {
        let newValue = prevValue;
        newValue = newValue.substring(0, index) + text + newValue.substring(index + 1);
        return newValue;
      });
      focusNextInput(index);
    } else if (text === '') { // Ajoutez cette condition pour gérer le cas où l'utilisateur efface le contenu d'une case
      setOtpValue((prevValue) => {
        let newValue = prevValue;
        newValue = newValue.substring(0, index) + text + newValue.substring(index + 1);
        return newValue;
      });
    } else {
      inputRefs[index].current.clear();
    }
  };

  const goToOtherStack = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Congrats' }],
    });
  };


  const onValid = () => {

    setErrorMessage("");
    setLoad(true);

        if(code === otpValue){

                postFunction(ADD_USER_URL, user).then((data) => {

                    console.log(data);

                    if(data) {

                        if(data.status === 0){

                            
                            setLoad(false);
                            //goToOtherStack();
                            setToken(data.token); 
                            storeData(data.token, data.user);
                            setAccount(true);
                        }

                        if(data.status === 1){

                                setLoad(false);
                        }

                    }else{


                    }

                },(err) => {

                        console.log(err);
                        setLoad(false);
                })
        }else{

            setErrorMessage(language === "English" ? "Invalid code" : "Code invalide");
            setLoad(false);
        }
  }

  if(load) return <Loading />

  return (
    <SafeAreaView style={{
        flex: 1, 
        backgroundColor: "#fff"
    }}>

        <KeyboardAwareScrollView contentContainerStyle={{
            paddingBottom: 120
        }}>

        <View style={{
            marginTop: 20, 
            paddingHorizontal: 25
        }}> 
            <TouchableOpacity onPress = {goBack}>
                <FontAwesome6 name='angle-left' color={COLORS.primary} size={34} />
            </TouchableOpacity>
            
        </View>

        <View style={{
            marginTop: 10, 
            alignItems: "center", 
           
        }}>
            <Image
                source={require("../assets/images/Grouping.png")}
                style={{
                    height: 120, 
                    width: 120, 
                    resizeMode: "contain"
                }}
                    

                />

                 <View style={{
                      paddingHorizontal: 20, 
                      alignItems: "center", 
                      marginTop: 25
                    }}>
                        <Text style={{
                            fontFamily: FONTS.bold, 
                            fontSize: 25, 
                            color: COLORS.primary
                        }}>{language === "English" ? "Authentication" : "Authentification"}</Text>
                        <Text style={{
                            fontFamily: FONTS.regular, 
                            color: COLORS.primary, 
                            fontSize: 14, 
                            textAlign: "center", 
                            marginTop: Platform.OS === "ios" ? 10 : 3
                        }}>
                            {language === "English" ? "Enter the 4-digit code we sent you by email to confirm your registration." : "Entrez le code à quatre (4) chiffres que nous vous avons envoyé par mail pour confirmer votre inscription."}
                        </Text>
                </View>

                <View style={{
                    marginTop: 60, 
                    flexDirection: "row", 
                    alignItems: "center", 
                }}>
                {inputRefs.map((ref, index) => (
                 <View 

                 key={index}
                
                 
                 style={{
                    height: 75, 
                    width: 65, 
                    borderRadius: 8, 
                    backgroundColor: COLORS.light_blue, 
                    alignItems: "center", 
                    justifyContent: "center", 
                    paddingHorizontal: 15, 
                    paddingVertical: 10,
                    marginLeft: index !== 0 ? 15 : 0
                }}>
                    <TextInput 
                        onChangeText={(text) => onChangeText(text, index)}
                        keyboardType="numeric"
                        maxLength={1}
                        ref={ref}
                        value={otpValue[index] || ""}
                        style={{
                            flex: 1, 
                            fontFamily: "Roboto-Bold", 
                            fontSize: 25, 
                            lineHeight: 25,
                            color: "#000", 
                            textAlign: "center"
                        }}
                    />
                    <View style={{
                        width: "100%", 
                        borderBottomWidth: 1, 
                        borderBottomColor: COLORS.primary
                    }} />
                </View>
            ))}
                </View>

                <View style={{
                    marginTop: 20, 
                    alignItems: "center"
                }}>
                    <Text style={{
                        fontFamily: FONTS.regular, 
                        color: COLORS.primary, 
                        fontSize: 15, 
                        textAlign: "center"
                    }}>{language === "English" ? "Didn't receive a code?" : "Vous n'avez pas reçu de code ?"}</Text>
                   <TouchableOpacity style={{
                     marginTop: Platform.OS === "ios" ? 5 : 0
                   }}> 
                    <Text style={{
                       fontFamily: FONTS.regular, 
                       color: COLORS.other_blue3, 
                       fontSize: 15, 
                       textAlign: "center"
                    }}>
                        {language === "English" ? "Resend code" : "Renvoyez le code"}
                    </Text>
                    </TouchableOpacity>
                </View>

                <View style={{
                    marginTop: Platform.OS === "ios" ? 120 :  60, 
                    width: "100%", 
                    paddingHorizontal: 40
                }}>
                    <Button1 onPress={onValid} label={language === "English" ? "Validate code" : "Validez le code"} backgroundColor={COLORS.primary}
                       textColor="#fff" fontFamily={FONTS.regular} fontSize={18} borderRadius={15} />
                </View>

                <View >
                    <ErrorMessage errorMessage={errorMessage} />
                </View>

                <View style={{
                    marginTop: 15
                }}>
                    <Text>{code}</Text>
                </View>
        </View>

        </KeyboardAwareScrollView>
       

    </SafeAreaView>
  )
}

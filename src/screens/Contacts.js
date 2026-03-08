import { View, Text, StyleSheet, Platform, Image, TextInput, Modal } from 'react-native'
import React, { useContext, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import FontAwesome6 from "react-native-vector-icons/FontAwesome6"
import { COLORS, FONTS, SIZES } from '../constants/theme'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AuthContext } from '../navigation/AuthProvider'
import FormInput from '../components/FormInput'
import Button1 from '../components/Button1'
import { useFetchFunctions } from '../infrastructures/functions'
import Loading from '../components/Loading'
import { API } from '../config/api';

const CONTACT_US_URL = API.USER_CONTACT_US;


export default function Contacts({navigation}) {

    const {user, token, language} = useContext(AuthContext);
    const [object, setObject] = useState(""); 
    const [message, setMessage] = useState("");
    const {postFunction} = useFetchFunctions(); 
    const [load, setLoad] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);


    const onSend = () => {

        if(!message && !object){

            alert(language === "English" ? "You must enter a message and subject" : "Vous devez saisir un message et l'objet de votre message");

        }else{

            setLoad(true);
            postFunction(CONTACT_US_URL, {message, object, name: user.name, mail: user.email}, token).then((data) => {

                setLoad(false);
                if(data?.status === 0){

                    setMessage("");
                    setObject("");
                    setSuccessVisible(true);

                }else{

                    alert(language === "English" ? "An error occurred" : "Une erreur s'est produite");
                }

            }, (err) => {

                    setLoad(false);
                    alert(language === "English" ? "An error occurred" : "Une erreur s'est produite");
                    console.log(err)
            })
        }
    }

    if(load) return <Loading />


  return (
    <View style={styles.container}>
      
<View style={{
            paddingTop: Platform.OS === "ios" ? 65 : 25, 
            paddingBottom: 10, 
            backgroundColor: "#fff", 
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5, // 

        }}>

            <View style={{
                paddingHorizontal: 15, 
                flexDirection: "row", 
                alignItems: "center", 
                justifyContent: "space-between"
            }}>
                 <TouchableOpacity onPress={() => navigation.goBack()} >
                    <FontAwesome6 name='angle-left' color={COLORS.primary} size={SIZES.h2} />
                </TouchableOpacity> 
                <View > 
                <Text style={{
                    fontFamily: FONTS.bold, 
                    color: COLORS.primary, 
                    fontSize: SIZES.h3
                }}>{language === "English" ? "Contact Us" : "Nous contacter"}</Text>
                </View>
                {<View style={{
                            flexDirection: "row", 
                            alignItems: "center"
                        }}>

   
                </View>}
               
            </View>

        </View>


        <KeyboardAwareScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
            paddingBottom: 111
        }}>
            <View style={{
                paddingHorizontal: 15, 
                marginTop: 21, 
                alignItems: "center"
            }}>
               {/* <Image
                    source={require("../assets/images/Grouping2.jpg")}
                    style={{
                        height: 151, 
                        width: 111, 
                        resizeMode: "contain"
                    }}
                /> */}

                <View style={{
                    
                }}>
                    <Text style={{
                        fontFamily: FONTS.regular, 
                        fontSize: SIZES.h5, 
                        color: "#000"
                    }}>
                        {language === "English" ? "Please leave your message below:" : "Merci de nous laisser votre message ci-dessous :"}
                    </Text>
                </View>

                <View style={{
                    alignItems: "flex-start", 
                    width: "100%", 
                    marginTop: 21
                }}>
                    <Text style={{
                        fontFamily: FONTS.bold, 
                        fontSize: SIZES.h5, 
                        color: "#000"
                    }}>{language === "English" ? "From:" : "De :"}</Text>
                    <View style={{
                        paddingHorizontal: 15, 
                        paddingVertical: 11, 
                        borderColor: "#ccc", 
                        borderWidth: 1, 
                        width: "100%", 
                        marginTop: 3, 
                        borderRadius: 8, 
                        backgroundColor: "#eee"
                    }}>
                        <Text  style={{
                        fontFamily: FONTS.regular, 
                        fontSize: SIZES.h5, 
                        color: "#000"
                    }}>{user.email}</Text> 
                    </View>

                   {/* <View style={{
                        marginTop: 15, 
                        width: "100%", 
                    }}>
                        <Text style={{
                        fontFamily: FONTS.bold, 
                        fontSize: SIZES.h5, 
                        color: "#000"
                    }}>À :</Text>
                    <View style={{
                        paddingHorizontal: 15, 
                        paddingVertical: 11, 
                        borderColor: "#ccc", 
                        borderWidth: 1, 
                        width: "100%", 
                        marginTop: 3, 
                        borderRadius: 8, 
                         backgroundColor: "#eee"
                    }}>
                        <Text  style={{
                        fontFamily: FONTS.regular, 
                        fontSize: SIZES.h5, 
                        color: "#000"
                    }}>contacts@groupingpro.com</Text> 
                    </View>
                    </View> */}

                    <View style={{
                        marginTop: 15, 
                        width: "100%"
                    }}>
                        <FormInput label={language === "English" ? "Subject" : "Objet"} placeholder={language === "English" ? "Enter your message subject" : "Entrez l'objet de votre message"} iconName="mail"
          imagePath={require("../assets/images/mailIcon.png")}  value={object} onChangeText={setObject} />
                    </View> 

                    <View style={{
                        marginTop: 15, 
                        width: "100%", 
                        borderWidth: 1, 
                        borderColor: "#ddd", 
                        borderRadius: 11, 
                        height: 211, 
                        justifyContent: "flex-start", 
                        alignItems: "flex-start"
                    }}>
                        <TextInput 
                            multiline={true}
                            numberOfLines={21}
                            style={{
                                fontFamily: FONTS.regular, 
                                color: "#000",
                                fontSize: SIZES.h5, 
                                flex: 1
                            }}
                            placeholderTextColor="#bbb"
                            placeholder={language === "English" ? "Type your text here" : "Tapez votre texte ici"}
                            value={message} 
                            onChangeText={setMessage} 
                        />
                    </View>

                    <View style={{
                        marginTop: 15, 
                        width: "100%"
                    }}>
                        <Button1 label={language === "English" ? "Send" : "Envoyer"} backgroundColor={COLORS.primary}
                         fontFamily={FONTS.bold} fontSize={SIZES.h3} textColor="#fff" borderRadius={9} 
                         onPress={onSend} />
                    </View>
                   
                </View>
            </View>
        </KeyboardAwareScrollView>

        <Modal
            visible={successVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => {}}
        >
            <View style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.4)",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <View style={{
                    width: SIZES.width - 100,
                    paddingVertical: 30,
                    paddingHorizontal: 25,
                    backgroundColor: "#fff",
                    borderRadius: 15,
                    alignItems: "center"
                }}>
                    <View style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: COLORS.primary,
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <Text style={{fontSize: 30, color: "#fff"}}>✓</Text>
                    </View>

                    <Text style={{
                        marginTop: 15,
                        textAlign: "center",
                        color: COLORS.primary,
                        fontFamily: FONTS.bold,
                        fontSize: SIZES.h3
                    }}>{language === "English" ? "Message sent!" : "Message envoyé !"}</Text>

                    <Text style={{
                        marginTop: 10,
                        textAlign: "center",
                        color: "#000",
                        fontFamily: FONTS.regular,
                        fontSize: SIZES.h5
                    }}>{language === "English" ? "Your message has been sent successfully. We will get back to you shortly." : "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais."}</Text>

                    <TouchableOpacity
                        onPress={() => {
                            setSuccessVisible(false);
                            navigation.navigate("Hommee");
                        }}
                        style={{
                            marginTop: 20,
                            paddingVertical: 12,
                            paddingHorizontal: 40,
                            backgroundColor: COLORS.primary,
                            borderRadius: 8,
                            alignItems: "center"
                        }}
                    >
                        <Text style={{
                            fontSize: SIZES.h3,
                            color: "#fff",
                            fontFamily: FONTS.bold
                        }}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

    </View>
  )
}

const styles = StyleSheet.create({

        container: {

            flex: 1, 
            backgroundColor: "#fff"
        }
})
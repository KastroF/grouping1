import { View, Text, TouchableOpacity, Image, Platform } from 'react-native'
import React, { useContext, useState } from 'react'
import { COLORS, FONTS, SIZES } from '../constants/theme'
import FormInput from '../components/FormInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Button1 from '../components/Button1'
import { AuthContext } from '../navigation/AuthProvider'
import { useFetchFunctions } from '../infrastructures/functions'
import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'

const CHANGE_PASSWORD_URL = "https://grouping-node-raar.onrender.com/api/user/changepassword"
//const CHANGE_PASSWORD_URL = "https://grouping-82aac4e3da78.herokuapp.com/api/user/changepassword"

//https://grouping-82aac4e3da78.herokuapp.com/
export default function Connexion({navigation}) {


    const [last, setLast] = useState(""); 
    const [newPass, setNewPass] = useState(""); 
    const {token} = useContext(AuthContext); 
    const {postFunction} = useFetchFunctions();
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const onRequest = () => {

        setErrorMessage("") ; 
        setLoading(true); 

            if(!newPass && !last){

                setErrorMessage("Veuillez renseigner les deux champs"); 
                setTimeout(() => {
                    setErrorMessage("")  
                }, 8000);

            }else{

                if(newPass.length < 6){

                    setErrorMessage("Mot de passe trop court, minimum six(6) caractères"); 
                    setTimeout(() => {
                        setErrorMessage("")  
                    }, 8000);
                }else{

                    postFunction(CHANGE_PASSWORD_URL, {newPass, last}, token).then((data) => {

                        if(data && data.status === 0){

                            alert("Félicitations, votre mot de passe a été changé avec succès"); 
                            setLast(""); 
                            setNewPass("");
                            

                        }

                        if(data && data.status === 1){

                            setErrorMessage(data.message);
                            setTimeout(() => {
                                setErrorMessage("")  
                            }, 8000);
                        }

                        setLoading(false);

                    }, (err) => {

                            console.log(err); 
                            setLoading(false);
                    })
                }
            }
    }

    if(loading) return <Loading />

  return (
    <View style={{
        flex: 1, 
        backgroundColor: "#fff" //"rgb(241, 246, 251)"
    }}>

        <View style={{
            paddingTop: Platform.OS === "android" ? 35 : 55, 
            paddingHorizontal: 15, 
            paddingBottom: 15, 
            flexDirection: "row", 
            backgroundColor: COLORS.middle_blue
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
                    Information de connexion
                </Text>
            </View>

        </View>

        <KeyboardAwareScrollView>

        <View style={{
            marginTop: 35, 
            paddingHorizontal: 15
        }}>
            <View style={{
                alignItems: "center", 
                paddingHorizontal: 15
            }} >
                 <Image
                        source={require("../assets/images/Grouping.png")}
                        style={{
                            height: 100, 
                            width: 80, 
                            borderRadius: 8,
                           
                            
                        }}
                    />

                    <Text style={{
                        marginTop: 15, 
                        fontFamily: FONTS.regular, 
                        fontSize: SIZES.h5, 
                        color: "#000", 
                        textAlign: "center"
                    }}>
                        Renseignez ci-dessous votre ancien mot de passe, suivi de votre nouveau mot de passe et enfin cliquez sur le bouton Modifier
                    </Text>

                

            </View>


            <View style={{
                marginTop: 25, 
              
            }} >
                <View style={{
                    
                }}>
                    <FormInput placeholder="Saisissez votre ancien mot de passe " label="Ancien mot de passe" iconName="eye" 
                        password={true} onChangeText={setLast} value={last} />
                </View>

                <View style={{
                    marginTop: 15
                }}>
                    <FormInput onChangeText={setNewPass} value={newPass} placeholder="Saisissez votre nouveau mot de passe " label="Nouveau mot de passe" iconName="eye" 
                        password={true} />
                </View>

                <View style={{
                    marginTop: 15
                }}>
                    <Button1 label="Modifier" backgroundColor={COLORS.primary} textColor="#fff" borderRadius={8} fontFamily={FONTS.bold}  onPress={onRequest} />
                </View>

                <View style={{
                    marginTop: 10, 
                    paddingHorizontal: 10
                }}>
                    
                        <Text style={{
                            textAlign: "center", 
                            fontFamily: FONTS.ligth, 
                            color: "#000", 
                            fontSize: SIZES.h6
                        }}> { Platform.OS === "android" ? "Si vous vous êtes connecté via Google, vous ne pouvez pas changer le mot de passe." : 
                        "Si vous vous êtes connecté via Google ou via Apple, vous ne pouvez pas changer le mot de passe."  } </Text>
                    
                </View>

                <View style={{
                    
                }}>
                    {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
                </View>
            </View>


        </View>
        </KeyboardAwareScrollView>
    </View>
  )
}
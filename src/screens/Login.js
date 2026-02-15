import React, { useContext, useEffect, useRef, useState } from 'react'
import { Image, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { COLORS, FONTS, SIZES } from '../constants/theme'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FormInput from '../components/FormInput'
import Button1 from '../components/Button1'
import { AuthContext } from '../navigation/AuthProvider'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { useFetchFunctions } from '../infrastructures/functions'
import FontAwesome6 from "react-native-vector-icons/FontAwesome6"

import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { API } from '../config/api';


GoogleSignin.configure({
  webClientId: "135035020483-4d808jdm0454rvol6vd51sstdvhhrqml.apps.googleusercontent.com"
});


const ADD_USER_URL = API.USER_REGISTER;
const ADD_WITH_GOOGLE = API.USER_SIGNIN_GOOGLE;
const CONNECT_WITH_APPLE = API.USER_CONNECT_APPLE;

export default function Login({navigation, route}) {

  let annoucement; 

  let _id
  let idg
  let arriere; 

  if(route.params){

      annoucement = route.params.annoucement; 
      _id = route.params._id;  
      idg = route.params.idg;  
      arr = route.params.arriere; 
  }
  //const {annoucement} = route.params;

  const [indicatif, setIndicatif] = useState(""); 
  const {setIsTabBarVisible, setUser, setAccount, setIdd, setToken, language} = useContext(AuthContext);
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessage2, setErrorMessage2] = useState("");
  const {validateEmail, postFunction} = useFetchFunctions()
  const scrollViewRef = useRef(null);


  useEffect(() => {

    setIndicatif("+241");

  }, [])

  const goToSignIn = () => {

    setIsTabBarVisible(true);
    navigation.navigate("Sign In", {from : true})

  }


  async function onAppleButtonPress() {
    // Start the sign-in request

    try{

        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            // As per the FAQ of react-native-apple-authentication, the name should come first in the following array.
            // See: https://github.com/invertase/react-native-apple-authentication#faqs
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
          });
        
          // Ensure Apple returned a user identityToken
          if (!appleAuthRequestResponse.identityToken) {
            throw new Error('Apple Sign-In failed - no identify token returned');
          }
        
          // Create a Firebase credential from the response
          const { identityToken, nonce } = appleAuthRequestResponse;
         // const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
        
  
              console.log(appleAuthRequestResponse);

              const user = appleAuthRequestResponse.fullName; 
              const email = appleAuthRequestResponse.email; 

          if(!user.familyName && !email){

            //alert("On dit quoi?");

            setLoading(true);

            postFunction(CONNECT_WITH_APPLE, {appleId: appleAuthRequestResponse.user}).then((data) => {

              if(data && data.status === 0){
  
                setTimeout(() => {
    
    
                  setToken(data.token); 
                  storeData(data.token, data.user);
               
                
                  setUser(data.user);

                //  alert(_id);

                  if(_id){

                          setIdd(_id)
                          navigation.goBack(); 
                        
                  }else{

                    setAccount(true);
                  

                  }
              
    
                  setTimeout(() => {
    
                    setLoading(false);
                    
                  }, 2000);
    
    
                }, 3000);
    
    
            }else{

                setLoading(false); 
                setErrorMessage(data.message || "Une erreur est survenue");
            }



            }, (err) => {

                    console.log(err); 
                    setLoading(false);

            })

             
            }else{

                const code = appleAuthRequestResponse.authorizationCode;

                setLoading(true);

                postFunction(CONNECT_WITH_APPLE, {

                  name: user.familyName + " "+ user.givenName, 
                  email: email.trim(), 
                  password: code,  
                  appleId: appleAuthRequestResponse.user,
                  type: "apple"

              
              }).then((data) => {
  
                if(data && data.status === 0){
  
             
  
                  setTimeout(() => {
      
      
                    setToken(data.token); 
                    storeData(data.token, data.user);
                   
                  
                    setUser(data.user);

                   // alert(_id);

                    if(_id){

                            setIdd(_id)
                            navigation.goBack(); 
                          
                    }else{

                      setAccount(true);
                     

                    }
                
      
                    setTimeout(() => {
      
                      setLoading(false);
                      
                    }, 2000);
      
      
                  }, 3000);
      
      
              }
  
                  
  
              }, (err) => {
  
                      setLoading(false);
                      console.log(err); 
              })

              }




  

    }catch(e){

        console.log("l'erreur", e)
        setLoading(false);
    }

    // Sign the user in with the credential
   // return auth().signInWithCredential(appleCredential);
  }

  function estMotDePasseValide(motDePasse) {
    // Vérifier la longueur du mot de passe
    if (motDePasse.length < 8) {
        return "Le mot de passe doit contenir au moins 8 caractères.";
    }

    // Vérifier s'il contient au moins une lettre minuscule, une majuscule et un chiffre
    var contientMinuscule = /[a-z]/.test(motDePasse);
    var contientMajuscule = /[A-Z]/.test(motDePasse);
    var contientChiffre = /\d/.test(motDePasse);

    // Vérifier chaque critère et retourner un message d'erreur approprié
    if (!contientMinuscule) {
        return "Le mot de passe doit contenir au moins une lettre minuscule.";
    }
    if (!contientMajuscule) {
        return "Le mot de passe doit contenir au moins une lettre majuscule.";
    }
    if (!contientChiffre) {
        return "Le mot de passe doit contenir au moins un chiffre.";
    }

    // Si tous les critères sont remplis, retourner true
    return true;
}


const storeData = async (value, user) => {

  console.log("La valeur " + value)

  try {

    await AsyncStorage.setItem('token', value); 
    await AsyncStorage.setItem("user", JSON.stringify(user)); 
   

  } catch (e) {
    console.log(e)
  }

};

const googleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

      setLoading(true);

      postFunction(ADD_WITH_GOOGLE, {
       
        name: userInfo.user.name, 
        password: userInfo.user.id, 
        email: userInfo.user.email, 
        photo: userInfo.user.photo
      
      }).then((data) => {

      //  alert(_id);

        if(data && data.status === 0){

          

            setTimeout(() => {


              setToken(data.token); 
              storeData(data.token, data.user);
            
             
              if(_id){

                  setIdd(_id)
                  navigation.goBack(); 
                 
              }else{

               
                setAccount(true);
              }
              setUser(data.user);
          

              setTimeout(() => {

                setLoading(false);
                
              }, 2000);


            }, 3000);


        }if(data && data.status === 1) {

          setTimeout(() => {


            setToken(data.token); 
            storeData(data.token, data.user);

           // console.log(data.user);
      
            setUser(data.user);
          

            if(_id){

            
             
              setIdd(_id)
              navigation.goBack(); 

            }else{

              setAccount(true); 

             // navigation.navigate("Home");
            }

          
            
       
          
            setTimeout(() => {

              setLoading(false);
              
            }, 2000);


          }, 3000);

        }else{

            setLoading(false); 
        }

      }, (err) => {

          console.log(err); 
          
      })

  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (e.g. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
    } else {
      // some other error happened
    }
  }
};

  const onRegister = () => {

    setLoading(true); 
    setErrorMessage(""); 
    setErrorMessage2("");

    if(name && password && email){

      var resultat = estMotDePasseValide(password); 

      if(validateEmail(email)){

        if(resultat === true){

         // console.log("On part");

          postFunction(ADD_USER_URL, {name, email, password}).then((data) => {
            
             // setLoading(false);

              if(data){


                //console.log(data);

                if(data.status === 0){

                            setLoading(false);
                            //goToOtherStack();
                            setToken(data.token); 
                            storeData(data.token, data.user);

                            setUser(data.user);
                           


                            if(_id){

                              //alert("yes");
                              setIdd(_id); 
                              navigation.goBack(); 


                             
                          }else{

                            setAccount(true);
                          }
                         
                         
                          
                       


                }
      
                if(data.status === 1){

                    console.log("c'est fort", data.message); 

                    setErrorMessage2(data.message); 
                    //scrollViewRef.current.scrollToEnd({ animated: true });

                    setLoading(false);

                }

              }else{

                  alert("vérifiez votre connexion internet");
                  setLoading(false);
              }

          }, (err) => {

              console.log(err)
          })


        }else{
  
            setErrorMessage("Mot de passe invalide. " + resultat);
            setLoading(false); 
        }

      }else{

        setErrorMessage("Format d'Email invalide");
        setLoading(false); 

      }



    }else{

        setErrorMessage("Veuillez remplir tous les champs"); 
        setLoading(false);
    }

  }

  if(loading) return <Loading />

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView 
      ref={scrollViewRef}
      enableOnAndroid={true}
       showsVerticalScrollIndicator={false}
      contentContainerStyle={{
            paddingBottom: 125, 
           
        }}>

<View style={{
            marginTop: Platform.OS === "ios" ? 45 : 25, 
         paddingHorizontal: 20
        }}>
           { (_id  || idg) && <TouchableOpacity style={{
            marginBottom: Platform.OS === "ios" ? 10 : 3
           }} onPress={() => navigation.goBack()}>
                    <FontAwesome6 name='angle-left' color={COLORS.primary} size={SIZES.h2} />
            </TouchableOpacity> }

      </View>

      <View style={{
        marginTop: 20, 
        alignItems: "center", 
        
      }}>
        <Image 
            source={require("../assets/images/Grouping.png")}
            style={{
              width: SIZES.width /4, 
              height: SIZES.width /4.5, 
              resizeMode: "contain"
            }}
        />
      </View>
      <View style={{
        marginTop: 15, 
        alignItems: "center", 
        paddingHorizontal: 40
      }}>

        <Text style={{
          fontFamily: FONTS.bold, 
          fontSize: SIZES.h2, 
          color: COLORS.primary
        }}>
            {language === "English" ? "Create an account" : "Créer votre compte"}
        </Text>

        <Text style={{
          marginTop: Platform.OS === "android" ? 2 : 10, 
          fontSize: SIZES.h6, 
          fontFamily: FONTS.ligth, 
          color: COLORS.primary, 
          textAlign: "center"
        }}>
          {language !== "English" ? "Afin de vous proposer des offres correspondant à vos recherches, veuillez renseigner vos informations." 
          : "To offer you deals that match your search, please provide your information."}
        </Text>

      </View>

      {
        errorMessage2 && <ErrorMessage errorMessage={errorMessage2} />
      }

      <View style={{
        marginTop: 30, 
        alignItems: "center"
      }}>
        <Text style={{
          fontFamily: FONTS.ligth, 
          fontSize: SIZES.h6, 
          color: COLORS.primary
        }}>{language === "English" ? "Create an account with..." : "Créer un compte avec..."}</Text>
      </View>

      <View style={{
        marginTop: 10, 
        alignItems: "center", 
        justifyContent: "center", 
        flexDirection: "row"
      }} >  

        <TouchableOpacity onPress={googleSignIn} style={{
           padding: 20, 
           borderRadius: 100, 
           backgroundColor: "rgb(250, 250, 250)"
        }} >
            <Image source={require("../assets/images/google1.png")} 
              style={{height: 40, width: 40, resizeMode: "contain"}}
            />
        </TouchableOpacity>

      {Platform.OS === "ios" &&  <TouchableOpacity onPress={onAppleButtonPress} style={{
          marginLeft: 20, 
          padding: 20, 
          borderRadius: 100, 
          backgroundColor: "rgb(250, 250, 250)"
        }}>
        <Image source={require("../assets/images/apple.png")} 
              style={{height: 40, width: 40, resizeMode: "contain"}}
            />
        </TouchableOpacity>}

      </View>

        <View style={{
          paddingHorizontal: 35, 
          marginTop: 20
        }}>
          <FormInput  label={language === "English" ? "Full name" : "Nom complet"}  value={name} onChangeText={setName} iconName="account-outline" 
          imagePath={require("../assets/images/user.png")} />
        </View>

  

        <View style={{
          paddingHorizontal: 35, 
          marginTop: 15
        }}>
          <FormInput value={email} onChangeText={setEmail} label={language === "English" ? "Email address" :"Adresse mail"} iconName="mail" 
          imagePath={require("../assets/images/mailIcon.png")}  />
        </View>

        <View style={{
          paddingHorizontal: 35, 
          marginTop: 15
        }}>
          <FormInput password={true} value={password} onChangeText={setPassword}  label={language === "English" ? "Password" :"Mot de passe"} placeholder={language === "English" ? "Create a password": "Créez un mot de passe"} iconName="eye" />
        </View>

        <View style={{
          paddingHorizontal: 35, 
          marginTop: 25
        }}>

          <Button1 
              label={language === "English" ? "Create an account" : "Créer un compte"}
              backgroundColor= {COLORS.primary}
              textColor="#fff"
              borderRadius={12}
              fontFamily={FONTS.regular}
              fontSize={25}
              onPress={onRegister}
            />

        </View>

        <View style={{
          paddingHorizontal: 35, 
          marginTop: 5
        }}>
          <Text style={{
            fontFamily: FONTS.ligth, 
            color: "rgba(0,0,0,0.6)", 
            fontSize: SIZES.h6, 
            textAlign: "center"
          }}>
          {language === "English" ? "Your password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@, !, etc.)." : "Votre mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@, !, , etc.)"}
          </Text>
        </View>

        {
          errorMessage && <ErrorMessage errorMessage={errorMessage} />
        }

        <View style={{
          paddingHorizontal: 35, 
          marginTop: 25, 
          alignItems: "center"
        }}>
          <Text style={{
            fontFamily: FONTS.regular, 
            fontSize: 13, 
            color: COLORS.primary, 
            textAlign: "center"
          }}>{language === "English" ? "Already have an account?" : "Avez-vous déjà un compte ?"}</Text>
          <TouchableOpacity onPress={() => goToSignIn()}>
            <Text style={{
              fontFamily: FONTS.bold, 
              fontSize: 16, 
              color: COLORS.other_blue3, 
              marginTop: 10, 
              textDecorationLine: "underline"
            }}>{language === "English" ? "Sign in here !" : "Connectez-vous ici!"}</Text>
          </TouchableOpacity>
        </View>


        
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({

    container: {

        flex: 1, 
        backgroundColor: "#fff"
    }
})
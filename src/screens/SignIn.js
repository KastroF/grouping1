import React, { useContext, useState } from 'react'
import { StyleSheet, TouchableOpacity, View, Platform, Image, Text, KeyboardAvoidingView, Modal } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


import FontAwesome6 from "react-native-vector-icons/FontAwesome6"
import Button1 from '../components/Button1';
import ErrorMessage from '../components/ErrorMessage';
import FormInput from '../components/FormInput';
import Loading from '../components/Loading';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useFetchFunctions } from '../infrastructures/functions';
import { AuthContext } from '../navigation/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import AntDesign from "react-native-vector-icons/AntDesign"
import { API } from '../config/api';

GoogleSignin.configure({
  webClientId: "135035020483-4d808jdm0454rvol6vd51sstdvhhrqml.apps.googleusercontent.com"
});


const CONNECT_USER_URL = API.USER_SIGNIN;
const ADD_WITH_GOOGLE = API.USER_SIGNIN_GOOGLE;
const CONNECT_WITH_APPLE = API.USER_CONNECT_APPLE;
const GO_TO_EMAIL_URL = API.USER_GO_TO_EMAIL;

export default function SignIn({navigation, route}) {


    const {from, _id, idg}  = route.params; 
    const {setIsTabBarVisible, setUser, setToken, setIdd, setAccount, language} = useContext(AuthContext);
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [errorMessage, setErrorMessage] = useState(""); 
    const {postFunction, validateEmail} = useFetchFunctions(); 
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible]= useState(false);
    const [mail, setMail] = useState(""); 

    const storeData = async (value, user) => {

        console.log("La valeur " + value)
      
        try {
      
          await AsyncStorage.setItem('token', value); 
          await AsyncStorage.setItem("user", JSON.stringify(user))
          
         
      
        } catch (e) {

          console.log(e); 

        }
      
      };


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
      
      
              }if(data && data.status === 1) {

                //navigation.goBack()
      
                setTimeout(() => {
      
      
                  setToken(data.token); 
                  storeData(data.token, data.user);
      
                 // console.log(data.user);
            
                  setUser(data.user);
                  
            


                  if(_id){


                  
                    setIdd(_id);
                    navigation.goBack(); 
                

                  }else{
                    setAccount(true); 
                  //  navigation.navigate("Home");
                  }

                  setIsTabBarVisible(false);
                
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

    const onConnect = () => {

            setLoading(true); 
            setErrorMessage("");

            if(email && password){


              postFunction(CONNECT_USER_URL, {email : email.trim(), password: password.trim()}).then((data) => {

                if(data){

                    if(data.status === 1){

                            setLoading(false); 
                            setErrorMessage(data.message); 
                    }

                    if(data.status === 0){

                        setTimeout(() => {


                            setToken(data.token); 
                            storeData(data.token, data.user);
                
                           // console.log(data.user);
                      
                            setUser(data.user);

                            
                          
                            setIsTabBarVisible(false);

                            if(_id){

                                setIdd(_id);
                                navigation.goBack(); 
                             
                            }else{

                              setAccount(true)

                            }

                          
                            setTimeout(() => {
                
                              setLoading(false);
                              
                            }, 2000);
                
                
                          }, 3000);
                    }

                }else{

                        setLoading(false); 


                }

              }, (err) => {

                    setLoading(false);
              })

            }else{

                    setErrorMessage("Veuillez remplir tous les champs");
                    setLoading(false);
            }
    }

    const goBack = () => {

            setIsTabBarVisible(false);
            navigation.goBack(); 

    }


    const sendEmail = () => {

        if(!validateEmail(mail)){

            alert("Veuillez renseigner une adresse email valide"); 
        
          }else{

              setLoading(true);

              postFunction(GO_TO_EMAIL_URL, {email: mail}).then((data) => {

                if(data && data.status === 0){

                    setModalVisible(false); 
                    setMail(""); 
                    alert("📩 Un e-mail de réinitialisation vient d’être envoyé. Consulte ta boîte de réception (ou tes spams) et suis les instructions pour choisir un nouveau mot de passe.")
                    setLoading(false);
                  }

                if(data && data.status === 1){

                  setModalVisible(false); 
                  setMail(""); 
                  alert("Adresse email introuvable"); 
                  setLoading(false);
              }

              }, (err) => {

                  console.log(err   )
                  setLoading(false);
              })
          }
    }


    if(loading) return <Loading />

  return (
    <View style={styles.container}>
      <Modal 
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={()=> {

            setModalVisible(false);

          }}
          >
        <View style={{
          flex: 1, 
          backgroundColor: "rgba(0,0,0,0.4)", 
          alignItems: "center", 
          justifyContent: "center", 
          paddingHorizontal: 40
        }} >



            <View style={{
              padding: 15, 
              backgroundColor: "#fff", 
              width: "100%", 
              borderRadius: 12, 
              alignItems: "center"
            }}>

                <View style={{
                  paddingVertical: 10, 
                  flexDirection: "row", 
                  justifyContent: "flex-start", 
                  width: "100%"
                }}>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <AntDesign name='close' color={"#000"} size={25} />
                  </TouchableOpacity>
                  
                </View>
                <View style={{}}>
                  <Text style={{
                    fontFamily: FONTS.bold, 
                    fontSize: SIZES.h4, 
                    color: COLORS.primary, 
                    textAlign: "center"
                  }}>{language === "English" ? "Forgot password?" : "Mot de passe oublié ?"}</Text>

                  <Text style={{
                    fontFamily: FONTS.regular, 
                    fontSize: SIZES.h6, 
                    color: "#000", 
                    textAlign: "center"
                  }}>
                  {language ==="English" ? "Don’t worry! Enter your email address below and we’ll send you a link to reset your password." : "Pas d'inquiétude ! Saisis ton adresse e-mail ci-dessous et nous t'enverrons un lien pour réinitialiser ton mot de passe."}
                  </Text>
                </View>

                <View style={{
                  marginTop: 10, 
                  width: "100%"
                }}>
                  <FormInput label={language ==="English" ? "Email address" : "Email"} value={mail} 
                  onChangeText={setMail}  iconName="mail"  
                  imagePath={require("../assets/images/mailIcon.png")} />
                </View>

                <View style={{
                  marginTop: 10, 
                  width: "100%"
                }}>
                  <Button1 label={language === "English" ? "Send" : "Envoyer"} textColor="#fff" fontFamily={FONTS.regular}  borderRadius={8}
                  fontSize={SIZES.h6} backgroundColor={COLORS.primary} onPress={sendEmail} />
                </View>
            </View>
        </View>
      </Modal>
        <KeyboardAwareScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
            paddingBottom: 130, 
            
        
        }}>
        <View style={{
            marginTop: Platform.OS === "ios" ? 75 : 45, 
         
        }}>
           { (from || idg) && <TouchableOpacity style={{
            marginBottom: Platform.OS === "ios" ? 10 : 3
           }} onPress={goBack}>
                    <FontAwesome6 name='angle-left' color={COLORS.primary} size={SIZES.h2} />
            </TouchableOpacity> }
            <View style={{
                alignItems: "center", 
            
            
            }}>


                <Image 

                    source={require("../assets/images/Grouping.png")}

                    style={{
                        height: SIZES.width * 0.3, 
                        width: SIZES.width * 0.3, 
                        resizeMode: "contain"
                    }}

                    />

            </View>

                <View style={{
                    marginTop: Platform.OS === "ios" ?  30 : 20, 
                  
                   
                }}>
                    <Text style={{
                        textAlign: "center", 
                        fontFamily: FONTS.bold, 
                        fontSize: SIZES.h1, 
                        color: COLORS.primary
                    }}>
                       {language === "English" ? "Sign in" : "Connectez-vous"} 
                    </Text>

                    <Text style={{
                        textAlign: "center", 
                        fontFamily: FONTS.ligth, 
                        fontSize: SIZES.h6, 
                        marginTop: Platform.OS === "ios" ? 10 : 5,
                        color: COLORS.primary
                    }}>
                        {language === 'English' ? "Enter your login details..." : "Entrez vos informations de connexion..."}
                    </Text>

                   


                </View>

                

              

               

            </View>

            <View style={{
               
                alignItems: "center", 
                justifyContent: "center", 
                flexDirection: "row", 
                paddingVertical: 35
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
                paddingHorizontal: 25, 
           
               
                }}>
                    <FormInput onChangeText={setEmail} value={email}  label={language === 'English' ? "Email address" : "Adresse mail"}   iconName="mail"  
                    imagePath={require("../assets/images/mailIcon.png")} />
            </View>

            <View style={{
                paddingHorizontal: 25, 
                marginTop: 15
                }}>
                    <FormInput onChangeText={setPassword} value={password} password={true}  label={language === 'English' ? "Password" : "Mot de passe"} iconName="lock" 
                        imagePath={require("../assets/images/lock.png")}
                        />
            </View>

            <View style={{
            paddingHorizontal: 25, 
            marginTop: 10
            }}>

            <Button1 
                label="Connexion"
                backgroundColor= {COLORS.primary}
                textColor="#fff"
                borderRadius={12}
                fontFamily={FONTS.regular}
                fontSize={18}
                onPress={onConnect}
                />

            </View>

            <View style={{
              justifyContent: "center", 
              flexDirection: "row", 
              marginTop: 10, 
             
              
            }}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Text style={{
                    textAlign: "center", 
                    fontFamily: FONTS.bold, 
                    color: COLORS.primary, 
                    fontSize: SIZES.h6, 
                    textDecorationLine: "underline"
                  }}>{language === "English" ? "Forgot password?" : "Mot de passe oublié ?"}</Text>
                </TouchableOpacity>
            </View>

            {
                errorMessage && <ErrorMessage errorMessage={errorMessage} />
            }


                </KeyboardAwareScrollView>

            
    </View>
  )
}

const styles = StyleSheet.create({

        container: {

                flex: 1, 
                backgroundColor: "#fff", 
     
                paddingHorizontal: 20
        }
})

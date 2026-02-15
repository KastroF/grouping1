import { View, Text, TouchableOpacity, Image, Platform, Modal, ActivityIndicator, TextInput, PermissionsAndroid } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { COLORS, FONTS, SIZES } from '../constants/theme'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AuthContext } from '../navigation/AuthProvider'
import Feather from "react-native-vector-icons/Feather"
import AntDesign from "react-native-vector-icons/AntDesign"
import { useFetchFunctions } from '../infrastructures/functions'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios'
import { API } from '../config/api';

const CHANGE_USER_NAME_URL = API.USER_CHANGE_NAME;
const CHANGE_PHOTO_URL = API.USER_CHANGE_PHOTO;
export default function Modify({navigation}) {

    const {user, token, setUser} = useContext(AuthContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState(""); 
    const [loading, setLoading] = useState(false); 
    const [loadingg, setLoadingg] = useState(false); 
    const {postFunction, postWithFile} = useFetchFunctions(); 
    const [imageUri, setImageUri] = useState(null);
    const viewRef = useRef();



    const pickImage = () => {
        launchImageLibrary(
          {
            mediaType: 'photo', // Permet de choisir uniquement des photos
            quality: 0.4,         // Qualité maximale de l'image
          },
          response => {
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.errorCode) {
              console.error('Error: ', response.errorMessage);
            } else {
              const uri = response.assets[0].uri; // URI de l'image sélectionnée
              console.log(response.assets[0]);
              const asset = response.assets[0];

              const correctedUri =
              Platform.OS === 'android' && !uri.startsWith('file://')
                ? 'file://' + uri
                : uri;

              const resizedImag  = correctedUri;
              setImageUri(uri); // Mettre à jour l'état avec l'URI de l'image

              const formData = new FormData(); 

              formData.append("test", "2");

              formData.append("image", {
                uri: resizedImag, 
                type: asset.type || 'image/jpeg',
                name: asset.fileName || `photo_${Date.now()}.jpg`,
            }) 


              console.log(formData);

              setLoadingg(true);

              onRequest2(formData);


            }
          }
        );
      };


      const onRequest2 =  async (formData) => {


        const response = await axios.post(CHANGE_PHOTO_URL, formData, {
            headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            },
        });

        if(response.data && response.data.status === 0){

                console.log("C'est Ok");
                setUser({...user, photo: response.data.photo})
                await AsyncStorage.setItem("user", JSON.stringify({...user, photo: response.data.photo}))
        }
        setLoadingg(false);

      }



    const onRequest = () => {

        setLoading(true); 

        if(!name){

                alert("Nom obligatoire"); 
                setLoading(false);
        
            }else{

                postFunction(CHANGE_USER_NAME_URL, {name}, token).then(async (data) => {

                    if(data && data.status === 0){

                        setUser({...user, name});
                        await AsyncStorage.setItem("user", JSON.stringify({...user, name}));
                        setModalVisible(false);
                        
                        
                    }

                    setLoading(false);

                }, (err) => {

                        console.log(err); 
                        setLoading(false);
                })

            }

    }

    return (
        <View style={{
            flex: 1, 
            backgroundColor: "rgb(241, 246, 251)"
        }}>

<Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {

                setModalVisible(false)
        }}
    >
        <View style={{
            flex: 1, 
            backgroundColor: "rgba(0,0,0,0.4)", 
            paddingHorizontal: 35, 
            alignItems: "center", 
            justifyContent: "center"
        }}>
        <KeyboardAwareScrollView contentContainerStyle={{
            paddingTop: 235
        }}>
            <View style={{
                backgroundColor: "#fff", 
                width: "100%", 
      
                borderRadius: 8
            }}>
                <View style={{
                    alignItems: "center", 
                    paddingVertical: 15
                }}>
                    <Text style={{
                        fontFamily: FONTS.bold, 
                        color: COLORS.primary, 
                        fontSize: SIZES.h3
                    }}>Changer de nom</Text>
                </View>
                <View style={{
                    paddingHorizontal: 15, 
                    marginBottom: 15
                }}>
                    <Text style={{
                        fontFamily: FONTS.bold, 
                        color: COLORS.primary, 
                        fontSize: SIZES.h5
                    }}>
                        Votre nom
                    </Text>

                    <View style={{
                        height: 40, 
                         
                        borderBottomColor: "#eee",
                        borderBottomWidth: 1, 
                        flexDirection: "row", 
                        alignItems: "center", 

                    }} >
                        <TextInput ref={viewRef} style={{
                            fontFamily: FONTS.regular, 
                            color: "#000", 
                            fontSize: SIZES.h5,
                            flex: 1
                        }} placeholder="Saisir le nom"  
                        value={name}
                        onChangeText={setName}
                        />

                        <Image source={require("../assets/images/user.png")}  style={{
                            height: 20, width: 20, resizeMode: "contain"
                        }} />
                    </View>
                </View>
                <View style={{
                    flexDirection: "row", 
                    alignItems: "center", 
                    borderTopColor: "#ccc", 
                    borderTopWidth: 1
                }}>
                    <TouchableOpacity onPress={() => setModalVisible(false) } style={{
                        paddingVertical: 15, 
                        alignItems: "center", 
                        width: "50%", 
                        borderRightColor: "#ccc", 
                        borderRightWidth: 1
                    }}>
                        <Text style={{
                            fontFamily: FONTS.bold, 
                            fontSize: SIZES.h5, 
                            color: "red"
                        }}>Annuler</Text>
                    </TouchableOpacity>
                    

                    <TouchableOpacity disabled={loading} onPress={() => onRequest() } style={{
                        paddingVertical: 15, 
                        alignItems: "center", 
                        width: "50%", 
                       
                    }}>
                        {
                            loading ? <ActivityIndicator /> :
                        
                        <Text  style={{
                            fontFamily: FONTS.bold, 
                            fontSize: SIZES.h5, 
                            color: "green"
                        }}>Modifier</Text>}
                    </TouchableOpacity>
                </View>
            </View>
            </KeyboardAwareScrollView>
        </View>
    </Modal>
    
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
                        Modifier le profil
                    </Text>
                </View>
    
            </View>
    
            <KeyboardAwareScrollView 
                contentContainerStyle={{
                    paddingTop: 35, 
                    paddingHorizontal: 15, 
                    alignItems: "center"
                }}
            >
                <View  >
                    <Image
                        source={imageUri ? {uri: imageUri} : user.photo ? {uri:user.photo} : require("../assets/images/Grouping.png")}
                        style={{
                            height: 100, 
                            width: 80, 
                            borderRadius: 8,
                           
                            
                        }}
                    />


                </View>

                <View style={{
                    marginTop: 5, 
                    flexDirection: "row", 
                    justifyContent: "center"
                }}>
                    <TouchableOpacity onPress={pickImage} >
                        <Text style={{
                            fontFamily: FONTS.bold, 
                            color: COLORS.primary, 
                            fontSize: SIZES.h4, 
                            textDecorationLine: "underline"
                        }}>{user.photo ? "Modifiez la photo" : "Ajoutez une photo"} <Feather name='edit-2' size={15} /> </Text>
                    </TouchableOpacity>
                </View>


                <View style={{
                    flexDirection: "row", 
                    alignItems: "center", 
                    justifyContent: "space-between", 
                  
                    width: "100%", 
                    marginTop: 45, 
                    paddingBottom: 15, 
                    borderBottomWidth: 1, 
                    borderBottomColor: "#ccc"
                }}>
                    <View style={{

                    
                        
                    
                       
                    }}>
                        <Text style={{
                            fontFamily: FONTS.bold, 
                            color: COLORS.primary, 
                            fontSize: SIZES.h4
                        }}>
                            Nom : 
                        </Text>
                        <Text  style={{
                            fontFamily: FONTS.regular, 
                            color: "rgba(0,0,0,0.8)", 
                            fontSize: SIZES.h5
                        }}> {user.name} </Text>
                    </View>
                    <TouchableOpacity onPress={() => {  setName(user.name); setModalVisible(true);  setTimeout(() => {
                        if(viewRef.current){viewRef.current.focus();}
                    }, 1000); }}>
                        <AntDesign color={COLORS.primary} name="edit" size={25} />
                    </TouchableOpacity>
                </View>
                <View style={{ 
                       marginTop: 15, 
                       paddingBottom: 15, 
                       borderBottomWidth: 1, 
                       borderBottomColor: "#ccc",
                       width: "100%", 
                       alignItems: "flex-start"
                    }}>
                        <Text style={{
                            fontFamily: FONTS.bold, 
                            color: COLORS.primary, 
                            fontSize: SIZES.h4
                        }}>
                            Email : 
                        </Text>
                        <Text  style={{
                            fontFamily: FONTS.regular, 
                            color: "rgba(0,0,0,0.8)", 
                            fontSize: SIZES.h5
                        }}> {user.email} </Text>
                    </View>
            </KeyboardAwareScrollView>
    
            
    
        </View>
      )
}
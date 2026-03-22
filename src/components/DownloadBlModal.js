import React, { useContext, useEffect, useState } from 'react'
import { Alert, Image, Modal, PermissionsAndroid, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons"
import AntDesign from "react-native-vector-icons/AntDesign"
import { COLORS, FONTS, SIZES } from '../constants/theme';
import {CameraRoll} from "@react-native-camera-roll/camera-roll"; 
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import uuid from 'react-native-uuid';
import CameraModal from "./CameraModal";
import { AuthContext } from '../navigation/AuthProvider';

export default function DownloadBlModal({modalVisible, dismissModal, terminate, putImage, downloadPdf}) {

   const { language } = useContext(AuthContext);

   // const [modalVisible, setModalVisible] = useState(false);
   const [medias, setMedias] = useState([]); 
   const [selected, setSelected] = React.useState([]);
   const [modalVisible2, setModalVisible2] = useState(false);


   const onTerminate = () => {

       // console.log(selected);

        const final = []; 

        for(let s of selected){

            final.push(medias[s])
        }

     //   console.log(final);

        terminate(final);
   }

   const takePicture = () => {


   }

   const onFinish = (media) => {

        setModalVisible2(false);
        putImage(media)

   }




   const toggleSelection = (index) => {
    // Vérifiez d'abord si le nombre maximal d'images sélectionnées est atteint
    if(selected.length < 2 || selected.includes(index)) {
      // Recherchez l'index de l'image dans la liste des images sélectionnées
      const selectedIndex = selected.indexOf(index);
  
      if (selectedIndex === -1) {
        // Si l'image n'est pas déjà sélectionnée, l'ajouter à la liste
        setSelected([...selected, index]);
      } else {
        // Si l'image est déjà sélectionnée, la retirer de la liste
        const updatedSelection = selected.filter((i) => i !== index);
        setSelected(updatedSelection);
      }
    }
  };

    useEffect(() => {

       if(isAndroid){

        requestCameraRollPermission();

       }else{

         getMediaFromGallery();
       }


    }, [])

    const requestCameraRollPermission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: language === "English" ? "Photo gallery access permission" : "Permission d'accès à la galerie photo",
              message: language === "English" ? "This app needs access to your photo gallery." : "Cette application a besoin d'accéder à votre galerie photo.",
              buttonNeutral: language === "English" ? "Later" : "Plus tard",
              buttonNegative: language === "English" ? "Cancel" : "Annuler",
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Autorisation accordée'); 
            
            getMediaFromGallery()

          } else {
            console.log('Autorisation refusée');
          }
        } catch (err) {
          console.warn(err);  
        }
      };

      const isAndroid = Platform.OS === "android"; 

   const getMediaFromGallery = async () => {
    try {
      const { edges } = await CameraRoll.getPhotos({
        first: 100, // Nombre de médias à récupérer
        assetType: 'Photos', // Récupérer tous les médias (photos et vidéos)
      });
      const mediaArray = edges.map((item) => item.node);
      setMedias(mediaArray);
      console.log("on y est")
      console.log(mediaArray.length)
    } catch (error) {
      console.log('Erreur : ', error);
    }
  };

  const openCamera = () => {

    setModalVisible2(true);

  }



  function generateUniqueFileName(extension = 'pdf') {
    const now = new Date();
    const uniqueId = uuid.v4();
    const timestamp = now.toISOString().replace(/[-:.]/g, '');
    return `${timestamp}_${uniqueId}.${extension}`;
  }
  
  const selectDoc = async () => {
    try {
      // Demander la permission de lire les fichiers si nécessaire
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: language === "English" ? "File read permission" : "Permission de lire les fichiers",
            message: language === "English" ? "This app needs permission to read files on your device." : "Cette application a besoin de la permission de lire les fichiers sur votre appareil.",
            buttonNeutral: language === "English" ? "Ask later" : "Demander plus tard",
            buttonNegative: language === "English" ? "Cancel" : "Annuler",
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permission refusée');
          return;
        }
      }
  
      const doc = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      });
  
      const originalFilePath = decodeURIComponent(doc.uri);
  
      // Nouveau chemin où vous voulez déplacer le fichier
      const newFilePath = `${RNFS.DocumentDirectoryPath}/${generateUniqueFileName("pdf")}`;
  
      // Déplacer le fichier
      await RNFS.moveFile(originalFilePath, newFilePath);
  
      doc.uri = `file://${newFilePath}`;
      downloadPdf(doc);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Téleversement interrompu', err);
      } else {
       // Alert.alert(err);
      }
    }
  };
  

  const dismissModall = () => {

    setModalVisible2(false);
}


  return (
    <Modal 
        visible={modalVisible}
        onRequestClose={() => {

                setSelected([])
                dismissModal();
        }}
        transparent={true}
        animationType="slide"
    >

<CameraModal modalVisible={modalVisible2} dismissModal={dismissModall} isFinished={onFinish} />

        <View style={{
            flex: 1, 
            backgroundColor: "#fff"
        }}>

            <View style={{
                paddingTop: Platform.OS === "ios" ? 65 : 17, 
                backgroundColor: "#fff", 
                paddingBottom: 17, 
                alignItems: "center", 
                flexDirection: "row", 
                justifyContent: "space-between", 
                paddingHorizontal: 10, 
                paddingTop: Platform.OS === "ios" ? 45 : 20
            }}>

                <View >
                    <TouchableOpacity onPress={() => { dismissModal()}}>
                        <Ionicons name='close' color={"#000"} size={SIZES.h2} />
                    </TouchableOpacity>
                </View>

                <View style={{
                  flex: 1, 
                  alignItems: "center"
                }}>
                    <Text style={{
                        fontFamily: FONTS.bold, 
                        fontSize: SIZES.h5, 
                        color: "rgba(0,0,0,0.8)", 
                        marginLeft: SIZES.h3 + SIZES.h2/2
                    }}>{language === "English" ? "Camera Roll" : "Pellicule"}</Text>
                </View>

                <View >
                 
                       {
                        selected.length > 0 ? 
                        <TouchableOpacity onPress={onTerminate}>
                            <Text style={{
                                fontFamily: FONTS.bold, 
                                color: COLORS.primary, 
                                fontSize: SIZES.h5
                            }}>{language === "English" ? "Done" : "Terminer"}</Text>
                        </TouchableOpacity> : 
                        <View style={{
                            flexDirection: "row", 
                            alignItems: "center"
                        }}>
                            <TouchableOpacity onPress={selectDoc} style={{
                                paddingHorizontal: 10
                            }}>
                                <AntDesign name='addfile' color="#000" size={SIZES.h3} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={openCamera}>
                                <Ionicons name='camera' color="#000" size={SIZES.h2} />
                            </TouchableOpacity>
                        </View>
                       }
                   
                </View>

            </View>

            <View style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.2)", 
            
            }}>
            <ScrollView contentContainerStyle={{
                 flexDirection: "row", 
                 flexWrap: "wrap", 
              
            }}>

                {
                    medias.map((item, index) => {

                            return(
                                <TouchableOpacity
                                key={index}
                                onPress={() => toggleSelection(index) } style={{

                                }}>
                                    <Image 
                                       
                                        source={{uri: item.image.uri}}
                                        style={{width:SIZES.width/3, height: SIZES.height/4.9, resizeMode: "cover", 

                                    borderWidth: 1, borderColor: selected.includes(index) ? COLORS.primary : "#fff"}}
                                    />
                                     <View style={{
                                        position: "absolute", 
                                        top: 10, 
                                        right: 10, 
                                        height: SIZES.width * 0.08, 
                                        width: SIZES.width * 0.08, 
                                        borderRadius:SIZES.width * 0.08, 
                                        borderWidth: 2, 
                                        borderColor: "#fff", 
                                        backgroundColor: selected.includes(index) ? COLORS.primary : "transparent", 
                                        alignItems: "center", 
                                        justifyContent: "center"
                                    }} >
                                        { selected.indexOf(index) !== -1 && <Text style={{
                                            fontFamily: FONTS.regular, 
                                            color: "#fff", 
                                            fontSize: SIZES.width * 0.03
                                        }}>
                                            {parseInt(selected.indexOf(index)) + 1 }
                                        </Text> }
                                    </View>

                                </TouchableOpacity>
                            )
                    })
                }

</ScrollView>

            </View>

        </View>
    </Modal>
  )
}

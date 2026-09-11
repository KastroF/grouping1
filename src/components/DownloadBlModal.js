import React, { useContext, useState } from 'react'
import { Modal, Platform, Text, TouchableOpacity, View } from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons"
import AntDesign from "react-native-vector-icons/AntDesign"
import Feather from "react-native-vector-icons/Feather"
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import uuid from 'react-native-uuid';
import CameraModal from "./CameraModal";
import { AuthContext } from '../navigation/AuthProvider';

const MAX_IMAGES = 2;

export default function DownloadBlModal({modalVisible, dismissModal, terminate, putImage, downloadPdf}) {

   const { language } = useContext(AuthContext);

   const [modalVisible2, setModalVisible2] = useState(false);

   const onFinish = (media) => {

        setModalVisible2(false);
        putImage(media)

   }

  // Android ne renvoie pas toujours le prefixe file://, que RNFS et l'upload attendent.
  const normalizeUri = (uri) => {

      if(!uri) return uri;

      return Platform.OS === "android" && !uri.startsWith("file://") ? "file://" + uri : uri;
  }

  // Le selecteur systeme ne demande aucune autorisation de lecture des medias :
  // c'est ce que recommande Google pour un acces ponctuel a la galerie.
  const pickFromGallery = () => {

      launchImageLibrary(
        {
          mediaType: 'photo',
          quality: 0.3,
          selectionLimit: MAX_IMAGES,
        },
        response => {

          if(response.didCancel) return;

          if(response.errorCode){

              console.warn("Sélecteur d'images :", response.errorMessage);
              return;
          }

          const assets = response.assets || [];

          if(assets.length === 0) return;

          // Meme forme que l'ancienne pellicule : les ecrans consommateurs
          // lisent media.image.uri et media.image.filename.
          const medias = assets.slice(0, MAX_IMAGES).map((asset) => ({
              image: {
                  ...asset,
                  uri: normalizeUri(asset.uri),
                  filename: asset.fileName,
              },
          }));

          terminate(medias);
        },
      );
  }

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

  const option = (icone, libelle, description, action) => {

      return(
          <TouchableOpacity onPress={action} style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 18,
              paddingHorizontal: 20,
              borderBottomWidth: 1,
              borderBottomColor: "rgba(0,0,0,0.06)",
          }}>
              <View style={{
                  height: SIZES.width * 0.12,
                  width: SIZES.width * 0.12,
                  borderRadius: SIZES.width * 0.06,
                  backgroundColor: "rgb(241, 246, 251)",
                  alignItems: "center",
                  justifyContent: "center",
              }}>
                  {icone}
              </View>
              <View style={{marginLeft: 15, flex: 1}}>
                  <Text style={{
                      fontFamily: FONTS.bold,
                      fontSize: SIZES.h4,
                      color: COLORS.primary,
                  }}>{libelle}</Text>
                  <Text style={{
                      fontFamily: FONTS.regular,
                      fontSize: SIZES.h7,
                      color: "#888",
                      marginTop: 2,
                  }}>{description}</Text>
              </View>
              <Feather name="chevron-right" size={SIZES.h3} color="#bbb" />
          </TouchableOpacity>
      )
  }

  return (
    <Modal
        visible={modalVisible}
        onRequestClose={dismissModal}
        transparent={true}
        animationType="slide"
    >

<CameraModal modalVisible={modalVisible2} dismissModal={dismissModall} isFinished={onFinish} />

        <View style={{
            flex: 1,
            backgroundColor: "#fff"
        }}>

            <View style={{
                backgroundColor: "#fff",
                paddingBottom: 17,
                alignItems: "center",
                flexDirection: "row",
                paddingHorizontal: 10,
                paddingTop: Platform.OS === "ios" ? 65 : 20,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(0,0,0,0.06)",
            }}>

                <TouchableOpacity onPress={dismissModal}>
                    <Ionicons name='close' color={"#000"} size={SIZES.h2} />
                </TouchableOpacity>

                <View style={{flex: 1, alignItems: "center"}}>
                    <Text style={{
                        fontFamily: FONTS.bold,
                        fontSize: SIZES.h5,
                        color: "rgba(0,0,0,0.8)",
                        marginRight: SIZES.h2,
                    }}>{language === "English" ? "Add a document" : "Ajouter un document"}</Text>
                </View>

            </View>

            <View style={{flex: 1}}>

                {option(
                    <Ionicons name='images-outline' color={COLORS.primary} size={SIZES.h3} />,
                    language === "English" ? "Choose a photo" : "Choisir une photo",
                    language === "English" ? `Up to ${MAX_IMAGES} photos from your gallery` : `Jusqu'à ${MAX_IMAGES} photos de votre galerie`,
                    pickFromGallery
                )}

                {option(
                    <Ionicons name='camera-outline' color={COLORS.primary} size={SIZES.h3} />,
                    language === "English" ? "Take a photo" : "Prendre une photo",
                    language === "English" ? "Use the camera" : "Utiliser l'appareil photo",
                    openCamera
                )}

                {option(
                    <AntDesign name='addfile' color={COLORS.primary} size={SIZES.h4} />,
                    language === "English" ? "Attach a PDF" : "Joindre un PDF",
                    language === "English" ? "Draft or bill of lading" : "Draft ou connaissement",
                    selectDoc
                )}

            </View>

        </View>
    </Modal>
  )
}

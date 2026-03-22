import React, { useContext, useEffect, useRef, useState } from 'react';
import { ImageBackground, Modal, Platform, StyleSheet, Text, TouchableOpacity, PermissionsAndroid, View, Alert } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES } from '../constants/theme';
import { AuthContext } from '../navigation/AuthProvider';

export default function CameraModal({ modalVisible, dismissModal, isFinished }) {
  const { language } = useContext(AuthContext);
  const device = useCameraDevice("back");
  const [imageData, setImageData] = useState(null);
  const cameraRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [flash, setFlash] = useState("off");

  const takePicture = async () => {
    try {
      const photo = await cameraRef.current.takePhoto({qualityPrioritization: 'speed'});
      setImageData(photo.path);
      setPhoto(photo);
    } catch (e) {
      console.log(e);
      Alert.alert(language === "English" ? "Error" : "Erreur", language === "English" ? "Unable to take the photo" : "Impossible de prendre la photo");
    }
  };

  useEffect(() => {
    console.log("CameraModal monté ? modalVisible =", modalVisible);
  }, [modalVisible]);

  const takePhoto = () => {
    if (photo && photo.path) {
      const filename = imageData.split('/').pop();
      const extension = filename.split('.').pop();
      const mime = extension === 'jpg' ? 'image/jpeg' : `image/${extension}`;
      const image = {
        uri: Platform.OS === "android" ? `file://${imageData}` : imageData,
        type: mime,
        fileName: filename,
      };
      isFinished(image);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestCameraPermission();
    }
  }, []);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: language === "English" ? "Camera permission" : "Permission caméra",
          message: language === "English" ? "The app needs access to your camera." : "L'application a besoin d'accéder à votre caméra.",
          buttonNeutral: language === "English" ? "Later" : "Plus tard",
          buttonNegative: language === "English" ? "Cancel" : "Annuler",
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Caméra autorisée');
      } else {
        console.log('Caméra refusée');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const toggleFlash = () => {
    setFlash(prev => (prev === 'off' ? 'on' : 'off'));
  };

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={dismissModal}
    >
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        {imageData ? (
          <View style={{ flex: 1 }}>
            <ImageBackground
              source={{ uri: Platform.OS === "android" ? `file://${imageData}` : imageData }}
              style={{ width: SIZES.width, height: SIZES.height - 200 }}
              resizeMode="cover"
            >
              <TouchableOpacity onPress={() => setImageData("")} style={{ padding: 20 }}>
                <Ionicons name="chevron-back" size={SIZES.height / 20} color="#fff" />
              </TouchableOpacity>
            </ImageBackground>
            <View style={{ height: 100, justifyContent: "center", alignItems: "center" }}>
              <TouchableOpacity onPress={takePhoto} style={{ height: 60, width: 120, borderRadius: 30, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 16 }}>{language === "English" ? "Next" : "Suivant"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            {device && (
              <Camera
                ref={cameraRef}
                device={device}
                isActive={true}
                photo
                style={StyleSheet.absoluteFill}
                torch={flash}
              />
            )}
            <View style={{ position: "absolute", top: 50, left: 25, flexDirection: "row" }}>
              <TouchableOpacity onPress={dismissModal}>
                <Ionicons name="close" size={SIZES.height / 25} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleFlash} style={{ marginLeft: 15 }}>
                <Ionicons name={flash === "off" ? "flash-off" : "flash"} size={SIZES.height / 28} color="#fff" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={takePicture} style={{ position: "absolute", bottom: 50, alignSelf: "center" }}>
              <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center" }}>
                <View style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: "#fff" }} />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}
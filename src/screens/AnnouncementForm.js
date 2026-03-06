import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Image, ImageBackground, Modal, PermissionsAndroid, Platform, Linking, Alert, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { COLORS, conteneurs, FONTS, kilos, SIZES } from '../constants/theme';
import Feather from "react-native-vector-icons/Feather"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import AntDesign from "react-native-vector-icons/AntDesign"
import Dropdown from 'react-native-input-select';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormInput from '../components/FormInput';
import Button1 from "../components/Button1"; 
import { useFetchFunctions } from '../infrastructures/functions';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import ErrorMessage from '../components/ErrorMessage';
import { AuthContext } from '../navigation/AuthProvider';
import DownloadBlModal from '../components/DownloadBlModal';
import CreateAnnouncement from './CreateAnnouncement';
import DocumentPicker from 'react-native-document-picker';
import Loading from '../components/Loading';
import SuccessModal from '../components/successModal';
import DatePicker from 'react-native-date-picker';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import axios from "axios";
import RNModal from 'react-native-modal';
import { launchImageLibrary } from 'react-native-image-picker';
import CameraModal from '../components/CameraModal';
import { WebView } from 'react-native-webview';
import RNFS from 'react-native-fs';
import uuid from 'react-native-uuid';
import DeviceInfo from 'react-native-device-info';
import { API } from '../config/api';


LocaleConfig.locales['fr'] = {
    monthNames: [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre'
    ],
    monthNames: [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre'
    ],
    monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
    today: "Aujourd'hui"
  };


  const getDevises = (language) => [
    {
      "code": "XAF",
      "label": "Franc CFA (BEAC)",
      "value": "XAF",
      "countries": ["Gabon", "Cameroun", "Tchad", "Congo", "République Centrafricaine", "Guinée Équatoriale"]
    },
    {
      "code": "XOF",
      "label": "Franc CFA (BCEAO)",
      "value": "XOF",
      "countries": ["Sénégal", "Côte d'Ivoire", "Burkina Faso", "Mali", "Niger", "Bénin", "Togo", "Guinée-Bissau"]
    },
    {
      "code": "USD",
      "label": language === "English" ? "US Dollar" : "Dollar américain",
      "value": "$",
      "countries": ["États-Unis", "Équateur", "El Salvador", "Zimbabwe"]
    },
    {
      "code": "EUR",
      "label": "Euro",
      "value": "€",
      "countries": ["France", "Allemagne", "Espagne", "Italie", "Belgique", "Pays-Bas", "Portugal", "Irlande", "Autriche", "Grèce", "et autres"]
    },
    {
      "code": "GBP",
      "label": language === "English" ? "British Pound" : "Livre sterling",
      "value": "£",
      "countries": ["Royaume-Uni"]
    },
    {
      "code": "NGN",
      "label": language === "English" ? "Nigerian Naira" : "Naira nigérian",
      "value": "₦",
      "countries": ["Nigeria"]
    },
    {
      "code": "KES",
      "label": language === "English" ? "Kenyan Shilling" : "Shilling kényan",
      "value": "KSh",
      "countries": ["Kenya"]
    },
    {
      "code": "ZAR",
      "label": language === "English" ? "South African Rand" : "Rand sud-africain",
      "value": "R",
      "countries": ["Afrique du Sud", "Namibie", "Lesotho", "Eswatini"]
    },
    {
      "code": "GHS",
      "label": language === "English" ? "Ghanaian Cedi" : "Cedi ghanéen",
      "value": "₵",
      "countries": ["Ghana"]
    },
    {
      "code": "CDF",
      "label": language === "English" ? "Congolese Franc" : "Franc congolais",
      "value": "FC",
      "countries": ["République démocratique du Congo"]
    }
  ]
  
  
  LocaleConfig.defaultLocale = 'fr';


const GET_CITIES_URL = API.CITY_LIST_BY_COUNTRY;
const GET_COUNTRIES_URL = API.COUNTRY_LIST;
const AJOUTER_UNE_ANNONCE_URL = API.ANNONCE_ADD;
const MODIFIER_UNE_ANNONCE_URL = API.ANNONCE_MODIFY_KILO;
const AJOUTER_UNE_ANNONCE_AVEC_PDF_URL = API.ANNONCE_ADD_PDF;
const AJOUTER_UNE_ANNONCE_AVEC_IMAGE_URL = API.ANNONCE_ADD_IMAGES;
const AJOUTER_UN_CONTENEUR_URL = API.ANNONCE_ADD_CONTAINER;
const MODIFIER_UN_CONTENEUR_URL = API.ANNONCE_MODIFY_IMG;
const MODIFIER_UNE_ANNONCE_AVEC_PDF_URL = API.ANNONCE_MODIFY_PDF;
const MON_ANNONCE_URL = API.ANNONCE_GET_ONE;
export default function AnnouncementForm({route, navigation}) {


    const [pieds, setPieds] = useState(20); 
    const [kiloss, setKiloss] = useState(null); 
    const [openFor, setOpenFor] = useState(""); 
    const [type, setType] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [cArrival, setCArrival] = useState(""); 
    const [cDeparture, setCDeparture] = useState("")
    const [kArrival, setKArrival] = useState(""); 
    const [kDeparture, setKDeparture] = useState(""); 
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState(null);
    const [cACountry, setCACountry] = useState(null); 
    const [cDCountry, setCDCountry] = useState(null); 
    const [kACountry, setKACountry] = useState(null); 
    const [kDCountry, setKDCountry] = useState(null); 
    const [cACities, setCACities] = useState([]); 
    const [cDCities, setCDCities] = useState([]); 
    const [kACities, setKACities] = useState([]); 
    const [kDCities, setKDCities] = useState([]); 
    const [load, setLoad] = useState(false);
    const {value, _id} = route.params; 
    const {laFonctionGet, postFunction, isTabBarVisible, postAvecFichier, postWithFile} = useFetchFunctions()
    const [announcementKiloStartCity, setAnnouncementKiloStartCity] = useState(""); 
    const [announcementKiloEndCity, setAnnouncementKiloEndCity] = useState(""); 
    const [announcementContainerStartCity, setAnnouncementContainerStartCity] = useState(""); 
    const [announcementContainerEndCity, setAnnouncementContainerEndCity] = useState(""); 
    const [cAFinalCountry, setCAFinalCountry] = useState(""); 
    const [cDFinalCountry, setCDFinalCountry] = useState("");
    const [kAFinalCountry, setKAFinalCountrys] = useState(""); 
    const [kDFinalCountry, setKDFinalCountry] = useState("");
    const [selected, setSelected] = useState('');
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);
    const [finalDate, setFinalDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [kiloPrice, setKiloPrice] = useState(null); 
    const [company, setCompany] = useState(null);
    const [kiloDescription, setKiloDescription] = useState(""); 
    const [containerDescription, setContainerDescription] = useState("");
    const [bookingReference, setBookingReference] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false); 
    const {token, setRefresh, setRefreshModify, refreshModify, language} = useContext(AuthContext);
    const [medias, setMedias] = useState([]);
    const [pdf, setPdf] = useState(null);
    const [good, setGood] = useState(false);
    const [modalVisible4, setModalVisible4] = useState(false);
    const [citiesError, setCitiesError] = useState(""); 
    const [dateError, setDateError] = useState("");
    const [countKilosError, setCountKilosError] = useState("");
    const [name, setName] = useState(""); 
    const [photoNames, setPhotoNames] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [CongratStack2, setCongratStack2] = useState(null);
    const [image, setImage] = useState(null);
    const [cam, setCam] = useState(null); 
    const [pdff, setPdff] = useState(null);
    const [modalVisible5, setModalVisible5] = useState(false);
    const [shouldOpenCamera, setShouldOpenCamera] = useState(false);
    const [annonce, setAnnonce] = useState(null);
    const [devise, setDevise] = useState("$");
    const [visible, setVisible] = useState(false);
    const [text, setText] = useState("");

    const loadCongratStack2 = async () => {
      const module = await import('../navigation/CongratStack2');
      setCongratStack2(() => module.default);
    };
    



  useEffect(() => {



    const getAnnonce = async () => {


        const uniqueId = await DeviceInfo.getUniqueId();

        postFunction(MON_ANNONCE_URL, {id: _id, phoneId: uniqueId}, token).then((data) => {

            // console.log(data.user);
 
             if(data && data.status === 0){
 
                    // setLoading(false);
 
                    // setUserr(data.user); 
                    // setSum(data.sum); 
                     setAnnonce(data.annonce)
                     console.log(data.annonce);

                     let anouncementt = data.annonce; 


                        setFinalDate(new Date(anouncementt.dateOfDeparture))
                        
                        if(anouncementt.status === "container"){

                            setCAFinalCountry(anouncementt.endCity2.country)
                            setCDFinalCountry(anouncementt.startCity2.country)
                            setAnnouncementContainerEndCity(anouncementt.endCity2.name)
                            setAnnouncementContainerStartCity(anouncementt.startCity2.name);
                            setPieds(parseInt(anouncementt.pieds));
                            setContainerDescription(anouncementt.description);
                            if(anouncementt.bookingReference) setBookingReference(anouncementt.bookingReference);
                            setPhotoNames([anouncementt.fileName])

                            if(anouncementt.fileType === "application/pdf"){

                                    setName("pdf");
                                    setPdff({
                                        uri: anouncementt.draft[0],
                                            name: anouncementt.fileName,
                                            type: anouncementt.fileType
                                    });
                                    setImage(null);

                                    }else{

                                        setName("image"); 
                                        setImage({
                                            uri: anouncementt.draft[0], 
                                            name: anouncementt.fileName, 
                                            type: anouncementt.fileType
                                        })
                                        setPdff(null);
                                    }
                            

                        }else{

                            setKAFinalCountrys(anouncementt.endCity2.country)
                            setKDFinalCountry(anouncementt.startCity2.country)
                            setAnnouncementKiloEndCity(anouncementt.endCity2.name)
                            setAnnouncementKiloStartCity(anouncementt.startCity2.name); 
                            setDevise(anouncementt.devise);
                            setKiloDescription(anouncementt.description); 
                            setKiloPrice(anouncementt.kiloPrice.toString()); 
                           // alert(parseInt(anouncementt.kilosCount))
                            setKiloss(anouncementt.kilosCount.toString());
                            setCompany(anouncementt.company)
                            

                        }

                            
                     
             }
     }, (err) => {
 
             setLoading(false);
     })
    }

    if(_id){

        getAnnonce();
    }





   },[])





    const goBack = () => {

        navigation.goBack();
    }


  function generateUniqueFileName(extension = 'pdf') {
    const now = new Date();
    const uniqueId = uuid.v4();
    const timestamp = now.toISOString().replace(/[-:.]/g, '');
    return `${timestamp}_${uniqueId}.${extension}`;
  }

  
  const selectPDF = async () => {
    try {
      const doc = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
        copyTo: 'cachesDirectory', // Important pour obtenir un chemin accessible
      });
  
      console.log("Document sélectionné :", doc);
  
      const originalFilePath = decodeURIComponent(doc.fileCopyUri || doc.uri);
  
      const newFilePath = `${RNFS.DocumentDirectoryPath}/${generateUniqueFileName("pdf")}`;
  
      // Déplacer le fichier (attention aux erreurs si fileCopyUri est undefined)
      await RNFS.moveFile(originalFilePath, newFilePath);
  
      doc.uri = `file://${newFilePath}`;
  
      setName("pdf");
      setPhotoNames([doc.name]);
      setIsVisible(false);
      setImage(null);
      setPdff(doc);
  
      return doc;
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Sélection annulée');
      } else {
        console.error("Erreur sélection PDF :", err);
      }
    }
  };
  

const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,

      {
        title: 'Storage Permission',
        message: 'App needs access to your storage to download Photos.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Storage permission denied');
    }
  }
};

const checkPermission = async () => {
  if (Platform.OS === 'android') {
    const result = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    switch (result) {
      case RESULTS.UNAVAILABLE:
        console.log('This feature is not available (on this device / in this context)');
        break;
      case RESULTS.DENIED:
        requestStoragePermission();
        break;
      case RESULTS.GRANTED:
        console.log('The permission is granted');
        break;
      case RESULTS.BLOCKED:
        console.log('The permission is denied and not requestable anymore');
        break;
    }
  }
};

useEffect(() => {

    requestCameraPermission();
   


  }, [])

  const requestCameraRollPermission = async () => {
    try {
        if(Platform.OS === "android"){
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: language === "English" ? 'Photo gallery access permission' : 'Permission d\'accès à la galerie photo',
          message: language === "English" ? 'This app needs access to your photo gallery.' : 'Cette application a besoin d\'accéder à votre galerie photo.',
          buttonNeutral: language === "English" ? 'Ask Me Later' : 'Plus tard',
          buttonNegative: language === "English" ? 'Cancel' : 'Annuler',
          buttonPositive: 'OK',
        },
      ); 
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Autorisation accordée'); 
        
       // getMediaFromGallery()

      } else {
        console.log('Autorisation refusée');
      }

    }
    } catch (err) {
      console.warn(err);  
    }
  };

  const onFinish = (i) => {

        setImage(i);
        setPdff(null);
        setName("image"); 
        setPhotoNames([i.fileName]);
        setModalVisible5(false);
        setIsVisible(false);
  }

// Call this function before picking the file



    useEffect(() => {

        

       // checkPermission();
        const getCountries = () => {

            laFonctionGet(GET_COUNTRIES_URL).then((data) => {

                    if(data && data.status === 0){


                            const countriess = data.countries; 

                            

                          const final =   countriess.map(item => {

                                    return {label: item.name, value: item._id, country: item.country}
                            })

                            const final2 = final.sort((a, b) => {
                                // Comparaison des labels en ignorant la casse
                                const labelA = a.label.toUpperCase();
                                const labelB = b.label.toUpperCase();
                                
                                if (labelA < labelB) {
                                    return -1;
                                }
                                if (labelA > labelB) {
                                    return 1;
                                }
                                return 0; // Les labels sont égaux
                            });

                            setCountries(final2)
                    
                        }else{

                                setLoad(false);
                        }



            }, (err) => {

                    console.log(err)
            })
    }


        getCountries();

        setPdf(null); 
        setMedias([]);


    },[]); 


    useEffect(() => {

        const isAndroid = Platform.OS === "android"; 
    
        if(isAndroid){
    
                requestCameraPermission();
        }
    
       },[])
    
       const requestCameraPermission = async () => {
        try {
          if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.requestMultiple([
              PermissionsAndroid.PERMISSIONS.CAMERA,
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
              
            ]);
      
            console.log("Permissions :", granted);
      
            const values = Object.values(granted);
      
            if (values.includes(PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN)) {
              Alert.alert(
                language === "English" ? "Permission blocked" : "Permission bloquée",
                language === "English" ? "Some permissions are blocked. Please enable them manually in settings." : "Certaines permissions sont bloquées. Veuillez les activer manuellement dans les paramètres.",
                [
                  { text: language === "English" ? "Cancel" : "Annuler", style: "cancel" },
                  { text: language === "English" ? "Open settings" : "Ouvrir les paramètres", onPress: () => Linking.openSettings() }
                ]
              );
              return;
            }
      
            const allGranted = values.every(value => value === PermissionsAndroid.RESULTS.GRANTED);
            if (allGranted) {
              console.log('Toutes les autorisations ont été accordées');
              // takePicture();
            } else {
              console.log('Une ou plusieurs autorisations ont été refusées');
            }
          }
        } catch (err) {
          console.warn(err);
        }
      };
      
      


    const toValidCity = () => {

        if(value === "container"){

            if(type === "a"){

                if(cArrival){

                    setAnnouncementContainerEndCity(cACities.filter(item => item.value === cArrival)[0].label);
                    setModalVisible(false); 
                    setCAFinalCountry(cACities.filter(item => item.value === cArrival)[0].country); 


                }else{

                        alert(language === "English" ? "Please select a city" : "Veuillez sélectionner une ville");
                }
          
            }


            if(type === "d"){

                if(cDeparture){

                    setAnnouncementContainerStartCity(cDCities.filter(item => item.value === cDeparture)[0].label);
                    setModalVisible(false); 
                    setCDFinalCountry(cDCities.filter(item => item.value === cDeparture)[0].country);

                }else{

                        alert(language === "English" ? "Please select a city" : "Veuillez sélectionner une ville");
                }
          
            }
    
        }else if(value === "kilos"){


            if(type === "a"){

                if(kArrival){

                    setAnnouncementKiloEndCity(kACities.filter(item => item.value === kArrival)[0].label);
                    setModalVisible(false); 
                    setKAFinalCountrys(kACities.filter(item => item.value === kArrival)[0].country)

                }else{

                        alert(language === "English" ? "Please select a city" : "Veuillez sélectionner une ville");
                }
          
            }


            if(type === "d"){

                if(kDeparture){

                    setAnnouncementKiloStartCity(kDCities.filter(item => item.value === kDeparture)[0].label);
                    setModalVisible(false); 
                    setKDFinalCountry(kDCities.filter(item => item.value === kDeparture)[0].country)

                }else{

                        alert(language === "English" ? "Please select a city" : "Veuillez sélectionner une ville");
                }
          
            }

        }

    }


    
    const pickMedia = () => {
        const options = {
          mediaType: "image",
          quality: 0.6,
        };
      
        launchImageLibrary(options, async (response) => {
            setIsVisible(false);
          if (response.didCancel) {
            console.log('L\'utilisateur a annulé');
          } else if (response.errorCode) {
            console.log('Erreur :', response.errorMessage);
          } else {
            const asset = response.assets[0];
            const mimeType = asset.type;
      
            if (mimeType.startsWith('image/')) {
              setImage(asset);
              setPhotoNames([asset.fileName]);
              setName("image");
              setPdff(null);
             // setVideo(null);
              
              console.log('Image sélectionnée');
            } else if (mimeType.startsWith('video/')) {
              console.log('Vidéo originale sélectionnée :', asset.uri);
      
              const compressedUri = await compressVideo(asset.uri);
              if (compressedUri) {
               // setVideo({ ...asset, uri: compressedUri });
                setImage(null);
                console.log('Vidéo compressée sélectionnée');
              }
            } else {
              console.warn('Type de fichier non pris en charge :', mimeType);
            }
          }
        });
      };
      


    const onChangeCountry2 = (valuee) => { 


        setLoad(true); 


        postFunction(GET_CITIES_URL, {_id: valuee, active: value}).then((data) => {


           // console.log()

            if(data && data.status === 0){

                    console.log(data);

                    if(value === "container"){

                            if(type === "a"){

                                setCACountry(valuee); 
                              
                               // setCities(data.cities);

                          const cities = data.cities; 

                          console.log(cities);

                          const final =  cities.map(item => {

                                return {label: item.name, value: item._id, country: item.country}
                        })

                        console.log("la finale", final);

                        const final2 = final.sort((a, b) => {
                            // Comparaison des labels en ignorant la casse
                            const labelA = a.label.toUpperCase();
                            const labelB = b.label.toUpperCase();
                            
                            if (labelA < labelB) {
                                return -1;
                            }
                            if (labelA > labelB) {
                                return 1;
                            }
                            return 0; // Les labels sont égaux
                        });


                            setCACities(final2);
                 
                            setCArrival(null);
                            setLoad(false); 
                            

                            
                        }

                            if(type === "d"){

                        setCDCountry(valuee); 
                           
                        const cities = data.cities; 

                          console.log(cities);

                          const final =  cities.map(item => {

                                return {label: item.name, value: item._id, country: item.country}
                        })

                        console.log("la finale", final);

                        const final2 = final.sort((a, b) => {
                            // Comparaison des labels en ignorant la casse
                            const labelA = a.label.toUpperCase();
                            const labelB = b.label.toUpperCase();
                            
                            if (labelA < labelB) {
                                return -1;
                            }
                            if (labelA > labelB) {
                                return 1;
                            }
                            return 0; // Les labels sont égaux
                        });

                            setCDCities(final2);
                      
                            //console.log()
                            setCDeparture(null);
                            setLoad(false); 

                            
                        

                                
                            }
                    
                        }else if(value === "kilos"){

                                if(type === "a"){


                                setKACountry(valuee); 
                              
                               // setCities(data.cities);

                          const cities = data.cities; 

                          console.log(cities);

                          const final =  cities.map(item => {

                                return {label: item.name, value: item._id, country: item.country}
                        })

                        console.log("la finale", final);

                        const final2 = final.sort((a, b) => {
                            // Comparaison des labels en ignorant la casse
                            const labelA = a.label.toUpperCase();
                            const labelB = b.label.toUpperCase();
                            
                            if (labelA < labelB) {
                                return -1;
                            }
                            if (labelA > labelB) {
                                return 1;
                            }
                            return 0; // Les labels sont égaux
                        });


                            setKACities(final2);
             
                            setKArrival(null);
                            setLoad(false); 

                                }else{


                                console.log("On est ici")
                                
                                setKDCountry(valuee); 
                              
                                // setCities(data.cities);

                           const cities = data.cities; 

                           console.log(cities);

                           const final =  cities.map(item => {

                                 return {label: item.name, value: item._id, country: item.country}
                         })

                         console.log("la finale", final);

                         const final2 = final.sort((a, b) => {
                             // Comparaison des labels en ignorant la casse
                             const labelA = a.label.toUpperCase();
                             const labelB = b.label.toUpperCase();
                             
                             if (labelA < labelB) {
                                 return -1;
                             }
                             if (labelA > labelB) {
                                 return 1;
                             }
                             return 0; // Les labels sont égaux
                         });


                             setKDCities(final2);
                      
                             setKDeparture(null);
                             setLoad(false); 


                                }
                        }

                
            }else{

                    setLoad(false);
            }

        }, (err) => {

                console.log(err); 
                setLoad(false);
        })

        

        
}


const onValidDate = () => {

    console.log(selected);

    if(selected){


        setFinalDate(selected);
        setModalVisible2(false);
    

    }else{

        alert(language === "English" ? "Please select a date" : "Veuillez au moins sélectionner une date");
    }
}


const onRegister = async () => {

    try{


    
    setErrorMessage("");
    setCitiesError("");
    setCountKilosError("");
    setDateError("");
    setLoading(true); 

        if(value === "kilos"){

            if((!announcementKiloStartCity || !announcementKiloEndCity) && (announcementKiloStartCity === "" || announcementKiloEndCity === "") ){

                setCitiesError("Veuillez choisir les villes de Départ et de Destination"); 
                setLoading(false); 

            }else{

                    if(!finalDate){

                        setDateError(language === "English" ? "Please select the flight departure date" : "Veuillez choisir la date de départ du vol");
                        setLoading(false)
                        setTimeout(() => {
                            setErrorMessage("");
                        }, 7000);
        

                    }else{

                        if(!kiloss){

                            setCountKilosError("Veuillez mentionner le nombre de kilos que vous proposez");
                            setLoading(false);
                            setTimeout(() => {
                                setErrorMessage("");
                            }, 7000);
            

                        }else{


                            if(announcementKiloStartCity === announcementKiloEndCity){

                                    setCitiesError("La ville de départ ne peut-être identique à celle d'arrivée"); 
                                    setLoading(false);
                                    setTimeout(() => {
                                        setErrorMessage("");
                                    }, 7000);
                    
                            
                            }else{

                                let kilo; 

                                if(kiloPrice.indexOf(",")){

                                     kilo = kiloPrice.replace(",", "."); 

                                    
                                }

                                /*

                            setKAFinalCountrys(anouncementt.endCity2.country)
                            setKDFinalCountry(anouncementt.startCity2.country)
                            setAnnouncementKiloEndCity(anouncementt.endCity2.name)
                            setAnnouncementKiloStartCity(anouncementt.startCity2.name); 
                            setDevise(anouncementt.devise);
                            setKiloDescription(anouncementt.description); 
                            setKiloPrice(anouncementt.priceKilo); 
                           // alert(parseInt(anouncementt.kilosCount))
                            setKiloss(anouncementt.kilosCount.toString());
                            setCompany(anouncementt.company)

                                */

                            let body = {}; 

                                if(annonce){

                                 
                                
                                    if(annonce.startCity2.name !== announcementKiloStartCity){
    
                                            body = {startCity: announcementKiloStartCity}
                                    }
    
                                    if(annonce.endCity2.name !== announcementKiloEndCity){
    
                                            body = {...body, endCity: announcementKiloEndCity}
                                    }
    
                                    if(new Date(annonce.dateOfDeparture) !== new Date(finalDate)){
    
                                            body = {...body, dateOfDeparture: finalDate}
                                    
                                    }
    
                                    if(parseInt(kiloss) !== parseInt(annonce.kilosCount)){
    
                                            body = {...body, kilosCount: kiloss}
                                    }
    
                                    if(parseInt(kilo) !== parseInt(annonce.priceKilo)){
    
                                        body = {...body, kiloPrice: kilo}
    
                                    }
    
                                    if(devise.toLowerCase() !== annonce.devise.toLowerCase()){
    
                                            body = {...body, devise: devise}
                                    }
    
                                    if(company.toLowerCase() !== annonce.company.toLowerCase()){
    
                                        body = {...body, company}
                                    }
    
                                    if(kiloDescription.toLowerCase() !== annonce.description.toLowerCase()      ){
    
                                        body = {...body, description: kiloDescription}
                                    }
    
                                    body = {...body, _id}
                                }


                                if(_id){


                                    postFunction(MODIFIER_UNE_ANNONCE_URL, body, token).then((data) => {


                                        setLoading(false); 

                                        if(data && data.status === 0){

                                            setText(language === "English" ? "Your listing has been updated successfully!" : "Votre annonce a été modifiée avec succès!");
                                            setVisible(true); 
                                            setRefreshModify(!refreshModify);
                                                
                                        }

                                    }, (err) => {

                                            console.log(err)
                                    })


                                }else{

                                    postFunction(AJOUTER_UNE_ANNONCE_URL, {
                                    
                                        startCity: announcementKiloStartCity, 
                                        endCity: announcementKiloEndCity, 
                                        dateOfDeparture: finalDate, 
                                        kilosCount: kiloss, 
                                        kiloPrice: kilo, 
                                        devise,
                                        company, 
                                        description: kiloDescription, 
                                        status: "kilos"
    
    
                                    }, token).then((data) => {
    
                                        if(data && data.status === 0){
    
                                          //  navigation.navigate("Congrats2"); 
                                            setRefresh(true);
                                            //setGood3(true);
    
                                            setLoading(false);
                                           //
                                           setGood(true);
    
                                        }else{
    
                                                setLoading(false);
                                        }
    
    
                                    }, (err) => {
    
                                            console.log(err)
                                    })
                                }




                            }
                              
                        }
                    }
            }


        }else if(value === "container"){




     if(!announcementContainerEndCity && !announcementContainerStartCity){

        setCitiesError("Veuillez choisir les villes de Départ et de Destination"); 
        setLoading(false); 
        setTimeout(() => {
            setCitiesError("");
        }, 7000);


     }else{



        if(!finalDate){

            setErrorMessage(language === "English" ? "Please select the flight departure date" : "Veuillez choisir la date de départ du vol");
            setLoading(false)
            setTimeout(() => {
                setErrorMessage("");
            }, 7000);


        }else{


            if(announcementContainerStartCity === announcementContainerEndCity){

                setCitiesError("La ville de départ ne peut-être identique à celle d'arrivée"); 
                setLoading(false);
                setTimeout(() => {
                    setErrorMessage("");
                }, 7000);

        
            }else{


           // setLoading(false);


                /*          setCAFinalCountry(anouncementt.endCity2.country)
                            setCDFinalCountry(anouncementt.startCity2.country)
                            setAnnouncementContainerEndCity(anouncementt.endCity2.name)
                            setAnnouncementContainerStartCity(anouncementt.startCity2.name); 
                            setPieds(parseInt(anouncementt.pieds));
                            setContainerDescription(anouncementt.description); 
                            setPhotoNames([anouncementt.fileName])
                            
                            if(anouncementt.fileType === "application/pdf"){

                                    setName("pdf"); 

                                    }else{

                                        setName("image"); 
                                        setImage({
                                            uri: anouncementt.draft[0], 
                                            name: anouncementt.fileName, 
                                            type: anouncementt.fileType
                                        })
                                        
                                    }*/






           




           if(image || pdff){

            let body = new FormData();
            console.log("l'image", image); 
            console.log("le pdf", pdff); 
            let urri = image ? image.uri : pdff.uri; 

            console.log("Est-on sorti de l'auberge du salut ?")


            if(_id){
 
                 if(annonce.startCity2.name !== announcementContainerStartCity){
 
                         if(annonce.draft[0] === urri){
 
                                 setLoading(false);
                                 setErrorMessage(language === "English" ? "Due to your changes, please upload a new Draft/BL" : "Suite à vos modifications, veuillez téléverser un nouveau Draft/Bl"); 
                                 setTimeout(() => {
                                    setErrorMessage("")
                                 }, 6000);
                                 return;
                         }
 
                     body.append("startCity", announcementContainerStartCity); 
 
                 }
 
 
 
                 if(annonce.endCity2.name !== announcementContainerEndCity){
 
                     if(annonce.draft[0] === urri){
 
                             setLoading(false);
                             setErrorMessage(language === "English" ? "Due to your changes, please upload a new Draft/BL" : "Suite à vos modifications, veuillez téléverser un nouveau Draft/Bl"); 
                             setTimeout(() => {
                                setErrorMessage("")
                             }, 6000);
                             return;
                     }
 
                 body.append("endCity", announcementContainerEndCity); 
                  
                 }
 
 
 
                 if(new Date(annonce.dateOfDeparture) !== new Date(finalDate)){
 
                     if(annonce.draft[0] === urri){
 
                             setLoading(false);
                             setErrorMessage(language === "English" ? "Due to your changes, please upload a new Draft/BL" : "Suite à vos modifications, veuillez téléverser un nouveau Draft/Bl"); 
                             setTimeout(() => {
                                setErrorMessage("")
                             }, 6000);
                             return;
                     }
 
                  body.append("dateOfDeparture", finalDate.toISOString());
                  
                 }
 
 
            if(parseInt(annonce.pieds) !== parseInt(pieds)){

                console.log(annonce.draft[0]+ " "+urri); 
 
 
             if(annonce.draft[0] === urri){
 
                     setLoading(false);
                     setErrorMessage(language === "English" ? "Due to your changes, please upload a new Draft/BL" : "Suite à vos modifications, veuillez téléverser un nouveau Draft/Bl"); 
                     setTimeout(() => {
                        setErrorMessage("")
                     }, 6000);
                     return;
             }
 
             body.append("pieds", pieds); 
          
           }
 
    
 
 
            if(annonce.description !== containerDescription){
 
                 body.append("description", containerDescription)
            }
 
            }


            const formData = new FormData(); 

            formData.append("startCity", announcementContainerStartCity); 
            formData.append("endCity", announcementContainerEndCity); 
            formData.append("dateOfDeparture", finalDate.toISOString()); 
            formData.append("description", containerDescription); 
            formData.append("status", "container");
            formData.append("pieds", pieds);
            if(bookingReference.trim()) formData.append("bookingReference", bookingReference.trim());
 
            formData.append("fileName", image ? image.fileName : pdff.name.replace(/\s/g, '_')); 
            formData.append("fileType", image ? image.type : pdff.type )
 
            
            body.append("fileName", image ? image.fileName : pdff.name.replace(/\s/g, '_')); 
            body.append("fileType", image ? image.type : pdff.type )

           

            if(image){

              //console.log(resizedImag.uri.split('.').pop());
  
               formData.append("images", {
                  uri: image.uri, 
                  type: image.type,
                  name: image.fileName
              })  

              
              if(annonce && annonce.draft[0] !== image.uri){

                    body.append("images", {
                        uri: image.uri, 
                        type: image.type,
                        name: image.fileName
                    })

         
              }
           

        if(_id){

            body.append("_id", _id);
            const response = await axios.post(MODIFIER_UN_CONTENEUR_URL, body, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'multipart/form-data',
                },
              });


              if(response.data && response.data.status === 0){
       
                setText(language === "English" ? "Your listing has been updated successfully! It will reappear in publications after validation." : "Votre annonce a été modifiée avec succès!, elle réapparaîtra dans les publications après validation.");
                setVisible(true); 
                setLoading(false);
                setRefreshModify(!refreshModify);
        
             }else{
        
                     setLoading(false);
             }

        }else{


            console.log("l'image", image);
            console.log("C'est ici");
       
            const response = await axios.post(AJOUTER_UN_CONTENEUR_URL, formData, {
               headers: {
                 Authorization: `Bearer ${token}`,
                 'Content-Type': 'multipart/form-data',
               },
             });
         
             console.log('Réponse serveur:', response.data);
       
       
       
             if(response.data && response.data.status === 0){
       
               // navigation.navigate("Congrats2"); 
                setGood(true);
               // setModalVisible4(true);
                setLoading(false);
       
            }else{
       
                    setLoading(false);
            }

        }
  
        



      /*  postAvecFichier(AJOUTER_UN_CONTENEUR_URL, formData, token).then((data) => {

            if(data && data.status === 0){

                 // navigation.navigate("Congrats2"); 
                  setGood(true);
                  setModalVisible4(true);
                  setLoading(false);

              }else{

                      setLoading(false);
              }
            
        }) */


            }else if(pdff){

               // console.log(pdff.name.replace(/\s/g, '_'));

               console.log(pdff);
              
                formData.append("pdf_document", {
                    uri: pdff.uri, 
                    type: pdff.type,
                    name: pdff ? pdff.name.replace(/\s/g, '_') : ''
                }); 


                if(annonce && annonce.draft[0] !== pdff.uri){
                    
                    body.append("pdf_document", {
                        uri: pdff.uri, 
                        type: pdff.type,
                        name: pdff ? pdff.name.replace(/\s/g, '_') : ''
                    }); 

         
              }

               if(_id){

                body.append("_id", _id); 

                const response = await axios.post(MODIFIER_UNE_ANNONCE_AVEC_PDF_URL, body, {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                    },
                });


              if(response.data && response.data.status === 0){
       
                setText(language === "English" ? "Your listing has been updated successfully! It will reappear in publications after validation." : "Votre annonce a été modifiée avec succès!, elle réapparaîtra dans les publications après validation.");
                setVisible(true); 
                setLoading(false);
                setRefreshModify(!refreshModify);
        
             }else{
        
                     setLoading(false);
             }
            


               }else{

                const response = await axios.post(AJOUTER_UNE_ANNONCE_AVEC_PDF_URL, formData, {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                    },
                });
            
                console.log('Réponse serveur:', response.data);

                if(response.data && response.data.status === 0){

                      //navigation.navigate("Congrats2"); 
                      setGood(true);
                   //  setModalVisible4(true);
                      setLoading(false);

                  }else{

                          setLoading(false);
                  }
                
               }





                 

            }



            new Date().getFullYear().toString()

                    
                
                    console.log(formData);

           }else{

                setErrorMessage("Vous devez nous partager votre Draft / BL"); 
                setLoading(false);
           }

        }

        }
        

     }



        }

    }catch(err){

        console.log(err); 
        setLoading(false);
}

}


const convertContentUriToFile = async (uri) => {
    if (Platform.OS === 'android' && uri.startsWith('content://')) {
      const dest = `${RNFS.TemporaryDirectoryPath}/temp.pdf`;
      await RNFS.copyFile(uri, dest);
      return `file://${dest}`;
    }
    return uri;
  };


/*const postAvecFichier = async (url, body) => {

    const response = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });


      return response.json(); 
}*/

const dismissModal = () => {

        setModalVisible3(false); 
}


const onTerminate = (medias) => {
        let photos = []; 
        console.log("ce sont les medias", medias[0].image.filename); 
        setModalVisible3(false);
        
        setMedias(medias)

        for(let media of medias){

                //showAlertWithObjectFields(media.image);
                photos.push(media.image.uri);
        }

        setPdf(null);
        setName("Image");
        setPhotoNames(photos);
}

function getFileNameFromURI(uri) {
    // Vérifier si l'URI est valide
    if (!uri) return null;
    
    // Trouver la dernière occurrence de 'tmp/' dans l'URI

    let tmpIndex ;


    
    // Si 'tmp/' n'est pas trouvé, retourner null
    if (tmpIndex === -1) return null;
    
    // Extraire et retourner le nom du fichier
    return uri // +4 pour obtenir la partie après 'tmp/'
  }

const putImage = (media) => {
        
        let photos = [];
        setPhotoNames([]);
        setModalVisible3(false);
        setMedias([{image: media}]); 
        setPdf(null);
       // showAlertWithObjectFields(media);
        photos.push(getFileNameFromURI(media.uri));
        setPhotoNames(photos)
        setName("Image");
        console.log("les photos", photos);
        console.log("regarde bien les medias", media);

}


putPdf = (doc) => {
    let photos = []; 
        setModalVisible3(false); 
        setPdf(doc); 
        setMedias([])
        photos.push(doc.name);
       // showAlertWithObjectFields(doc); 
       // console.log(doc)
       setPhotoNames(photos)
       setName("pdf");

}



const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };



if(!token) return <CreateAnnouncement navigation={navigation} />

if(loading) return <Loading />

//if(good3) return <SuccessModal modalVisible={modalVisible4} onGoing={() => {setModalVisible4(false); }} />

if (good) {
    if (!CongratStack2) {
      loadCongratStack2();
      return <Loading />;
    }
    return <CongratStack2 />;
  }




  return (
    <View style={{
        flex: 1
    }}>


      <CameraModal  modalVisible={modalVisible5} dismissModal={() => setModalVisible5(false)} isFinished={(img) => onFinish(img)} />
      <RNModal
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
        swipeDirection="down"
        onSwipeComplete={() => setIsVisible(false)}
        style={styles.modal}
        backdropOpacity={0.3}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        onModalHide={() => {
            if (shouldOpenCamera) {
            setModalVisible5(true);
            setShouldOpenCamera(false);
            }


        }}
      >
        <View style={styles.modalContent}>
            <View style={{
                flexDirection: "row", 
                justifyContent: "flex-end"
            }}>
                <TouchableOpacity onPress={() => setIsVisible(false)}>
                    <AntDesign name='close' size={SIZES.h2} color="#aaa" />
                </TouchableOpacity>
            </View>



            <View style={{
                marginTop: 20, 
                flexDirection: "row", 
                alignItems: "center", 
                justifyContent: "space-around"
            }}>
                <TouchableOpacity 
                onPress={() => {
                    setIsVisible(false);
                    setShouldOpenCamera(true); 
                  }}
                style={{
                    alignItems: "center"
                }}>
                    <Image 
                        source={require("../assets/images/cam.png")}
                        style={{
                            height: 50, 
                            width: 70, 
                            resizeMode: "contain"
                        }}
                    />
                  <Text style={{
                    fontFamily: FONTS.regular, 
                    color: "#aaa", 
                    fontSize: SIZES.h6
                  }}>{language === "English" ? "Camera" : "Caméra"}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={pickMedia} style={{
                    alignItems: "center"
                }}>
                    <Image 
                        source={require("../assets/images/gallery.png")}
                        style={{
                            height: 50, 
                            width: 70, 
                            resizeMode: "contain"
                        }}
                    />
                  <Text style={{
                    fontFamily: FONTS.regular, 
                    color: "#aaa", 
                    fontSize: SIZES.h6
                  }}>Gallerie</Text>
                </TouchableOpacity>
            </View>

            <View style={{
                marginTop: 20, 
                marginBottom: 15,
                flexDirection: "row", 
                alignItems: "center", 
                justifyContent: "center"
            }}>

                <TouchableOpacity onPress={selectPDF} style={{
                    alignItems: "center"
                }}>
                    <Image 
                        source={require("../assets/images/pdf2.png")}
                        style={{
                            height: 50, 
                            width: 70, 
                            resizeMode: "contain"
                        }}
                    />
                  <Text style={{
                    fontFamily: FONTS.regular, 
                    color: "#aaa", 
                    fontSize: SIZES.h6
                  }}>Fichier Pdf</Text>
                </TouchableOpacity>
            </View>

        </View>
      </RNModal>

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.infoBox}>
            <Text style={styles.title}>{language === "English" ? "Success" : "Succès"}</Text>
            <Text style={styles.message}>
              {text}
            </Text>

            <TouchableOpacity
              style={styles.okButton}
              onPress={() => {setVisible(false); navigation.goBack()}}
            >
              <Text style={styles.okText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
        
        <SuccessModal modalVisible={modalVisible4} onGoing={() => {setModalVisible4(false); navigation.navigate("Hommee")}} />
        <KeyboardAwareScrollView 
        showsVerticalScrollIndicator = {false}
        contentContainerStyle={{
            paddingBottom: !isTabBarVisible ?  SIZES.height * 0.08 : SIZES.height * 0.001, 
            backgroundColor: "#fff"
        }}>

            <DownloadBlModal modalVisible={modalVisible3} dismissModal={dismissModal} 
            putImage={putImage} terminate={onTerminate} downloadPdf={putPdf} />

        
        <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => {

            
                setModalVisible(false);

            }}
        >

            <View style={{
                flex: 1, 
                backgroundColor: "#fff"
            }}>

                <View style={{
                
                marginTop: Platform.OS === "ios" ? 100 : 45,
                paddingHorizontal: 20, 
              
                }}>
                    <TouchableOpacity style={{
                        height: 60, 
                        width: 60, 
                        borderRadius: 30, 
                        borderWidth: 1, 
                        borderColor: "#bbb", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        
                    }} onPress={() => setModalVisible(false)}>
                        <AntDesign name='left' color="rgba(0,0,0,0.6)" size={25} />
                    </TouchableOpacity>
              
                    <View style={{
                        marginTop: 25, 
                        alignItems: "center", 
                        paddingHorizontal: 20
                    }}>
                        <Text style={{
                            fontFamily: FONTS.bold, 
                            fontSize: SIZES.h2, 
                            textAlign: "center",
                            color: COLORS.primary
                        }}>{language === "English" ? ("Select the " + (type === "d" ? "departure" : "arrival") + " city") : ("Choisir la ville " + (type === "d" ? "de départ" : "d'arrivée"))}</Text>
                        <Text style={{
                            fontFamily: FONTS.ligth, 
                            fontSize: SIZES.h6, 
                            color: COLORS.primary, 
                            marginTop: 8, 
                            textAlign: "center"
                        }}>{language === "English" ? "Please select the country first, then choose the city" : "Veuillez d'abord sélectionner le pays, ensuite vous choisirez la ville"}</Text>

                    </View>


                    <View style={{
                        marginTop: 15
                    }}>
                        <Dropdown
                            label="Pays"
                            placeholder={language === "English" ? "Select the country" : "Sélectionnez le pays"}
                            options={countries.map((country) => ({
                                label: country.label,
                                value: country.value,
                            }))}
                            selectedValue={value === "container" ? type === "a" ? cACountry : cDCountry : type=== "a" ? kACountry : kDCountry}
                            
                            onValueChange={(value) => onChangeCountry2(value)}
                            primaryColor={COLORS.primary}
                            dropdownStyle={{
                            borderColor: COLORS.middle_blue, 
                            backgroundColor: COLORS.gray
                            }}
                            labelStyle={{
                                fontFamily: FONTS.bold, 
                                fontSize: SIZES.h5, 
                                color: COLORS.primary
                            }}
                            placeholderStyle={{
                                color: "rgba(0,0,0,0.7)", 
                                fontFamily: FONTS.ligth
                            }}
                        
                            isSearchable={true}

                            selectedItemStyle={{
                                fontFamily: FONTS.regular,
                                color: "#000",
                                fontSize: SIZES.h5
                            }}
                            checkboxLabelStyle={{
                                fontFamily: FONTS.regular,
                                color: COLORS.primary,
                                fontSize: SIZES.h5
                            }}


                        />

                    </View>

                        <View style={{
                            marginTop: 20,
                            alignItems: "center"
                    }}>
                       { load ? <ActivityIndicator size="large" />  : <Dropdown
                            label="Ville"
                            placeholder={language === "English" ? "Select the city" : "Sélectionnez la ville"}
                            options={value === "container" ? type === "a" ? 
                            cACities.map((country) => ({
                                label: country.label,
                                value: country.value,
                            })) : cDCities.map((country) => ({
                                label: country.label,
                                value: country.value,
                            }))
                            : type=== "a" ? 
                            kACities.map((country) => ({
                                label: country.label,
                                value: country.value,
                            }))  : kDCities.map((country) => ({
                                label: country.label,
                                value: country.value,
                            }))
                            }
                            selectedValue={value === "container" ? type === "a" ? cArrival : cDeparture : type=== "a" ? kArrival : kDeparture}
                            
                            onValueChange={(valuee) => {value === "container" ? type === "a" ?  setCArrival(valuee) : setCDeparture(valuee) : type=== "a" ? setKArrival(valuee) : setKDeparture(valuee)}}
                            primaryColor={COLORS.primary}
                            dropdownStyle={{
                            borderColor: COLORS.middle_blue, 
                            backgroundColor: COLORS.gray
                            }}
                            labelStyle={{
                                fontFamily: FONTS.bold, 
                                fontSize: SIZES.h5, 
                                color: COLORS.primary
                            }}
                            placeholderStyle={{
                                color: "rgba(0,0,0,0.7)", 
                                fontFamily: FONTS.ligth
                            }}
                            isSearchable={true}
                            selectedItemStyle={{
                                fontFamily: FONTS.regular,
                                color: "#000",
                                fontSize: SIZES.h5
                            }}
                            checkboxLabelStyle={{
                                fontFamily: FONTS.regular,
                                color: COLORS.primary,
                                fontSize: SIZES.h5
                            }}
                            disabled={value === "container" ? type === "a" ? (!cACountry && !load) :  !cDCountry : type=== "a" ? !kACountry : !kDCountry}


                        />   }

                             

                    </View>

                    <View style={{
                           
                    }}>

                        <Button1 onPress={() => toValidCity()} label="Valider" textColor="#fff" backgroundColor={COLORS.primary} 
                        borderRadius={12} fontFamily={FONTS.regular} fontSize={SIZES.h2} />

                    </View>

                </View>

            </View>
            
        </Modal>
        <Modal 
            visible={modalVisible2}
            transparent={true}
            animationType="slide"
            onRequestClose={() => {

                setModalVisible2(false); 

            }}
        >

            <View style={{
                backgroundColor : "rgba(0,0,0,0.2)", 
                flex: 1
            }}>

                <View style={{
                    paddingTop: Platform.OS === "ios" ? 80 : 20, 
                    backgroundColor : "rgba(0,0,0,0.2)", 
                    paddingBottom: 20, 
 
                    width: SIZES.width,
                    paddingHorizontal: 15, 
                    alignItems: "flex-end"
                
                }}>
                    <TouchableOpacity onPress={() => setModalVisible2(false) }>
                        <AntDesign name='close' color="#fff" size={25} />
                    </TouchableOpacity>
                   

                </View>

                <View style={{
                    flex: 1, 
                    backgroundColor: "rgba(0,0,0,0.2)", 
                    alignItems: "center", 
                    justifyContent: "center"
                }}>

                <Calendar
                        onDayPress={day => {
                            setSelected(day.dateString);
                        }}
                        
                        theme={{
                            textSectionTitleColor: COLORS.primary, 
                            selectedDayBackgroundColor: COLORS.primary, 
                            textDayFontFamily: FONTS.bold, 
                            textDayHeaderFontFamily: FONTS.regular, 
                            textMonthFontFamily: FONTS.regular, 
                            todayButtonFontFamily: FONTS.regular, 
                            arrowColor: COLORS.primary, 
                            dayTextColor: COLORS.primary, 
                            monthTextColor: COLORS.primary, 
                            
                        }}
                        style={{
                            borderWidth: 1, 
                       
                          
                            paddingVertical: 10
                        }}
                        markedDates={{
                            [selected]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
                        }}
                        minDate={new Date().toISOString()}
                        />

                    <View style = {{
                        marginTop: 30, 
                        width: "100%", 
                        paddingHorizontal: 60
                    }}> 
                       <TouchableOpacity onPress={() => onValidDate()} style={{
                        paddingVertical: 15, 
                        alignItems: "center", 
                        backgroundColor: COLORS.primary, 
                        width: "100%", 
                        borderRadius: 13
                       }}>

                        <Text style={{
                            color: "#fff", 
                            fontSize: 15, 
                            fontFamily: FONTS.bold
                        }}>
                            {language === "English" ? "Confirm date" : "Validez la date"}
                        </Text>

                       </TouchableOpacity>
                    </View>
                </View>

            </View>

        </Modal>
        <ImageBackground source={require("../assets/images/Background.png")} 
            style={{
                flex: 1
            }}
        >

            

               <View style={{
                height: Platform.OS === "ios" ? 60 : 0, 
                backgroundColor: "rgba(0,0,0,0.1)", 
                width: SIZES.width, 
                borderBottomWidth: 1, 
                borderBottomColor: COLORS.gray
            }} />

            <Animated.View entering={FadeInDown.duration(400).springify().damping(18)} style={{
                marginTop: 15,
                paddingHorizontal: 10
            }}>

                <TouchableOpacity onPress={goBack}>
                    <Feather name='chevron-left' size={SIZES.width * 0.08} color="#fff" />
                </TouchableOpacity>

            </Animated.View>

            <Animated.View entering={FadeInDown.delay(120).duration(450).springify().damping(18)} style={{
                marginTop: 25,
                alignItems: "center",
                paddingHorizontal: 25
            }}>

                <View >
                    <Text style={{
                        fontFamily: FONTS.bold,
                        color: "#fff",
                        fontSize: SIZES.h2,
                        textAlign: "center"
                    }}>{language === "English" ? "Create your listing" : "Créez votre annonce"}</Text>
                     <Text style={{
                        fontFamily: FONTS.regular,
                        color: "#fff",
                        fontSize: SIZES.h5,
                        lineHeight: SIZES.h5,
                        textAlign: "center",
                        marginTop: 5
                    }}> {language === "English" ? (value === "container" ? "In just a few minutes, connect with thousands of shippers ready to use your space." : "Share your available kilos with people in your city.") : (value === "container" ? " En quelques minutes entrez en contact avec des milliers d'expéditeurs prêts à utiliser votre espace." : "Partagez vos kilos disponibles avec des personnes dans votre ville.")}</Text>
                </View>

            </Animated.View>

            <View style={{
                marginTop: Platform.OS === "ios" ? 40 : 30 , 
                backgroundColor: "#fff", 
                paddingHorizontal: 15, 
                paddingVertical: 50, 
                flex: 1, 
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40
            }}>

                <Animated.View entering={FadeInUp.delay(200).duration(450).springify().damping(18)} style={{
                    flexDirection: "row",

                }}>
                    <Pressable onPress={() => {setType("d"); setModalVisible(true)}} style={{
                        width: SIZES.width/2 - 20,
                        backgroundColor: COLORS.input_blue,

                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: COLORS.other_blue,
                        paddingVertical:  Platform.OS === "ios" ? 10 : 8,
                        paddingHorizontal: 10
                    }}>
                        <Text style={{
                                fontFamily: FONTS.ligth, 
                                fontSize: SIZES.h7, 
                                lineHeight: SIZES.h7,
                                color: COLORS.textInput
                            }}>{language === "English" ? "Departure country" : "Pays de départ"}</Text>

                    {value === "container" ?  <Text style={{
                            marginTop: Platform.OS === "ios" ? 10 : 4, 
                            fontFamily: FONTS.ligth, 
                            fontSize: SIZES.h6, 
                            textTransform: "capitalize",
                            color: "#000"
                        }}>
                        {cDFinalCountry }  
                        </Text> :  <Text style={{
                            marginTop: Platform.OS === "ios" ? 10 : 4, 
                            fontFamily: FONTS.ligth, 
                            fontSize:  SIZES.h6,
                            textTransform: "capitalize",
                            color: "#000"
                        }}>
                     {kDFinalCountry} 
                        </Text>}

                    </Pressable>

                    <Pressable onPress={() => {setType("d"); setModalVisible(true)}} style={{
                        width: SIZES.width/2 - 20, 
                        backgroundColor: COLORS.input_blue, 
                        
                        borderRadius: 10, 
                        borderWidth: 1, 
                        borderColor: citiesError ? "red" : COLORS.other_blue, 
                        marginLeft: 10, 
                        flexDirection: "row", 
                        alignItems: "center"
                    }}>

                        <View style={{
                            flex: 1, 
                            borderRightWidth: 1, 
                            borderRightColor: COLORS.other_blue, 
                            paddingVertical: Platform.OS === "ios" ? 10 : 8,
                            
                            paddingHorizontal: 10
                        }}>
                            <Text style={{
                                fontFamily: FONTS.ligth, 
                                fontSize: SIZES.h7,
                                lineHeight: SIZES.h7, 
                                color: COLORS.textInput, 
                                
                            }}>{language === "English" ? "Departure city" : "Ville de départ"}</Text>
                           <Text style={{
                            marginTop: Platform.OS === "ios" ? 10 : 4, 
                            fontFamily: FONTS.ligth, 
                            textTransform: "capitalize",
                            fontSize: SIZES.h6,
                            color: "#000", 
                           }}>{value === "container" ? announcementContainerStartCity :  announcementKiloStartCity} </Text>
                        </View>

                        <TouchableOpacity onPress={() => {setType("d"); setModalVisible(true)}} style={{
                            alignItems: "center", 
                            justifyContent: "center", 
                            paddingHorizontal: 3, 
                            
                        }} >
                            <MaterialCommunityIcons name='menu-down' color={COLORS.primary} size={30} />
                        </TouchableOpacity>

                    </Pressable>

                </Animated.View>

                <Animated.View entering={FadeInUp.delay(300).duration(450).springify().damping(18)} style={{
                    flexDirection: "row",

                    marginTop: 10
                }}>
                    <Pressable onPress={() => {setType("a"); setModalVisible(true)}} style={{
                        width: SIZES.width/2 - 20, 
                        backgroundColor: COLORS.input_blue, 
                   
                        borderRadius: 10, 
                        borderWidth: 1, 
                        borderColor: COLORS.other_blue, 
                        paddingVertical:  Platform.OS === "ios" ? 10 : 8, 
                        paddingHorizontal: 10
                    }}>
                        <Text style={{
                                fontFamily: FONTS.ligth, 
                                fontSize: SIZES.h7, 
                                lineHeight: SIZES.h7,
                                color: COLORS.textInput
                            }}>{language === "English" ? "Destination country" : "Pays de destination"} </Text>

                        {value === "container" ?  <Text style={{
                            marginTop: Platform.OS === "ios" ? 10 : 3, 
                            fontFamily: FONTS.ligth, 
                            fontSize: SIZES.h6,
                            textTransform: "capitalize",
                            color: "#000"
                        }}>
                        {cAFinalCountry} 
                        </Text> :  <Text style={{
                            marginTop: Platform.OS === "ios" ? 10 : 3, 
                            fontFamily: FONTS.ligth, 
                            fontSize: SIZES.h6, 
                            textTransform: "capitalize",
                            color: "#000"
                        }}>
                     {kAFinalCountry}
                        </Text>}

                    </Pressable>

                    <Pressable onPress={() => {setType("a"); setModalVisible(true)}} style={{
                        width: SIZES.width/2 - 20, 
                        backgroundColor:  COLORS.input_blue, 
                     
                        borderRadius: 10, 
                        borderWidth: 1, 
                        borderColor: citiesError ? "red" : COLORS.other_blue, 
                        marginLeft: 10, 
                        flexDirection: "row", 
                        alignItems: "center",
            
                    }}>

                        <View style={{
                            flex: 1, 
                            borderRightWidth: 1, 
                            borderRightColor: COLORS.other_blue, 
                         
                            paddingVertical:  Platform.OS === "ios" ? 10 : 8, 
                            paddingHorizontal: 10
                        }}>
                            <Text style={{
                                fontFamily: FONTS.ligth, 
                                fontSize:  SIZES.h7,
                                lineHeight: SIZES.h7, 
                                color: COLORS.textInput
                            }}>{language === "English" ? "Destination city" : "Ville de destination"} </Text>
                        <Text style={{
                            marginTop: Platform.OS === "ios"  ? 10 : 4, 
                            fontFamily: FONTS.ligth, 
                            fontSize: SIZES.h6,
                            textTransform: "capitalize",
                            color: "#000", 
                           }}>{value === "container" ? announcementContainerEndCity :  announcementKiloEndCity}</Text>
                        </View>

                        <TouchableOpacity onPress={() => {setType("a"); setModalVisible(true)}} style={{
                            alignItems: "center", 
                            justifyContent: "center", 
                            paddingHorizontal: 3
                        }} >
                            <MaterialCommunityIcons name='menu-down' color={COLORS.primary} size={30} />
                        </TouchableOpacity>

                    </Pressable>

                </Animated.View>

                {
                    citiesError && <ErrorMessage left={true}  errorMessage={citiesError}  />
                }

                <Animated.View entering={FadeInUp.delay(400).duration(450).springify().damping(18)} style={{
                    marginTop: 25,
                    paddingRight: 65
                }}>
                    <Text style={{
                        fontFamily: FONTS.bold,
                        color: COLORS.primary,
                        fontSize: SIZES.h5,
                        lineHeight: SIZES.h5
                    }}>{language === "English" ? (value === "container" ? "Select your container departure date" : "Select your departure date") : (value === "container" ? "Sélectionnez la date de départ de votre container" : "Sélectionez votre date de départ")}
                     <Text style={{color: "red", fontSize: 14, fontFamily: FONTS.ligth, marginLeft: 5}}> * </Text> </Text>
                </Animated.View>

                {
                    dateError && <ErrorMessage errorMessage={dateError} left={true} />
                }

                <Animated.View entering={FadeInUp.delay(480).duration(450).springify().damping(18)}>
                <TouchableOpacity onPress={() => setOpen(true)} style={{
                    marginTop: 10,
                    width: "100%",
                    backgroundColor: COLORS.input_blue,

                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: dateError ? "red" : COLORS.other_blue,
                    flexDirection: "row",

                }}> 

                <View style={{
                    flex: 1, 
                    paddingVertical: Platform.OS === "ios" ? 10 : 5, 
                    paddingHorizontal: 10
                }}>
                    <Text style={{
                            fontFamily: FONTS.ligth, 
                            fontSize: SIZES.height * 0.015, 
                            color: COLORS.other_blue
                    }}>{language === "English" ? "Click the calendar icon" : "Cliquez sur l'icône calendrier"}</Text>

                    <Text style={{
                         fontFamily: FONTS.regular, 
                         fontSize: SIZES.height * 0.017, 
                         color: "#000", 
                         marginTop: Platform.OS === "ios" ? 8 : 4
                    }}>
                        {formatDate(finalDate)}
                    </Text>

                </View>


                <TouchableOpacity onPress={() => setOpen(true)} style={{
                    paddingHorizontal: 10, 
                    alignItems: "center", 
                    justifyContent: "center"
                }}>
                    <AntDesign name='calendar' color={COLORS.primary} size={SIZES.h3} />
                </TouchableOpacity>
                

                </TouchableOpacity>
                </Animated.View>

                <View >
                <DatePicker
                    modal
                    open={open}
                    date={finalDate}
                    mode="date"
                    locale="fr"
                    minimumDate={new Date()}
                    onConfirm={(date) => {
                    setOpen(false);
                    setFinalDate(date);
                    }}
                    onCancel={() => {
                    setOpen(false);
                    }}
                />
                </View>

                <Animated.View entering={FadeInUp.delay(560).duration(450).springify().damping(18)} style={{
                    marginTop: 15
                }}>


                      { value === "container" &&  <Dropdown
                            label={language === "English" ? "Select a size *" : "Sélectionnez une taille *"}
                            placeholder={language === "English" ? "Make a choice" : "Faites un choix"}
                            options={conteneurs.map(item => ({
                                ...item,
                                label: item.label,
                            }))}
                            selectedValue={pieds}

                            onValueChange={(value) => setPieds(value)}
                            primaryColor={COLORS.primary}
                            dropdownStyle={{
                            borderColor: COLORS.other_blue,
                            backgroundColor: "#fff",
                            paddingHorizontal: 10
                            }}
                            labelStyle={{
                                fontFamily: FONTS.bold,
                                fontSize: SIZES.height * 0.015,
                                lineHeight: SIZES.height * 0.015,
                                color: COLORS.primary
                            }}
                            placeholderStyle={{
                                color: "rgba(0,0,0,0.7)",
                                fontFamily: FONTS.ligth
                            }}
                            isSearchable={true}

                            selectedItemStyle={{
                                fontFamily: FONTS.regular,
                                color: COLORS.primary,
                                fontSize: 17
                            }}
                            checkboxLabelStyle={{
                                fontFamily: FONTS.regular,
                                color: COLORS.primary,
                            }}


                        />  }

{ value === "kilos" &&  

        <View >

        <View style={{
           
            width: "100%", 
            borderWidth: 1, 
            borderColor: countKilosError ? "red" : COLORS.middle_blue, 
            borderRadius: 10, 
            paddingHorizontal: 8,
            paddingVertical: Platform.OS === "ios" ? 10 :  3,
           
            flexDirection: "row", 
            alignItems: "center"

        
        }}>

            <View style={{
                flex: 1, 
         
            }}>
                   <Text style={{
                    fontFamily: FONTS.ligth, 
                    color: COLORS.other_blue, 
                    fontSize: SIZES.height * 0.015, 
                   }}>{language === "English" ? "Enter available kilos" : "Saisissez le nombre de Kilos disponibles"}</Text>
                   <TextInput
                        keyboardType="numeric"
                        value={kiloss}
                        onChangeText={setKiloss}
                        style={{
                            fontSize: SIZES.height * 0.017,
                            lineHeight: SIZES.height * 0.017,
                            fontFamily: FONTS.regular, 
                            flex: 1, 
                            color: "#000", 
                            paddingVertical: 0,
                            marginTop: Platform.OS === "ios" ? 5 : 2,
                            
                        }}

                    />
            </View>
             
            <View style={{
                paddingLeft: 5
            }}>

                <Text style={{
                    fontFamily: FONTS.bold, 
                    color: COLORS.primary, 
                    fontSize: SIZES.height * 0.017
                }}>Kg</Text>
            </View>

        </View>

        {
            countKilosError && <ErrorMessage errorMessage={countKilosError} left={true} />
        }

    </View>


}
                </Animated.View>

            {
                value === "kilos" &&
                <Animated.View entering={FadeInUp.delay(640).duration(450).springify().damping(18)}>

                <View style={{
                    marginTop: 10
                }}> 
                    <Dropdown
                        options={getDevises(language).map(item => ({
                            ...item,
                            label: item.label,
                        }))}
                        label={language === "English" ? "Select a currency" : "Sélectionnez une devise"}
                        placeholder={language === "English" ? "Make a choice" : "Faites un choix"}
                        selectedValue={devise}

                        onValueChange={(value) => setDevise(value)}
                        primaryColor={COLORS.primary}
                        dropdownStyle={{
                        borderColor: COLORS.other_blue,
                        backgroundColor: "#fff",
                        paddingHorizontal: 10
                        }}
                        labelStyle={{
                            fontFamily: FONTS.bold,
                            fontSize: SIZES.height * 0.015,
                            lineHeight: SIZES.height * 0.015,
                            color: COLORS.primary
                        }}
                        placeholderStyle={{
                            color: "rgba(0,0,0,0.7)",
                            fontFamily: FONTS.ligth
                        }}

                        selectedItemStyle={{
                            fontFamily: FONTS.regular,
                            color: COLORS.primary,
                            fontSize: 17
                        }}
                        checkboxLabelStyle={{
                            fontFamily: FONTS.regular,
                            color: COLORS.primary,
                        }}
                    />
                </View>

                <View style={{
                    
                }}>
                    <FormInput 
                        label={language === "English" ? "Price per kilo" : "Prix du Kilo"}
                        iconName="dollar"
                        isNumeric={true}
                        backgroundColor="#fff"
                        value={kiloPrice}
                        onChangeText={setKiloPrice}
                        devise={devise}

                        
                    />
                </View>

                <View style={{
                    marginTop: 15
                }}>
                    <FormInput 
                        label={language === "English" ? "Airline" : "Compagnie aérienne"}
                        imagePath={require("../assets/images/avion1.png")}
                        backgroundColor="#fff"
                        value={company}
                        onChangeText={setCompany}
                        
                    />
                </View>

                <View style={{
                    marginTop: 15
                }}>
                    <FormInput 
                        label={language === "English" ? "More details about your listing" : "Plus de détail sur votre annonce"}
                        iconName="edit"
                        value={kiloDescription}
                        onChangeText={setKiloDescription}
                        multilines={true}
                        numberOfLines={5}
                        fontSize={SIZES.h6}
                    />
                </View>
                </Animated.View>
            }

            {
                value === "container" &&
                <Animated.View entering={FadeInUp.delay(640).duration(450).springify().damping(18)}>
                    <View style={{
                        marginTop: 15
                    }}>
                        <FormInput 
                        label={language === "English" ? "More details about your listing" : "Plus de détail sur votre annonce"}
                        iconName="edit"
                        value={containerDescription}
                        onChangeText={setContainerDescription}
                        multilines={true}
                        numberOfLines={5}
                        fontSize={SIZES.h6}
                    />
                    </View>

                    <View style={{
                        marginTop: 15
                    }}>
                        <FormInput
                        label={language === "English" ? "Hapag-Lloyd booking reference (optional)" : "Référence de réservation Hapag-Lloyd (optionnel)"}
                        iconName="tag"
                        value={bookingReference}
                        onChangeText={setBookingReference}
                        fontSize={SIZES.h6}
                        placeholder={language === "English" ? "Ex: 12345678" : "Ex: 12345678"}
                    />
                    </View>

                    <View style={{
                        marginTop: 25
                    }}>
                        <Text style={{
                              fontFamily: FONTS.bold,
                              color: COLORS.primary,
                              fontSize: 17,
                              lineHeight: 17,
                              width: SIZES.width - 100
                        }}>
                            {medias.length > 0 ? (language === "English" ? "Click the icon to edit the draft / BL" : "Cliquez sur l'icone pour modifier le draft / BL") : (language === "English" ? "Please upload your draft / BL" : "Veuillez insérez votre draft / BL")}
                        </Text>
                        <View style={{
                            marginTop: 10, 
                            height: 130, 
                            backgroundColor: COLORS.input_blue, 
                            borderRadius: 12, 
                            borderWidth: 1, 
                            borderStyle: "dashed", 
                            borderColor: COLORS.other_blue, 
                            alignItems: "center", 
                            paddingHorizontal: 20, 
                            justifyContent: "center"

                        }}>

                            <TouchableOpacity onPress={() => {setIsVisible(true)}}>
                                <Image source={ name ? name === "pdf" ? require("../assets/images/pdf.png") : require("../assets/images/file-png.png") : require("../assets/images/addimage.png")}

                                    style={{
                                        height: 50, 
                                        width: 50, 
                                        resizeMode: "contain"
                                    }} />
                            </TouchableOpacity>

                            {
                                photoNames.map((item) => {

                                        return(<Text key={item} style={{
                                            marginTop: 3, 
                                            fontSize: SIZES.h7, 
                                            color: COLORS.primary, 
                                            fontFamily: FONTS.regular, 
                                            textAlign: "center"
                                        }}> {item} </Text>)
                                })
                            }

                        </View>
                    </View>

                    <View style={{
                        marginTop: 20

                    }} >

                        {
                            pdff && <View >

                                    <View style={{
                                        marginBottom: 15,
                                        marginTop: 6
                                    }}>
                                        <Text style={{
                                              fontFamily: FONTS.regular,
                                              color: COLORS.primary,
                                              fontSize: SIZES.h5,
                                              textAlign: "center"
                                        }}>{language === "English" ? "Your PDF file" : "Votre fichier PDF"} <Text style={{
                                            fontFamily: FONTS.bold,
                                            color: COLORS.primary,
                                            fontSize: SIZES.h5,
                                      }}> {photoNames[0]} </Text> {language === "English" ? "has been selected." : "a bien été sélectionné."}</Text>
                                    </View>

                                    <View style={{position: "relative"}}>
                                        <TouchableOpacity
                                            onPress={() => {setPdff(null); setName(""); setPhotoNames([]);}}
                                            style={{
                                                position: "absolute",
                                                top: 8,
                                                right: 8,
                                                zIndex: 10,
                                                backgroundColor: "rgba(0,0,0,0.5)",
                                                borderRadius: 15,
                                                width: 30,
                                                height: 30,
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}>
                                            <AntDesign name="close" size={18} color="#fff" />
                                        </TouchableOpacity>
                                        <Image
                                            source={{uri: pdff.uri}}
                                            style={{
                                                width: "100%",
                                                height: 500
                                            }}
                                        />
                                    </View>

                                </View>
                        }

{
                            image && <View >

                                    <View style={{
                                        marginBottom: 15,
                                        marginTop: 6
                                    }}>
                                        <Text style={{
                                              fontFamily: FONTS.regular,
                                              color: COLORS.primary,
                                              fontSize: SIZES.h5,
                                        }}>{language === "English" ? "Your Image:" : "Votre Image :"}</Text>
                                    </View>

                                    <View style={{position: "relative"}}>
                                        <TouchableOpacity
                                            onPress={() => {setImage(null); setName(""); setPhotoNames([]);}}
                                            style={{
                                                position: "absolute",
                                                top: 8,
                                                right: 8,
                                                zIndex: 10,
                                                backgroundColor: "rgba(0,0,0,0.5)",
                                                borderRadius: 15,
                                                width: 30,
                                                height: 30,
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}>
                                            <AntDesign name="close" size={18} color="#fff" />
                                        </TouchableOpacity>
                                        <Image
                                            source={{uri: image.uri}}
                                            style={{
                                                width: "100%",
                                                height: SIZES.height/1.4,
                                                resizeMode: "cover"
                                            }}
                                        />
                                    </View>
                                </View>
                        }

                    </View>

                </Animated.View>
            }

            <Animated.View entering={FadeInUp.delay(720).duration(450).springify().damping(18)} style={{
                marginTop: 25
            }}>
                 <Button1 label={language === "English" ? "Submit my listing" : "Soumettre mon annonce"}   backgroundColor={COLORS.primary} 
                    textColor="#fff" fontFamily={FONTS.regular} fontSize={23} 
                    borderRadius={12}
                    onPress={onRegister}
                 />
            </Animated.View>

            {
                errorMessage && <ErrorMessage errorMessage={errorMessage} />
            }



            </View>





        </ImageBackground>
        </KeyboardAwareScrollView>
    </View>
  )
}

const styles = StyleSheet.create({

    modal: {
        justifyContent: 'flex-end',
        margin: 0,
      },
      modalContent: {
        //height: SIZES.height / 2,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
      },

      overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      infoBox: {
        width: 300,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        elevation: 4,
      },
      title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
      },
      message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#555',
      },
      okButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 6,
      },
      okText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
      },
})

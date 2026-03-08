import React, { useContext, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Image, ImageBackground, Modal, Platform, 
    RefreshControl, Pressable, ScrollView, StyleSheet, Text, Animated, TouchableOpacity, View, FlatList } from 'react-native'
import { COLORS, FONTS, MONTHS, SIZES } from '../constants/theme'; 
import AntDesign from "react-native-vector-icons/AntDesign"
import Entypo from "react-native-vector-icons/Entypo"
import Feather from "react-native-vector-icons/Feather"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import SelectItem1 from '../components/SelectItem1';
import Button1 from '../components/Button1';
import { useFetchFunctions } from '../infrastructures/functions';
import Dropdown from 'react-native-input-select';
import { AuthContext } from '../navigation/AuthProvider';
import { useFocusEffect } from '@react-navigation/native';
import AnnounceBlock from '../components/AnnounceBlock';
import ErrorMessage from '../components/ErrorMessage';
import { translate } from '../i18n/locales/translate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../config/api';

const MES_ANNONCES_URL = API.ANNONCE_LIST;
const GET_CITIES_URL = API.CITY_LIST_BY_COUNTRY;
const GET_COUNTRIES_URL = API.COUNTRY_LIST;
const GET_ANNONCES_URLL = API.ANNONCE_GET_ALL;
const GET_DEPARTS_URL = API.ANNONCE_DEPARTS;

export default function Home({navigation}) {
  
    const [active, setActive] = useState(""); 
    const [searchContainerDate, setSearchContainerDate] = useState(""); 
    const [searchContainerStartCity, setSearchContainerStartCity] = useState("");
    const [searchContainerEndCity, setSearchContainerEndCity] = useState("");
    const [searchKilosDate, setSearchKilosDate] = useState(""); 
    const [searchKilosStartCity, setSearchKilosStartCity] = useState("");
    const [searchKilosEndCity, setSearchKilosEndCity] = useState("");
    const [transitaireCountry, setTransitaireCountry] = useState(""); 
    const [transitaireCity, setTransitaireCity] = useState("");
    const [demenageurCountry, setDemenageurCountry] = useState(""); 
    const [demenageurCity, setDemenageurCity] = useState(""); 
    const [modalVisible, setModalVisible] = useState(false);
    const [openFor, setOpenFor] = useState(""); 
    const [nextYear, setNextYear] = useState(false);
    const [cYear, setCYear] = useState(null); 
    const [cMonth, setCMonth] = useState(null);
    const [kYear, setKYear] = useState(null); 
    const [kMonth, setKMonth] = useState(null);
    const {postFunction, laFonctionGet, timeAgo} = useFetchFunctions(); 
    const [currentSelect, setCurrentSelect] = useState("");
    const [modalVisible6, setModalVisible6] = useState([]);
    const [currentType, setCurrentType] = useState(false);
    const [cArrival, setCArrival] = useState(""); 
    const [cDeparture, setCDeparture] = useState("")
    const [kArrival, setKArrival] = useState(""); 
    const [kDeparture, setKDeparture] = useState(""); 
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);
    const [modalVisible5, setModalVisible5] = useState(false);
    const [type, setType] = useState("");
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState(null);
    const [cACountry, setCACountry] = useState(null); 
    const [cDCountry, setCDCountry] = useState(null); 
    const [cACountry2, setCACountry2] = useState(null); 
    const [cDCountry2, setCDCountry2] = useState(null); 
    const [kACountry, setKACountry] = useState(null); 
    const [kDCountry, setKDCountry] = useState(null); 
    const [cACities, setCACities] = useState([]); 
    const [cDCities, setCDCities] = useState([]); 
    const [kACities, setKACities] = useState([]); 
    const [kDCities, setKDCities] = useState([]); 
    const [load, setLoad] = useState(false);
    const [annoucements, setAnnoucements] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const {token, user, refresh, setBadgee, setLanguage, language, setRefresh, pendingSearch, setPendingSearch, refreshModify} = useContext(AuthContext);
    const [containers, setContainers] = useState([]); 
    const [kilos, setKilos] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [refreshing2, setRefreshing2] = useState(false);
    const [startAt, setStartAt] = useState(0);
    const [lesAnnonces, setLesAnnonces] = useState([]);
    const [flatLoading, setFlatLoading] = useState(false);
    const [total, setTotal] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const [activee, setActivee] = useState(false)
    const [departsImminents, setDepartsImminents] = useState([]);
    const [modalDepartsVisible, setModalDepartsVisible] = useState(false);
    const [departsLoading, setDepartsLoading] = useState(false)

    const scrollY = useRef(new Animated.Value(0)).current;

    
    const months = language === "English" ?
    
    [
        { label: 'January', value: 1 },
        { label: 'Frebruary', value: 2 },
        { label: 'March', value: 3 },
        { label: 'April', value: 4 },
        { label: 'May', value: 5 },
        { label: 'June', value: 6 },
        { label: 'July', value: 7 },
        { label: 'August', value: 8 },
        { label: 'September', value: 9 },
        { label: 'October', value: 10 },
        { label: 'November', value: 11 },
        { label: 'December', value: 12 },
    ]

    :
    
    [
        { label: 'Janvier', value: 1 },
        { label: 'Février', value: 2 },
        { label: 'Mars', value: 3 },
        { label: 'Avril', value: 4 },
        { label: 'Mai', value: 5 },
        { label: 'Juin', value: 6 },
        { label: 'Juillet', value: 7 },
        { label: 'Août', value: 8 },
        { label: 'Septembre', value: 9 },
        { label: 'Octobre', value: 10 },
        { label: 'Novembre', value: 11 },
        { label: 'Décembre', value: 12 },
    ];


    // setBackgroundMessageHandler a été déplacé dans index.js (top-level)
    // La navigation sur tap de notification est gérée par onNotificationOpenedApp dans BottomTabBar


    const avoirLesAnnonces = (status) => {

            postFunction(GET_ANNONCES_URLL, {startAt: 0, status}).then((data) => {

                    if(data && data.status === 0){

                          //  console.log(data);
                            setFlatLoading(false);
                            setLesAnnonces(data.annonces); 
                            setStartAt(data.startAt);
                            setTotal(data.total);

                           
                    }else{

                            setFlatLoading(false); 
                    }
            },(err) => {

                console.log(err); 
                setFlatLoading(false);
            })
    }

    // Redirection automatique vers la recherche après inscription/connexion
    useEffect(() => {
        if (token && pendingSearch) {
            const params = pendingSearch;
            setPendingSearch(null);
            navigation.navigate("Search", params);
        }
    }, [token, pendingSearch]);

    useFocusEffect(
        React.useCallback(() => {

         // console.log('Je suis arrivé sur cette page !');

            postFunction(MES_ANNONCES_URL, {three: true}).then((data) => {

               // console.log("chez refresh", data);
                setRefresh(false);

                    if(data && data.status === 0){

                            setContainers(data.containers);
                            setKilos(data.kilos);
                    }

                 })


          return () => {
           // console.log('Je suis parti de cette page !');
          };
        }, [refreshModify])
      );





    
    const chargerDepartsImminents = () => {
        setDepartsLoading(true);
        setModalDepartsVisible(true);
        postFunction(GET_DEPARTS_URL, {}).then((data) => {
            if (data && data.status === 0) {
                setDepartsImminents(data.departs);
            }
            setDepartsLoading(false);
        }).catch(() => setDepartsLoading(false));
    }

    const navigateToAnnouncement = () => {

            navigation.navigate("Announcement");
    }


    const pickerRef = useRef();

    function open(text) {

        setOpenFor(text); 
        console.log(cMonth); 
        console.log(cYear);
        setModalVisible(true)
    }



    function modifierNomsChamps(objet, regles) {
        const nouveauObjet = {};
        for (const champ in objet) {
            if (Object.hasOwnProperty.call(objet, champ)) {
                const nouveauChamp = regles[champ] || champ;
                nouveauObjet[nouveauChamp] = objet[champ];
            }
        }
        return nouveauObjet;
    }

    function renommerChamps(objet) {
        return {
            label: objet.name,
            value: objet.code
            // Vous pouvez également inclure d'autres champs si nécessaire
        };
    }

    useEffect(() => {



      /*  postFunction(ADD_COUNTRY_URL, {name: "Sénégal"}).then((data) => {

            if(data && data.status === 0){

                    console.log("Pays enregistré avec succès"); 
            } 
        }) 
 */
        setKYear( new Date().getFullYear()); 
        setKMonth(new Date().getMonth() + 1); 

        setCYear( new Date().getFullYear()); 
        setCMonth(new Date().getMonth() + 1)


        setActive("container");
        setSearchContainerDate(`${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`);
        setSearchKilosDate(`${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`);
        setSearchContainerStartCity("Libreville"); 
        setSearchContainerEndCity("Marseille")
        setSearchKilosStartCity("Libreville"); 
        setSearchKilosEndCity("Paris");
        setTransitaireCountry("Gabon"); 
        setCACountry2(null); 
        setCDCountry2(null);
        setCACountry(null); 
        setCDCountry(null);
        setTransitaireCity("Libreville");
        setTransitaireCountry("Gabon"); 
        setTransitaireCity("Libreville");
        setDemenageurCity("Paris");
        setDemenageurCountry("France"); 

        

        const getCountries = () => {

            console.log("c'est chaud");

            try {

                laFonctionGet(GET_COUNTRIES_URL).then((data) => {

                  //  console.log(data)

                    if(data && data.status === 0){


                            const countriess = data.countries; 

                            

                          const final =   countriess.map(item => {

                                    return {label: item.name, value: item._id}
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

                            setCountries(final2); 
                            setRefreshing(false); 
                    
                        }else{

                            setRefreshing(false);
                        }
            }, (err) => {

                    setRefreshing(false);
            })


            }catch(err) {
                setRefreshing(false);
            }


        }


            getCountries();


    }, [refreshing]); 

    const handleRefreshing = () => {

            setRefreshing(true); 
    }



    const dismissModal = (index) => {

       // alert(index);
       // alert(openFor);
         
            if(openFor === "container"){

                setCMonth(index + 1);

            }else{

                setKMonth(index + 1);
                
            }
            setModalVisible(false);

    }

    const dismissModal2 = (name) => {

            if(openFor === "container"){

                    if(type === 'd'){

                            setSearchContainerStartCity(name);
                    
                        }else{

                                setSearchContainerEndCity(name)
                        }
            }else{

                if(type === 'd'){

                    setSearchKilosStartCity(name);
            
                }else{

                        setSearchKilosEndCity(name)
                }
            }

            setModalVisible2(2);
    }


    const onChangeCountry = (value) => {

         

     


        if(activee === "kilos"){

            
            setLoad(true);

            postFunction(GET_CITIES_URL, {_id: value, active: activee}).then((data) => {


                console.log(value);

             //  alert("On est OK");

             if(activee === "kilos"){

               console.log(data);

                if(data && data.status === 0){

                        if(openFor === "container"){

                                if(type === "a"){

                                    setCACountry(value); 
                                  
                                   // setCities(data.cities);

                              const cities = data.cities; 

                             // console.log(cities);

                              const final =  cities.map(item => {

                                    return {label: item.name, value: item._id}
                            })

                         //   console.log("la finale", final);

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

                                    setCDCountry(value); 
                               
                            const cities = data.cities; 

                         //     console.log(cities);

                              const final =  cities.map(item => {

                                    return {label: item.name, value: item._id}
                            })

                      //      console.log("la finale", final);

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
                                setCDeparture(null);
                                setLoad(false); 

                                
                            

                                    
                                }
                        
                            }else if(openFor === "kilos"){

                                    if(type === "a"){


                                    setKACountry(value); 
                                  
                                   // setCities(data.cities);

                              const cities = data.cities; 

                            //  console.log(cities);

                              const final =  cities.map(item => {

                                    return {label: item.name, value: item._id}
                            })

                          //  console.log("la finale", final);

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



                                    setKDCountry(value); 
                                  
                                    // setCities(data.cities);
 
                               const cities = data.cities; 
 
                             //  console.log(cities);
 
                               const final =  cities.map(item => {
 
                                     return {label: item.name, value: item._id}
                             })
 
                         //    console.log("la finale", final);
 
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

                    
                }

            }else{

              //  console.log(countries);

            }

            }, (err) => {

                    console.log(err)
                    setLoad(false);
            })

            
    }else{


        if(type === "a"){

            if(value){

                setCACountry(value); 

                setCACountry2(countries.filter(item => item.value === value)[0].label)

            }



                //countries.filter(item => item.value === value)[0].label


        }else{

               if(value){

                setCDCountry(value);
                setCDCountry2(countries.filter(item => item.value === value)[0].label);

               }

                
        }

    }

            
    }

    const toValidCity = () => {

        if(openFor === "container"){

            setModalVisible2(false); 

                if(type === "a"){

                    console.log(cACountry);

                  /*  if(cArrival){

                        setSearchContainerEndCity(cACities.filter(item => item.value === cArrival)[0].label);
                        setModalVisible2(false); 

                    }else{

                            alert(language === "English" ? "Please select a city" : "Veuillez sélectionner une ville");
                    } */

                    
              
                }


                if(type === "d"){

                    console.log(cDCountry);

                   /* if(cDeparture){

                        setSearchContainerStartCity(cDCities.filter(item => item.value === cDeparture)[0].label);
                        setModalVisible2(false); 

                    }else{

                            alert(language === "English" ? "Please select a city" : "Veuillez sélectionner une ville");
                    } */
              
                }
        
            }else if(openFor === "kilos"){


                if(type === "a"){

                    if(kArrival){

                        setSearchKilosEndCity(kACities.filter(item => item.value === kArrival)[0].label);
                        setModalVisible2(false); 

                    }else{

                            alert(language === "English" ? "Please select a city" : "Veuillez sélectionner une ville");
                    }
              
                }


                if(type === "d"){

                    if(kDeparture){

                        setSearchKilosStartCity(kDCities.filter(item => item.value === kDeparture)[0].label);
                        setModalVisible2(false); 

                    }else{

                            alert(language === "English" ? "Please select a city" : "Veuillez sélectionner une ville");
                    }
              
                }

            }
    }


    const onSearch = () => {

        setModalVisible2(false); 
        setModalVisible6(false); 
        setModalVisible(false);
        setModalVisible5(false);

        setErrorMessage("");

        if(modalVisible5){

            if(activee === "kilos" && searchKilosStartCity && searchKilosStartCity === searchKilosEndCity){

                setErrorMessage(language === "English" ? "The departure city cannot be the same as the arrival city" : "La ville de départ ne peut être la même que celle d'arrivée")
    
            }else if(activee === "container" && cDCountry2 && cDCountry2 === cACountry2) {
    
                setErrorMessage(language === "English" ? "The departure country cannot be the same as the arrival country" : "Le pays de départ ne peut être la même que celui d'arrivée")
    
            }else{
    
                console.log("Tu vois ca comment ?" + months.filter(item => item.value ===  kMonth)[0].label + activee)
    
                navigation.navigate("Search", {type: activee, start: activee === "kilos" ? searchKilosStartCity : cDCountry2, 
                end: activee === "kilos" ? searchKilosEndCity : cACountry2, 
                year: activee === "kilos" ?  kYear : cYear, month : activee === "kilos" ? months.filter(item => item.value ===  kMonth)[0].label  : months.filter(item => item.value ===  cMonth)[0].label });
    
           
                setSearchContainerDate(`${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`);
                setSearchKilosDate(`${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`);
                setSearchContainerStartCity("Libreville"); 
                setSearchContainerEndCity("Marseille")
                setSearchKilosStartCity("Libreville"); 
                setSearchKilosEndCity("Paris");
                setCACountry2(null); 
                setCDCountry2(null);
                setCACountry(null); 
                setCDCountry(null);
                setTransitaireCountry("Gabon"); 
                setTransitaireCity("Libreville");
                setTransitaireCountry("Gabon"); 
                setTransitaireCity("Libreville");
                setDemenageurCity("Paris");
                setDemenageurCountry("France"); 
           
            }

        }else{


            if(active === "kilos" && searchKilosStartCity && searchKilosStartCity === searchKilosEndCity){

                setErrorMessage(language === "English" ? "The departure city cannot be the same as the arrival city" : "La ville de départ ne peut être la même que celle d'arrivée")
    
            }else if(active === "container" && cDCountry2 && cDCountry2 === cACountry2) {
    
                setErrorMessage(language === "English" ? "The departure country cannot be the same as the arrival country" : "Le pays de départ ne peut être la même que celui d'arrivée");
    
            }else{
    
                console.log("Tu vois ca comment ?" + months.filter(item => item.value ===  kMonth)[0].label + active)
    
                navigation.navigate("Search", {type: active, start: active === "kilos" ? searchKilosStartCity : cDCountry2, 
                end: active === "kilos" ? searchKilosEndCity : cACountry2, 
                year: active === "kilos" ?  kYear : cYear, month : active === "kilos" ? months.filter(item => item.value ===  kMonth)[0].label  : months.filter(item => item.value ===  cMonth)[0].label });
    

                setSearchContainerDate(`${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`);
                setSearchKilosDate(`${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`);
                setSearchContainerStartCity("Libreville"); 
                setSearchContainerEndCity("Marseille")
                setSearchKilosStartCity("Libreville"); 
                setSearchKilosEndCity("Paris");
                setTransitaireCountry("Gabon"); 
                setCACountry2(null); 
                setCDCountry2(null);
                setCACountry(null); 
                setCDCountry(null);
                setTransitaireCity("Libreville");
                setTransitaireCountry("Gabon"); 
                setTransitaireCity("Libreville");
                setDemenageurCity("Paris");
                setDemenageurCountry("France"); 
            
            
            }


        }



       
    }

    const renderLoader = () => {

        return(
        
          isLoading ?
          <View style={{marginVertical: 20, alignItems: "center"}}>
            <ActivityIndicator size="large" color="#aaa" />
          </View> : null
        )
     }


     const loadMoreItem = () => {

        setIsLoading(true); 

        if(!startAt){

            setIsLoading(false);
        
        }else{


            postFunction(GET_ANNONCES_URLL, {startAt, status: currentType}).then((data) => {

                if(data && data.status === 0){

                        console.log(data);
                        setFlatLoading(false);
                        setIsLoading(false);
                        if(data.annonces.length > 0){
                            setLesAnnonces([...lesAnnonces, ...data.annonces]); 
                        }
                       
                        setStartAt(data.startAt);
                        //setTotal(data.total);

                       
                }else{

                        setFlatLoading(false); 
                        setIsLoading(false);
                }
        },(err) => {

            console.log(err); 
            setFlatLoading(false);
        })

        }


     }
    

    const onRefresh2 = () => {
        setRefreshing2(true);
        postFunction(MES_ANNONCES_URL, {three: true}).then((data) => {

            console.log("chez refresh", data);
            setRefreshing2(false);

                if(data && data.status === 0){

                        setContainers(data.containers); 
                        setKilos(data.kilos);
                }

             }) 
      };
    

    return (
<View style={[styles.container, {backgroundColor: COLORS.gray}]}>

<Modal
    visible={modalVisible6}
    onRequestClose={() => {

        setModalVisible6(false);
}}
animationType="slide"
transparent={true}

>
    <View style={{
        width: SIZES.width, 
        height: SIZES.height, 
        backgroundColor: "rgba(0,0,0,0.6)", 
        alignItems: "center", 
        justifyContent: "center"
    }} >
        <View style={{
            backgroundColor: "#fff", 
            width: SIZES.width - 60, 
            borderRadius: 12, 
            paddingHorizontal: 15,
            paddingVertical: 15
        }} {...styles.shadow}>
        
        <View style={{
            flexDirection: "row", 
            paddingBottom: 20, 
            alignItems: "center"
        }}>
            <TouchableOpacity onPress={() => setModalVisible6(false)} style={{
                flexDirection: "row"
            }}>
            
                    <AntDesign name='left' size={25} color={COLORS.primary}  />
        
            </TouchableOpacity> 

            <View style={{
                marginLeft: 15
            }}>
                <Text style={{
                    fontFamily: FONTS.bold, 
                    color: COLORS.primary, 
                    fontSize: SIZES.h4
                }}>
                     { language === "English" ? "Search" : "Recherche"} {activee ===  "kilos" ? language === "English" ?  "Air Cargo Space" : " de kilos" : language === "English" ? "container" : "conteneur" }
                </Text>
            </View>
        </View>
       


{
                    active === "container" && <View>

                        <SelectItem1 
                            label1={language === "English" ? "Select a departure month" : "Sélectionnez un mois de départ"}
                            label2={`${months.filter(item => item.value === cMonth)[0].label} ${cYear}`}
                            onPress={() => { setCurrentSelect("c"); open("container")}}
                        />

                        <SelectItem1 
                            label1={language === "English" ? "Departure country" : "Pays de départ"}
                            label2={cDCountry2}
                            onPress={() => {setOpenFor("container"); setType("d"); setModalVisible2(true)}}
                            marginTop={10}
                        />  

                         <SelectItem1 
                            label1={language === "English" ? "Destination country": "Pays d'arrivée"}
                            label2={cACountry2}
                            onPress={() => {setOpenFor("container"); setType("a"); setModalVisible2(true)}}
                            marginTop={10}
                        />    

                        <Button1 

                            backgroundColor={COLORS.primary}
                            borderRadius={8}
                            label={language === "English" ? "Search" : "Rechercher"}
                            textColor="#fff"
                            fontFamily="AristotelicaProTx-Rg"
                            fontSize={SIZES.height * 0.03}
                            imagePath= {require("../assets/images/search.png")}
                            iconColor="#fff"
                            iconSize={SIZES.height * 0.035}
                            onPress = {onSearch}
                        
                        />



                    </View>
                }

                {
                    active === "kilos" && <View>

                        <SelectItem1 
                            label1={language === "English" ? "Select a departure month" : "Sélectionnez un mois de départ"}
                            label2={`${months.filter(item => item.value === kMonth)[0].label} ${kYear}`}
                            onPress={() => { open("kilos")}}
                        />

                        <SelectItem1 
                            label1={language === "English" ? "Departure city" : "Ville de départ"}
                            label2={searchKilosStartCity}
                            onPress={() => {setOpenFor("kilos"); setType("d"); setModalVisible2(true)}}
                            marginTop={10}
                        />  

                         <SelectItem1 
                            label1={language === "English" ? "Destination city": "Ville d'arrivée"}
                            label2={searchKilosEndCity}
                            onPress={() => {setOpenFor("kilos"); setType("a"); setModalVisible2(true)}}
                            marginTop={10}
                        />    

                         <Button1 

                            backgroundColor={COLORS.primary}
                            borderRadius={12}
                            label={language === "English" ? "Search" : "Rechercher"}
                            textColor="#fff"
                            fontFamily="AristotelicaProTx-Rg"
                            fontSize={SIZES.height * 0.03}
                            imagePath= {require("../assets/images/search.png")}
                            iconColor="#fff"
                            iconSize={SIZES.height * 0.035}
                            onPress = {onSearch}
                        
                        />

                        </View>
                }

<Modal
        visible={modalVisible2}
        onRequestClose={() => {

                setModalVisible2(false);
        }}
        animationType="slide"
        transparent={true}
    >
        <View style={{
            flex: 1, 
            backgroundColor: "rgba(0,0,0,0.2)", 
            alignItems: "center", 
            justifyContent: "center"
        }}>

 

            <View style={{
                backgroundColor: COLORS.other_blue2, 
                height: SIZES.height - 100, 
                width: SIZES.width, 
                marginTop: 100, 
                borderTopLeftRadius: 20, 
                borderTopRightRadius: 20
               
            }}  {...styles.shadow}>



                <View style={{
                    paddingHorizontal: 20, 
                    paddingVertical: 20
                }}>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
                        paddingBottom: 80, 
                        
                    }}>



                    <View style={{
                        
                        paddingBottom: 15

                    }} >
                        <TouchableOpacity style={{
                            height: 60, 
                            width: 60, 
                            borderRadius: 30, 
                            borderColor: "#bbb", 
                            borderWidth: 1, 
                            alignItems: "center", 
                            justifyContent: "center"
                        }} onPress={() => setModalVisible2(false)}>
                            <FontAwesome name='angle-left' color="rgba(0,0,0,0.6)" size={30} />
                        </TouchableOpacity>

                    
                        
                    </View>

                    <View style={{
                      
                        marginTop: Platform.OS === "iso" ? 10 : 5, 
                        alignItems: "center", 
                        paddingHorizontal: 45
                  
                    }}>

                        <Text style={{
                            fontFamily: FONTS.bold, 
                            color: COLORS.primary, 
                            fontSize: 20, 
                            textAlign: "center"
                        }}>{ language === "English" ? `${type === "d" ? "Departure" : "Destination"} ${activee === "kilos" ? "city" : "country"}` :  `${activee === "kilos" ? "la ville" : "le pays"} ${type === "d" ? "de départ" : "d'arrivée"}`}</Text>

                        <Text style={{
                            fontFamily: FONTS.ligth, 
                            color: "rgba(0,0,0,0.7)", 
                            fontSize: 13,
                            marginTop: 5,
                            marginBottom: 20, 
                            textAlign: "center"
                          
                        }}>{active === "kilos" ? language === "English" ? "Please first select the country, then choose the city" : "Veuillez d'abord sélectionner le pays, ensuite vous choisirez la ville" : language === "English" ? "Please select the country from the list below" :  "Veuillez sélectionner le pays dans la liste ci-dessous"}</Text>


                    </View>

                    <View style={{
                        
                    }}>
                        <Dropdown
                            label= {language === "English" ? "Country" : "Pays"}
                            placeholder={language === "English" ? 'Select the country' : 'Sélectionnez le pays'}
                            options={countries.map((country) => ({
                                label: country.label,
                                value: country.value,
                            }))}
                            selectedValue={openFor === "container" ? type === "a" ? cACountry : cDCountry : type=== "a" ? kACountry : kDCountry}
                            
                            onValueChange={(value) => onChangeCountry(value)}
                            primaryColor={COLORS.primary}

                            dropdownStyle={{
                            borderColor: COLORS.middle_blue, 
                            backgroundColor: COLORS.gray
                            }}
                            labelStyle={{
                                fontFamily: FONTS.bold, 
                                fontSize: 15, 
                                color: COLORS.primary
                            }}
                            
                            placeholderStyle={{
                                color: "rgba(0,0,0,0.7)", 
                                fontFamily: FONTS.ligth
                            }}
                            isSearchable={true}
                            selectedItemStyle={{
                                fontFamily: FONTS.regular,
                                color: "red",
                                fontSize: 15
                            }}
                            checkboxLabelStyle={{
                                fontFamily: FONTS.regular,
                                color: COLORS.primary,
                                fontSize: 15
                            }}


                        />

                             

                  </View>
                  {activee === "kilos" && 
                        <View style={{
                            marginTop: 20, 
                            alignItems: "center"
                    }}>
                       { load ? <ActivityIndicator size="large" />  : <Dropdown
                            label={language === "English" ? "City" : "Ville"}
                            placeholder={language === "English" ? "Select the city" : 'Sélectionnez la ville'}


                            options={openFor === "container" ? type === "a" ? 
                            cACities.map((country) => ({
                                label: country.label,
                                value: country.value,
                            })) :  cDCities.map((country) => ({
                                label: country.label,
                                value: country.value,
                            })) : 
                            type=== "a" ? 
                            kACities.map((country) => ({
                                label: country.label,
                                value: country.value,
                            })) :  kDCities.map((country) => ({
                                label: country.label,
                                value: country.value,
                            }))}


                            selectedValue={openFor === "container" ? type === "a" ? cArrival : cDeparture : type=== "a" ? kArrival : kDeparture}
                            
                            onValueChange={(value) => {openFor === "container" ? type === "a" ?  setCArrival(value) : setCDeparture(value) : type=== "a" ? setKArrival(value) : setKDeparture(value)}}
                            primaryColor={COLORS.primary}
                            dropdownStyle={{
                            borderColor: COLORS.middle_blue, 
                            backgroundColor: COLORS.gray
                            }}
                            labelStyle={{
                                fontFamily: FONTS.bold, 
                                fontSize: 15, 
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
                                fontSize: 15
                            }}
                            checkboxLabelStyle={{
                                fontFamily: FONTS.regular,
                                color: COLORS.primary,
                                fontSize: 15
                            }}
                            disabled={openFor === "container" ? type === "a" ? (!cACountry && !load) :  !cDCountry : type=== "a" ? !kACountry : !kDCountry}


                        />   }

                             

                    </View> }

                    <View style={{
                           
                    }}>

                        <Button1 onPress={() => toValidCity()} label={language === "English" ? "Confirm" : "Valider"} textColor="#fff" backgroundColor={COLORS.primary} 
                        borderRadius={12} fontFamily={FONTS.bold} fontSize={15} />

                    </View>


                    </ScrollView>
            </View>

            
            
            </View>

          

        </View>

    </Modal>



    <Modal
        visible={modalVisible}
        onRequestClose={() => {

                setModalVisible(false);
        }}
        animationType="slide"
        transparent={true}
    >
        <View style={{
            flex: 1, 
            backgroundColor: "rgba(0,0,0,0.2)", 
            alignItems: "center", 
            justifyContent: "center"
        }}>

            <View style={{
                backgroundColor: COLORS.other_blue2, 
                height: SIZES.height - 100, 
                width: SIZES.width, 
                marginTop: 100, 
                borderTopLeftRadius: 20, 
                borderTopRightRadius: 20
               
            }}  {...styles.shadow}>

                <View style={{
                    paddingHorizontal: 20, 
                    paddingVertical: 20
                }}>
                    <View style={{
                        
                        paddingBottom: 15

                    }} >
                        <TouchableOpacity style={{
                            height: 60, 
                            width: 60, 
                            borderRadius: 30, 
                            borderColor: "#bbb", 
                            borderWidth: 1, 
                            alignItems: "center", 
                            justifyContent: "center"
                        }} onPress={() => setModalVisible(false)}>
                            <FontAwesome name='angle-left' color="rgba(0,0,0,0.6)" size={30} />
                        </TouchableOpacity>

                    
                        
                    </View>
                    <ScrollView
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    contentContainerStyle={{
                            paddingVertical: 30, 
                            paddingBottom: 70, 
                            
                           
                        }}>

                            <View style={{
                                flexDirection: "row", 
                                alignItems: "center", 
                                justifyContent: "space-between"
                            }}>
                                <Text style={{
                                           fontFamily: FONTS.bold, 
                                           color: COLORS.primary, 
                                           fontSize: 20, 
                          
                                }}>
                                   {language !== "English" ? "Année" : ""}  {openFor === "container" ? cYear : kYear}
                                </Text>
                                <View style={{
                                    flexDirection: "row", 
                                    alignItems: "center"
                                }}>
                                    <TouchableOpacity disabled={(openFor === "container" && cYear === new Date().getFullYear() ) || (openFor === "kilos" && kYear === new Date().getFullYear())  }
                                    onPress={() => {openFor === "container" ? setCYear(prevYear => (parseInt(prevYear) - 1)) : setKYear(prevYear => (parseInt(prevYear) - 1)) }}
                                    style={{
                                        
                                       
                                    }}>
                                        <FontAwesome name='angle-left' color={openFor === "container" ? cYear === new Date().getFullYear() ? "#ccc" : "#000" : kYear === new Date().getFullYear() ? "#ccc" : "#000" } size={28} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => openFor === "container" ? setCYear(prevYear => (parseInt(prevYear) + 1)) : setKYear(prevYear => (parseInt(prevYear) + 1)) } style={{
                                    
                                        marginLeft: 20
                                    }}>
                                        <FontAwesome name='angle-right' color={"#000"} size={28} />
                                    </TouchableOpacity>
                                </View>
                               
                            </View>

                            <View style={{
                                marginTop: 20, 
                                alignItems: "center"
                            }}>

                                {
                                   months &&  months.map((item, index) => {

                                            return (
                                                <TouchableOpacity disabled={ openFor  === "container" && (cYear === new Date().getFullYear() && index < new Date().getMonth()) ? true :  openFor  === "kilos" && (kYear === new Date().getFullYear() && index < new Date().getMonth()) ? true : false  } onPress={() => dismissModal(index)} style={{
                                                    paddingVertical: 15, 
                                                    alignItems: "center", 
                                                    flexDirection: "row", 
                                                    justifyContent: "space-between", 
                                                    borderBottomWidth: 1, 
                                                    borderBottomColor: "#ccc", 
                                                    width: "100%",
                                                    alignItems: "center"
                                                }} key={index}>
                                                    <Text style={{
                                                        fontFamily: FONTS.ligth, 
                                                        color: openFor  === "container" && (cYear === new Date().getFullYear() && index < new Date().getMonth()) ? "gray" :  openFor  === "kilos" && (kYear === new Date().getFullYear() && index < new Date().getMonth()) ? "gray" : "#000",
                                                        fontSize: 15
                                                    }}>
                                                        {item.label}
                                                    </Text>
                                                    <FontAwesome name='angle-right' size={25} color={openFor  === "container" && (cYear === new Date().getFullYear() && index < new Date().getMonth()) ? "gray" :  openFor  === "kilos" && (kYear === new Date().getFullYear() && index < new Date().getMonth()) ? "gray" : "#000"} />
                                                </TouchableOpacity>
                                            )

                                    })
                                }

                            </View>

                    </ScrollView>
                </View>

            </View>


        </View>

    </Modal>
        </View>
    </View>
</Modal>

<Modal
        visible={modalVisible5}
        onRequestClose={() => {

                setModalVisible5(false);
        }}
        animationType="slide"
        transparent={true}
    >


        <View style={{
            flex: 1, 
            backgroundColor: COLORS.light_blue
        }}>

                    <View style={{
                            flexDirection: "row", 
                            alignItems: "center", 
                            paddingVertical: 20, 
                            paddingHorizontal: 15, 
                            paddingTop: Platform.OS === "ios" ? 55 : 20, 
                            shadowColor: '#000', // Couleur de l'ombre
                            shadowOffset: { width: 0, height: 4 }, // Décalage de l'ombre
                            shadowOpacity: 0.1, // Opacité de l'ombre (0 à 1)
                            shadowRadius: 6, // Rayon de flou de l'ombre
                            // Ombres pour Android
                            elevation: 6, // Nécessaire pour Android, 
                            backgroundColor: COLORS.middle_blue
                        }}>
                            <TouchableOpacity onPress={() => setModalVisible5(false)}>
                                <AntDesign name='leftcircleo' color={COLORS.primary} size={SIZES.h1} />
                            </TouchableOpacity>
                            
                        </View>

        <FlatList

            ListHeaderComponent={() => {

                    return(
                        <View style={{
                            flexDirection: "row", 
                            alignItems: "center", 
                            paddingVertical: 20, 
                            paddingHorizontal: 15, 
                            justifyContent: "space-between"
                        }}>
                        <View style={{
                            flexDirection: "row", 
                            alignItems: "center", 
                      
                        }}>
                            <View style={{
                                flexDirection: "row", 
                                alignItems: "center"
                            }}>
                            {
                                currentType === "c" ? <Image source={require("../assets/images/container1.png")} style={{
                                    height: 15, 
                                    width: 30
                                }} /> : <Image source={require("../assets/images/avion1.png")} style={{
                                    height: 15, 
                                    width: 30
                                }} />
                            }
                           {currentType === "c" ? <Text style={{
                                fontFamily: FONTS.bold, 
                                fontSize: SIZES.h5, 
                                color: COLORS.primary, 
                                marginTop: Platform.OS === "ios" ? 3 : 0
                            }}> {total} Annonces conteneurs...</Text> :  <Text style={{
                                fontFamily: FONTS.bold, 
                                fontSize: SIZES.h5, 
                                color: COLORS.orange, 
                                marginTop: Platform.OS === "ios" ? 3 : 0
                            }}> {total} {language === "English" ? "Available kilos..." : "Disponibilitées en kilos..."}</Text>}
                            </View>
                        </View>

                    </View>
                    )
            }}
            keyExtractor={item => item._id}
            data={lesAnnonces}
            contentContainerStyle={{
                paddingHorizontal: 10, 
                paddingBottom: 25
            }}
            ListFooterComponent={renderLoader}
            onEndReached={loadMoreItem}
            renderItem={({item, index}) => {

                if(flatLoading) return <View />

                return (
                    <AnnounceBlock key={item._id} index={index} status= {currentType === "c" ? "container" : "kilos"} userId={item.userId}  city1={item.startCity} city2={item.endCity}  onPress= {() => { setModalVisible5(false); navigation.navigate("Details", {_id: item._id})}}
                    date={item.dateOfDeparture} views={item.views} datee={item.date} company={item.company} name={item.transitaire || (item.user && item.user.name)} startCity={item.startCity2 && item.startCity2.code} endCity={item.endCity2 && item.endCity2.code}
                    startCountry={item.startCity2 && item.startCity2.country} endCountry={item.endCity2 && item.endCity2.country} />
                )
            }}
        
        />



        </View>

</Modal>
    <Modal 
        visible={modalVisible3}
        onRequestClose={() => {

                setModalVisible3(false); 
        }}
        animationType="slide"
        transparent={true}
        on
    >

        <Pressable onPress={() => setModalVisible3(false)} style={{
            flex: 1, 
            backgroundColor: "rgba(0,0,0,0.3)"
        }}>



            <View  style={{
                marginTop: Platform.OS === "ios" ? 110 : 55, 
                width: SIZES.width - 130
            }}>
                <Pressable style={{
                    backgroundColor: COLORS.primary, 
                    paddingVertical: 20, 
                    paddingHorizontal: 25
                }}> 
                    <Text style={{
                        fontFamily: FONTS.bold, 
                        fontSize: SIZES.h4, 
                        color: "#fff"
                    }}>Menu</Text>
                </Pressable>
                {
                    token ?  <TouchableOpacity activeOpacity={0.9} onPress={() => {setModalVisible3(false); navigation.navigate("MyAccount", {back: true})}} style={{
                        paddingVertical: 15, 
                        paddingHorizontal: 20, 
                        backgroundColor: "#fff", 
                        flexDirection: "row", 
                        alignItems: "center", 
                        borderBottomWidth: 1, 
                        borderBottomColor: COLORS.middle_blue
                    }}>
                        <Image source={user && user.photo ? {uri : user.photo} : require("../assets/images/user.png")}
                            style={{
                                height:  (user && user.photo) ? SIZES.width * 0.05 : SIZES.width * 0.03 , 
                                width:  (user && user.photo) ? SIZES.width * 0.05 : SIZES.width * 0.03 , 
                                resizeMode: "contain", 
                                borderRadius : (user && user.photo) ? SIZES.width * 0.1 : 0 
                            }}
                        />
                        <Text style={{
                            fontFamily: FONTS.regular, 
                            color: COLORS.primary, 
                            fontSize: SIZES.h6, 
                            marginLeft: 15, 
                         
                        }}>{language === "English" ? translate.home.menu.compte.en: translate.home.menu.compte.fr}</Text>
                    </TouchableOpacity> : 

                    <TouchableOpacity activeOpacity={0.9} onPress={() => {setModalVisible3(false);  navigation.navigate("Login")}} style={{
                        paddingVertical: 15, 
                        paddingHorizontal: 20, 
                        backgroundColor: "#fff", 
                        flexDirection: "row", 
                        alignItems: "center", 
                        borderBottomWidth: 1, 
                        borderBottomColor: COLORS.middle_blue
                    }}>
                        <Image source={user && user.photo ? {uri : user.photo} : require("../assets/images/adduser.png")}
                            style={{
                                height: SIZES.h5, 
                                width: SIZES.h5, 
                                resizeMode: "contain"
                            }}
                        />
                        <Text style={{
                            fontFamily: FONTS.regular, 
                            color: COLORS.primary, 
                            fontSize: SIZES.h6, 
                            marginLeft: 15, 
                        
                        }}>{language === "English" ? translate.home.menu.createAnAccount.en: translate.home.menu.createAnAccount.fr}</Text>
                    </TouchableOpacity>

                }
                <TouchableOpacity activeOpacity={0.9} onPress={() => {setModalVisible3(false); navigateToAnnouncement()}} style={{
                    paddingVertical: 15, 
                    paddingHorizontal: 20, 
                    backgroundColor: "#fff", 
                    flexDirection: "row", 
                    alignItems: "center", 
                    borderBottomWidth: 1, 
                    borderBottomColor: COLORS.middle_blue
                }}>
                    <Entypo name='plus' color={COLORS.primary} size={SIZES.h5} />
                    <Text style={{
                        fontFamily: FONTS.regular, 
                        color: COLORS.primary, 
                        fontSize: SIZES.h6, 
                        marginLeft: 15, 
                        
                    }}>{language === "English" ? translate.home.menu.postAListing.en: translate.home.menu.postAListing.fr}</Text>
                </TouchableOpacity>
                <TouchableOpacity  activeOpacity={0.9} onPress={() => setModalVisible3(false)}  style={{
                    paddingVertical: 15, 
                    paddingHorizontal: 20, 
                    backgroundColor: "#fff", 
                    flexDirection: "row", 
                    alignItems: "center", 
                    borderBottomWidth: 1, 
                    borderBottomColor: COLORS.middle_blue
                }}>
                    <AntDesign name='search1' color={COLORS.primary} size={SIZES.h5} />
                    <Text style={{
                        fontFamily: FONTS.regular, 
                        color: COLORS.primary, 
                        fontSize: SIZES.h6, 
                        marginLeft: 15, 
                       
                    }}>{language === "English" ? translate.home.menu.search.en: translate.home.menu.search.fr}</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.9} style={{
                    paddingVertical: 15, 
                    paddingHorizontal: 20, 
                    backgroundColor: "#fff", 
                    flexDirection: "row", 
                    alignItems: "center", 
                    borderBottomWidth: 1, 
                    borderBottomColor: COLORS.middle_blue
                }}>
                    <Feather name='file-text' color={COLORS.primary} size={SIZES.h5} />
                    <Text style={{
                        fontFamily: FONTS.regular, 
                        color: COLORS.primary, 
                        fontSize: SIZES.h6, 
                        marginLeft: 15, 
                        marginTop: 4
                    }}>{language === "English" ? translate.home.menu.conditions.en: translate.home.menu.conditions.fr}</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.9} style={{
                    paddingVertical: 15, 
                    paddingHorizontal: 20, 
                    backgroundColor: "#fff", 
                    flexDirection: "row", 
                    alignItems: "center", 
                    borderBottomWidth: 1, 
                    borderBottomColor: COLORS.middle_blue
                }}>
                    <Feather name='file-text' color={COLORS.primary} size={SIZES.h5} />
                    <Text style={{
                        fontFamily: FONTS.regular, 
                        color: COLORS.primary, 
                        fontSize: SIZES.h6, 
                        marginLeft: 15, 
                        marginTop: 4
                    }}>{language === "English" ? translate.home.menu.mentions.en: translate.home.menu.mentions.fr}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {AsyncStorage.setItem("language", language === "English" ? "Francais" : "English"); setLanguage(language === "English" ? "Francais" : "English"); setModalVisible3(false)}} activeOpacity={0.9} style={{
                    paddingVertical: 15, 
                    paddingHorizontal: 20, 
                    backgroundColor: "#fff", 
                    flexDirection: "row", 
                    alignItems: "center", 
                    borderBottomWidth: 1, 
                    borderBottomColor: COLORS.middle_blue
                }}>
                    <Feather name='refresh-ccw' color={COLORS.primary} size={SIZES.h5} />
                    <Text style={{
                        fontFamily: FONTS.regular, 
                        color: COLORS.primary, 
                        fontSize: SIZES.h6, 
                        marginLeft: 15, 
                        marginTop: 4
                    }}>{language === "English" ? "Translate to french": "Traduire en anglais"}</Text>
                </TouchableOpacity>


              { token && <TouchableOpacity 
                 onPress={() => {setModalVisible3(false);  navigation.navigate("Contacts")}}
                activeOpacity={0.9} style={{
                    paddingVertical: 15, 
                    paddingHorizontal: 20, 
                    backgroundColor: "#fff", 
                    flexDirection: "row", 
                    alignItems: "center", 
                }}>
                    <AntDesign name='mail' color={COLORS.primary} size={SIZES.h5} />
                    <Text style={{
                        fontFamily: FONTS.regular, 
                        color: COLORS.primary, 
                        fontSize: SIZES.h6, 
                        marginLeft: 15, 
                        marginTop: 4
                    }}>Nous contacter</Text>
                </TouchableOpacity> }
            </View>

          

        </Pressable>

    </Modal>




<ScrollView 

            refreshControl={<RefreshControl refreshing={refreshing2} onRefresh={onRefresh2} />}
            contentContainerStyle={{
                paddingBottom: 85
            }}
            bounces={true}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
           
            
        >


<View style={{
                        flex: 1
                    }}>


<ImageBackground 
        source={require("../assets/images/degrade.png")}
       
      >


            <View 
                style={{
                    height : Platform.OS === "android" ? 0 : 60, 
                    borderBottomWidth: 1, 
                    borderBottomColor: Platform.OS === "ios" ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0)" 
                }}
            />
            <View style={styles.iconMenu}>
                <TouchableOpacity style={{
                    flexDirection: "row", 
                    alignItems: "center", 
                    gap: 1
                }} onPress={() => setModalVisible3(true)}>
                    {/*<AntDesign name={ modalVisible3 ? "menu-unfold" : "menu-fold"} size={SIZES.height * 0.038} color="#fff" />*/}
                    <Image 
                        source={require("../assets/images/last2.png")}
                        style={{
                            height: 30, 
                            width: 42, 
                            resizeMode: "contain"
                        }}
                   />
                   {/* <Text style={{
                        fontFamily: FONTS.bold, 
                        color: "#fff", 
                        fontSize: SIZES.h5
                    }}>Menu</Text>*/}
                </TouchableOpacity>


                <View style={{
                    paddingHorizontal: 15, 
                    paddingVertical: 10, 
                }}  >
                   { /* <Ionicons name='add-circle-outline' size={SIZES.height * 0.04} color="#FFF" />  */}
                   <Image 
                        source={require("../assets/images/Grouping2.jpg")}
                        style={{
                            height: 40, 
                            width: 40,
                            borderRadius: 20, 
                            resizeMode: "contain"
                        }}
                   />
                  
                </View>
            </View>

        
            <View style={{
                marginTop: 25, 
                paddingHorizontal: 30
            }}>
                <Text style={{
                     fontFamily: "AristotelicaProTx-Bld", 
                     fontSize: SIZES.height * 0.043, 
                     color: "#fff"
                }}>
                    {language === "English" ? translate.home.welcome1.en : translate.home.welcome1.fr} 
                </Text>
                <Text style={{
                     fontFamily: "AristotelicaProTx-Bld", 
                     fontSize: SIZES.height * 0.043, 
                     color: "#fff", 
                     marginTop: Platform.OS === "android" ? -15 : 10, 
                }}>
                      {language === "English" ? translate.home.welcome2.en : translate.home.welcome2.fr} 
                </Text>

            </View>

            <View style={{
                marginTop: 12, 
                paddingLeft: 30,
                paddingRight: 55, 
                marginTop: Platform.OS === "android" ? 0 : 10,
                marginBottom: 130
            }}>
                <Text style={{
                    color: "#fff", 
                    fontFamily: "AristotelicaProTx-Rg", 
                    fontSize: SIZES.height * 0.02, 
                    lineHeight: SIZES.height * 0.02
                }}>{language === "English" ? translate.home.welcomeSubTitle.en : translate.home.welcomeSubTitle.fr}  </Text>
            </View>
      

            </ImageBackground>

     <View style={{
            paddingHorizontal: 20, 

      }} >
        <View style={{
            backgroundColor: "#fff", 
            borderRadius: 20, 
            ...styles.shadow, 
            marginTop: -100,
            paddingBottom: 20
        }}>

            <View style={{
                flexDirection: "row", 
                alignItems: "center", 
                backgroundColor: COLORS.light_blue, 
                borderTopLeftRadius: 20, 
                borderTopRightRadius: 20
            }}>
            <TouchableOpacity onPress={() => {setActive("container"); 
            
            setKYear( new Date().getFullYear()); 
            setKMonth(new Date().getMonth() + 1); 
    
            setCYear( new Date().getFullYear()); 
            setCMonth(new Date().getMonth() + 1)
    
            setSearchContainerDate(`${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`);
            setSearchKilosDate(`${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`);
            setSearchContainerStartCity("Libreville"); 
            setSearchContainerEndCity("Marseille")
            setSearchKilosStartCity("Libreville"); 
            setSearchKilosEndCity("Paris");
            setTransitaireCountry("Gabon"); 
            setTransitaireCity("Libreville");
            setTransitaireCountry("Gabon"); 
            setTransitaireCity("Libreville");
            setDemenageurCity("Paris");
            setDemenageurCountry("France"); 
            
            setActivee("container")}} style={{
                    alignItems: "center", 
                    flex: 1,
                    paddingVertical: 10,
                    backgroundColor: active === "container" ? "#fff" : COLORS.light_blue, 
                    borderTopLeftRadius: 20, 
                   
         
                }} >
            
                    <Image source={require("../assets/images/container1.png")} style={{
                        height: SIZES.width * 0.07, 
                        width: SIZES.width * 0.07, 
                        resizeMode: "contain"
                    }} />
                    <View style={{
                    
                    }}>
                        <Text style={{
                            fontFamily: "AristotelicaProTx-Rg", 
                            color: COLORS.primary , 
                            fontSize: SIZES.height * 0.018, 
                         
                        }}>{language === "English" ? translate.home.container.en : translate.home.container.fr}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {setActive("kilos"); 
                
                setKYear( new Date().getFullYear()); 
                setKMonth(new Date().getMonth() + 1); 
        
                setCYear( new Date().getFullYear()); 
                setCMonth(new Date().getMonth() + 1)
        
                setSearchContainerDate(`${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`);
                setSearchKilosDate(`${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`);
                setSearchContainerStartCity("Libreville"); 
                setSearchContainerEndCity("Marseille")
                setSearchKilosStartCity("Libreville"); 
                setSearchKilosEndCity("Paris");
                setTransitaireCountry("Gabon"); 
                setTransitaireCity("Libreville");
                setTransitaireCountry("Gabon"); 
                setTransitaireCity("Libreville");
                setDemenageurCity("Paris");
                setDemenageurCountry("France"); 
                
                setActivee("kilos")}} style={{
                    alignItems: "center", 
                    flex: 1,
                    paddingVertical: 10,
                    backgroundColor: active === "kilos" ? "#fff" : COLORS.light_blue, 
                    borderTopRightRadius: 20,
         
                }} >
              

            
           
                            <Image 
                                source={require("../assets/images/avion1.png")}
                                style={{
                                    height: SIZES.width * 0.07, 
                                    width: SIZES.width * 0.07, 
                                    resizeMode: "contain"
                                }}
                            />
                   
                      
                        
                  
              

                    <View style={{
                    
                    }}>
                        <Text style={{
                            fontFamily: "AristotelicaProTx-Rg", 
                            color: COLORS.primary , 
                            fontSize: SIZES.height * 0.018, 
                
                        }}>Kilos</Text>
                    </View>
                </TouchableOpacity>
               {/* <TouchableOpacity onPress={() => setActive("transitaires")} style={{
                    alignItems: "center", 
                    flex: 1,
                    paddingVertical: 20,
                    backgroundColor: active === "transitaires" ? "#fff" : COLORS.light_blue, 

                }} >
                    <Octicons name="person-fill" size={25} color = {COLORS.primary} />
                    <View style={{
                    
                    }}>
                        <Text style={{
                            fontFamily: "AristotelicaProTx-Rg", 
                            color: COLORS.primary , 
                            fontSize: 11, 
                            marginTop: 5
                        }}>Transitaires</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActive("demenageurs")} style={{
                    alignItems: "center", 
                    flex: 1,
                    paddingVertical: 20,
                    backgroundColor: active === "demenageurs" ? "#fff" : COLORS.light_blue, 
        
                    borderTopRightRadius: 20,
                }} >
                    <MaterialCommunityIcons name="truck-fast" size={25} color = {COLORS.primary} />
                    <View style={{
                    
                    }}>
                        <Text style={{
                            fontFamily: "AristotelicaProTx-Rg", 
                            color: COLORS.primary , 
                            fontSize: 11, 
                            marginTop: 5
                        }}>{language === "English" ? "Movers" : "Déménageurs"}</Text>
                    </View>
                </TouchableOpacity> */}
            </View>

            <View style={{
                marginTop: 25, 
                paddingHorizontal: 20
            }}>

                {
                    active === "container" && <View>

                       {/* <SelectItem1 
                            label1={language === "English" ? "Select a departure month" : "Sélectionnez un mois de départ"}
                            label2={`${months.filter(item => item.value === cMonth)[0].label} ${cYear}`}
                            onPress={() => { setCurrentSelect("c"); open("container")}}
                        />

                        <SelectItem1 
                            label1={language === "English" ? "Departure city" : "Ville de départ"}
                            label2={searchContainerStartCity}
                            onPress={() => {setOpenFor("container"); setType("d"); setModalVisible2(true)}}
                            marginTop={10}
                        />  

                         <SelectItem1 
                            label1={language === "English" ? "Arrival city" : "Ville d'arrivée"}
                            label2={searchContainerEndCity}
                            onPress={() => {setOpenFor("container"); setType("a"); setModalVisible2(true)}}
                            marginTop={10}
                        />  */}

                         <Button1 

                            backgroundColor={COLORS.orange}
                            borderRadius={8}
                            label={language === "English" ? translate.home.createListing.en : translate.home.createListing.fr}
                            textColor="#fff"
                            fontFamily="AristotelicaProTx-Rg"
                            fontSize={SIZES.height * 0.03}
                            imagePath= {require("../assets/images/addButton.png")}
                            iconColor="#fff"
                            iconSize={SIZES.height * 0.035}
                            onPress={() => navigateToAnnouncement() }
                        
                        />  

                        <Button1 

                            backgroundColor={COLORS.primary}
                            borderRadius={8}
                            label={language === "English" ? translate.home.searchListing.en : translate.home.searchListing.fr}
                            textColor="#fff"
                            fontFamily="AristotelicaProTx-Rg"
                            fontSize={SIZES.height * 0.03}
                            imagePath= {require("../assets/images/search.png")}
                            iconColor="#fff"
                            iconSize={SIZES.height * 0.035}
                            onPress = {
                                () => {

                                    setKYear( new Date().getFullYear()); 
                                    setKMonth(new Date().getMonth() + 1); 
                            
                                    setCYear( new Date().getFullYear()); 
                                    setCMonth(new Date().getMonth() + 1)
                            
                                    setSearchContainerDate(`${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`);
                                    setSearchKilosDate(`${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`);
                                    setSearchContainerStartCity("Libreville"); 
                                    setSearchContainerEndCity("Marseille")
                                    setSearchKilosStartCity("Libreville"); 
                                    setSearchKilosEndCity("Paris");
                                    setTransitaireCountry("Gabon"); 
                                    setTransitaireCity("Libreville");
                                    setTransitaireCountry("Gabon"); 
                                    setTransitaireCity("Libreville");
                                    setDemenageurCity("Paris");
                                    setDemenageurCountry("France"); 
                                    setCurrentType(active === "kilos" ? "k" : "c")
                                    
                                    setActivee(active); avoirLesAnnonces(active === "kilos" ? "k" : "c"); setModalVisible6(true)
                                    
                                }
                            }
                        
                        />



                    </View>
                }

                {
                    active === "kilos" && <View>

                     {/*}   <SelectItem1 
                            label1={language === "English" ? "Select a departure month" : "Sélectionnez un mois de départ"}
                            label2={`${months.filter(item => item.value === kMonth)[0].label} ${kYear}`}
                            onPress={() => { open("kilos")}}
                        />

                        <SelectItem1 
                            label1={language === "English" ? "Departure city" : "Ville de départ"}
                            label2={searchKilosStartCity}
                            onPress={() => {setOpenFor("kilos"); setType("d"); setModalVisible2(true)}}
                            marginTop={10}
                        />  

                         <SelectItem1 
                            label1={language === "English" ? "Arrival city" : "Ville d'arrivée"}
                            label2={searchKilosEndCity}
                            onPress={() => {setOpenFor("kilos"); setType("a"); setModalVisible2(true)}}
                            marginTop={10}
                        />    

                */}
                         <Button1 

                            backgroundColor={COLORS.orange}
                            borderRadius={8}
                            label={language === "English" ? translate.home.createListing.en : translate.home.createListing.fr}
                            textColor="#fff"
                            fontFamily="AristotelicaProTx-Rg"
                            fontSize={SIZES.height * 0.03}
                            imagePath= {require("../assets/images/addButton.png")}
                            iconColor="#fff"
                            iconSize={SIZES.height * 0.035}
                            onPress={() => navigateToAnnouncement() }
                        
                        />  

                         <Button1 

                            backgroundColor={COLORS.primary}
                            borderRadius={12}
                            label={language === "English" ? translate.home.searchListing.en : translate.home.searchListing.fr}
                            textColor="#fff"
                            fontFamily="AristotelicaProTx-Rg"
                            fontSize={SIZES.height * 0.03}
                            imagePath= {require("../assets/images/search.png")}
                            iconColor="#fff"
                            iconSize={SIZES.height * 0.035}
                            onPress = {
                                () => {

                                    setKYear( new Date().getFullYear()); 
                                    setKMonth(new Date().getMonth() + 1); 
                            
                                    setCYear( new Date().getFullYear()); 
                                    setCMonth(new Date().getMonth() + 1)
                            
                                    setSearchContainerDate(`${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`);
                                    setSearchKilosDate(`${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`);
                                    setSearchContainerStartCity("Libreville"); 
                                    setSearchContainerEndCity("Marseille")
                                    setSearchKilosStartCity("Libreville"); 
                                    setSearchKilosEndCity("Paris");
                                    setTransitaireCountry("Gabon"); 
                                    setTransitaireCity("Libreville");
                                    setTransitaireCountry("Gabon"); 
                                    setTransitaireCity("Libreville");
                                    setDemenageurCity("Paris");
                                    setDemenageurCountry("France"); 
                                    
                                    setActivee(active); avoirLesAnnonces(active === "kilos" ? "k" : "c"); setModalVisible6(true)

                                }
                            }
                        
                        />

                        </View>
                }

                {
                    active === "transitaires" && <View> 

                            <SelectItem1 

                                label1={language === "English" ? "Country" : "Pays"}
                                label2={transitaireCountry}
                             />

                             <SelectItem1 

                                label1={language === "English" ? "Arrival city" : "Ville d'arrivée"}
                                label2={transitaireCity}
                                marginTop={10}
                             />

                            <Button1 

                                backgroundColor={COLORS.primary}
                                borderRadius={12}
                                label={language === "English" ? "Search" : "Rechercher"}
                                textColor="#fff"
                                fontFamily="AristotelicaProTx-Bld"
                                fontSize={16}
                                iconName={"search"}
                                iconColor="#fff"
                                iconSize={20}
                            
                            />

                        </View>
                }

{
                    active === "demenageurs" && <View> 

                            <SelectItem1 

                                label1={language === "English" ? "Country" : "Pays"}
                                label2={demenageurCountry}
                             />

                             <SelectItem1 

                                label1={language === "English" ? "City" : "Ville"}
                                label2={demenageurCity}
                                marginTop={10}
                             />

                            <Button1 

                                backgroundColor={COLORS.primary}
                                borderRadius={12}
                                label={language === "English" ? "Search" : "Rechercher"}
                                textColor="#fff"
                                fontFamily="AristotelicaProTx-Bld"
                                fontSize={16}
                                iconName={"search"}
                                iconColor="#fff"
                                iconSize={20}
                            
                            />

                        </View>
                }


                {
                    errorMessage && <ErrorMessage errorMessage={errorMessage} />
                }
               

            </View>

        </View>
      </View>
 

    </View>

    <TouchableOpacity onPress={chargerDepartsImminents} style={{
        flexDirection: "row",
        alignItems: "center",
        marginTop: 25,
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginHorizontal: 15,
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "rgba(0,0,0,0.15)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4
    }}>
        <FontAwesome name="plane" size={18} color={COLORS.orange} />
        <Image source={require("../assets/images/container1.png")} style={{ height: 18, width: 28, resizeMode: "contain", marginLeft: 6, tintColor: COLORS.primary }} />
        <Text style={{
            fontFamily: FONTS.bold,
            fontSize: SIZES.h6,
            color: COLORS.primary,
            marginLeft: 10,
            flex: 1
        }}>{language === "English" ? "Upcoming departures" : "Départs imminents"}</Text>
        <AntDesign name="right" size={16} color={COLORS.primary} />
    </TouchableOpacity>

    <View >


    {
    containers.length > 0 && <View style={{
        marginTop: 35,

    }}>
        { //premier texte à figer au haut de la page 
        <View style={{
     
            flexDirection: "row", 
            alignItems: "center", 
            justifyContent: "space-between", 
            paddingHorizontal: 20, 
           
        }} >

            <View>
                <Text style={{
                    fontFamily: FONTS.bold, 
                    fontSize: SIZES.h5, 
                    color: COLORS.primary
                }}>{language === "English" ? translate.home.annoncesContainers.en : translate.home.annoncesContainers.fr} ...</Text>
            </View>

           { containers.length === 3 && <TouchableOpacity onPress={() => {setCurrentType("c");
           
           setKYear( new Date().getFullYear()); 
           setKMonth(new Date().getMonth() + 1); 
   
           setCYear( new Date().getFullYear()); 
           setCMonth(new Date().getMonth() + 1)
   
           setSearchContainerDate(`${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`);
           setSearchKilosDate(`${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`);
           setSearchContainerStartCity("Libreville"); 
           setSearchContainerEndCity("Marseille")
           setSearchKilosStartCity("Libreville"); 
           setSearchKilosEndCity("Paris");
           setTransitaireCountry("Gabon"); 
           setTransitaireCity("Libreville");
           setTransitaireCountry("Gabon"); 
           setTransitaireCity("Libreville");
           setDemenageurCity("Paris");
           setDemenageurCountry("France"); 
           
           setFlatLoading(true); avoirLesAnnonces("c"); setActivee("container"); setModalVisible5(true)}} style={{
                paddingVertical: 3, 
                paddingHorizontal: 10, 
                backgroundColor: COLORS.primary, // "rgb(220, 231, 244)", 
                borderRadius: 4
            }}>
                <Text style={{
                    fontFamily: FONTS.regular, 
                    fontSize: SIZES.h7, 
                    color: "#fff" // COLORS.primary
                }}>Tout voir</Text>
            </TouchableOpacity> }

        </View>}

        <View style={{
            paddingHorizontal: 10, 
            marginTop: 15
        }}>

        {
            containers.map((item, idx) => {

                    return (
                        <AnnounceBlock key={item._id} index={idx} status="container" userId={item.userId}  city1={item.startCity} city2={item.endCity}  onPress= {() => navigation.navigate("Details", {_id: item._id})}
                        date={item.dateOfDeparture} name={item.transitaire || (item.user && item.user.name)} views={item.views} datee={item.date} company={item.company} startCity={item.startCity2 && item.startCity2.code} endCity={item.endCity2 && item.endCity2.code}
                        startCountry={item.startCity2 && item.startCity2.country} endCountry={item.endCity2 && item.endCity2.country}
                        goToModify={(status) => navigation.navigate("AnnouncementForm", {_id: item._id, value: status})} />
                    )
            })
        }

        </View>

       

        </View>
}


{
    kilos.length > 0 && <View style={{
        marginTop: 35, 
       
    }}>
       { //deuxieme texte à figer 
       <View style={{
            flexDirection: "row", 
            alignItems: "center", 
            justifyContent: "space-between", 
            paddingHorizontal: 20
        }} >

            <View>
                <Text style={{
                    fontFamily: FONTS.bold, 
                    fontSize: SIZES.h5, 
                    color: COLORS.orange
                }}>{language === "English" ? translate.home.disponibiliteKilos.en : translate.home.disponibiliteKilos.fr} ...</Text>
            </View>

           {kilos.length === 3 && <TouchableOpacity onPress={() => {setCurrentType("k"); setFlatLoading(true); 
           
           setKYear( new Date().getFullYear()); 
           setKMonth(new Date().getMonth() + 1); 
   
           setCYear( new Date().getFullYear()); 
           setCMonth(new Date().getMonth() + 1)
   
           setSearchContainerDate(`${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`);
           setSearchKilosDate(`${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`);
           setSearchContainerStartCity("Libreville"); 
           setSearchContainerEndCity("Marseille")
           setSearchKilosStartCity("Libreville"); 
           setSearchKilosEndCity("Paris");
           setTransitaireCountry("Gabon"); 
           setTransitaireCity("Libreville");
           setTransitaireCountry("Gabon"); 
           setTransitaireCity("Libreville");
           setDemenageurCity("Paris");
           setDemenageurCountry("France"); 
           
           setActivee("kilos"); avoirLesAnnonces("k"); setModalVisible5(true)}}  style={{
                paddingVertical: 3, 
                paddingHorizontal: 10, 
                backgroundColor: COLORS.orange, 
                borderRadius: 4
            }}>
                <Text style={{
                    fontFamily: FONTS.regular, 
                    fontSize: SIZES.h7, 
                    color: "#fff"
                }}>Tout voir</Text>
            </TouchableOpacity> }

        </View> }

        <View style={{
            paddingHorizontal: 10, 
            marginTop: 15
        }}>

        {
            kilos.map((item, idx) => {

                    return (
                        <AnnounceBlock key={item._id} index={idx} userId={item.userId} status="kilos" city1={item.startCity} city2={item.endCity}
                        date={item.dateOfDeparture}  datee={item.date} onPress= {() => navigation.navigate("Details", {_id: item._id})}
                        company={item.company} views={item.views} startCity={ item.startCity2 && item.startCity2.code} endCity={item.endCity2 &&  item.endCity2.code}
                        startCountry={item.startCity2 && item.startCity2.country} endCountry={item.endCity2 && item.endCity2.country}
                        goToModify={(status) => navigation.navigate("AnnouncementForm", {_id: item._id, value: status})}  />
                    )
            })
        }

        </View>

       

        </View>
}

    </View>

        </ScrollView>

    <Modal
        visible={modalDepartsVisible}
        onRequestClose={() => setModalDepartsVisible(false)}
        animationType="slide"
        transparent={true}
    >
        <View style={{
            width: SIZES.width,
            height: SIZES.height,
            backgroundColor: "rgba(0,0,0,0.6)",
            alignItems: "center",
            justifyContent: "flex-end"
        }}>
            <View style={{
                backgroundColor: "#fff",
                width: SIZES.width,
                height: SIZES.height * 0.8,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingHorizontal: 15,
                paddingTop: 15
            }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingBottom: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: "#f0f0f0"
                }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Feather name="clock" size={20} color={COLORS.primary} />
                        <Text style={{
                            fontFamily: FONTS.bold,
                            fontSize: SIZES.h5,
                            color: COLORS.primary,
                            marginLeft: 10
                        }}>{language === "English" ? "Upcoming departures" : "Départs imminents"}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setModalDepartsVisible(false)} style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: "#f5f5f5",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <AntDesign name="close" size={16} color="#666" />
                    </TouchableOpacity>
                </View>

                {departsLoading ? (
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
                        {departsImminents.length === 0 ? (
                            <Text style={{
                                fontFamily: FONTS.regular,
                                fontSize: SIZES.h6,
                                color: "#999",
                                textAlign: "center",
                                marginTop: 40
                            }}>{language === "English" ? "No upcoming departures" : "Aucun départ imminent"}</Text>
                        ) : (
                            departsImminents.map((item) => {
                                const departDate = new Date(item.dateOfDeparture);
                                const day = departDate.getDate();
                                const month = MONTHS[departDate.getMonth()];
                                const year = departDate.getFullYear();
                                const isContainer = item.status === "container";
                                const accentColor = isContainer ? COLORS.primary : COLORS.orange;
                                const bgTint = isContainer ? "rgba(0,51,102,0.08)" : "rgba(255,140,0,0.08)";
                                return (
                                    <TouchableOpacity key={item._id} onPress={() => {
                                        setModalDepartsVisible(false);
                                        navigation.navigate("Details", { _id: item._id });
                                    }} style={{
                                        backgroundColor: "#fff",
                                        borderRadius: 14,
                                        padding: 14,
                                        marginBottom: 12,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        shadowColor: "#000",
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.08,
                                        shadowRadius: 8,
                                        elevation: 3,
                                        borderLeftWidth: 4,
                                        borderLeftColor: accentColor,
                                    }}>
                                        <View style={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 12,
                                            backgroundColor: bgTint,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginRight: 12,
                                        }}>
                                            {isContainer ? (
                                                <Image source={require("../assets/images/container1.png")} style={{ height: 22, width: 32, resizeMode: "contain", tintColor: accentColor }} />
                                            ) : (
                                                <FontAwesome name="plane" size={18} color={accentColor} />
                                            )}
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{
                                                fontFamily: FONTS.bold,
                                                fontSize: SIZES.h6,
                                                color: "#222",
                                            }} numberOfLines={1}>{item.startCity}  →  {item.endCity}</Text>
                                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                                                <Feather name="calendar" size={12} color="#888" />
                                                <Text style={{
                                                    fontFamily: FONTS.regular,
                                                    fontSize: SIZES.h7,
                                                    color: "#666",
                                                    marginLeft: 5,
                                                }}>{day} {month} {year}</Text>
                                                {item.company ? <Text style={{
                                                    fontFamily: FONTS.regular,
                                                    fontSize: SIZES.h7,
                                                    color: "#999",
                                                }}> • {item.company}</Text> : null}
                                            </View>
                                            {(item.user && item.user.name) ? (
                                                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}>
                                                    <Feather name="user" size={11} color="#aaa" />
                                                    <Text style={{
                                                        fontFamily: FONTS.regular,
                                                        fontSize: SIZES.h8,
                                                        color: "#999",
                                                        marginLeft: 4,
                                                    }}>{item.user.name}</Text>
                                                </View>
                                            ) : null}
                                        </View>
                                        <View style={{
                                            paddingHorizontal: 10,
                                            paddingVertical: 5,
                                            backgroundColor: bgTint,
                                            borderRadius: 8,
                                        }}>
                                            <Text style={{
                                                fontFamily: FONTS.bold,
                                                fontSize: SIZES.h8,
                                                color: accentColor,
                                            }}>{isContainer ? (language === "English" ? "Container" : "Conteneur") : "Kilos"}</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })
                        )}
                        <View style={{ height: 30 }} />
                    </ScrollView>
                )}
            </View>
        </View>
    </Modal>

    </View>
  );

    }
    
    
    const styles = StyleSheet.create({
    
    
    
          
            container: {

                flex: 1, 
                backgroundColor: "#fff", 
    

           
        }, 
    
        text1: {
    
                fontFamily: "AristotelicaProTx-Lt", 
                color: "#000", 
                fontSize: 14
        }, 
        text2: {
    
            fontFamily: "AristotelicaProTx-Bld", 
            color: "#000", 
            fontSize: 14
    }, 
    iconMenu: {

        flexDirection: "row", 
        paddingVertical: 15, 
        paddingHorizontal: 30, 
        alignItems: "center", 
        justifyContent: "space-between"
}, 

shadow: {
    shadowColor: "rgba(0,0,0,0.5)", 
    shadowOffset: {
        width: 0, 
        height: 10,
    }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.5, 
    elevation: 5
}, 

horizontalGradient: {
    flex: 1,
    backgroundColor: 'orange', // Couleur orange
  },
  verticalGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'blue', // Couleur bleue
    opacity: 0.5, // Ajuste l'intensité du dégradé vertical
  },

  subGradient: {
    position: 'absolute',
    flex: 1,
  },

  gradient: {
    flex: 1,
  },

        
    
    })
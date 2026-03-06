import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, ImageBackground, Platform, Text, TouchableOpacity, View } from 'react-native'
import AnnounceBlock from '../components/AnnounceBlock';
import { COLORS, FONTS, SIZES } from '../constants/theme'
import { useFetchFunctions } from '../infrastructures/functions';
import { AuthContext } from '../navigation/AuthProvider';
import Loading from '../components/Loading';
import DetourStack from '../navigation/DetourStack';
import Button1 from '../components/Button1';
import { API } from '../config/api';

const SEARCH_URL = API.ANNONCE_SEARCH;

export default function Search({route, navigation}) {

    const {type, start, year, month, end} = route.params; 
    const {token, language, setPendingSearch} = useContext(AuthContext);
    const {postFunction} = useFetchFunctions()
    const [startAt, setStartAt] = useState(0); 
    const [annonces, setAnnonces] = useState([]); 
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [good, setGood] = useState(false);
    const [loading, setLoading] = useState(true);
    const [ok, setOk]= useState(false); 

    

   useEffect(() => {

    if(token){

       // alert(type)
    postFunction(SEARCH_URL, {start, end, month, year, type, startAt: 0}, token).then((data) => {


        console.log(data);

        if(data && data.status === 0){

            setStartAt(data.startAt); 
            console.log(data.startAt);
            console.log(data);
            setAnnonces(data.annonces); 
            setCount(data.count);

            if(data.annonces.length === 0 && !token){

                    setGood(true);
            }

            if(data.annonces.length === 0 && token){

           

                setOk(true);
         }


        }

        setLoading(false)
            
    }, (err) => {

            console.log(err); 
            setLoading(false);
    })




    }else{

        setPendingSearch({type, start, end, year, month});
        navigation.goBack();
        navigation.navigate("Ouhaaa");
        setLoading(false)
    }

   },[])

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

    if(startAt === null){

        setIsLoading(false);
    
    }else{



            postFunction(SEARCH_URL, {start, end, month, year, type, startAt }).then((data) => {

                if(data && data.status === 0){
        
                    setStartAt(data.startAt); 
                    console.log(data.startAt);
                    setIsLoading(false);
                    setAnnonces([...annonces, ...data.annonces]); 
    
                   // setCount(data.count);
    
    
                }
                    
            }, (err) => {
    
                    console.log(err)
            })


        


    }
        
 }


 if(loading) return <Loading />

 if(good) return <DetourStack />

 if(ok)  return (

    <View style={{
        flex: 1, 
        backgroundColor: COLORS.primary, 
        alignItems: "center", 
        justifyContent: "center"
    }}>
        <View >
            <Text style={{
                fontFamily: FONTS.bold, 
                color: "#fff", 
                fontSize: SIZES.h2
            }}>{language === "English" ? "Congratulations!" : "Félicitations !"}</Text>
        </View>

        <View style={{
            marginTop: Platform.OS === "ios" ? 15 : 10, 
            paddingHorizontal: 30
        }}>
            <Text style={{
                textAlign: "center", 
                color: "#fff", 
                fontFamily: FONTS.regular, 
                fontSize: SIZES.h5, 
                lineHeight: SIZES.h5
            }}>
                {language === "English" ? "Your request has been received. One of our advertisers will contact you within 72 business hours." : "Votre demande a été prise en compte. Un de nos annonceurs vous contactera sous 72h ouvrés."}
            </Text>
        </View>



        <View style={{
                alignItems: "center", 
                marginTop: 40
            }}>
                <Image
                    source={require("../assets/images/felicitation.png")}

                    style={{
                        width : SIZES.width  -100, 
                        height: SIZES.width / 1.5, 
                        resizeMode: "contain"
                    }}
                />
            </View>

        <View style={{
            paddingHorizontal: 30, 
            width: "100%"
        }}>
             <View style={{
            marginTop: 25, 
             
            }}>
                <Button1 label={language === "English" ? "Back" : "Retour"} backgroundColor="#fff" textColor={COLORS.primary} fontFamily={FONTS.regular} borderRadius={12} 
                onPress={() => {navigation.goBack()}} />
            </View>
        </View>
    </View>
  )

  return (
    <View style={{
        flex: 1, 
        backgroundColor: COLORS.light_blue
    }}>

        <FlatList 

            ListHeaderComponent={() => {
                return(

                <View style={{
                    marginBottom: 25
                }} >
                    <ImageBackground 
                    style={{
                        paddingTop: Platform.OS === "android" ? 35 : 65, 
                        paddingHorizontal: 25
                    }}
                    source={require("../assets/images/Background.png")}
                >
        
                    <View style={{
                        flexDirection: "row", 
                        alignItems: "center", 
                        marginBottom: Platform.OS  === "android" ? 10 : 15
                    }}>
        
                    <TouchableOpacity onPress={() => navigation.goBack()}>
        
                        <Image 
                            source={require("../assets/images/left.png")} 
                            style={{
                                height: SIZES.h3, 
                                width: SIZES.h3, 
                                resizeMode: "contain"
                            }} />
                    </TouchableOpacity>
        
                    <View style={{
                        flex: 1,
                        alignItems: "center", 
                       
                    }}>
        
                        <Text style={{
                            fontFamily: FONTS.bold, 
                            fontSize: SIZES.h3, 
                            color: "#fff", 
                            textAlign: "center"
                        }}>
                            {language === "English" ? "Results for ..." : "Résultats pour ..."}
                        </Text>
        
                    </View>
        
        
        
                    </View>
        
                <View style={{
                    paddingHorizontal: 10
                }}>
        
                    <View style={{
                        paddingVertical: Platform.OS === "android" ? 5 : 10, 
                        paddingHorizontal: Platform.OS === "ios" ? 15 : 15 , 
                        backgroundColor: "#fff", 
                        borderRadius: 12
                    }}> 
        
                        <View >
                            <Text style={{
                                fontFamily: FONTS.regular, 
                                color: COLORS.primary, 
                                fontSize: SIZES.h7
                            }}>{language === "English" ? "Departure month" : "Mois de départ"}</Text>
                        </View>
                        <View style={{
                            marginTop: Platform.OS === "android" ? 0 : 9
                        }} >
                            <Text style={{
                                fontFamily: FONTS.regular, 
                                color: COLORS.primary, 
                                fontSize: SIZES.h5
                            }}>{month} {year}</Text>
                        </View>
                        
                    </View>
        
                    <View style={{
                        paddingVertical: Platform.OS === "android" ? 5 : 10, 
                        paddingHorizontal: Platform.OS === "ios" ? 15 : 15 , 
                        backgroundColor: "#fff", 
                        borderRadius: 12, 
                        marginTop: 10
                    }}> 
        
                        <View >
                            <Text style={{
                                fontFamily: FONTS.regular, 
                                color: COLORS.primary, 
                                fontSize: SIZES.h7
                            }}>{language === "English" ? "Departure city" : "Ville de départ"}</Text>
                        </View>
                        <View style={{
                            marginTop: Platform.OS === "android" ? 0 : 9
                        }} >
                            <Text style={{
                                fontFamily: FONTS.regular, 
                                color: COLORS.primary, 
                                fontSize: SIZES.h5
                            }}>{start}</Text>
                        </View>
                        
                    </View>
        
                    <View style={{
                        paddingVertical: Platform.OS === "android" ? 5 : 10, 
                        paddingHorizontal: Platform.OS === "ios" ? 15 : 15 , 
                        backgroundColor: "#fff", 
                        borderRadius: 12, 
                        marginTop: 10
                    }}> 
        
                        <View >
                            <Text style={{
                                fontFamily: FONTS.regular, 
                                color: COLORS.primary, 
                                fontSize: SIZES.h7
                            }}>{language === "English" ? "Arrival city" : "Ville d'arrivée"}</Text>
                        </View>
                        <View style={{
                            marginTop: Platform.OS === "android" ? 0 : 9
                        }} >
                            <Text style={{
                                fontFamily: FONTS.regular, 
                                color: COLORS.primary, 
                                fontSize: SIZES.h5
                            }}>{end}</Text>
                        </View>
                        
                    </View>
        
                    <View style={{
                        flexDirection: "row", 
                        alignItems: "center", 
                        marginTop: 10, 
                        paddingHorizontal: 3
                    }} >
        
                        <View style={{
                            paddingVertical: Platform.OS === "android" ? 1 : 5, 
                            paddingHorizontal: 15, 
                            borderColor: "#fff", 
                            borderWidth: 1, 
                            borderRadius: 4
                        }}>
                            <Text style={{
                                fontFamily: FONTS.ligth, 
                                fontSize: SIZES.h6, 
                                color: "#fff"
                            }}> {start} </Text>
                        </View>
        
                         <View style={{
                            paddingVertical: Platform.OS === "android" ? 1 : 5, 
                            paddingHorizontal: 15, 
                            borderColor: "#fff", 
                            borderWidth: 1, 
                            borderRadius: 4, 
                            marginLeft: 10
                        }}>
                            <Text style={{
                                fontFamily: FONTS.ligth, 
                                fontSize: SIZES.h6, 
                                color: "#fff"
                            }}> {end} </Text>
                        </View>
        
                    </View>
        
                    
        
                </View>
        
                <View style={{
                    marginTop: 10, 
                    height: 10, 
                    backgroundColor: "rgb(78, 112, 167)", 
                    width : SIZES.width, 
                    marginLeft: -25
                }}>
        
        
        
                </View>
        
                </ImageBackground>

                <View style={{
                    marginTop: 30, 
                    flexDirection: "row", 
                    alignItems: "center", 
                    paddingHorizontal: 30, 
                    justifyContent: "space-between"
                }} >
                    <View style={{
                        flexDirection: "row", 
                        alignItems: "center"
                    }}>
                        <Image source={type === "container" ?  require("../assets/images/container5.png") : require("../assets/images/avion1.png")}
                            style={{
                                height: SIZES.h3, 
                                width: SIZES.h2, 
                                resizeMode: "contain"
                            }} />

                        <View style={{ marginLeft: 15 }} >
                            <Text style={{
                                fontFamily: FONTS.bold, 
                                fontSize: SIZES.h5, 
                                color: COLORS.primary, 
                                marginTop: Platform.OS === "android" ? -5 : 0
                            }}> {count} {type === "container" ? (language === "English" ? "container(s)" : "conteneur(s)") : (language === "English" ? "traveler(s)" : "voyageur(s)")} {language === "English" ? "found" : "trouvé(s)"} </Text>
                        </View>
                    </View>


                    <View >
                        <Image source={require("../assets/images/xxx.png")} style={{
                            height: SIZES.h3, 
                            width: SIZES.h3, 
                            resizeMode: "contain"
                        }} />
                    </View>

                   
                </View>


                </View>
                )
            }}
            contentContainerStyle={{
             
            }}
            ListFooterComponent={renderLoader}
            onEndReached={loadMoreItem}
            keyExtractor={(item) => item._id}
            data={annonces}
            renderItem={({item}) => {

                    return(

                        <View style={{
                            paddingHorizontal: 10
                        }}>
                             <AnnounceBlock key={item._id} userId={item.userId}  status={type==="kilos" ? "kilos" : "container"} city1={item.startCity} city2={item.endCity} onPress= {() =>{ token ? navigation.navigate("Details", {_id: item._id}) : navigation.navigate("Ouhaaa", {userId: "1"})}}
                                date={item.dateOfDeparture} datee={item.date} company={item.company} startCity={item.startCity2.code} endCity={item.endCity2.code}
                                startCountry={item.startCity2.country} endCountry={item.endCity2.country}  />
                        </View>
                       
                    )
            }}

        />

    </View>
  )
}

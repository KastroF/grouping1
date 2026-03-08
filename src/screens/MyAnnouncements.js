import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import FontAwesome6 from "react-native-vector-icons/FontAwesome6"
import Ionicons from "react-native-vector-icons/Ionicons"
import AnnounceBlock from '../components/AnnounceBlock';
import Loading from '../components/Loading';
import { COLORS, FONTS, SIZES } from '../constants/theme'
import { useFetchFunctions } from '../infrastructures/functions';
import { AuthContext } from '../navigation/AuthProvider';
import { API } from '../config/api';

const MES_ANNONCES_URL = API.ANNONCE_GET_BY_USER;
const PLUS_ANNONCES_URL = API.ANNONCE_MORE;

export default function MyAnnouncements({route, navigation}) {

    let _id = null; 

    if(route ){
         _id = route.params; 
    }
    

    const [kilos, setKilos] = useState([]); 
    const [containers, setContainers] = useState([]);
    const {laFonctionGet, postFunction} = useFetchFunctions(); 
    const {token, language, refreshModify} = useContext(AuthContext);
    const [startAt, setStartAt] = useState(0); 
    const [startBt, setStartBt] = useState(0);
    const [loading, setLoading]  = useState(true)
    const [modalVisible, setModalVisible] = useState(false);
    const [type, setType] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    


    useEffect(() => {



        try{


        laFonctionGet(MES_ANNONCES_URL,  token).then((data) => {

            if(data && data.status === 0){

                  console.log(data.kilos.length)
                   setKilos(data.kilos); 
                   setContainers(data.containers);
                   setStartAt(data.startAt); 
                   setStartBt(data.startBt);
                 

                  // console.log(data)
            }

            setLoading(false);

    })

        }catch(e){

                console.log(e); 
                setLoading(false);
        }


    },[refreshModify])



const navigateToAnnouncement = () => {

        navigation.navigate("Announcement");
}

const moreAnnounces = (typee) => {



    setModalVisible(true); 
    setType(typee)
 

    
        
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

    if( type === "container" && !startAt){

        setIsLoading(false);

    }else if(type === "kilos" && !startBt){

        setIsLoading(false);

    }else{


    

        postFunction(PLUS_ANNONCES_URL, {skip: type === "kilos" ? startBt : startAt, status: type === "kilos" ? "kilos" : "container" }, token).then((data) => {

            console.log(data);
            if(data && data.status === 0){
    
                if(type === "kilos"){
    
                   // setKilos([...kilos, ...data.annonces]); 
                    setKilos(
                        [...kilos, ...data.annonces]
                    
                    )
                    setStartBt(data.skip); 
    
    
                }else{
    
                    setContainers(
                        [...containers, ...data.annonces]
                )
                    setStartAt(data.skip)
    
                }

                setIsLoading(false);
            }
                
        });



    }
}


    if(loading) return <Loading />


  return (
    <View style={{
        flex: 1, 
 
        backgroundColor: COLORS.light_blue
    }}>

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
                backgroundColor: COLORS.light_blue, 
                paddingTop: Platform.OS === "android" ? 35 : 65, 
                
            }}>

                <FlatList 
                    ListHeaderComponent={() => {

                        return(
                            <View >
                                <TouchableOpacity onPress={() => setModalVisible(false) } style={{
                                    width: "100%", 
                                    alignItems: "flex-end", 
                                    paddingVertical: 10, 
                                    paddingHorizontal: 15
                                }}>
                                    <Ionicons name='close' color={COLORS.primary} size={SIZES.h2} />
                                </TouchableOpacity>
                                <View style={{
                                    paddingHorizontal: 15, 
                                    marginBottom: 15
                                }} >
                                    <Text style={{
                                        fontFamily: FONTS.bold, 
                                        fontSize: SIZES.h3, 
                                        color: COLORS.primary
                                    }}>{type === "kilos" ? (language === "English" ? "My kilos ads" : "Mes annonces de kilos") : (language === "English" ? "My container ads" : "Mes annonces de conteneur")}</Text>
                                </View>
                            </View>
                        )
                    }}

                    data={type==="kilos" ? kilos : containers}
                    ListFooterComponent={renderLoader}
                    onEndReached={loadMoreItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{
                        paddingHorizontal: 10, 
                        paddingBottom: 10
                    }}
                    renderItem={({item}) => {

                        return <AnnounceBlock key={item._id} userId={item.userId}  status={type==="kilos" ? "kilos" : "container"} city1={item.startCity} city2={item.endCity} onPress= {() =>{ setModalVisible(false); navigation.navigate("Details", {_id: item._id})}}
                        date={item.dateOfDeparture} datee={item.date} company={item.company} startCity={item.startCity2.code} endCity={item.endCity2.code}
                        startCountry={item.startCity2.country} endCountry={item.endCity2.country} />
                    }}
                />

            </View>

        </Modal>



        <View style={{
            paddingTop: Platform.OS === "ios" ? 85 : 45, 
            paddingBottom: 10, 
            backgroundColor: "#fff", 
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5, // 

        }}>

            <View style={{
                paddingHorizontal: 15, 
                flexDirection: "row", 
                alignItems: "center", 
                justifyContent: "space-between"
            }}>
                { _id && <TouchableOpacity onPress={() => navigation.goBack()} >
                    <FontAwesome6 name='angle-left' color={COLORS.primary} size={SIZES.h2} />
                </TouchableOpacity> }
                <View style={{
                    flexDirection: "row", 
                    alignItems: "center"
                }} > 
                <Text style={{
                    fontFamily: FONTS.bold, 
                    color: COLORS.primary, 
                    fontSize: SIZES.h3
                }}>{language === "English" ? "My ads" : "Mes annonces"}</Text>
                </View>
                <View style={{
                    flexDirection: "row", 
                    alignItems: "center"
                }}>

                    <TouchableOpacity onPress={() => navigation.navigate("Announcement")} style={{
                        marginLeft: 5
                }}>
                    <Ionicons name='add-circle-outline' size={SIZES.h2} color={COLORS.primary} />
                </TouchableOpacity>
                        
                </View>
               
            </View>

        </View>
       
     <ScrollView 
        contentContainerStyle={{
            paddingBottom: 100
        }}
     >

        <View>

       {/*} <View style={{
            marginTop: 20, 
            flexDirection: "row", 
            alignItems: "center", 
            paddingHorizontal: 15
        }}>
            <View style={{
                paddingVertical : Platform.OS === "ios" ? 15 : 1, 
                paddingHorizontal: 10, 
                borderColor: COLORS.middle_blue, 
                borderWidth: 1, 
                borderRadius: 8, 
                backgroundColor: "#fff", 
                flex: 1, 
      

            }}>
                <TextInput 
                    style={{
                        flex: 1, 
                        fontSize: SIZES.h5, 
                        color: "#000", 
                        fontFamily: FONTS.regular
                    }}
                    placeholder="Rechercher..."
                    placeholderTextColor={COLORS.middle_blue}

                />

            </View>

            <View style={{
                paddingLeft: 15
            }}>
                <Image source={require("../assets/images/xxx.png")}

                    style={{
                        height: Platform.OS === "android" ? SIZES.h2 : SIZES.h3, 
                        width: Platform.OS === "android" ? SIZES.h2 : SIZES.h3, 
                        resizeMode: "contain"
                    }}

                />
            </View>
           
        </View>*/}

        {
                kilos.length === 0 && containers.length === 0 && <View style={{
                    marginTop: 25, 
                    paddingHorizontal: 20
                }}>
                    <Text style={{
                        fontFamily: FONTS.bold, 
                        fontSize: SIZES.h5, 
                        color: COLORS.primary, 
                        textAlign: "center"
                    }}>{language === "English" ? "You haven't posted any ads yet!" : "Vous n'avez publié aucune annonce pour le moment !"}</Text>
                </View>
            }


            {
                containers.length > 0 && <View >
                        
                        <View style={{
                            marginTop: 35, 
                            paddingHorizontal: 20
                        }}>

                            <Text style={{
                                fontFamily: FONTS.bold, 
                                fontSize: SIZES.h3, 
                                color: COLORS.primary
                            }}>{language === "English" ? "My container ads" : "Mes annonces de conteneur"}</Text>

                        </View>


                        {startAt ?  <View style={{
                            paddingHorizontal: 12, 
                            marginTop: 10, 
                            width: "100%", 
                            alignItems: "flex-end"
                        }}>
                        <TouchableOpacity onPress={() => {moreAnnounces("container")} } style={{
                            backgroundColor: COLORS.primary, 
                            paddingHorizontal: 10, 
                            paddingVertical: Platform.OS === "android" ? 3 : 5, 
                            borderRadius: 5
                          }} >
                                <Text style={{
                                    fontFamily: FONTS.regular, 
                                    fontSize: SIZES.h6, 
                                    color: "#fff"
                                }}>{language === "English" ? "See all ..." : "Tout voir ..."}</Text>
                            </TouchableOpacity>
                        </View> : null}
                        
                        <View style={{
                            marginTop: 15, 
                            paddingHorizontal: 10
                        }}>

                                    {
                                        containers.map((item) => {

                                                return (
                                                    <AnnounceBlock key={item._id} userId={item.userId}  status="container" city1={item.startCity} city2={item.endCity} onPress= {() => navigation.navigate("Details", {_id: item._id})}
                                                    date={item.dateOfDeparture} datee={item.date} company={item.company} startCity={item.startCity2.code} endCity={item.endCity2.code}
                                                    startCountry={item.startCity2.country} endCountry={item.endCity2.country}
                                                    goToModify={(status) => navigation.navigate("AnnouncementForm", {_id:item._id, value: status})} />
                                                )
                                        })
                                    }

                        </View>


                    </View>
            }


{
                kilos.length > 0 && <View >



                        
                        <View style={{
                            marginTop: 35, 
                            paddingHorizontal: 20
                        }}>

                            <Text style={{
                                fontFamily: FONTS.bold, 
                                fontSize: SIZES.h3, 
                                color: COLORS.primary
                            }}>{language === "English" ? "My kilos ads" : "Mes annonces de kilos"}</Text>

                        </View>

                        <View style={{
                            paddingHorizontal: 12, 
                            paddingVertical: 10, 
                            width: "100%", 
                            alignItems: "flex-end"
                        }}>
                          {startBt ? <TouchableOpacity  onPress={() => {moreAnnounces("kilos");} } style={{
                            backgroundColor: COLORS.primary, 
                            paddingHorizontal: 10, 
                            paddingVertical: Platform.OS === "android" ? 3 : 5, 
                            borderRadius: 5
                          }} >
                                <Text style={{
                                    fontFamily: FONTS.regular, 
                                    fontSize: SIZES.h6, 
                                    color: "#fff"
                                }}>{language === "English" ? "See all ..." : "Tout voir ..."}</Text>
                            </TouchableOpacity> : null}
                        </View>
                        
                        <View style={{
                            paddingHorizontal: 10
                        }}>

                                    {
                                        kilos.map((item) => {

                                                return (
                                                    <AnnounceBlock key={item._id} userId={item.userId}  status="kilos" city1={item.startCity} city2={item.endCity} onPress= {() => navigation.navigate("Details", {_id: item._id})}
                                                    date={item.dateOfDeparture} datee={item.date} company={item.company} startCity={item.startCity2.code} endCity={item.endCity2.code}
                                                    startCountry={item.startCity2.country} endCountry={item.endCity2.country} />
                                                )
                                        })
                                    }

                        </View>

             


                    </View>
            }

        </View>


                


        </ScrollView>


    </View>
  )
}

import React, { useContext, useEffect, useState } from 'react'
import { COLORS, FONTS, MONTHS, SIZES } from '../constants/theme'
import { StyleSheet, View, Text, ImageBackground, Dimensions, Image, TouchableOpacity, Platform, ScrollView } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons"
import { useFetchFunctions } from '../infrastructures/functions';
import { AuthContext } from '../navigation/AuthProvider';
import Button1 from '../components/Button1';
import Loading from '../components/Loading';
import DeviceInfo from 'react-native-device-info';
import Entypo from "react-native-vector-icons/Entypo"
import Octicons from "react-native-vector-icons/Octicons"


const MON_ANNONCE_URL = "https://grouping-node-raar.onrender.com/api/annonce/getannoncee"; //
//const MON_ANNONCE_URL = "https://grouping-82aac4e3da78.herokuapp.com/api/annonce/getannoncee";

export default function AnnonceDetails({navigation, route}) {



    const {_id} = route.params;

    const {token, user, refreshModify, language} = useContext(AuthContext); 
    const {postFunction, timeAgo} = useFetchFunctions()
    const [annonce, setAnnonce] = useState({}); 
    const [userr, setUserr] = useState({}); 
    const [sum, setSum] = useState(null);
    const [loading, setLoading] = useState(true);
  

   // alert(_id)

   useEffect(() => {



    const getAnnonce = async () => {

        const uniqueId = await DeviceInfo.getUniqueId();

        postFunction(MON_ANNONCE_URL, {id: _id, phoneId: uniqueId}, token).then((data) => {

            // console.log(data.user);
 
             if(data && data.status === 0){
 
                     setLoading(false);
 
                     setUserr(data.user); 
                     setSum(data.sum); 
                     setAnnonce(data.annonce)
             }
             
             
             if(data && data.status === 1){

                navigation.goBack();

             }
     }, (err) => {
 
             setLoading(false);
     })
    }

    getAnnonce();



   },[refreshModify])


   const getFormattedDay = (date) => {
    const day = new Date(date).getDate(); // getDate() retourne le jour du mois
    return day.toString().padStart(2, '0');

};

function calculateContainerVolume(feet) {
    let length, width, height;
  
    if (feet === 20) {
      length = 5.9;
      width = 2.35;
      height = 2.39;
    } else if (feet === 40) {
      length = 12.03;
      width = 2.35;
      height = 2.39;
    } else if (feet === 401) {
      length = 12.03;
      width = 2.35;
      height = 2.69;
    } else if (feet === 45) {
      length = 13.56;
      width = 2.35;
      height = 2.69;
    } else {
      return 'Taille de conteneur non supportée';
    }
  
    const volume = length * width * height;
    return `${volume.toFixed(2)} m³`;
  }


  const goToMessenger = (value) => {

    if(token){

       // navigation.navigate("AnnouncementForm", {value})
       navigation.navigate("Messenger", {_id: userr._id})

    }else{

        //alert("hiii")
        navigation.navigate("Ouhaaa", {userId: userr._id});

    }


}

  if(loading) return <Loading/>

    return (
        <View style={{
            flex: 1, 
            backgroundColor: "rgb(241, 246, 251)"
        }}>



        <ScrollView contentContainerStyle={{
            paddingBottom: 80
        }}>
         
          {annonce.status === "container" ?   <Image 
                source={require("../assets/images/degrade.png")}
                style={{
                    width: SIZES.width + 300, 
                    height: SIZES.width  >  350 ? 400 : 350, 
                    marginTop: -50,
                    transform: [{rotate: "-180deg"}], 
                    marginLeft: -300
                    
                }}
            /> :  <Image 
            source={require("../assets/images/degrade.png")}
            style={{
                width: SIZES.width,
                height: SIZES.width  >  350 ? 350 : 300,  
      
                
            }}
        />  }

            <View style={{
                position: "absolute", 
                top: 0, 
                left: 0
            }}>

                <View style={{
                    paddingHorizontal: 15, 
                    paddingVertical: Platform.OS === "ios" ? 65 : 20
                }}>
                    <View style={{
                        flexDirection: "row", 
                        alignItems: "center", 
                        justifyContent: user && annonce.userId === user._id ? "space-between" : "flex-start",
                        flex: 1, 
                        width: SIZES.width - 65
                    }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image source={require("../assets/images/left.png")} style={{
                                height: SIZES.h4, 
                                width: SIZES.h4, 
                                resizeMode: "contain"
                            }} />
                        </TouchableOpacity>

                        <View style={{
                            width: "100%", 
                            alignItems: "center"
                        }}>
                            <Text style={{
                                fontFamily: FONTS.bold, 
                                color: "#fff", 
                                fontSize: SIZES.h3, 
                                marginLeft: - SIZES.h1
                            }}>{language === "English" ? "Details" : "Détails"}</Text>
                        </View>

                     {user && annonce.userId === user._id ? <TouchableOpacity disabled={user && annonce.userId !==  user._id} onPress={() => navigation.navigate("AnnouncementForm", {_id, value: annonce.status})} >
                            <Text style={{
                                fontFamily: FONTS.bold, 
                                color: "#fff", 
                                fontSize: SIZES.h2,
                                marginTop: Platform.OS === "android" ? -15 : -15
                            }}>...</Text>
                        </TouchableOpacity> : "" }

               

                    </View>

                    <View style={{
                        marginTop: 30, 
                        flexDirection: "row", 
                        alignItems: "center", 
                        justifyContent: "center"
                    }}> 

                        <Ionicons name='calendar' size={SIZES.h6} color="#fff" />
                        <Text style={{
                            marginLeft: 5, 
                            color: "#fff", 
                            fontSize: SIZES.h6, 
                            fontFamily: FONTS.regular
                        }}>{language ==="English" ? "Date of dearture" : "Date de départ : "}</Text>
                    </View>

                    <View style={{
                        alignItems: "center", 
                        marginTop: Platform.OS === "ios" ? 5 : 0
                    }}>
                      { annonce && annonce.dateOfDeparture ?  <Text style={{
                        
                         color: "#fff", 
                         fontSize: SIZES.h6, 
                         fontFamily: FONTS.regular
                      }}> {`${getFormattedDay(new Date(annonce.dateOfDeparture))} ${MONTHS[new Date(annonce.dateOfDeparture).getMonth()]} ${new Date(annonce.dateOfDeparture).getFullYear()}`} </Text> : null}
                    </View>

        
        <View  style={{
            marginTop: 25, 
            alignItems: "center", 
            justifyContent: "center", 
            flexDirection: "row"
        }}>
            <View style={{
                alignItems: "center", 
                width: "25%", 

            }}>
                <Text style={{
                    color: "#fff", 
                    fontFamily: FONTS.bold, 
                    fontSize: SIZES.h3
                }}>{annonce.startCity2 ? annonce.startCity2.code.toUpperCase() : null}</Text>
                <Text style={{
                    fontFamily: FONTS.ligth, 
                    fontSize: SIZES.h7, 
                    color: "#fff", 
                    textAlign: "center"
                  
                }}>
                    {annonce && annonce.startCity}
                </Text>
            </View>

            <View style={{
                marginLeft: 15
            }}>
                <View 
                    style={{
                        padding: 2, 
                        borderWidth: 1, 
                        borderColor: "rgb(237, 112, 107)", 
                        borderRadius: 100
                    }}
                 >
                    <View 
                        style={{
                            padding: 3, 
                            backgroundColor: "rgb(237, 112, 107)", 
                            borderRadius: 100
                        }}
                    />
                </View>
            </View>
            <View style={{
                marginLeft: 7, 
                marginTop: Platform.OS === "android" ? -2 : 0
            }}>
                <Text style={{
                    color: "#fff", 
                    fontFamily: FONTS.regular
                }}>-----</Text>
            </View>

            <View style={{
                paddingHorizontal: 10, 
                paddingVertical: 10, 
                borderRadius: 100, 
                backgroundColor: annonce.status === "container" ? "#fff" : COLORS.primary

            }}> 
              { annonce && annonce.startCity ? <Image source={annonce.status === "container" ? require("../assets/images/container4.png") : require("../assets/images/avion3.png") }
                style={{
                    height: SIZES.h3, 
                    width: SIZES.h3, 
                    resizeMode: "contain"
                }} /> : null}

            </View>
            <View style={{
             
                marginTop: Platform.OS === "android" ? -2 : 0
            }}>
                <Text style={{
                    color: "#fff", 
                    fontFamily: FONTS.regular
                }}>-----</Text>
            </View>

            <View style={{
                marginLeft: 7
            }}>
                <View 
                    style={{
                        padding: 2, 
                        borderWidth: 1, 
                        borderColor: "rgb(127, 223, 72)", 
                        borderRadius: 100
                    }}
                 >
                    <View 
                        style={{
                            padding: 3, 
                            backgroundColor: "rgb(127, 223, 72)", 
                            borderRadius: 100
                        }}
                    />
                </View>
            </View>

            <View style={{
                marginLeft: 15, 
                alignItems: "center", 
                width: "25%"
            }}>
                  <Text style={{
                    color: "#fff", 
                    fontFamily: FONTS.bold, 
                    fontSize: SIZES.h3
                }}>{annonce.endCity2 && annonce.endCity2.code.toUpperCase()}</Text>
                 <Text style={{
                    fontFamily: FONTS.ligth, 
                    fontSize: SIZES.h7, 
                    color: "#fff", 
                  
                }}>
                    {annonce.endCity} 
                </Text>
            </View>

           
          
          
        </View>



        <View style={{
            flexDirection: "row", 
            alignItems: "center", 
            justifyContent: "space-between", 
            display: "flex",
            flex: 1, 
            marginTop: 40, 
            paddingHorizontal: 5
            }}>
            <View style={{
                flexDirection: "row", 
                alignItems: "center", 
              
                }}>
                <View style={{
                flexDirection: "row", 
                alignItems: "center", 
                height: 23
                }}>
                <View style={{
                    backgroundColor: "rgb(222, 105, 43)", 
                    height: 20, 
                    width: 20
                }}

                />

                <View style={{
                    backgroundColor: COLORS.light_blue, 
                    height: 20, 
                    width: 20, 
                    marginTop: 3, 
                    marginLeft: -17
                }}

                />

                </View>

            <View style={{
                marginLeft: 7
            }}>
                <Text style={{
                    fontFamily: FONTS.regular, 
                    fontSize: SIZES.h7, 
                    color: '#fff'
                }}>{annonce.company}</Text>
            </View>

            </View>

            <View style={{
                display: "flex", 
                alignItems: "center", 
                flexDirection: "row"
            }} >
                <View>
                     <Text style={{
                        fontFamily: FONTS.regular, 
                        fontSize: SIZES.h7, 
                        color: "#fff"
                    }}>Publiée {timeAgo(new Date(annonce.date))} </Text>
                </View>
                { annonce.views && <View style={{
                         display: "flex", 
                         alignItems: "center", 
                         flexDirection: "row"
                    }}>
                        <Entypo name='dot-single' color="#fff" size={SIZES.h5} />
                        <View>
                            <Text style={{
                                 fontFamily: FONTS.regular, 
                                 fontSize: SIZES.h7, 
                                 color: "#fff", 
                               
                            }}>{annonce.views} {annonce.views === 1 ? "vue" : "vues"} </Text>
                        </View>
                        <Octicons name='eye' size={SIZES.h8} color="#fff" />
                    </View>}
            </View>

           {/* <View style={{
            marginTop: 5
            }}>
                <View style={{
                    display: "flex", 
                    alignItems: "center", 
                    flexDirection: "row"
                }} >
                    <Text style={{
                        fontFamily: FONTS.regular, 
                        fontSize: SIZES.h7, 
                        color: "#fff"
                    }}>Publiée {timeAgo(new Date(annonce.date))} </Text>
                   { annonce.views && <View style={{
                         display: "flex", 
                         alignItems: "center", 
                         flexDirection: "row"
                    }}>
                        <Entypo name='dot-single' color="#fff" size={SIZES.h5} />
                        <View>
                            <Text style={{
                                 fontFamily: FONTS.regular, 
                                 fontSize: SIZES.h7, 
                                 color: "#fff", 
                                 marginTop: -2
                            }}>{annonce.views} {annonce.views === 1 ? "vue" : "vues"} <Octicons name='eye' size={SIZES.h8} color="#fff" /></Text>
                        </View>
                    </View>}
                </View>
            </View> */}

        </View>
  


                </View>

            </View>

            <View style={{
                marginTop: 20, 
                paddingHorizontal: 15
            }}>
                <View style={{
                    flexDirection: "row", 
                    alignItems: "center"
                }}>
                    <Image 
                        source={require("../assets/images/container1.png")}
                        style={{
                            height: SIZES.h3, 
                            width: SIZES.h2, 
                            
                            resizeMode: "contain", 

                        }}
                    />
                    <Text style={{
                        marginLeft: 10, 
                        fontFamily: FONTS.bold, 
                        color: COLORS.primary, 
                        fontSize: SIZES.h4, 
                        marginTop: Platform.OS === "android" ?  -3 : 2
                    }}>
                        Caractéristiques
                    </Text>
                </View>

                {
                    annonce.status === "container" ? 
                    <View >
                        <View style={{
                            flexDirection: "row", 
                            alignItems: "center", 
                            justifyContent: "space-between", 
                            marginTop: Platform.OS === "android" ? 15 : 25
                        }} >
                            <Text style={{
                                color: "#000", 
                                fontFamily: FONTS.bold, 
                                fontSize: SIZES.h5
                            }}>Taille : </Text>
                            <Text style={{
                                color: "#000", 
                                fontFamily: FONTS.bold, 
                                fontSize: SIZES.h5
                            }}> {annonce.pieds && annonce.pieds === 401 ? "40 pieds Hight" : `${annonce.pieds} pieds`} </Text>
                        </View> 

                        <View style={{
                            flexDirection: "row", 
                            alignItems: "center", 
                            justifyContent: "space-between", 
                            marginTop: Platform.OS === "android" ? 15 : 25
                        }} >
                            <Text style={{
                                color: "#000", 
                                fontFamily: FONTS.bold, 
                                fontSize: SIZES.h5
                            }}>Volume : </Text>
                            <Text style={{
                                color: "#000", 
                                fontFamily: FONTS.bold, 
                                fontSize: SIZES.h5
                            }}> {`${calculateContainerVolume(annonce.pieds)}`} </Text>
                        </View> 

                    </View>
                        : 

                    <View >
                        <View style={{
                            flexDirection: "row", 
                            alignItems: "center", 
                            justifyContent: "space-between", 
                            marginTop: Platform.OS === "android" ? 15 : 25
                        }} >
                            <Text style={{
                                color: "#000", 
                                fontFamily: FONTS.bold, 
                                fontSize: SIZES.h5
                            }}>Kilos disponibles : </Text>
                            <Text style={{
                                color: "#000", 
                                fontFamily: FONTS.bold, 
                                fontSize: SIZES.h5
                            }}> {annonce.kilosCount} Kg</Text>
                        </View> 

                        <View style={{
                            flexDirection: "row", 
                            alignItems: "center", 
                            justifyContent: "space-between", 
                            marginTop: Platform.OS === "android" ? 15 : 25
                        }} >
                            <Text style={{
                                color: "#000", 
                                fontFamily: FONTS.bold, 
                                fontSize: SIZES.h5
                            }}>Prix du kilo : </Text>
                            <Text style={{
                                color: "#000", 
                                fontFamily: FONTS.bold, 
                                fontSize: SIZES.h5
                            }}> {annonce.kiloPrice} <Text>{annonce.devise}</Text> </Text>
                        </View> 
                    </View>
                }

                <View style={{
                    marginTop: Platform.OS === "ios" ? 30 :  20
                }}>
                    <Text style={{
                        fontFamily: FONTS.bold, 
                        fontSize: SIZES.h5, 
                        color: "#000"
                    }}>Informations complémentaires :</Text>

                    <Text style={{
                        fontFamily: FONTS.regular, 
                        fontSize: SIZES.h6, 
                        color: "rgba(0,0,0,0.7)", 
                        marginTop: Platform.OS === "ios" ? 10 : 0
                    }}>
                        {annonce.description}
                    </Text>
                </View>

                <View style={{
                    marginTop: 45,
                    marginLeft: 15, 
                    flexDirection: "row", 
                    alignItems: "center"
                }}>

                    <View >
                        <Image source={require("../assets/images/user5.png")} style={{
                            height: SIZES.h4, 
                            width: SIZES.h3, 
                            resizeMode: "contain"
                        }} />
                    </View>

                    <View style={{
                        marginLeft: 15
                    }}>
                        <Text style={{
                            fontFamily: FONTS.bold, 
                            color: COLORS.primary, 
                            fontSize: SIZES.h5
                        }}> Partageur {annonce.status === "container" ? "du conteneur" : "de kilos"} </Text>
                    </View>

                </View>

                <View style = {{
                    marginTop: 15, 
                    backgroundColor: "#fff", 
                    borderRadius: 10, 
                    padding: 20,
                    shadowColor: "rgba(0,0,0,0.2)", 
                    shadowOffset: {
                        width: 0, 
                        height: 10,
                    }, 
                    shadowOpacity: 0.25, 
                    shadowRadius: 3.5, 
                    elevation: 5 

                }}>

                    <View style={{
                        flexDirection: "row"
                    }} >
                        <View >
                            {
                                <Image source={userr.photo ? {uri: userr.photo} : require("../assets/images/user5.png")} style={{
                                    height: 60, 
                                    width: 60, 
                                    resizeMode: "contain", 
                                    borderRadius: 8
                                }} />  
                            }
                        </View>

                        <View style={{
                             marginLeft: 15, 
                             padding: 0, 
                             marginTop: 0
                        }} >
                            <Text style={{
                                marginTop: Platform.OS === "android" ? -5 : 0,
                                fontFamily: FONTS.bold, 
                                color: "#000", 
                                fontSize: SIZES.h5
                            }}>{userr && userr.name}</Text>
                             <Text style={{
                                fontFamily: FONTS.bold, 
                                marginTop: Platform.OS === "android" ? -5 : 2,
                                color: "rgba(0,0,0,0.6)", 
                                fontSize: SIZES.h6
                            }}>{userr && userr.email}</Text>
                            <Text style={{
                                fontFamily: FONTS.bold, 
                                marginTop: Platform.OS === "android" ? -5 : 10,
                                color: COLORS.orange, 
                                fontSize: SIZES.h6
                            }}>{sum} annonce(s) partagée(s)</Text>
                            {user && user._id === userr._id ? <Text style={{
                                fontSize: SIZES.h8, 
                                color: "#bbb", 
                                fontFamily: FONTS.regular, 
                                marginTop: Platform.OS === "android" ? -5 : 10,
                            }}>(vous-même)</Text>: null}
                        </View>
                    </View>

                  

                </View>

               { user && user._id ===  annonce.userId ? "" : <View style={{
                    paddingHorizontal: 15
                }}>
                    <View style={{
                        marginTop: 15, 
                        marginBottom: 30
                    }}>
                        <Button1 label="Lancer la discussion" backgroundColor={COLORS.primary} imagePath={require("../assets/images/mail.png")}
                        textColor="#fff" fontFamily={FONTS.regular} borderRadius={12} onPress={goToMessenger} disabled={user && userr._id === user._id} />
                    </View>
                </View> }

                    

            </View>

            </ScrollView>

         </View>
         )

    }
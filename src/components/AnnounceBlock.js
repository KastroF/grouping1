import React, { useContext } from 'react'
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native'
import { COLORS, FONTS, MONTHS, SIZES } from '../constants/theme';
import { useFetchFunctions } from '../infrastructures/functions';
import { AuthContext } from '../navigation/AuthProvider';
import Entypo from "react-native-vector-icons/Entypo"
import Octicons from "react-native-vector-icons/Octicons"
import { translate } from '../i18n/locales/translate';

export default function AnnounceBlock({status, date, startCity, endCity, city1, city2,
     company, userId, datee, views, goToModify, name, ...rest}) {

    const {user, language} = useContext(AuthContext); 
    const {timeAgo, timeAgoEN} = useFetchFunctions()
    

    const getFormattedDay = (date) => {
        const day = new Date(date).getDate(); 
        return day.toString().padStart(2, '0');

    };

    const MONTHS_EN = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      
      const formatDateEN = (date) => {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, "0");
        const month = MONTHS_EN[d.getMonth()];
        const year = d.getFullYear();
      
        return `${month} ${day}, ${year}`; 
      };

    
  return (
    <TouchableOpacity  style={{
        backgroundColor: "#fff", 
        borderRadius: 8, 
        paddingVertical: 15, 
        paddingHorizontal: 15, 
        marginTop: 5, 
        shadowColor: "rgba(0,0,0,0.2)", 
        shadowOffset: {
            width: 0, 
            height: 10,
        }, 
        shadowOpacity: 0.25, 
        shadowRadius: 3.5, 
        elevation: 5
        
    }}  {...rest} >

        <View style={{
            flexDirection: "row", 
            justifyContent: "space-between", 
            alignItems: "flex-start"
        }}> 
        <View>
          <View  style={{
            paddingVertical: 2, 
            paddingHorizontal: 2, 
            borderRadius: 3, 
            backgroundColor: COLORS.light_blue, 
            flexDirection: "row", 
            alignItems: "center"
          }}>
            <Image 
                source={require("../assets/images/calendar.png")}
                style={{
                    height: SIZES.h8, 
                    width: SIZES.h8, 
                    resizeMode: "contain", 
                    marginLeft: 2
                }}
            />
            <Text style={{
                fontFamily: FONTS.bold, 
                color: COLORS.primary, 
                fontSize: SIZES.h8, 
                
            }}> {language === "English" ? translate.listingItem.dateDepart.en : translate.listingItem.dateDepart.fr}: {language === "English" ? formatDateEN(date) : `${getFormattedDay(date)} ${MONTHS[new Date(date).getMonth()]} ${new Date(date).getFullYear()}` } </Text>  
          </View>

          </View>

   
            {user &&  user && user._id === userId  ? <TouchableOpacity disabled={!user ||  (user && user._id !== userId)} onPress={() => goToModify(status) }>
            <Text style={{
                fontFamily: FONTS.bold, 
                fontSize: SIZES.h3, 
                color: COLORS.primary
            }}>...</Text>
            </TouchableOpacity> : ""}
          
        </View>

        <View  style={{
            marginTop: 15, 
            alignItems: "center", 
            justifyContent: "center", 
            flexDirection: "row"
        }}>
            <View style={{
                alignItems: "center", 
                width: "25%", 

            }}>
                <Text style={{
                    color: COLORS.primary, 
                    fontFamily: FONTS.bold, 
                    fontSize: SIZES.h4
                }}>{startCity && startCity.toUpperCase()}</Text>
                <Text style={{
                    fontFamily: FONTS.ligth, 
                    fontSize: SIZES.h7, 
                    color: COLORS.primary, 
                    textAlign: "center",
                    textTransform: "capitalize"
                }}>
                    {city1}
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
                    color: COLORS.primary, 
                    fontFamily: FONTS.regular
                }}>-----</Text>
            </View>

            <View style={{
                paddingHorizontal: 10, 
                paddingVertical: 10, 
                borderRadius: 100, 
                backgroundColor: status === "container" ? COLORS.light_blue : COLORS.orange

            }}> 
                <Image source={status === "container" ? require("../assets/images/container1.png") : require("../assets/images/avion3.png") }
                style={{
                    height: SIZES.h3, 
                    width: SIZES.h3, 
                    resizeMode: "contain"
                }} />

            </View>
            <View style={{
             
                marginTop: Platform.OS === "android" ? -2 : 0
            }}>
                <Text style={{
                    color: COLORS.primary, 
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
                    color: COLORS.primary, 
                    fontFamily: FONTS.bold, 
                    fontSize: SIZES.h4
                }}>{endCity && endCity.toUpperCase()}</Text>
                 <Text style={{
                    fontFamily: FONTS.ligth, 
                    fontSize: SIZES.h7, 
                    color: COLORS.primary, 
                    textAlign: "center",
                    textTransform: "capitalize"
                }}>
                    {city2} 
                </Text>
            </View>

           
          
          
        </View>
        <View style={{

                flexDirection: "row",
                marginTop: 20 , 
                alignItems: "center",
                justifyContent: "space-between"
               
        }}>

        <View>
            <View style={{
                flexDirection: "row", 
                alignItems: "center"
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

                <View style={{
                    marginLeft: 10
                }}>
                    <Text style={{
                        fontFamily: FONTS.regular, 
                        fontSize: SIZES.h8, 
                        color: COLORS.primary, 
                        textTransform: "capitalize"
                    }}>{company} {status === "container" && name}</Text>
                </View>

            </View>

            { user && user._id === userId  && <View style={{
            marginTop: 5
        }}>
            <View >
                    {/*<Text style={{
                        fontFamily: FONTS.regular, 
                        fontSize: SIZES.h7, 
                        color: "rgba(0,0,0,0.6)"
                    }}>Publiée {timeAgo(new Date(datee))} </Text>*/}
                 </View>
        </View> }
        </View>

           {user && user._id === userId && 1===2  ?  <TouchableOpacity onPress={() => alert("Bientôt disponible")} style={{
                paddingVertical: 10, 
                paddingHorizontal: 15, 
                backgroundColor: COLORS.primary, 
                borderRadius: 8
            }} >
                <Text style={{
                    color: "#fff", 
                    fontSize: SIZES.h7, 
                    fontFamily: FONTS.bold
                }}>Booster votre annonce </Text>
            </TouchableOpacity> : <View style={{
                flexDirection: "row", 
                alignItems: "center", 
                display: "flex"
            }} >

                   { <Text style={{
                        fontFamily: FONTS.regular, 
                        fontSize: SIZES.h7, 
                        color: "rgba(0,0,0,0.6)"
                    }}> {language === "English" ? `Posted ${timeAgoEN(new Date(datee))}` : `Publiée ${timeAgo(new Date(datee))}`}</Text>}
                   { views && <View style={{
                            flexDirection: "row", 
                            alignItems: "center", 
                            display: "flex", 
                            marginLeft: 2, 
                            
                            
                        }} ><Entypo name='dot-single' size={SIZES.h5} color="rgba(0,0,0,0.6)"  />
                    <View>
                        <Text style={{
                             color: "rgba(0,0,0,0.6)", 
                             fontSize: SIZES.h7, 
                             fontFamily: FONTS.regular, 
                             marginLeft: 2,
                             marginTop: 0
                        }}>{views} {views === 1 ? language === "English" ? "view" : "vue" : language === "English" ? "views" :  "vues"} <Octicons  name='eye' size={SIZES.h8} color="rgba(0,0,0,0.6)" /> </Text> 
                    </View>
                    </View> }
                 </View>}

        </View>




    </TouchableOpacity>
  )
}

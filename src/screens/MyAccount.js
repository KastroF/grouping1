import React, { useContext, useEffect, useState } from 'react'
import { TouchableOpacity, View, Text, Image, Platform, ScrollView} from 'react-native'
import { COLORS, FONTS, SIZES } from '../constants/theme'
import { AuthContext } from '../navigation/AuthProvider';
import EvilIcons from "react-native-vector-icons/EvilIcons"
import Feather from "react-native-vector-icons/Feather"
import Entypo from "react-native-vector-icons/Entypo"
import FontAwesome6 from "react-native-vector-icons/FontAwesome6"
import AntDesign from "react-native-vector-icons/AntDesign"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useFocusEffect } from '@react-navigation/native';
import { useFetchFunctions } from '../infrastructures/functions';
import { SocketContext } from '../navigation/SocketProv';


const  NOT_READ_URL = "https://grouping-node-raar.onrender.com/api/notification/notread"; 
//const  NOT_READ_URL = "https://grouping-82aac4e3da78.herokuapp.com/api/notification/notread"; 


//https://grouping-82aac4e3da78.herokuapp.com/

export default function MyAccount({navigation, route}) {



const {laFonctionGet} = useFetchFunctions(); 
const {token} = useContext(AuthContext);

  const {user} = useContext(AuthContext); 
  const [badge, setBadge] = useState(null);
  const [annonce, setAnnonce] = useState(null);
  const socket = useContext(SocketContext); // Accès à l'instance socket
  const [messages, setMessages] = useState([]);

  const [messageInput, setMessageInput] = useState("");

  // Rejoindre une room dès le montage du composant
 /* useEffect(() => {
    if (socket) {
      const roomId1 = "room1"; // Par exemple, une room statique ou dynamique

      // Rejoindre la room
      socket.emit("joinRoom", { roomId1 });

      // Écouter les messages reçus
      socket.on("messageReceived", (message) => {
        console.log("Message reçu :", message);
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // Écouter les notifications d'état utilisateur
      socket.on("userStatusChanged", (statusUpdate) => {
        console.log("Mise à jour de l'état utilisateur :", statusUpdate);
      });

      // Nettoyage lors du démontage
      return () => {
        socket.off("messageReceived");
        socket.off("userStatusChanged");
      };
    }
  }, [socket]); */


  let _id ; 
  if(route){

    _id = route.params; 

  }

  

  const disconnect = () => {

      console.log("navigue")
      navigation.navigate("Deconnexion")
  }



  useFocusEffect(
    React.useCallback(() => {


      laFonctionGet(NOT_READ_URL, token).then((data) => {

        console.log(data);
        if(data && data.status === 0){

            //console.log("Hi man ")
        //    alert(data.badges)

       //   alert(data.badges);

      // alert("un ok")

            setBadge(data.badges);
            setAnnonce(data.annonces);

        }

      }, (err) => {

          console.log(err); 
      })

  
      return () => {
       // console.log('Je suis parti de cette page !');
      };
    }, [])
  );



  return (
    <View style={{
        flex: 1,  
        backgroundColor: COLORS.light_blue, 
      
    }}>

        <View style={{
            paddingTop: Platform.OS === "ios" ? 65 : 25, 
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
                <View > 
                <Text style={{
                    fontFamily: FONTS.bold, 
                    color: COLORS.primary, 
                    fontSize: SIZES.h3
                }}>Mon compte</Text>
                </View>
                <View style={{
                    flexDirection: "row", 
                    alignItems: "center"
                }}>

                    <TouchableOpacity onPress={() => navigation.navigate("Announcement") } style={{
                      marginLeft: 10
                    }}>
                       <Ionicons name='add-circle-outline' size={SIZES.h2} color={COLORS.primary} />
                    </TouchableOpacity>
                        
                </View>
               
            </View>

        </View>


    { user ?  <ScrollView contentContainerStyle={{
        paddingBottom: 85
      }}>

        <View style={{
          marginTop: 15, 
          backgroundColor: "#fff", 
          flexDirection: "row", 
          justifyContent: "space-between",
          alignItems: "flex-end",
          padding: 10
        }}> 
        <View style={{
          flexDirection: "row", 
          flex: 1
        }}>


            {
             user ?  user.photo && <View >
                  <Image 
                      source={{uri: user.photo}}
                      style={{
                        height: SIZES.width * 0.17, 
                        width: SIZES.width * 0.17, 
                        resizeMode: "cover", 
                        borderRadius: 8
                      }}
                  /> 
                </View> : null
            }

            <View style={{
              marginLeft: 10, 
              marginTop: Platform.OS === "android" ? -7 : 0
            }}>
                <Text style={{
                  color: "#000", 
                  fontFamily: FONTS.bold, 
                  fontSize: SIZES.h4, 
                  textTransform: "capitalize"
                }}>
                  {user.name}
                </Text>
                <Text style={{
                  color: "#aaa", 
                  fontFamily: FONTS.regular, 
                  fontSize: SIZES.h7, 
                  marginTop: Platform.OS === "android" ? -5 : 0 
                }}>
                  {user.email}
                </Text>
                <View  style={{
                  marginTop: Platform.OS === "ios" ? 3 : 0
                }}>
                  <EvilIcons name='location' color={"#000"} size={SIZES.h5} />
                </View>
                <View  style={{
                  marginTop: 5
                }}>
                  <Feather name='users' color={"#000"} size={SIZES.h5} />
                </View>
            </View>

      </View>   

          <TouchableOpacity onPress={() => navigation.navigate("Modify")} style={{
           
              marginHorizontal: 10
          }}>
            <Image source={require("../assets/images/crayon.png")} style={{
              height: SIZES.h3, 
              width: SIZES.h3, resizeMode: "contain"
            }} />
          </TouchableOpacity>

        </View>

        <View style={{
          paddingHorizontal: 25
        }}>
           <View 
          style={{
            marginTop: 15, 
            borderBottomColor: "rgb(211, 220, 235)", 
            borderBottomWidth: 2
          }}
        />
        </View>

        <View style={{
          marginTop: 15
        }}>

        <View style={{
          paddingHorizontal: 15, 
          flexDirection: "row", 
          alignItems: "center"
        }}>

          <TouchableOpacity onPress={() => navigation.navigate("My Announcements", {_id: true})} style={{
            backgroundColor: "#fff", 
            paddingVertical: 5,
            paddingHorizontal: 10, 
            width: SIZES.width/2 - 22.5, 
            borderRadius: 8, 
            position: "relative"
          }}>
              <Image source={require("../assets/images/annonces.png")}
                style={{
                    width: SIZES.h1, 
                    height: SIZES.h1, 
                    resizeMode: "contain", 
                }}/>
              <Text style={{
                color: COLORS.primary, 
                fontSize: SIZES.h6, 
                fontFamily: FONTS.regular, 
                marginTop: 3
              }}>
                Mes annonces
              </Text>

              {
                annonce ? <View style={{
                  position: "absolute", 
                  right: 5, 
                  top: -10, 
                  height: 20, 
                  width: 20, 
                  alignItems: "center", 
                  justifyContent: "center", 
                  backgroundColor: "red", 
                  borderRadius: 10
                }} >
                    <Text style={{
                      fontFamily: FONTS.bold, 
                      color: "#fff", 
                      fontSize: 8
                    }} > {annonce > 99 ? `99+` : annonce} </Text>
                </View> : ""
              }


          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Reception") } style={{
            backgroundColor: "#fff", 
            paddingHorizontal: 10,
            paddingVertical: 5, 
            width: SIZES.width/2 - 22.5, 
            borderRadius: 8, 
            marginLeft: 15, 
            position: "relative"
          }}>
              <Image source={require("../assets/images/boite.png")}
                style={{
                    width: SIZES.h1, 
                    height: SIZES.h1, 
                    resizeMode: "contain", 
                }}/>
              <Text style={{
                color: COLORS.primary, 
                fontSize: SIZES.h6, 
                fontFamily: FONTS.regular, 
                marginTop: 3
              }}>
                Boîte de reception
              </Text>

              {
                badge ? <View style={{
                  position: "absolute", 
                  right: 5, 
                  top: -10, 
                  height: 20, 
                  width: 20, 
                  alignItems: "center", 
                  justifyContent: "center", 
                  backgroundColor: "red", 
                  borderRadius: 10
                }} >
                    <Text style={{
                      fontFamily: FONTS.bold, 
                      color: "#fff", 
                      fontSize: 8
                    }} > {badge > 99 ? `99+` : badge} </Text>
                </View> : ""
              }

          </TouchableOpacity>

        </View>

        </View>

        <View style={{
            marginTop: 15, 
            paddingHorizontal: 15
        }}>
          <TouchableOpacity onPress={() => navigation.navigate("Parameters")}  style={{
            width: "100%", 
            backgroundColor: "#fff", 
            paddingHorizontal: 15, 
            paddingVertical: 15,
            borderRadius: 8, 
            flexDirection: "row", 
            alignItems: "center"
          }}>

            <Image source={require("../assets/images/parametre.png")}
                style={{
                    width: SIZES.h1, 
                    height: SIZES.h1, 
                    resizeMode: "contain", 
                }} />

                <Text style={{
                color: COLORS.primary, 
                fontSize: SIZES.h5, 
                fontFamily: FONTS.regular, 
                  marginLeft: 10
              }} > Paramètres </Text>

          </TouchableOpacity>
        </View>


        <View style={{
          paddingHorizontal: 25
        }}>
           <View 
          style={{
            marginTop: 15, 
            borderBottomColor: "rgb(211, 220, 235)", 
            borderBottomWidth: 2
          }}
        />
        </View>
       

       <View style={{
        marginTop: 15
       }}>
          <View style={{
            alignItems: "center", 
            flexDirection: "row", 
            justifyContent: "space-between", 
            paddingHorizontal: 25,
            paddingVertical: 10, 
            backgroundColor: "#fff", 
            borderBottomWidth: 3,
            borderBottomColor: COLORS.gray, 
          }} >
              <Text style={{
                fontFamily: FONTS.regular, 
                fontSize: SIZES.h5, 
                color: COLORS.primary
              }}>Aide et assistance</Text>

              <Entypo name='chevron-down' size={SIZES.h2} color={COLORS.primary} />
          </View>
          <View style={{
            alignItems: "center", 
            flexDirection: "row", 
            justifyContent: "space-between", 
            paddingHorizontal: 25,
            paddingVertical: 10, 
            backgroundColor: "#fff", 
            borderBottomWidth: 3,
            borderBottomColor: COLORS.gray, 
          }} >
              <Text style={{
                fontFamily: FONTS.regular, 
                fontSize: SIZES.h5, 
                color: COLORS.primary
              }}>Conditions d'utilisations</Text>

              <Entypo name='chevron-down' size={SIZES.h2} color={COLORS.primary} />
          </View>
          <View style={{
            alignItems: "center", 
            flexDirection: "row", 
            justifyContent: "space-between", 
            paddingHorizontal: 25,
            paddingVertical: 10, 
            backgroundColor: "#fff", 
        
          }} >
              <Text style={{
                fontFamily: FONTS.regular, 
                fontSize: SIZES.h5, 
                color: COLORS.primary
              }}>Mention légale</Text>

              <Entypo name='chevron-down' size={SIZES.h2} color={COLORS.primary} />
          </View>
       </View>

       <TouchableOpacity onPress={disconnect}  style={{
        marginTop: 25, 
        flexDirection: "row", 
        alignItems: "center", 
        alignSelf: "center"
       }}>

          <AntDesign name='poweroff' color={COLORS.primary} size={SIZES.h2} />

          <Text style={{
            marginLeft: 10, 
            color: COLORS.primary, 
            fontFamily: FONTS.regular, 
            fontSize: SIZES.h3, 
            marginTop: 5
          }}>
            Déconnexion
          </Text>

       </TouchableOpacity>

       </ScrollView> : null}

    </View>
  )
}

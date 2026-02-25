import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { COLORS, FONTS, SIZES } from '../constants/theme'
import FontAwesome6 from "react-native-vector-icons/FontAwesome6"
import { AuthContext } from '../navigation/AuthProvider'
import { useFetchFunctions } from '../infrastructures/functions'
import Notification from '../components/Notification'
import { API } from '../config/api';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';

const GET_NOTIFS_URL = API.NOTIF_GET;
const DELETE_NOTIF_URL = API.NOTIF_DELETE;

export default function Reception({navigation}) {

    const {user, token, setBadgee, language} = useContext(AuthContext);
    const {postFunction, laFonctionGet} = useFetchFunctions()
    const [notifications, setNotifications] = useState([]);
    const [messages, setMessages] = useState([]);
    const [startAt, setStart] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentId, setCurrentId] = useState("");
    const [loading, setLoading] = useState(false);
    const hasAnimated = useRef(false);

    useEffect(() => {

        // Reset badge et marquer les notifs comme lues
        setBadgee(0);
        if(token){
            laFonctionGet(API.NOTIF_VIEW, token);
        }

        postFunction(GET_NOTIFS_URL, {startAt}, token).then((data) => {

            if(data && data.status === 0){

                setNotifications(data.notifs);
                setMessages(data.messages);
                setStart(data.startAt);
                setTimeout(() => { hasAnimated.current = true; }, 800);
            }

        }, (err) => {

                console.log(err);

        })

      },[])

      const onClick = (_id) => {
        navigation.navigate("Messenger", {_id})
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

            postFunction(GET_NOTIFS_URL, {startAt}, token).then((data) => {

                if(data && data.status === 0){

                    setNotifications(data.notifs);
                    setMessages([...messages, ...data.messages]);
                    setStart(data.startAt);
                    setIsLoading(false);
                }

            }, (err) => {

                    console.log(err);
                    setIsLoading(false);

            })

        }

     }

     const onRequest = () => {

            setLoading(true);

            postFunction(DELETE_NOTIF_URL, {_id: currentId}, token).then((data) => {

                if(data && data.status === 0){

                    setNotifications(notifications.filter(item => item._id !== currentId));
                    setModalVisible(false);

                }

                setLoading(false);

            }, (err) => {

                console.log(err);
                setLoading(false);

            })
     }

     const onClose = (_id) => {
        setCurrentId(_id);
        setModalVisible(true);
     }

     const onGoing = (item) => {

        if(item.annonceId){
            navigation.navigate( "Details", {_id: item.annonceId})
        }

        if(item.title  === 'Félicitations'){
            navigation.navigate("My Announcements", {_id: true})
        }
     }

  return (
    <View style={{
        flex: 1,
        backgroundColor: COLORS.light_blue
    }}>

    {/* Modal de confirmation anime */}
    {modalVisible && (
      <View style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 999,
          elevation: 999,
      }}>
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            paddingHorizontal: 35,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Animated.View
            entering={ZoomIn.duration(300).springify().damping(15)}
            exiting={ZoomOut.duration(200)}
            style={{
              backgroundColor: "#fff",
              width: "100%",
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
                <View style={{
                    alignItems: "center",
                    paddingVertical: 15
                }}>
                    <Text style={{
                        fontFamily: FONTS.bold,
                        color: COLORS.primary,
                        fontSize: SIZES.h3
                    }}>{language === "English" ? "Confirmation" : "Confirmation"}</Text>
                </View>
                <View style={{
                    paddingHorizontal: 15,
                    marginBottom: 15
                }}>
                    <Text style={{
                        fontFamily: FONTS.regular,
                        color: "rgba(0,0,0,0.8)",
                        fontSize: SIZES.h5,
                        lineHeight: SIZES.h3,
                        textAlign: "center"
                    }}>{language === "English" ? "By clicking confirm, you agree to remove this notification." : "En cliquant sur le bouton valider, vous confirmez le retrait de cette notification de l'interface."}</Text>
                </View>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderTopColor: "#eee",
                    borderTopWidth: 1
                }}>
                    <TouchableOpacity onPress={() => setModalVisible(false) } style={{
                        paddingVertical: 15,
                        alignItems: "center",
                        width: "50%",
                        borderRightColor: "#eee",
                        borderRightWidth: 1
                    }}>
                        <Text style={{
                            fontFamily: FONTS.bold,
                            fontSize: SIZES.h5,
                            color: "#FF3B30"
                        }}>{language === "English" ? "Cancel" : "Annuler"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity disabled={loading} onPress={() => onRequest() } style={{
                        paddingVertical: 15,
                        alignItems: "center",
                        width: "50%",
                    }}>
                        {
                            loading ? <ActivityIndicator /> :
                        <Text  style={{
                            fontFamily: FONTS.bold,
                            fontSize: SIZES.h5,
                            color: "#34C759"
                        }}>{language === "English" ? "Confirm" : "Valider"}</Text>}
                    </TouchableOpacity>
                </View>
          </Animated.View>
        </Animated.View>
      </View>
    )}

<Animated.View entering={!hasAnimated.current ? FadeInDown.duration(400) : undefined} style={{
            paddingTop: Platform.OS === "ios" ? 65 : 25,
            paddingBottom: 10,
            backgroundColor: "#fff",
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
        }}>

            <View style={{
                paddingHorizontal: 15,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                 <TouchableOpacity onPress={() => navigation.goBack()} >
                    <FontAwesome6 name='angle-left' color={COLORS.primary} size={SIZES.h2} />
                </TouchableOpacity>
                <View >
                <Text style={{
                    fontFamily: FONTS.bold,
                    color: COLORS.primary,
                    fontSize: SIZES.h3
                }}>{language === "English" ? "Inbox" : "Boite de réception"}</Text>
                </View>
                {<View style={{
                            flexDirection: "row",
                            alignItems: "center"
                        }}>

                        <Image source={ user && user.photo ? {uri: user.photo} : require("../assets/images/user.png")}
                        style={{
                            width: user && user.photo ?  50 : 20 ,
                            height: user && user.photo ?  50 : 20 ,
                            borderRadius: user && user.photo ?  25 : 0,
                            resizeMode: "cover"
                        } } />

                </View>}

            </View>

        </Animated.View>

        <FlatList

            contentContainerStyle={{
                paddingBottom: 100
            }}
            ListFooterComponent={renderLoader}
            onEndReached={loadMoreItem}
            keyExtractor={(item) => item.firstMessage._id}
            data={messages}
            renderItem={({item, index}) => {

                    return <Notification
                      message={item}
                      onClick={() => onClick(item.user._id)}
                      index={index + (notifications.length > 0 ? notifications.length + 2 : 1)}
                    />
            }}
            ListHeaderComponent={() => {

                return(
                    <View>
                    <Animated.View entering={!hasAnimated.current ? FadeInUp.delay(200).duration(400) : undefined} style={{
                        marginTop: 20,
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 15
                    }}>
                        <View style={{
                            paddingVertical : Platform.OS === "ios" ? 15 : 2,
                            paddingHorizontal: 10,
                            borderColor: COLORS.middle_blue,
                            borderWidth: 1,
                            borderRadius: 8,
                            height: 50,
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
                                placeholder={language === "English" ? "Search..." : "Rechercher..."}
                                placeholderTextColor={COLORS.middle_blue}
                            />
                        </View>
                    </Animated.View>

                    { notifications.length > 0 ? <Animated.View entering={!hasAnimated.current ? FadeInUp.delay(300).duration(400) : undefined} style={{
                        marginTop: 30
                    }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <View>
                                <Image source={require("../assets/images/notif.png")} style={{
                                   height: 20,
                                   width: 20,
                                   resizeMode: "contain"
                                }} />
                            </View>
                            <View>
                                <Text style={{
                                    fontFamily: FONTS.bold,
                                    color: COLORS.primary,
                                    fontSize: SIZES.h5,
                                    marginLeft: 5
                                }}>Notifications</Text>
                            </View>
                        </View>

                        <View style={{
                            marginTop: 10
                        }}>
                            {
                                notifications.map((item, idx) => {

                                        return(
                                            <Notification
                                              onClose={() => onClose(item._id)}
                                              onClick={() => onGoing(item)}
                                              notif={true}
                                              message={item}
                                              key={item._id}
                                              index={idx}
                                            />
                                        )
                                })
                            }
                        </View>
                    </Animated.View> : null}

                   { messages.length > 0 ? <Animated.View entering={!hasAnimated.current ? FadeInUp.delay(400).duration(400) : undefined} style={{
                        marginTop: 30,
                        marginBottom: 10
                    }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <View>
                                <Image source={require("../assets/images/message.png")} style={{
                                   height: 20,
                                   width: 30,
                                   resizeMode: "contain"
                                }} />
                            </View>
                            <View>
                                <Text style={{
                                    fontFamily: FONTS.bold,
                                    color: COLORS.primary,
                                    fontSize: SIZES.h5,
                                    marginLeft: 5
                                }}>Conversations</Text>
                            </View>
                        </View>
                    </Animated.View> : null }
                </View>
                )
            }}
        />



    </View>
  )
}

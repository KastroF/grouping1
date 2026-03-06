import React, { useContext, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Image, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { COLORS, FONTS, SIZES } from '../constants/theme'
import FontAwesome6 from "react-native-vector-icons/FontAwesome6"
import { AuthContext } from '../navigation/AuthProvider'
import { useFetchFunctions } from '../infrastructures/functions'
import Notification from '../components/Notification'
import { API } from '../config/api';

const GET_NOTIFS_URL = API.NOTIF_GET;
const DELETE_NOTIF_URL = API.NOTIF_DELETE;

export default function Reception({navigation}) {

    const {user, token, language, refreshBadgeCount} = useContext(AuthContext);
    const {postFunction, laFonctionGet} = useFetchFunctions()
    const [notifications, setNotifications] = useState([]);
    const [messages, setMessages] = useState([]);
    const [startAt, setStart] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const deleteIdRef = useRef(null);

    useEffect(() => {

        if(token){
            laFonctionGet(API.NOTIF_VIEW, token).then(() => {
                refreshBadgeCount();
            });
        }

        postFunction(GET_NOTIFS_URL, {startAt}, token).then((data) => {

            if(data && data.status === 0){

                setNotifications(data.notifs);
                setMessages(data.messages);
                setStart(data.startAt);
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

     const onDelete = (_id) => {
        deleteIdRef.current = _id;
        Alert.alert(
            language === "English" ? "Confirmation" : "Confirmation",
            language === "English" ? "By clicking confirm, you agree to remove this notification." : "En cliquant sur le bouton valider, vous confirmez le retrait de cette notification de l'interface.",
            [
                {
                    text: language === "English" ? "Cancel" : "Annuler",
                    style: "cancel"
                },
                {
                    text: language === "English" ? "Confirm" : "Valider",
                    onPress: () => {
                        const idToDelete = deleteIdRef.current;
                        setNotifications(prev => prev.filter(item => item._id !== idToDelete));

                        postFunction(DELETE_NOTIF_URL, {_id: idToDelete}, token).then((data) => {
                            console.log("deleteNotif response:", JSON.stringify(data));
                        }, (err) => {
                            console.log("deleteNotif error:", err);
                        })
                    }
                }
            ]
        );
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

        <View style={{
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

        </View>

        <FlatList

            contentContainerStyle={{
                paddingBottom: 100
            }}
            ListFooterComponent={renderLoader}
            onEndReached={loadMoreItem}
            keyExtractor={(item) => item.firstMessage._id}
            data={messages}
            ListEmptyComponent={() => {
                if(notifications.length > 0) return null;
                return(
                    <View style={{
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 80,
                        paddingHorizontal: 30
                    }}>
                        <Image source={require("../assets/images/message.png")} style={{
                            height: 50,
                            width: 50,
                            resizeMode: "contain",
                            opacity: 0.3
                        }} />
                        <Text style={{
                            fontFamily: FONTS.bold,
                            color: COLORS.middle_blue,
                            fontSize: SIZES.h4,
                            marginTop: 15,
                            textAlign: "center"
                        }}>{language === "English" ? "No messages received" : "Aucun message reçu"}</Text>
                        <Text style={{
                            fontFamily: FONTS.regular,
                            color: COLORS.middle_blue,
                            fontSize: SIZES.h6,
                            marginTop: 5,
                            textAlign: "center"
                        }}>{language === "English" ? "Your conversations will appear here." : "Vos conversations apparaîtront ici."}</Text>
                    </View>
                )
            }}
            renderItem={({item, index}) => {

                    return <Notification
                      message={item}
                      onClick={() => onClick(item.user._id)}
                    />
            }}
            ListHeaderComponent={() => {

                return(
                    <View>
                    <View style={{
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
                    </View>

                    { notifications.length > 0 ? <View style={{
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
                                              onClose={() => onDelete(item._id)}
                                              onClick={() => onGoing(item)}
                                              notif={true}
                                              message={item}
                                              key={item._id}
                                            />
                                        )
                                })
                            }
                        </View>
                    </View> : null}

                   { messages.length > 0 ? <View style={{
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
                    </View> : null }
                </View>
                )
            }}
        />

    </View>
  )
}

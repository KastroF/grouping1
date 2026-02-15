import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Modal, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { COLORS, FONTS, SIZES } from '../constants/theme'
import FontAwesome6 from "react-native-vector-icons/FontAwesome6"
import { AuthContext } from '../navigation/AuthProvider'
import { useFetchFunctions } from '../infrastructures/functions'
import Notification from '../components/Notification'


const GET_NOTIFS_URL = "https://grouping-node-raar.onrender.com/api/notification/getnotifications"
//const GET_NOTIFS_URL = "https://grouping-82aac4e3da78.herokuapp.com/api/notification/getnotifications"

const DELETE_NOTIF_URL = "https://grouping-node-raar.onrender.com/api/notification/deletenotif"
//const DELETE_NOTIF_URL = "https://grouping-82aac4e3da78.herokuapp.com/api/notification/deletenotif"

export default function Reception({navigation}) {

    const {user, token} = useContext(AuthContext);
    const {postFunction} = useFetchFunctions()
    const [notifications, setNotifications] = useState([]); 
    const [messages, setMessages] = useState([]); 
    const [startAt, setStart] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentId, setCurrentId] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        postFunction(GET_NOTIFS_URL, {startAt}, token).then((data) => {

            if(data && data.status === 0){

                setNotifications(data.notifs); 
                setMessages(data.messages); 
                setStart(data.startAt);
                console.log(data.messages);
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
                    setMessages([...messages, data.messages]); 
                    setStart(data.startAt);
                    console.log(data.messages);
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

        console.log(item);                                                      

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

    <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {

                setModalVisible(false)
        }}
    >
        <View style={{
            flex: 1, 
            backgroundColor: "rgba(0,0,0,0.4)", 
            paddingHorizontal: 35, 
            alignItems: "center", 
            justifyContent: "center"
        }}>
            <View style={{
                backgroundColor: "#fff", 
                width: "100%", 
      
                borderRadius: 8
            }}>
                <View style={{
                    alignItems: "center", 
                    paddingVertical: 15
                }}>
                    <Text style={{
                        fontFamily: FONTS.bold, 
                        color: COLORS.primary, 
                        fontSize: SIZES.h3
                    }}>Confirmation</Text>
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

                    }}>En cliquant sur le bouton valider, vous confirmez le retrait de cette notification de l'interface. </Text>
                </View>
                <View style={{
                    flexDirection: "row", 
                    alignItems: "center", 
                    borderTopColor: "#ccc", 
                    borderTopWidth: 1
                }}>
                    <TouchableOpacity onPress={() => setModalVisible(false) } style={{
                        paddingVertical: 15, 
                        alignItems: "center", 
                        width: "50%", 
                        borderRightColor: "#ccc", 
                        borderRightWidth: 1
                    }}>
                        <Text style={{
                            fontFamily: FONTS.bold, 
                            fontSize: SIZES.h5, 
                            color: "red"
                        }}>Annuler</Text>
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
                            color: "green"
                        }}>Valider</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>

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
                 <TouchableOpacity onPress={() => navigation.goBack()} >
                    <FontAwesome6 name='angle-left' color={COLORS.primary} size={SIZES.h2} />
                </TouchableOpacity> 
                <View > 
                <Text style={{
                    fontFamily: FONTS.bold, 
                    color: COLORS.primary, 
                    fontSize: SIZES.h3
                }}>Boite de réception</Text>
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
            renderItem={({item}) => {

                    return <Notification message={item} onClick={() => onClick(item.user._id)} />
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
                                placeholder="Rechercher..."
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
                                notifications.map((item) => {

                                        return(
                                            <Notification onClose={() => onClose(item._id)} onClick={() => onGoing(item)} notif={true}  message={item} key={item._id} />
                                        )
                                })
                            }
                        </View>
                    </View> : ""}
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
                    </View> : "" }
                </View>
                )
            }}
        />



    </View>
  )
}

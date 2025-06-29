import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, ImageBackground, KeyboardAvoidingView, Platform, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { COLORS, FONTS, SIZES } from '../constants/theme'
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../navigation/AuthProvider';
import { useFetchFunctions } from '../infrastructures/functions';
import AntDesign from "react-native-vector-icons/AntDesign"
import Feather from "react-native-vector-icons/Feather"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { SocketContext } from '../navigation/SocketProv';
import uuid from 'react-native-uuid';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

const GET_MESSAGES_URL = "https://grouping.glitch.me/api/message/getmessages"
//const GET_MESSAGES_URL = "https://grouping-82aac4e3da78.herokuapp.com/api/message/getmessages"

//https://grouping-82aac4e3da78.herokuapp.com/
const ADD_MESSAGE_URL = "https://grouping.glitch.me/api/message/addmessagewithimage"

export default function Messenger({navigation, route}) {

    const {_id} = route.params; 

    const {setIsTabBarVisible, user, token, socket} = useContext(AuthContext); 

    const {postFunction, timeAgo} = useFetchFunctions(); 
    const [startAt, setStartAt] = useState(0); 
    const [userr, setUserr] = useState({}); 
    const [messages, setMessages] = useState([]);
    const [count, setCount] = useState(0);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [visibleImageModal, setVisibleImageModal] = useState(false);
    const [currentImageUrl, setCurrentImageUrl] = useState(null); 


         // Accès à l'instance socket
    const [messageInput, setMessageInput] = useState({});
    

  // Rejoindre une room dès le montage du composant

  const sendMessage = async (id, url) => {
    console.log("On y va en forme et encore  ", url );
    if (!socket  || !user || !userr) return;
  
    try {
      const roomId = [user._id, userr._id].sort().join("-");
      const receiverId = userr._id;
  
      let message; 
      if(id){

        message = {
            text: id ? url : text.trim(),
            sender: user._id,
            type: "image"
          };
      

      }else{

        message = {
            text: id ? url : text.trim(),
            sender: user._id,
            
          };

      }
      
      socket.emit("sendMessage", { roomId1: roomId, receiverId, message, url, id });
  
      setText("");
    } catch (err) {
      console.error("Erreur lors de l’envoi du message :", err);
    }
  };
  


    useEffect(() => {

        postFunction(GET_MESSAGES_URL, {user2: _id, startAt: 0}, token).then((data) => {

            if(data && data.status === 0){

                    setUserr(data.user);
                    setStartAt(data.startAt); 
                    setCount(data.count)
                    setMessages(data.messages);

                    console.log(data.messages.length);


            }
        })


    }, [])


    useEffect(() => {

        console.log(socket); 
        console.log(user); 
        console.log(userr);

        if (!socket || !user || !userr) return;
      
        const roomId1 = [user._id, userr._id].sort().join("-");
      
        // Rejoindre la room
        socket.emit("joinRoom", { roomId1 });
      
        // Message reçu
        const handleMessageReceived = (message) => {
          console.log("📥 Message reçu :", message);
          const newMessage = {
            ...message,
            user1Id: message.sender,
            _id: uuid.v4(),
          };
          setMessages((prev) => [newMessage, ...prev]);
        };
      
        // Notification externe
        const handleNewMessageNotification = (notification) => {
          console.log("📣 Nouvelle notification :", notification);
        };
      
        // Mise à jour du statut du message
        const handleMessageStatusUpdate = (status) => {
          console.log("✅ Statut du message :", status);
          setMessages((prev) => {
            return prev.map((msg, idx) =>
              idx === prev.length - 1 && msg._id !== status._id
                ? { ...msg, _id: status._id }
                : msg
            );
          });
        };
      
        // Mise à jour de l’état utilisateur
        const handleUserStatusChanged = (statusUpdate) => {
          console.log("👤 État utilisateur modifié :", statusUpdate);
        };
      
        // Enregistrement des handlers
        socket.on("messageReceived", handleMessageReceived);
        socket.on("newMessageNotification", handleNewMessageNotification);
        socket.on("messageStatusUpdate", handleMessageStatusUpdate);
        socket.on("userStatusChanged", handleUserStatusChanged);
      
        // Cleanup à la destruction du composant
        return () => {
          socket.off("messageReceived", handleMessageReceived);
          socket.off("newMessageNotification", handleNewMessageNotification);
          socket.off("messageStatusUpdate", handleMessageStatusUpdate);
          socket.off("userStatusChanged", handleUserStatusChanged);
        };
      }, [socket, user, userr]);


   /* useEffect(() => {

        try{

        if (socket && user) {
      
            const roomId1 = [user._id, userr._id].sort().join("-"); // Par exemple, une room statique ou dynamique
    
          // Rejoindre la room
          socket.emit("joinRoom", { roomId1 });
    
          // Écouter les messages reçus
          socket.on("messageReceived", (message) => {
            console.log("Message reçu :", message);
            message.user1Id = message.sender, 
            message._id = uuid.v4();
            //setMessageInput(message);
            const messagess = [message, ...messages];
            setMessages(messagess);
            

          });
    
         socket.on("newMessageNotification", (message) => {
    
                console.log("le message Message", message  ); 
                

          })

          socket.on("messageStatusUpdate", (status) => {

                console.log("les status", status);
                
                if( messages[messages.length -1] && messages[messages.length -1]._id !== status._id){

                    messages[messages.length -1]._id = status._id; 

                }
                

          })
    
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

    }catch(err){

            console.log(err);
    }

    },[socket, userr, messages]) */


    useFocusEffect(
        React.useCallback(() => {

         // console.log('Je suis arrivé sur cette page !'); 
          setIsTabBarVisible(true)
      
          return () => {
           // console.log('Je suis parti de cette page !');
           setIsTabBarVisible(false)
          };
        }, [])
      );

      const addMessage = () => {

            setLoading(true); 
            const textt = text; 
            setText("");

            sendMessage().then(() => {

                setLoading(false); 

            }, (err) => {

                    console.log(err);
            });

         /*   postFunction(ADD_MESSAGE_URL, {text: textt, _id, startAt: 0}, token).then((data) => {

               if(data && data.status === 0){

                console.log(data.messages)
                setMessages(data.messages); 
                setStartAt(data.startAt);
                setLoading(false); 
               }

            }, () => {

                    setLoading(false);
            }) */

            

      }

      function formatMinutes(minutes) {
        if (minutes < 10) {
            return "0" + minutes;
        } else {
            return minutes;
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

 const pickMedia = () => {
   launchImageLibrary(
     {
       mediaType: 'photo',
       quality: 0.3,
     },
     response => {
       if (response.didCancel) {
         console.log('User cancelled image picker');
       } else if (response.errorCode) {
         console.error('Error: ', response.errorMessage);
       } else {
         const asset = response.assets[0];
         const originalUri = asset.uri;
 
         // Ajoute file:// uniquement sur Android si absent
         const correctedUri =
           Platform.OS === 'android' && !originalUri.startsWith('file://')
             ? 'file://' + originalUri
             : originalUri;
 
         console.log("✅ URI utilisée :", correctedUri);
 
         setImage({ uri: correctedUri });
 
         const formData = new FormData();
         formData.append("user1", user._id);
         formData.append("user2", userr._id);
 
         formData.append("images", {
           uri: correctedUri,
           type: asset.type || 'image/jpeg',
           name: asset.fileName || `photo_${Date.now()}.jpg`,
         });
 
         console.log("📦 FormData prêt :", formData);
 
         onRequest2(formData);
       }
     }
   );
 };
 

  const onRequest2 =  async (formData) => {


    const response = await axios.post(ADD_MESSAGE_URL, formData, {
        headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
        },
    });

    if(response.data && response.data.status === 0){

            console.log("C'est Ok");
            setImage(null);
           // setText(response.data.url); 


                console.log("On y va en forme ", response.data.url );
           
                sendMessage(true, response.data.url);
          
            //setUser({...user, photo: response.data.photo})
            //await AsyncStorage.setItem("user", JSON.stringify({...user, photo: response.data.photo}))
    }
  //  setLoadingg(false);

  }

 const loadMoreItem = () => {

    setIsLoading(true); 

    if(!startAt){

        setIsLoading(false);

    }else{

        postFunction(GET_MESSAGES_URL, {user2: _id, startAt}, token).then((data) => {

            if(data && data.status === 0){

                    setUserr(data.user);
                    setStartAt(data.startAt); 
                    setCount(data.count)
                    setMessages([...messages, ...data.messages]);
                    setIsLoading(false);

                    //console.log(data.messages.length);


            }
        })

    }

 }



  return (
    <View style={{
        flex: 1, 
        backgroundColor: "rgb(220, 231, 244)"
    }}>

<KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >

{visibleImageModal && currentImageUrl && (
  <Modal
    visible={visibleImageModal}
    transparent={false}
    animationType="fade"
    onRequestClose={() => setVisibleImageModal(false)}
  >
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <TouchableOpacity
        onPress={() => setVisibleImageModal(false)}
        style={{
          position: 'absolute',
          top: Platform.OS === 'ios' ? 50 : 30,
          right: 20,
          zIndex: 2,
        }}
      >
        <AntDesign name="closecircle" size={35} color="#fff" />
      </TouchableOpacity>

      <Image
        source={{ uri: currentImageUrl }}
        style={{
          width: '100%',
          height: '100%',
          resizeMode: 'contain',
        }}
      />
    </View>
  </Modal>
)}

    

    
        <View style={{
            flex: 1, 
            flexDirection: "column", 
        }}>
    
            {/* Header */}
            <View style={{
                backgroundColor: "#fff", 
                paddingTop: Platform.OS === "ios" ? 55 : 25, 
                paddingBottom: 25, 
            
        
                paddingHorizontal: 15
            }}>
            
            <View style={{
                    flexDirection: "row", 
                    alignItems: "flex-end",
            }}>
                
                <View style={{
                    flexDirection: "row", 
                    alignItems: 'center', 
                    flex: 1
                }}>

                <TouchableOpacity onPress={() => navigation.goBack() }>
                    <Image 
                        source={require("../assets/images/left2.png")}
                        style={{
                            height: SIZES.h3, 
                            width: SIZES.h3, 
                            resizeMode: "contain"
                        }}
                    />
                </TouchableOpacity>
                {
                    userr.photo ? <View style={{
                        marginLeft: 30
                    }} >
                        <Image source={{uri: userr.photo}} style={{height: 60, width: 60, borderRadius: 8, resizeMode: "cover"}} />
                        </View> : null
                }

                <View style={{
                    marginLeft: 15, 
                }} >
                    <Text style={{
                        fontFamily: FONTS.bold, 
                        fontSize: SIZES.h6, 
                        marginTop: Platform.OS === "android" ? -5 : 0,
                        color: "#000"
                    }}> {userr.name} </Text>
                     <Text style={{
                        fontFamily: FONTS.regular, 
                        fontSize: SIZES.h7, 
                        marginTop: Platform.OS === "android" ? -5 : 0,
                        color: "#ccc"
                    }}> {userr.email} </Text>
                </View>


                </View>

            </View>




                <View style={{
                
                
                marginTop: 10, 
                alignItems: "flex-end"
            }}>
                <Text style={{
                 color: COLORS.orange,
                  
                 fontFamily: FONTS.bold, 
                 fontSize: SIZES.h6, 
                 
                }}> {count} annonce(s) partagée(s)</Text> 
            </View>

               



            </View>

        
    
            {/* Main Content - Bonsoir */}
            <View style={{
                flex: 1, // Prendre tout l'espace restant
                justifyContent: "center", // Centrer le texte verticalement si nécessaire
                alignItems: "center", 
               // Centrer le texte horizontalement si nécessaire
            }}>
                <ImageBackground source={require("../assets/images/motif3.png")} resizeMode="cover" style={{flex: 1, width: "100%", height: "100%",}} >
                    <FlatList 
                        data={messages}
                        inverted={true}
                        ListFooterComponent={renderLoader}
                        onEndReached={loadMoreItem}
                        contentContainerStyle={{

                            paddingVertical: 10
                        }}
                        keyExtractor={(item) => item._id}

                        renderItem={({item, index}) => {

                                return(
                                    <View style={{
                                        flexDirection: "row", 
                                        width: "100%", 
                                        justifyContent: item.user1Id === user._id ? "flex-end" : "flex-start", 
                                        paddingLeft: item.user1Id === user._id ? "30%" : 15, 
                                        paddingRight: item.user1Id !== user._id ? "30%" : 15

                                    }}  >
                                        {item.user1Id === user._id ? item.type === "image" ? 
                                        <TouchableOpacity onPress={() => {setCurrentImageUrl(item.url); setVisibleImageModal(true)}} style={{
                                            marginTop: 3
                                        }}>
                                        <View>
                                        <Image 
                                            source={{uri: item.url}}
                                            style={{
                                                height: 150, 
                                                width: 95, 
                                                borderRadius: 10, 
                                                resizeMode: "cover"
                                            }}
                                        /><View style={{
                                            width: "100%", 
                                            alignItems: "flex-end"
                                        }}>
                                            <Text style={{
                                                fontFamily: FONTS.regular, 
                                                fontSize: SIZES.h8, 
                                                color: COLORS.primary, 
                                                
                                                marginTop: 2
                                            }}> {timeAgo(new Date(item.date))} </Text>
                                        </View></View></TouchableOpacity>  : <View style={{
                                            paddingVertical: Platform.OS === "android" ? 10 : 15, 
                                            paddingHorizontal: 15, 
                                            backgroundColor: COLORS.primary, 
                                            marginTop: 3, 
                                            borderTopLeftRadius: 20, 
                                            borderBottomLeftRadius: 20, 
                                            borderTopRightRadius: index%2 !== 0 ? 20 : 0, 
                                            borderBottomRightRadius: index%2 === 0 ? 20 : 0, 
                                        }} >
                                            <Text style={{
                                                color: "#fff", 
                                                fontSize: SIZES.h6, 
                                                lineHeight: SIZES.h7,
                                                fontFamily: FONTS.regular
                                            }}>{item.text}</Text>
                                            <View style={{
                                                width: "100%", 
                                                alignItems: "flex-end"
                                            }}>
                                                <Text style={{
                                                    fontFamily: FONTS.ligth, 
                                                    fontSize: SIZES.h8, 
                                                    color: "#aaa", 
                                                    
                                                    marginTop: 5
                                                }}> {timeAgo(new Date(item.date))} </Text>
                                            </View>
                                        </View> : item.type === "image" ? 
                                        <TouchableOpacity onPress={() => {setCurrentImageUrl(item.url); setVisibleImageModal(true)}} style={{
                                            marginTop: 3
                                        }}>
                                        <View>
                                        <Image 
                                            source={{uri: item.url}}
                                            style={{
                                                height: 150, 
                                                width: 95, 
                                                borderRadius: 10, 
                                                resizeMode: "cover"
                                            }}
                                        /><View style={{
                                            width: "100%", 
                                            alignItems: "flex-end"
                                        }}>
                                            <Text style={{
                                                fontFamily: FONTS.regular, 
                                                fontSize: SIZES.h8, 
                                                color: COLORS.primary, 
                                                
                                                marginTop: 2
                                            }}> {timeAgo(new Date(item.date))} </Text>
                                        </View></View></TouchableOpacity> :  <View style={{
                                            paddingVertical: Platform.OS === "android" ? 10 : 15,
                                             paddingHorizontal: 20, 
                                             backgroundColor: "#fff", 
                                             marginTop: 2, 
                                             borderTopRightRadius: 20, 
                                             borderBottomRightRadius: 20, 
                                             borderTopLeftRadius: index%2 !== 0 ? 20 : 0, 
                                             borderBottomLeftRadius: index%2 === 0 ? 20 : 0, 
                                        }} >
                                            <Text style={{
                                                color: COLORS.primary, 
                                                fontSize: SIZES.h6, 
                                                lineHeight: SIZES.h6,
                                                fontFamily: FONTS.regular
                                            }}>{item.text}</Text>
                                              <View style={{
                                                width: "100%", 
                                                alignItems: "flex-end"
                                            }}>
                                                <Text style={{
                                                    fontFamily: FONTS.ligth, 
                                                    fontSize: SIZES.h8, 
                                                    color: "#aaa", 
                                                    
                                                    marginTop: 5
                                                }}> {timeAgo(new Date(item.date))} </Text>
                                            </View>
                                        </View> }
                                    </View>
                                )
                        }}
                    />
                    {
                        image && <View style={{
                            paddingVertical: 10
                        }}>
                            <ActivityIndicator />
                        </View>
                    }
                </ImageBackground>
            </View>
    
            {/* Footer - Bonjour */}
            <View style={{
                backgroundColor: "#fff", 
                paddingVertical: 20, 
                paddingHorizontal: 15, 
                flexDirection: "row", 
                alignItems: "center"
            }}>
               <TouchableOpacity onPress={pickMedia} >
                    <AntDesign name='plus' size={SIZES.h4} color={COLORS.primary} />
               </TouchableOpacity>
                <View style={{
                    marginHorizontal: 15, 
                    flex: 1, 
                    paddingVertical:Platform.OS === "android" ? 10 : 15, 
                    flexDirection: "row", 
                    alignItems: "center", 
                    backgroundColor: "rgb(245, 245, 245)", 
                    borderRadius: 15, 
                    paddingHorizontal: 15, 
                    justifyContent: "space-between"
                }}>
                    <TextInput placeholder='Entrer votre message ici...' 
                        placeholderTextColor="#bbb"
                        multiline={true}
                        onChangeText={setText}
                        value={text}
                        style={{
                            fontFamily: FONTS.regular, 
                            fontSize: SIZES.h6, 
                            color: "#000", 
                            flex: 1, 
                            

                        }}
                    />

                     { (text== "") ? <TouchableOpacity>
                        <MaterialCommunityIcons name='microphone' size={SIZES.h3} color={COLORS.primary}/>
                    </TouchableOpacity> : null}
                </View>
               <TouchableOpacity onPress={addMessage} disabled={!text || text === "" || loading} style={{
                paddingHorizontal: 12, 
                paddingVertical: 12, 
                backgroundColor: COLORS.primary, 
                borderRadius: 10
               }}>
                {loading ? <ActivityIndicator size="small" color="#fff" /> : <Feather name='send' color="#fff" size={SIZES.h4} />}
                
               </TouchableOpacity>
            </View>
    
        </View>
        </KeyboardAvoidingView>
        
    
    </View>
  )
}

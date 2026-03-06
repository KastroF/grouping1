import React, { useContext, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, Image, ImageBackground, KeyboardAvoidingView, Platform, Modal, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native'
import { COLORS, FONTS, SIZES } from '../constants/theme'
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../navigation/AuthProvider';
import { useFetchFunctions } from '../infrastructures/functions';
import AntDesign from "react-native-vector-icons/AntDesign"
import Feather from "react-native-vector-icons/Feather"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import uuid from 'react-native-uuid';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { createChatSocket } from "../services/socket";
import { API } from '../config/api';

const GET_MESSAGES_URL = API.MESSAGE_GET;
const ADD_MESSAGE_URL = API.MESSAGE_ADD_IMAGE;

export default function Messenger({navigation, route}) {

    const {_id} = route.params; 

    const {setIsTabBarVisible, user, token, language, refreshBadgeCount} = useContext(AuthContext);

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
    const socketRef = useRef(null);
    const toId = (v) => (v == null ? "" : String(v));

    

    const getSenderId = (m) => {
      // gère: sender = "id"  | sender = {_id:"id"} | user1Id = "id" | user1Id = {_id:"id"}
      return toId(m?.sender?._id ?? m?.sender ?? m?.user1Id?._id ?? m?.user1Id);
      
    };
    

  // Rejoindre une room dès le montage du composant

  const sendMessage = (isImage = false, url = null) => {
    if (!socketRef.current || !user?._id || !userr?._id) return;
  
    const roomId = [user._id, userr._id].sort().join("-");
    const receiverId = userr._id;
  
    const clientId = uuid.v4(); // ✅ identifiant stable
  
    const message = isImage
      ? { text: url, sender: user._id, type: "image" }
      : { text: text.trim(), sender: user._id };
  
    // (optionnel) optimiste: tu peux afficher pending immédiatement sans attendre l'event serveur
    // Mais comme ton serveur renvoie déjà "messageReceived" pending, on peut éviter le doublon.
    // Ici on laisse le serveur gérer l'affichage pending.
  
    socketRef.current.emit("sendMessage", {
      roomId1: roomId,
      receiverId,
      message,
      url,
      id: isImage ? true : null,
      user1: user,
      clientId, // ✅ IMPORTANT
    });
  
    if (!isImage) setText("");
  };
  
  
  


    useEffect(() => {

        postFunction(GET_MESSAGES_URL, {user2: _id, startAt: 0}, token).then((data) => {

            if(data && data.status === 0){

                    setUserr(data.user);
                    setStartAt(data.startAt);
                    setCount(data.count)
                    const mapped = (data.messages || []).map((m) => ({
                      ...m,
                      sender: getSenderId(m),      // ✅
                      _id: toId(m._id),
                    }));
                    setMessages(mapped);

                    console.log(data.messages.length);

                    // Messages du correspondant marques comme lus cote backend, mettre a jour le badge
                    refreshBadgeCount();
            }
        })


    }, [])

    const safeId = (v) => (v && v !== "undefined" && v !== "null" ? String(v) : undefined);


    useEffect(() => {
      if (!token || !user?._id || !userr?._id) return;
    
      const s = createChatSocket(token);
      socketRef.current = s;
    
      const roomId1 = [user._id, userr._id].sort().join("-");
    
      const onConnect = () => {
        console.log("✅ socket connected:", s.id);
        s.emit("joinRoom", { roomId1 });
      };
    
      const handleMessageReceived = (message) => {

        console.log(message); 
        const normalized = {
          ...message,
          sender: getSenderId(message),
          _id: safeId(message?._id), 
        };
      
        setMessages((prev) => {
          const idx = normalized.clientId
            ? prev.findIndex((m) => m.clientId === normalized.clientId)
            : -1;
      
          if (idx !== -1) {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], ...normalized };
            return copy;
          }
      
          return [normalized, ...prev];
        });
      };
      
      
      
    
      const handleMessageStatusUpdate = (status) => {
        setMessages((prev) => {
          const idx = prev.findIndex((m) => m.clientId === status.clientId);
          if (idx === -1) return prev;
      
          const copy = [...prev];
          copy[idx] = {
            ...copy[idx],
            _id: status._id ? String(status._id) : copy[idx]._id,
            status: status.status || copy[idx].status,
            date: status.date || copy[idx].date,
            sender: status.sender ? toId(status.sender) : copy[idx].sender,
          };
          return copy;
        });
      };
      
      
    
      const onError = (err) => console.log("❌ connect_error:", err.message);
    
      s.on("connect", onConnect);
      s.on("messageReceived", handleMessageReceived);
      s.on("messageStatusUpdate", handleMessageStatusUpdate);
      s.on("connect_error", onError);
    
      s.connect();
    
      return () => {
        s.off("connect", onConnect);
        s.off("messageReceived", handleMessageReceived);
        s.off("messageStatusUpdate", handleMessageStatusUpdate);
        s.off("connect_error", onError);
    
        s.removeAllListeners();
        s.disconnect();
        socketRef.current = null;
      };
    }, [token, user?._id, userr?._id]);
    


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
        if (!text.trim()) return;
        sendMessage(false, null);
      };
      
      

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
 
         formData.append("image", {
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
                    const mapped = (data.messages || []).map((m) => ({
                      ...m,
                      sender: getSenderId(m),      // ✅
                      _id: toId(m._id),
                    }));
               
                    setMessages([...messages, ...mapped]);
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >

{visibleImageModal && currentImageUrl && (
  <Modal
    visible={visibleImageModal}
    transparent={false}
    animationType="fade"
    onRequestClose={() => setVisibleImageModal(false)}
  >
    <View style={{ flex: 1, backgroundColor: '#000', paddingVertical : 91, paddingHorizontal: 2 }}>

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

      <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      maximumZoomScale={4}     // 🔍 zoom max
      minimumZoomScale={1}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      centerContent
    >
      <Image
        source={{ uri: currentImageUrl }}
        style={{
          width: '100%',
          height: '100%',
          resizeMode: 'contain',
        }}
      />

    </ScrollView>
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
                 
                }}> {count} {language === "English" ? "shared ad(s)" : "annonce(s) partagée(s)"}</Text>
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
                        keyExtractor={(item, index) =>
                          item?.clientId
                            ? `c_${String(item.clientId)}`
                            : item?._id
                            ? `s_${String(item._id)}`
                            : `i_${index}`
                        }
                        
                        renderItem={({item, index}) => {

                          const isMine = getSenderId(item) === toId(user._id);


                          return (
                            <View
                              style={{
                                flexDirection: "row",
                                width: "100%",
                                justifyContent: isMine ? "flex-end" : "flex-start",
                                paddingLeft: isMine ? "30%" : 15,
                                paddingRight: !isMine ? "30%" : 15,
                              }}
                            >
                              {isMine ? (
                                item.type === "image" ? (
                                  <TouchableOpacity
                                    onPress={() => {
                                      setCurrentImageUrl(item.url);
                                      setVisibleImageModal(true);
                                    }}
                                    style={{ marginTop: 3 }}
                                  >
                                    <View>
                                      <Image
                                        source={{ uri: item.url }}
                                        style={{
                                          height: 150,
                                          width: 95,
                                          borderRadius: 10,
                                          resizeMode: "cover",
                                        }}
                                      />
                                      <View style={{ width: "100%", alignItems: "flex-end" }}>
                                        <Text
                                          style={{
                                            fontFamily: FONTS.regular,
                                            fontSize: SIZES.h8,
                                            color: COLORS.primary,
                                            marginTop: 2,
                                          }}
                                        >
                                          {timeAgo(new Date(item.date))}
                                        </Text>
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                ) : (
                                  <View
                                    style={{
                                      paddingVertical: Platform.OS === "android" ? 10 : 15,
                                      paddingHorizontal: 15,
                                      backgroundColor: COLORS.primary,
                                      marginTop: 3,
                                      borderTopLeftRadius: 20,
                                      borderBottomLeftRadius: 20,
                                      borderTopRightRadius: index % 2 !== 0 ? 20 : 0,
                                      borderBottomRightRadius: index % 2 === 0 ? 20 : 0,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color: "#fff",
                                        fontSize: SIZES.h6,
                                        lineHeight: SIZES.h7,
                                        fontFamily: FONTS.regular,
                                      }}
                                    >
                                      {item.text}
                                    </Text>
                                    <View style={{ width: "100%", alignItems: "flex-end" }}>
                                      <Text
                                        style={{
                                          fontFamily: FONTS.ligth,
                                          fontSize: SIZES.h8,
                                          color: "#aaa",
                                          marginTop: 5,
                                        }}
                                      >
                                        {timeAgo(new Date(item.date))}
                                      </Text>
                                    </View>
                                  </View>
                                )
                              ) : item.type === "image" ? (
                                <TouchableOpacity
                                  onPress={() => {
                                    setCurrentImageUrl(item.url);
                                    setVisibleImageModal(true);
                                  }}
                                  style={{ marginTop: 3 }}
                                >
                                  <View>
                                    <Image
                                      source={{ uri: item.url }}
                                      style={{
                                        height: 150,
                                        width: 95,
                                        borderRadius: 10,
                                        resizeMode: "cover",
                                      }}
                                    />
                                    <View style={{ width: "100%", alignItems: "flex-end" }}>
                                      <Text
                                        style={{
                                          fontFamily: FONTS.regular,
                                          fontSize: SIZES.h8,
                                          color: COLORS.primary,
                                          marginTop: 2,
                                        }}
                                      >
                                        {timeAgo(new Date(item.date))}
                                      </Text>
                                    </View>
                                  </View>
                                </TouchableOpacity>
                              ) : (
                                <View
                                  style={{
                                    paddingVertical: Platform.OS === "android" ? 10 : 15,
                                    paddingHorizontal: 20,
                                    backgroundColor: "#fff",
                                    marginTop: 2,
                                    borderTopRightRadius: 20,
                                    borderBottomRightRadius: 20,
                                    borderTopLeftRadius: index % 2 !== 0 ? 20 : 0,
                                    borderBottomLeftRadius: index % 2 === 0 ? 20 : 0,
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: COLORS.primary,
                                      fontSize: SIZES.h6,
                                      lineHeight: SIZES.h6,
                                      fontFamily: FONTS.regular,
                                    }}
                                  >
                                    {item.text}
                                  </Text>
                                  <View style={{ width: "100%", alignItems: "flex-end" }}>
                                    <Text
                                      style={{
                                        fontFamily: FONTS.ligth,
                                        fontSize: SIZES.h8,
                                        color: "#aaa",
                                        marginTop: 5,
                                      }}
                                    >
                                      {timeAgo(new Date(item.date))}
                                    </Text>
                                  </View>
                                </View>
                              )}
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
                    <TextInput placeholder={language === "English" ? "Enter your message here..." : "Entrer votre message ici..."}
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

                     {/* (text== "") ? <TouchableOpacity>
                        <MaterialCommunityIcons name='microphone' size={SIZES.h3} color={COLORS.primary}/>
                    </TouchableOpacity> : null */}
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

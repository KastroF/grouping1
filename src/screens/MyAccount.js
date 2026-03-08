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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useFocusEffect } from '@react-navigation/native';
import Animated, {
  FadeInUp,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

// Badge anime avec bounce
function AnimatedCardBadge({ count }) {
  const scale = useSharedValue(0);

  useEffect(() => {
    if (count && count > 0) {
      scale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withSpring(1, { damping: 10, stiffness: 180 })
      );
    } else {
      scale.value = withTiming(0, { duration: 120 });
    }
  }, [count]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  if (!count || count === 0) return null;

  return (
    <Animated.View style={[{
      position: "absolute",
      right: 5,
      top: -10,
      height: 20,
      minWidth: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FF3B30",
      borderRadius: 10,
      paddingHorizontal: 4,
    }, animatedStyle]}>
      <Text style={{
        fontFamily: FONTS.bold,
        color: "#fff",
        fontSize: 8,
        fontWeight: '700',
      }}>{count > 99 ? '99+' : count}</Text>
    </Animated.View>
  );
}

export default function MyAccount({navigation, route}) {

const {token, language, user, refreshBadgeCount, badgee} = useContext(AuthContext);
  const [badge, setBadge] = useState(null);
  const [annonce, setAnnonce] = useState(null);

  let _id ;
  if(route){
    _id = route.params;
  }

  const disconnect = () => {
      navigation.navigate("Deconnexion")
  }

  const goToReception = () => {
    navigation.navigate("Reception");
  }

  useFocusEffect(
    React.useCallback(() => {

      refreshBadgeCount().then((data) => {
        if(data){
            setBadge(data.badges || 0);
            setAnnonce(data.annonces || 0);
        }
      }).catch((err) => {
          console.log(err);
      });

      return () => {};
    }, [badgee])
  );



  return (
    <View style={{
        flex: 1,
        backgroundColor: COLORS.light_blue,
    }}>

        <Animated.View entering={FadeInDown.duration(400)} style={{
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
                { _id && <TouchableOpacity onPress={() => navigation.goBack()} >
                    <FontAwesome6 name='angle-left' color={COLORS.primary} size={SIZES.h2} />
                </TouchableOpacity> }
                <View >
                <Text style={{
                    fontFamily: FONTS.bold,
                    color: COLORS.primary,
                    fontSize: SIZES.h3
                }}>{language === "English" ? "My account" : "Mon compte"}</Text>
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

        </Animated.View>


    { user ?  <ScrollView contentContainerStyle={{
        paddingBottom: 85
      }}>

        <Animated.View entering={FadeInUp.delay(100).duration(450).springify().damping(16)} style={{
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

        </Animated.View>

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

          <Animated.View entering={FadeInUp.delay(200).duration(450).springify().damping(16)}>
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
                {language === "English" ? "My listings" : "Mes annonces"}
              </Text>

              <AnimatedCardBadge count={annonce} />

          </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(300).duration(450).springify().damping(16)}>
          <TouchableOpacity onPress={goToReception} style={{
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
                {language === "English" ? "Inbox" : "Boîte de réception"}
              </Text>

              <AnimatedCardBadge count={badge} />

          </TouchableOpacity>
          </Animated.View>

        </View>

        </View>

        <Animated.View entering={FadeInUp.delay(400).duration(450).springify().damping(16)} style={{
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
              }} > {language === "English" ? "Settings" : "Paramètres"} </Text>

          </TouchableOpacity>
        </Animated.View>


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


       <Animated.View entering={FadeInUp.delay(500).duration(450).springify().damping(16)} style={{
        marginTop: 15
       }}>
          <TouchableOpacity onPress={() => navigation.navigate("Home", { screen: "ChatBot" })} style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 25,
            paddingVertical: 10,
            backgroundColor: "#fff",
            borderBottomWidth: 3,
            borderBottomColor: COLORS.gray,
          }} >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons name='robot-outline' size={SIZES.h3} color={COLORS.primary} />
                <Text style={{
                  fontFamily: FONTS.regular,
                  fontSize: SIZES.h5,
                  color: COLORS.primary,
                  marginLeft: 10
                }}>{language === "English" ? "Grouping Assistant" : "Assistant Grouping"}</Text>
              </View>
              <Entypo name='chevron-right' size={SIZES.h2} color={COLORS.primary} />
          </TouchableOpacity>
       </Animated.View>

       <Animated.View entering={FadeInUp.delay(600).duration(450).springify().damping(16)}>
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
              }}>{language === "English" ? "Terms of Use" : "Conditions d'utilisations"}</Text>

              <Entypo name='chevron-down' size={SIZES.h2} color={COLORS.primary} />
          </View>
       </Animated.View>

       <Animated.View entering={FadeInUp.delay(700).duration(450).springify().damping(16)}>
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
              }}>{language === "English" ? "Legal Notice" : "Mention légale"}</Text>

              <Entypo name='chevron-down' size={SIZES.h2} color={COLORS.primary} />
          </View>
       </Animated.View>

       <Animated.View entering={FadeInUp.delay(800).duration(450).springify().damping(16)}>
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
            {language === "English" ? "Log out" : "Déconnexion"}
          </Text>

       </TouchableOpacity>
       </Animated.View>

       </ScrollView> : null}

    </View>
  )
}

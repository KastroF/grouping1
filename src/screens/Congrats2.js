import React, { useContext, useState } from 'react'
import { Image, Text, View } from 'react-native'
import Button1 from '../components/Button1'
import Loading from '../components/Loading';
import { COLORS, FONTS, SIZES } from '../constants/theme'
import { AuthContext } from '../navigation/AuthProvider'

export default function Congrats2({navigation, type, goHome}) {

    const {language} = useContext(AuthContext);
    const [good, setGood] = useState(false);
    const [MyAnnouncementStack, setMyAnnouncementStack] = useState(null);

    const isContainer = type === "container";

    const loadMyAnnouncementStack = async () => {
      const module = await import('../navigation/MyAnnouncementStack');
      setMyAnnouncementStack(() => module.default);
    };


    if (good) {

        if (!MyAnnouncementStack) {
          loadMyAnnouncementStack();
          return <Loading />
        }
        return <MyAnnouncementStack />;
      }

  return (

    <View style={{
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: "#fff",
        flex: 1,
        paddingVertical: 115,
        paddingHorizontal: 30
    }}>

        <View style={{

        }}>
            <Text style={{
                fontFamily: FONTS.bold,
                fontSize: SIZES.h2,
                color: COLORS.primary,
                textAlign: "center"

            }}>
                {language === "English" ? "Congratulations!" : "Félicitations !"}
            </Text>
            <Text style={{
                    fontFamily: FONTS.regular,
                    color: COLORS.primary,
                    fontSize: SIZES.h5,
                    textAlign: "center",
                    marginTop: 5
                }}>
                {isContainer
                    ? (language === "English"
                        ? "Your listing has been submitted successfully. It will be available shortly after validation."
                        : "Votre annonce a été soumise avec succès. Elle sera disponible sous peu après validation.")
                    : (language === "English"
                        ? "Your listing has been added successfully and is now available to everyone!"
                        : "Votre annonce a été ajoutée avec succès et est désormais disponible pour tous !")}
            </Text>
         </View>


            <Image
                source={require("../assets/images/congrats2.png")}
                style={{
                    width: "80%",
                    height: SIZES.height/2,
                    resizeMode: "contain"
                }}
            />

        <View style={{width: "100%"}}>
            {isContainer
                ? <Button1 label={language === "English" ? "Back to home" : "Retour à l'accueil"} backgroundColor={COLORS.primary}
                    textColor="#fff" fontFamily={FONTS.regular} fontSize={SIZES.h2}
                    onPress={goHome}
                    borderRadius={10}/>
                : <Button1 label={language === "English" ? "My listings" : "Mes annonces"} backgroundColor={COLORS.primary}
                    textColor="#fff" fontFamily={FONTS.regular} fontSize={SIZES.h2}
                    onPress={() => {setGood(true)}}
                    borderRadius={10}/>
            }
        </View>


    </View>

  )
}
